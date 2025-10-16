import React, { useState } from 'react';
import { generateText } from '../services/geminiService';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Textarea from '../components/ui/Textarea';
import { Loader2Icon, SparklesIcon, CopyIcon, CloseIcon, KeyIcon } from '../components/icons';
import { useToast } from '../contexts/ToastContext';
import { useApiKey } from '../contexts/ApiKeyContext';

const ApiKeyPrompt = () => (
    <Card>
        <div className="text-center p-6">
            <div className="mx-auto bg-yellow-100 w-12 h-12 rounded-full flex items-center justify-center">
                <KeyIcon className="w-6 h-6 text-yellow-600" />
            </div>
            <h3 className="font-bold text-yellow-800 mt-4">مفتاح API مطلوب</h3>
            <p className="text-sm text-yellow-700 mt-2 max-w-sm mx-auto">
                لاستخدام مولّد الأوامر، يرجى إضافة مفتاح Gemini API الخاص بك من خلال النقر على صورة ملفك الشخصي واختيار "مفتاح API".
            </p>
        </div>
    </Card>
);


const PromptGeneratorPage: React.FC = () => {
    const [idea, setIdea] = useState('');
    const [generatedPrompt, setGeneratedPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { addToast } = useToast();
    const { geminiClient, isApiKeySet } = useApiKey();

    const handleGenerate = async () => {
        if (!geminiClient) {
            addToast('يرجى إعداد مفتاح API الخاص بك أولاً.', 'error');
            return;
        }
        if (!idea.trim()) {
            addToast('يرجى إدخال فكرة أولاً.', 'error');
            return;
        }
        setIsLoading(true);
        setGeneratedPrompt('');
        
        const systemInstruction = `
            You are a creative assistant specializing in prompt engineering for generative AI.
            Your task is to take a user's simple idea and transform it into a rich, detailed, and effective prompt.
            The output should be ONLY the prompt text, without any introductory phrases like "Here is the prompt:".
            The prompt should be in Arabic.
        `;

        try {
            const result = await generateText(geminiClient, idea, systemInstruction);
            setGeneratedPrompt(result);
        } catch (error) {
            addToast('فشل في توليد الأمر. تحقق من مفتاح API الخاص بك والكونسول.', 'error');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleCopy = () => {
        if (generatedPrompt) {
            navigator.clipboard.writeText(generatedPrompt);
            addToast('تم نسخ الأمر المحسّن!', 'success');
        }
    };
    
    const pageHeader = (
        <header className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-[#303841]">
                مولّد الأوامر الذكي
            </h1>
            <p className="text-gray-600 mt-2">
                حوّل فكرتك البسيطة إلى أمر مفصّل وقوي باستخدام الذكاء الاصطناعي.
            </p>
        </header>
    );

    if (!isApiKeySet) {
        return (
            <div className="max-w-3xl mx-auto space-y-8">
                {pageHeader}
                <ApiKeyPrompt />
            </div>
        )
    }

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            {pageHeader}
            <Card>
                <div className="p-6 space-y-6">
                    <div>
                        <label htmlFor="idea" className="block text-sm font-medium text-[#303841] mb-2">
                            اكتب فكرتك أو موضوعك هنا:
                        </label>
                        <Textarea
                            id="idea"
                            value={idea}
                            onChange={(e) => setIdea(e.target.value)}
                            placeholder="مثال: صورة لقط يرتدي قبعة"
                            rows={4}
                            disabled={isLoading}
                        />
                    </div>
                    
                    <Button onClick={handleGenerate} disabled={isLoading} className="w-full sm:w-auto">
                        {isLoading ? (
                            <><Loader2Icon className="w-5 h-5 me-2 animate-spin" /> جاري التفكير...</>
                        ) : (
                            <><SparklesIcon className="w-5 h-5 me-2" /> حسّن الأمر</>
                        )}
                    </Button>
                </div>
            </Card>

            {(isLoading || generatedPrompt) && (
                <Card>
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold text-[#1C2B3A]">الأمر المقترح:</h2>
                            {generatedPrompt && !isLoading && (
                                <div className="flex gap-2">
                                     <Button onClick={handleCopy} variant="secondary" className="!p-2 h-9 w-9 bg-white">
                                        <CopyIcon className="w-4 h-4" />
                                     </Button>
                                      <Button onClick={() => setGeneratedPrompt('')} variant="secondary" className="!p-2 h-9 w-9 bg-white">
                                        <CloseIcon className="w-4 h-4" />
                                     </Button>
                                </div>
                            )}
                        </div>
                        {isLoading && !generatedPrompt && (
                             <div className="flex justify-center items-center py-10">
                                <Loader2Icon className="w-8 h-8 text-gray-400 animate-spin" />
                            </div>
                        )}
                        {generatedPrompt && (
                            <div className="bg-gray-50 text-gray-800 p-4 rounded-lg font-mono text-sm leading-relaxed whitespace-pre-wrap">
                                {generatedPrompt}
                            </div>
                        )}
                    </div>
                </Card>
            )}
        </div>
    );
};

export default PromptGeneratorPage;