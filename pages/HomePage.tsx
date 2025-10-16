import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getPrompts } from '../services/apiService';
import PromptCard from '../components/PromptCard';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { ArrowLeftIcon, Loader2Icon, SearchIcon } from '../components/icons';
import { PromptCategory, promptCategoryTranslations, Prompt } from '../types';
import AdsenseAd from '../components/AdsenseAd';
import { useSearch } from '../contexts/SearchContext';

const HomePage: React.FC = () => {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { setSearchTerm } = useSearch();
  const [localSearch, setLocalSearch] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!localSearch.trim()) return;
    setSearchTerm(localSearch);
    navigate('/prompts');
  };

  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        setLoading(true);
        setError(null);
        const allPrompts = await getPrompts();
        setPrompts(allPrompts);
      } catch (err) {
        setError("Failed to fetch prompts for homepage");
        console.error("Failed to fetch prompts for homepage", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPrompts();
  }, []);

  const categories = Object.values(PromptCategory);

  return (
    <div>
      {/* Ad Section moved to top */}
      <section className="pt-8">
        <AdsenseAd type="display" />
      </section>

      {/* Hero Section */}
      <section className="text-center pt-8 md:pt-16 pb-20 md:pb-28">
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-[#1C2B3A] mb-6 tracking-tight">
          اكتشف أفضل الأوامر لإبداعك
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-[#344054] max-w-3xl mx-auto mb-10">
          برمباتي هو وجهتك الأولى لاستكشاف ومشاركة أوامر الذكاء الاصطناعي باللغة العربية، مصممة لإطلاق العنان لقدراتك الإبداعية.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-12">
            <Link to="/prompts">
                <Button className="!px-8 !py-3 !text-lg w-full sm:w-auto">تصفح الأوامر</Button>
            </Link>
             <Link to="/submit">
                <Button variant="secondary" className="!px-8 !py-3 !text-lg bg-transparent hover:bg-gray-100 w-full sm:w-auto">شارك إبداعك</Button>
            </Link>
        </div>
      </section>

      {/* Search Section */}
      <section className="max-w-3xl mx-auto -mt-24 relative z-10 px-4">
        <div className="bg-white p-2 rounded-xl shadow-2xl border border-gray-200/50">
            <form onSubmit={handleSearchSubmit} className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-5 pointer-events-none">
                    <SearchIcon className="w-6 h-6 text-gray-400" />
                </div>
                <Input
                    type="search"
                    placeholder="ابحث في أكثر من 80 أمرًا..."
                    value={localSearch}
                    onChange={(e) => setLocalSearch(e.target.value)}
                    className="w-full !p-4 !ps-14 !pe-24 sm:!pe-32 !rounded-lg !text-base sm:!text-lg !border-transparent focus:!ring-2 focus:!ring-[#0A2647]"
                />
                <Button type="submit" className="absolute top-1/2 end-2 -translate-y-1/2 !px-4 sm:!px-6 !py-2.5">
                    بحث
                </Button>
            </form>
        </div>
      </section>

      {/* Prompts Sections Wrapper */}
      <div className="space-y-24 pt-16">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2Icon className="w-12 h-12 text-gray-400 animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-16 text-red-600 bg-red-50 border border-red-200 rounded-lg">
              <p>{error}</p>
          </div>
        ) : (
          categories.map((category, index) => {
            const promptsForCategory = prompts
              .filter(p => p.category === category)
              .slice(0, 6);

            if (promptsForCategory.length === 0) {
              return null;
            }

            return (
              <React.Fragment key={category}>
                <section>
                  <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                    <h2 className="text-3xl sm:text-4xl font-bold text-[#1C2B3A]">
                      {promptCategoryTranslations[category]}
                    </h2>
                    <Link
                      to={`/prompts?category=${category}`}
                      className="flex items-center gap-2 text-base font-semibold text-[#0A2647] hover:underline flex-shrink-0"
                    >
                      <span>عرض الكل</span>
                      <ArrowLeftIcon className="w-5 h-5" />
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {promptsForCategory.map(prompt => (
                      <PromptCard key={prompt.id} prompt={prompt} />
                    ))}
                  </div>
                </section>
                
                {(index === 1 || index === 5) && (
                    <section key={`ad-${index}`}>
                        <AdsenseAd type="feed" />
                    </section>
                )}
              </React.Fragment>
            );
          })
        )}
      </div>
    </div>
  );
};

export default HomePage;