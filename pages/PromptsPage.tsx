import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { getPrompts } from '../services/apiService';
import PromptCard from '../components/PromptCard';
import Select from '../components/ui/Select';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { FilterIcon, CloseIcon, Loader2Icon } from '../components/icons';
import { useSearch } from '../contexts/SearchContext';
import { 
  Prompt,
  PromptCategory, 
  promptCategoryTranslations,
  PromptLevel,
  promptLevelTranslations,
  PromptLanguage,
  promptLanguageTranslations
} from '../types';
import AdsenseAd from '../components/AdsenseAd';

type SortOption = 'newest' | 'oldest' | 'alphabetical';
const PAGE_SIZE = 12;

const FilterPanel = ({
  selectedCategories,
  setSelectedCategories,
  selectedLevel,
  setSelectedLevel,
  selectedLanguages,
  setSelectedLanguages,
  clearFilters
}: {
  selectedCategories: string[];
  setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>;
  selectedLevel: string;
  setSelectedLevel: React.Dispatch<React.SetStateAction<string>>;
  selectedLanguages: string[];
  setSelectedLanguages: React.Dispatch<React.SetStateAction<string[]>>;
  clearFilters: () => void;
}) => {

  const handleCategoryChange = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category) 
        : [...prev, category]
    );
  };

  const handleLanguageChange = (language: string) => {
    setSelectedLanguages(prev =>
      prev.includes(language)
        ? prev.filter(l => l !== language)
        : [...prev, language]
    );
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="font-semibold text-[#1C2B3A] text-lg mb-4">الفئة</h3>
        <div className="space-y-3">
          {Object.values(PromptCategory).map(cat => (
            <label key={cat} className="flex items-center space-x-2 space-x-reverse cursor-pointer">
              <input 
                type="checkbox"
                checked={selectedCategories.includes(cat)}
                onChange={() => handleCategoryChange(cat)}
                className="rounded accent-[#0A2647] w-4 h-4"
              />
              <span className="text-gray-700">{promptCategoryTranslations[cat]}</span>
            </label>
          ))}
        </div>
      </div>
      <div>
        <h3 className="font-semibold text-[#1C2B3A] text-lg mb-4">المستوى</h3>
        <div className="space-y-3">
           <label className="flex items-center space-x-2 space-x-reverse cursor-pointer">
              <input 
                type="radio"
                name="level"
                value="all"
                checked={selectedLevel === 'all'}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="accent-[#0A2647] w-4 h-4"
              />
              <span className="text-gray-700">الكل</span>
            </label>
          {Object.values(PromptLevel).map(level => (
            <label key={level} className="flex items-center space-x-2 space-x-reverse cursor-pointer">
              <input 
                type="radio"
                name="level"
                value={level}
                checked={selectedLevel === level}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="accent-[#0A2647] w-4 h-4"
              />
              <span className="text-gray-700">{promptLevelTranslations[level]}</span>
            </label>
          ))}
        </div>
      </div>
       <div>
        <h3 className="font-semibold text-[#1C2B3A] text-lg mb-4">اللغة</h3>
        <div className="space-y-3">
          {Object.values(PromptLanguage).map(lang => (
            <label key={lang} className="flex items-center space-x-2 space-x-reverse cursor-pointer">
              <input 
                type="checkbox"
                checked={selectedLanguages.includes(lang)}
                onChange={() => handleLanguageChange(lang)}
                className="rounded accent-[#0A2647] w-4 h-4"
              />
              <span className="text-gray-700">{promptLanguageTranslations[lang]}</span>
            </label>
          ))}
        </div>
      </div>
      <Button onClick={clearFilters} variant="secondary" className="w-full">
        مسح الفلاتر
      </Button>
    </div>
  );
};

const PromptsPage: React.FC = () => {
  const { searchTerm } = useSearch();
  const [allPrompts, setAllPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const location = useLocation();

  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const loader = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getPrompts();
        setAllPrompts(data);
      } catch (err) {
        setError("Failed to load prompts from the database.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPrompts();
  }, []);

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedLevel('all');
    setSelectedLanguages([]);
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const category = params.get('category');
    if (category && Object.values(PromptCategory).includes(category as PromptCategory)) {
      setSelectedCategories([category]);
    } else {
      if (location.state?.fromNav !== true) {
         setSelectedCategories([]);
      }
    }
  }, [location.search, location.state]);

  const filteredPrompts = useMemo(() => {
    let prompts = allPrompts.filter(prompt => {
      const matchesSearch = searchTerm === '' || prompt.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            prompt.prompt_text.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(prompt.category);
      const matchesLevel = selectedLevel === 'all' || prompt.level === selectedLevel;
      const matchesLanguage = selectedLanguages.length === 0 || selectedLanguages.includes(prompt.language);
      return matchesSearch && matchesCategory && matchesLevel && matchesLanguage;
    });

    switch (sortBy) {
        case 'newest':
            prompts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
            break;
        case 'oldest':
            prompts.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
            break;
        case 'alphabetical':
            prompts.sort((a, b) => a.title.localeCompare(b.title, 'ar'));
            break;
    }
    return prompts;
  }, [searchTerm, selectedCategories, selectedLevel, selectedLanguages, sortBy, allPrompts]);
  
  const visiblePrompts = useMemo(() => {
    return filteredPrompts.slice(0, visibleCount);
  }, [filteredPrompts, visibleCount]);

  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const target = entries[0];
    if (target.isIntersecting && visibleCount < filteredPrompts.length) {
      setVisibleCount((prev) => prev + PAGE_SIZE);
    }
  }, [visibleCount, filteredPrompts.length]);

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, { rootMargin: '200px' });
    const currentLoader = loader.current;
    if (currentLoader) {
      observer.observe(currentLoader);
    }
    return () => {
      if (currentLoader) {
        observer.unobserve(currentLoader);
      }
    };
  }, [handleObserver]);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [searchTerm, selectedCategories, selectedLevel, selectedLanguages, sortBy]);

  return (
    <div className="space-y-12">
      <header className="text-center">
        <h1 className="text-5xl font-extrabold text-[#1C2B3A]">مكتبة الأوامر</h1>
        <p className="text-lg text-gray-700 mt-4">ابحث وتصفح في مجموعتنا المتنامية من الأوامر الإبداعية.</p>
      </header>
      
      <div className="my-8">
        <AdsenseAd type="display" />
      </div>

      <div className="md:grid md:grid-cols-4 md:gap-12">
        <aside className="hidden md:block md:col-span-1 self-start sticky top-28">
          <Card className="p-6">
            <FilterPanel
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
              selectedLevel={selectedLevel}
              setSelectedLevel={setSelectedLevel}
              selectedLanguages={selectedLanguages}
              setSelectedLanguages={setSelectedLanguages}
              clearFilters={clearFilters}
            />
          </Card>
        </aside>

        <main className="md:col-span-3 space-y-6">
          <div className="flex justify-between items-center">
             <div className="text-sm text-gray-600">
                عرض {visiblePrompts.length} من {filteredPrompts.length} نتيجة
              </div>
            <div className="flex gap-4">
              <Select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="md:max-w-xs"
              >
                  <option value="newest">الأحدث</option>
                  <option value="oldest">الأقدم</option>
                  <option value="alphabetical">أبجديًا</option>
              </Select>
              <Button 
              variant="secondary" 
              className="md:hidden flex items-center gap-2"
              onClick={() => setIsFilterModalOpen(true)}
              aria-label="Open filters"
              >
                  <FilterIcon className="w-5 h-5" />
                  <span>تصفية</span>
              </Button>
            </div>
          </div>

          {loading ? (
             <div className="flex justify-center items-center py-20">
                <Loader2Icon className="w-10 h-10 text-gray-400 animate-spin" />
             </div>
          ) : error ? (
            <div className="text-center py-16 text-red-600 bg-red-50 border border-red-200 rounded-lg">
                <p>{error}</p>
            </div>
          ) : (
            <>
              {filteredPrompts.length > 0 ? (
                <React.Fragment>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {visiblePrompts.map(prompt => (
                      <PromptCard key={prompt.id} prompt={prompt} />
                    ))}
                  </div>
                  
                  {visibleCount < filteredPrompts.length && (
                    <div ref={loader} className="flex justify-center items-center py-6">
                      <Loader2Icon className="w-8 h-8 text-gray-400 animate-spin" />
                    </div>
                  )}
                </React.Fragment>
              ) : (
                <div className="text-center py-16 text-gray-500 bg-white border border-gray-200 rounded-lg">
                    <p>لم يتم العثور على نتائج. حاول تغيير معايير البحث أو التصفية.</p>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      <Modal 
        isOpen={isFilterModalOpen} 
        onClose={() => setIsFilterModalOpen(false)}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-[#1C2B3A]">تصفية النتائج</h2>
          <button onClick={() => setIsFilterModalOpen(false)} className="p-2 text-gray-500 hover:text-gray-800 rounded-full -m-2" aria-label="Close modal">
              <CloseIcon className="w-6 h-6"/>
          </button>
        </div>
        <div className="p-6">
            <FilterPanel
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
              selectedLevel={selectedLevel}
              setSelectedLevel={setSelectedLevel}
              selectedLanguages={selectedLanguages}
              setSelectedLanguages={setSelectedLanguages}
              clearFilters={clearFilters}
            />
        </div>
      </Modal>
    </div>
  );
};

export default PromptsPage;