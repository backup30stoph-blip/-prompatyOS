import React, { useState, useEffect, useCallback } from 'react';
import Card from '../components/ui/Card';
import { getAdminPrompts, updatePromptVerification, deletePromptById } from '../services/apiService';
import { Prompt } from '../types';

const Loader: React.FC = () => (
    <div className="flex justify-center items-center py-10">
        <svg className="animate-spin h-8 w-8 text-slate-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
    </div>
);

const PromptsManagementPage: React.FC = () => {
    const [prompts, setPrompts] = useState<Prompt[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPrompts = useCallback(async () => {
        try {
            setLoading(true);
            const data = await getAdminPrompts();
            setPrompts(data);
        } catch (err) {
            setError('Failed to load prompts.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPrompts();
    }, [fetchPrompts]);

    const handleToggleVerify = async (prompt: Prompt) => {
        try {
            const updatedPrompt = await updatePromptVerification(prompt.id, !prompt.verified);
            setPrompts(prompts.map(p => p.id === prompt.id ? updatedPrompt : p));
        } catch (err) {
            alert('Failed to update prompt status.');
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this prompt permanently?')) {
            try {
                await deletePromptById(id);
                setPrompts(prompts.filter(p => p.id !== id));
            } catch (err) {
                alert('Failed to delete prompt.');
            }
        }
    };

    const renderContent = () => {
        if (loading) {
            return <Loader />;
        }
        if (error) {
            return <p className="text-center text-red-500 py-10">{error}</p>;
        }
        if (prompts.length === 0) {
            return <p className="text-center text-slate-500 py-10">No prompts found.</p>;
        }
        return (
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">العنوان</th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">المؤلف</th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">الفئة</th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">الحالة</th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">الإجراءات</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                        {prompts.map(prompt => (
                            <tr key={prompt.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{prompt.title}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{prompt.author?.username || 'N/A'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{prompt.category}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    {prompt.verified ? 
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">موثق</span> :
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">غير موثق</span>
                                    }
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2 space-x-reverse">
                                    <button onClick={() => handleToggleVerify(prompt)} className="text-orange-600 hover:text-orange-900">
                                        {prompt.verified ? 'إلغاء التوثيق' : 'توثيق'}
                                    </button>
                                    <button onClick={() => handleDelete(prompt.id)} className="text-red-600 hover:text-red-900">حذف</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">إدارة الأوامر (Prompts)</h1>
            <Card>
                {renderContent()}
            </Card>
        </div>
    );
};

export default PromptsManagementPage;