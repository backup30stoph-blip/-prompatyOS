import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { addPostToDb } from '../services/apiService';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Textarea from '../components/ui/Textarea';
import { Loader2Icon, EditIcon } from '../components/icons';
import { Post } from '../types';

// Helper to generate slug
const generateSlug = (text: string) => text.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

const SubmitPostPage: React.FC = () => {
    const { user } = useAuth();
    const { addToast } = useToast();
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tags, setTags] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            addToast('يجب عليك تسجيل الدخول أولاً.', 'error');
            return;
        }
        if (!title.trim() || !content.trim()) {
            addToast('العنوان والمحتوى حقول إلزامية.', 'error');
            return;
        }

        setIsSubmitting(true);

        const newPostData: Omit<Post, 'id' | 'published_at' | 'author' | 'views' | 'comments_count' | 'is_trending'> & { author_id: string } = {
            title,
            slug: generateSlug(title),
            content_html: `<p>${content.replace(/\n/g, '</p><p>')}</p>`,
            author_id: user.id,
            featured_image: imageUrl || `https://picsum.photos/seed/${generateSlug(title)}/600/400`,
            tags: tags.split(',').map(t => t.trim()).filter(Boolean),
        };

        try {
            const savedPost = await addPostToDb(newPostData);
            addToast('تم نشر المقال بنجاح!', 'success');
            navigate(`/blog/${savedPost.slug}`);
        } catch (error) {
            console.error("Error submitting post:", error);
            addToast('حدث خطأ أثناء إرسال المقال.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <header className="text-center">
                <h1 className="text-3xl md:text-4xl font-bold text-[#303841]">
                    اكتب مقالاً جديدًا
                </h1>
                <p className="text-gray-600 mt-2">
                    شارك خبراتك ومعرفتك مع مجتمع برمباتي.
                </p>
            </header>

            <form onSubmit={handleSubmit}>
                <Card>
                    <div className="p-6 space-y-6">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-[#303841] mb-1">عنوان المقال</label>
                            <Input 
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="أفضل 10 أوامر لتوليد الصور الواقعية"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="content" className="block text-sm font-medium text-[#303841] mb-1">محتوى المقال</label>
                            <Textarea
                                id="content"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="ابدأ بكتابة مقالك هنا..."
                                required
                                rows={15}
                            />
                            <p className="text-xs text-gray-500 mt-1">يمكنك استخدام HTML بسيط. سيتم تحويل الأسطر الجديدة إلى فقرات.</p>
                        </div>
                        
                        <div>
                            <label htmlFor="tags" className="block text-sm font-medium text-[#303841] mb-1">العلامات (Tags)</label>
                            <Input
                                id="tags"
                                value={tags}
                                onChange={(e) => setTags(e.target.value)}
                                placeholder="نصائح, توليد صور, Midjourney"
                            />
                            <p className="text-xs text-gray-500 mt-1">افصل بين العلامات بفاصلة (,).</p>
                        </div>

                        <div>
                            <label htmlFor="imageUrl" className="block text-sm font-medium text-[#303841] mb-1">رابط الصورة البارزة (اختياري)</label>
                            <Input
                                id="imageUrl"
                                type="url"
                                value={imageUrl}
                                onChange={(e) => setImageUrl(e.target.value)}
                                placeholder="https://example.com/image.jpg"
                            />
                        </div>

                        <div className="pt-4 border-t border-gray-200">
                            <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
                                {isSubmitting ? <><Loader2Icon className="w-5 h-5 me-2 animate-spin"/> جاري النشر...</> : <><EditIcon className="w-5 h-5 me-2"/> نشر المقال</>}
                            </Button>
                        </div>
                    </div>
                </Card>
            </form>
        </div>
    );
};

export default SubmitPostPage;
