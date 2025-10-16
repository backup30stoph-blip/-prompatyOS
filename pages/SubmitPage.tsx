import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { addPromptToDb, validateSlugUniqueness, getUniqueSlugSuggestion } from '../services/apiService';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Textarea from '../components/ui/Textarea';
import Select from '../components/ui/Select';
import { Loader2Icon, PlusIcon, SparklesIcon } from '../components/icons';
import { 
  PromptCategory, 
  promptCategoryTranslations,
  PromptLevel,
  promptLevelTranslations,
  PromptLanguage,
  promptLanguageTranslations
} from '../types';
import { useApiKey } from '../contexts/ApiKeyContext';
import { generatePrompt } from '../services/geminiService';

const generateSlug = (text: string) => text.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

const ApiKeyPrompt = () => (
    <div className="text-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h3 className="font-bold text-yellow-800 text-sm">مفتاح API مطلوب</h3>
        <p className="text-xs text-yellow-700 mt-1">
            للتوليد بالذكاء الاصطناعي، أضف مفتاح Gemini API من إعدادات ملفك الشخصي.
        </p>
    </div>
);

const SubmitPage: React.FC = () => {
    const { user } = useAuth();
    const { addToast } = useToast();
    const navigate = useNavigate();
    const { isApiKeySet, geminiClient } = useApiKey();

    const [mode, setMode] = useState<'manual' | 'ai'>('manual');
    const [aiTopic, setAiTopic] = useState('');
    const [aiContext, setAiContext] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        prompt_text: '',
        category: PromptCategory.TEXT,
        level: PromptLevel.BEGINNER,
        language: PromptLanguage.ARABIC,
        tags: '',
        slug: '',
        is_ai_generated: false,
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [slugStatus, setSlugStatus] = useState<'idle' | 'checking' | 'valid' | 'invalid'>('idle');
    const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

    // Effect to auto-generate slug from title if not manually edited
    useEffect(() => {
        if (mode === 'manual' && !slugManuallyEdited) {
            setFormData(prev => ({...prev, slug: generateSlug(prev.title)}));
        }
    }, [formData.title, mode, slugManuallyEdited]);
    
    // Effect to validate slug with a debounce
    useEffect(() => {
        const handler = setTimeout(() => {
            checkSlug(formData.slug);
        }, 500);

        return () => clearTimeout(handler);
    }, [formData.slug]);

    const checkSlug = async (slug: string) => {
        if (!slug) {
            setSlugStatus('idle');
            return;
        }
        setSlugStatus('checking');
        const isUnique = await validateSlugUniqueness(slug);
        setSlugStatus(isUnique ? 'valid' : 'invalid');
    };

    const handleSuggestSlug = async () => {
        if (formData.slug) {
            const suggestion = await getUniqueSlugSuggestion(formData.slug);
            setFormData(prev => ({ ...prev, slug: suggestion }));
            setSlugStatus('valid');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSlugManuallyEdited(true);
        handleChange(e);
    };
    
    const handleGenerateWithAi = async () => {
        if (!geminiClient) {
            addToast('يرجى إعداد مفتاح API الخاص بك أولاً.', 'error');
            return;
        }
        if (!aiTopic.trim()) {
            addToast('يرجى إدخال موضوع الأمر.', 'error');
            return;
        }
        setIsGenerating(true);
        try {
            const result = await generatePrompt(geminiClient, aiTopic, aiContext);
            const newSlug = generateSlug(result.title || '');
            setFormData({
                title: result.title || '',
                prompt_text: result.prompt_text || '',
                tags: (result.tags || []).join(', '),
                slug: newSlug,
                category: PromptCategory.TEXT,
                level: PromptLevel.BEGINNER,
                language: PromptLanguage.ARABIC,
                is_ai_generated: true,
            });
            setSlugManuallyEdited(false); // Reset slug editing state
            addToast('تم توليد الأمر بنجاح! يمكنك الآن مراجعته وإرساله.', 'success');
            setMode('manual'); // Switch to manual mode to edit
        } catch (error) {
            addToast('حدث خطأ أثناء توليد الأمر.', 'error');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            addToast('يجب عليك تسجيل الدخول أولاً.', 'error');
            return;
        }
        if (Object.values(formData).some(val => typeof val === 'string' && !val.trim() && val !== formData.tags)) {
            addToast('يرجى ملء جميع الحقول الإلزامية.', 'error');
            return;
        }
        if (slugStatus !== 'valid') {
            addToast('الرابط المختصر غير صالح أو مستخدم بالفعل.', 'error');
            return;
        }

        setIsSubmitting(true);
        try {
            const dataToSubmit = {
                ...formData,
                author_id: user.id,
                tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
            };
            const newPrompt = await addPromptToDb(dataToSubmit);
            addToast('تم إرسال الأمر بنجاح!', 'success');
            navigate(`/prompts/${newPrompt.id}`);
        } catch (error) {
            console.error(error);
            addToast('حدث خطأ أثناء إرسال الأمر.', 'error');
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <header className="text-center">
                <h1 className="text-3xl md:text-4xl font-bold text-[#303841]">
                    أضف أمرًا جديدًا
                </h1>
                <p className="text-gray-600 mt-2">
                    شارك أفضل أوامرك مع المجتمع أو استخدم الذكاء الاصطناعي للمساعدة.
                </p>
            </header>
            
            <div className="flex justify-center bg-gray-200 p-1 rounded-lg max-w-sm mx-auto">
                <button onClick={() => setMode('manual')} className={`flex-1 py-2 px-4 rounded-md text-sm font-semibold transition-colors ${mode === 'manual' ? 'bg-white shadow' : 'text-gray-600'}`}>
                    إدخال يدوي
                </button>
                <button onClick={() => setMode('ai')} className={`flex-1 py-2 px-4 rounded-md text-sm font-semibold transition-colors ${mode === 'ai' ? 'bg-white shadow' : 'text-gray-600'}`}>
                    <SparklesIcon className="w-4 h-4 inline me-1"/>
                    توليد بـ AI
                </button>
            </div>

            {mode === 'ai' && (
                <Card>
                    <div className="p-6 space-y-6">
                        {isApiKeySet ? (
                            <>
                                <div>
                                    <label htmlFor="aiTopic" className="block text-sm font-medium text-[#303841] mb-1">الموضوع الرئيسي للأمر</label>
                                    <Input id="aiTopic" value={aiTopic} onChange={(e) => setAiTopic(e.target.value)} placeholder="مثال: خطة تسويقية لمنتج جديد" />
                                </div>
                                <div>
                                    <label htmlFor="aiContext" className="block text-sm font-medium text-[#303841] mb-1">سياق أو تفاصيل إضافية (اختياري)</label>
                                    <Textarea id="aiContext" value={aiContext} onChange={(e) => setAiContext(e.target.value)} rows={4} placeholder="مثال: المنتج هو تطبيق جوال للياقة البدنية يستهدف الشباب" />
                                </div>
                                <Button onClick={handleGenerateWithAi} disabled={isGenerating} className="w-full sm:w-auto">
                                    {isGenerating ? <><Loader2Icon className="w-5 h-5 me-2 animate-spin"/> جاري التوليد...</> : <><SparklesIcon className="w-5 h-5 me-2"/> ولّد الأمر</>}
                                </Button>
                            </>
                        ) : (
                           <ApiKeyPrompt />
                        )}
                    </div>
                </Card>
            )}
            
            {mode === 'manual' && (
                 <form onSubmit={handleSubmit}>
                    <Card>
                        <div className="p-6 space-y-6">
                            <div>
                                <label htmlFor="title" className="block text-sm font-medium text-[#303841] mb-1">عنوان الأمر</label>
                                <Input id="title" name="title" value={formData.title} onChange={handleChange} placeholder="مثال: إنشاء وصفة طعام مبتكرة" required />
                            </div>
                            <div>
                                <label htmlFor="slug" className="block text-sm font-medium text-[#303841] mb-1">الرابط المختصر (Slug)</label>
                                <div className="flex items-center gap-2">
                                    <Input id="slug" name="slug" value={formData.slug} onChange={handleSlugChange} required />
                                    {slugStatus === 'checking' && <Loader2Icon className="w-5 h-5 animate-spin text-gray-400" />}
                                    {slugStatus === 'valid' && <span className="text-green-600 text-xs">متاح</span>}
                                    {slugStatus === 'invalid' && <button type="button" onClick={handleSuggestSlug} className="text-red-600 text-xs hover:underline whitespace-nowrap">مستخدم، اقترح؟</button>}
                                </div>
                            </div>
                            <div>
                                <label htmlFor="prompt_text" className="block text-sm font-medium text-[#303841] mb-1">نص الأمر</label>
                                <Textarea id="prompt_text" name="prompt_text" value={formData.prompt_text} onChange={handleChange} rows={8} placeholder="اكتب نص الأمر هنا..." required />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="category" className="block text-sm font-medium text-[#303841] mb-1">الفئة</label>
                                    <Select id="category" name="category" value={formData.category} onChange={handleChange} required>
                                        {Object.entries(promptCategoryTranslations).map(([key, value]) => (
                                            <option key={key} value={key}>{value}</option>
                                        ))}
                                    </Select>
                                </div>
                                <div>
                                    <label htmlFor="level" className="block text-sm font-medium text-[#303841] mb-1">المستوى</label>
                                    <Select id="level" name="level" value={formData.level} onChange={handleChange} required>
                                        {Object.entries(promptLevelTranslations).map(([key, value]) => (
                                            <option key={key} value={key}>{value}</option>
                                        ))}
                                    </Select>
                                </div>
                            </div>
                            <div>
                                <label htmlFor="language" className="block text-sm font-medium text-[#303841] mb-1">اللغة</label>
                                <Select id="language" name="language" value={formData.language} onChange={handleChange} required>
                                    {Object.entries(promptLanguageTranslations).map(([key, value]) => (
                                        <option key={key} value={key}>{value}</option>
                                    ))}
                                </Select>
                            </div>
                            <div>
                                <label htmlFor="tags" className="block text-sm font-medium text-[#303841] mb-1">العلامات (Tags)</label>
                                <Input id="tags" name="tags" value={formData.tags} onChange={handleChange} placeholder="تلخيص, أكاديمي, علمي" />
                                <p className="text-xs text-gray-500 mt-1">افصل بين العلامات بفاصلة (,).</p>
                            </div>
                            <div className="pt-4 border-t border-gray-200">
                                <Button type="submit" disabled={isSubmitting || slugStatus !== 'valid'} className="w-full sm:w-auto">
                                    {isSubmitting ? <><Loader2Icon className="w-5 h-5 me-2 animate-spin"/> جاري الإرسال...</> : <><PlusIcon className="w-5 h-5 me-2"/> أضف الأمر</>}
                                </Button>
                            </div>
                        </div>
                    </Card>
                </form>
            )}
        </div>
    );
};

export default SubmitPage;