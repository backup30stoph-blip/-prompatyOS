import React, { useState, useEffect, useCallback } from 'react';
import Card from '../components/ui/Card';
import { getAdminPosts, deletePostById } from '../services/apiService';
import { Post } from '../types';

const Loader: React.FC = () => (
    <div className="flex justify-center items-center py-10">
        <svg className="animate-spin h-8 w-8 text-slate-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
    </div>
);

const PostsManagementPage: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPosts = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getAdminPosts();
            setPosts(data);
        } catch (err) {
            setError('Failed to load posts.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this post permanently?')) {
            try {
                await deletePostById(id);
                setPosts(posts.filter(p => p.id !== id));
            } catch (err) {
                alert('Failed to delete post.');
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
        if (posts.length === 0) {
            return <p className="text-center text-slate-500 py-10">No posts found.</p>;
        }
        return (
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">العنوان</th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">المؤلف</th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">العلامات</th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">تاريخ النشر</th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">الإجراءات</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                        {posts.map(post => (
                            <tr key={post.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{post.title}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{post.author?.username || 'N/A'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                    <div className="flex flex-wrap gap-1">
                                        {post.tags.slice(0, 3).map(tag => (
                                            <span key={tag} className="px-2 text-xs leading-5 font-semibold rounded-full bg-amber-100 text-amber-800">{tag}</span>
                                        ))}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{new Date(post.published_at).toLocaleDateString('ar-EG')}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2 space-x-reverse">
                                    <button className="text-orange-600 hover:text-orange-900">تعديل</button>
                                    <button onClick={() => handleDelete(post.id)} className="text-red-600 hover:text-red-900">حذف</button>
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
            <h1 className="text-3xl font-bold">إدارة المقالات (Posts)</h1>
            <Card>
                {renderContent()}
            </Card>
        </div>
    );
};

export default PostsManagementPage;
