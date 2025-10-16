import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Textarea from '../components/ui/Textarea';
import Modal from '../components/ui/Modal';
import { 
    UploadIcon, 
    TrashIcon, 
    UserIcon,
    MailIcon, 
    LockIcon,
    LinkIcon, 
    TwitterIcon, 
    GithubIcon,
    LinkedInIcon,
    BellIcon,
    ShieldCheckIcon,
    AlertCircleIcon
} from '../components/icons';

// A simple toggle switch component for this page
const ToggleSwitch: React.FC<{ checked: boolean; onChange: (checked: boolean) => void; }> = ({ checked, onChange }) => (
    <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-[22px] w-[42px] flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-[#D72323] ${
        checked ? 'bg-[#D72323]' : 'bg-gray-300'
        }`}
    >
        <span
        className={`pointer-events-none inline-block h-[18px] w-[18px] transform rounded-full bg-white shadow ring-0 transition-transform duration-200 ease-in-out ${
            // In RTL, the button starts on the right (off). For ON, we move it left.
            checked ? '-translate-x-5' : 'translate-x-0'
        }`}
        />
    </button>
);


const EditProfilePage: React.FC = () => {
    const { user } = useAuth();
    const { addToast } = useToast();
    const navigate = useNavigate();

    // State for image previews
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [bannerPreview, setBannerPreview] = useState<string | null>(null);
    const avatarInputRef = useRef<HTMLInputElement>(null);
    const bannerInputRef = useRef<HTMLInputElement>(null);

    // Mock data for a full profile
    const [profile, setProfile] = useState({
        displayName: user?.username || '',
        username: user?.username.toLowerCase().replace(' ', '_') || '',
        bio: user?.bio || 'متحمس للذكاء الاصطناعي ومشاركة المعرفة.',
        website: user?.website || 'https://example.com',
        location: 'الرياض, السعودية',
        social: {
            twitter: user?.social?.twitter || 'prompaty',
            github: user?.social?.github || 'prompaty_dev',
            linkedin: user?.social?.linkedin || ''
        },
        email: 'demo@example.com',
        notifications: {
            newFollowers: true,
            promptLikes: true,
            newsletter: false,
        }
    });
    
    const [initialProfile, setInitialProfile] = useState(profile);
    const [isDirty, setIsDirty] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteConfirmation, setDeleteConfirmation] = useState('');

    useEffect(() => {
        const profileChanged = JSON.stringify(initialProfile) !== JSON.stringify(profile);
        const imagesChanged = !!avatarPreview || !!bannerPreview;
        setIsDirty(profileChanged || imagesChanged);
    }, [profile, initialProfile, avatarPreview, bannerPreview]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
    };

    const handleSocialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setProfile(p => ({ ...p, social: { ...p.social, [name]: value } }));
    };

    const handleNotificationChange = (key: keyof typeof profile.notifications, value: boolean) => {
        setProfile(p => ({ ...p, notifications: { ...p.notifications, [key]: value } }));
    };
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'banner') => {
        const file = e.target.files?.[0];
        if (file && file.type.startsWith('image/')) {
            const previewUrl = URL.createObjectURL(file);
            if (type === 'avatar') {
                setAvatarPreview(previewUrl);
            } else {
                setBannerPreview(previewUrl);
            }
        } else if (file) {
            addToast('يرجى تحديد ملف صورة صالح.', 'error');
        }
    };
    
    const handleRemoveImage = (type: 'avatar' | 'banner') => {
        if (type === 'avatar') {
            setAvatarPreview(null);
            if(avatarInputRef.current) avatarInputRef.current.value = '';
        } else {
            setBannerPreview(null);
            if(bannerInputRef.current) bannerInputRef.current.value = '';
        }
    };

    const handleSaveChanges = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate API call
        console.log('Saving profile:', profile);
        // In a real app, you would upload the files if they exist
        // and then update the user object with the new URLs.
        setInitialProfile(profile); 
        addToast('تم حفظ التغييرات بنجاح!', 'success');
        setIsDirty(false); 
        // Note: Previews are not cleared to show the "saved" state.
        // In a real app, after successful upload, you'd update user.avatar_url
        // and clear the preview state.
    };
    
    const handleCancelChanges = () => {
        setProfile(initialProfile);
        handleRemoveImage('avatar');
        handleRemoveImage('banner');
    };
    
    const handleDeleteAccount = () => {
        if (deleteConfirmation !== user?.username) {
            addToast('النص الذي أدخلته لا يطابق اسم المستخدم الخاص بك.', 'error');
            return;
        }
        addToast('تم حذف الحساب بنجاح. سيتم تسجيل خروجك الآن.', 'success');
        setIsDeleteModalOpen(false);
        setTimeout(() => navigate('/'), 2000);
    };

    if (!user) return null;

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <header>
                <h1 className="text-3xl font-bold text-[#303841]">إعدادات الحساب</h1>
                <p className="text-gray-600 mt-2">
                    إدارة ملفك الشخصي العام وتفاصيل حسابك.
                </p>
            </header>

            <form onSubmit={handleSaveChanges}>
                {/* Public Profile Section */}
                <Card className="mb-8">
                    <div className="p-4 border-b border-gray-200">
                        <h2 className="text-lg font-bold">الملف الشخصي العام</h2>
                    </div>
                    <div className="p-6 space-y-6">
                        {/* Profile Banner */}
                        <div className="h-40 bg-gray-200 rounded-lg flex items-center justify-center relative group">
                            <img src={bannerPreview || `https://picsum.photos/seed/${user.id}/1000/250`} alt="Profile Banner" className="w-full h-full object-cover rounded-lg" />
                            <div className="absolute inset-0 bg-black/40 rounded-lg sm:opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <label htmlFor="banner-upload" className="cursor-pointer">
                                    <div className="bg-white/90 text-black text-sm py-2 px-3 rounded-md flex items-center gap-2 hover:bg-white transition-colors">
                                        <UploadIcon className="w-4 h-4" /> تغيير الغلاف
                                    </div>
                                    <input id="banner-upload" ref={bannerInputRef} type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'banner')} />
                                </label>
                                {bannerPreview && (
                                    <Button type="button" onClick={() => handleRemoveImage('banner')} variant="secondary" className="!bg-white/90 !text-black !text-sm !p-2">
                                        <TrashIcon className="w-4 h-4" />
                                    </Button>
                                )}
                            </div>
                        </div>

                        {/* Avatar */}
                        <div className="flex items-end -mt-16 ms-6">
                            <div className="relative group">
                                <img src={avatarPreview || user.avatar_url} alt="Avatar" className="w-24 h-24 rounded-full border-4 border-white shadow-md" />
                                <label htmlFor="avatar-upload" className="absolute inset-0 bg-black/50 rounded-full sm:opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                                    <UploadIcon className="w-6 h-6 text-white" />
                                    <input id="avatar-upload" ref={avatarInputRef} type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'avatar')} />
                                </label>
                            </div>
                            {avatarPreview && (
                                <Button type="button" onClick={() => handleRemoveImage('avatar')} variant="secondary" className="!text-xs ms-4 bg-white hover:bg-gray-100 border border-gray-300">
                                    <TrashIcon className="w-3 h-3 me-1" />
                                    إزالة
                                </Button>
                            )}
                        </div>
                        
                        {/* Form Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">الاسم المعروض</label>
                                <Input name="displayName" value={profile.displayName} onChange={handleInputChange} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">اسم المستخدم</label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 start-0 flex items-center ps-3 text-gray-500">@</span>
                                    <Input name="username" value={profile.username} onChange={handleInputChange} className="ps-7" />
                                </div>
                            </div>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium mb-1">نبذة تعريفية</label>
                            <Textarea name="bio" value={profile.bio} onChange={handleInputChange} rows={3} maxLength={160} />
                            <p className="text-xs text-gray-500 mt-1">{160 - profile.bio.length} حرف متبقي</p>
                        </div>

                        {/* Social Links */}
                        <div className="space-y-4">
                            <div className="relative">
                                <label className="block text-sm font-medium mb-1">الموقع الإلكتروني</label>
                                <span className="absolute inset-y-0 start-0 flex items-center ps-3 top-7 text-gray-400"><LinkIcon className="w-4 h-4"/></span>
                                <Input name="website" value={profile.website} onChange={handleInputChange} className="ps-9" placeholder="https://..." />
                            </div>
                             <div className="relative">
                                <label className="block text-sm font-medium mb-1">تويتر (X)</label>
                                <span className="absolute inset-y-0 start-0 flex items-center ps-3 top-7 text-gray-400"><TwitterIcon className="w-4 h-4"/></span>
                                <Input name="twitter" value={profile.social.twitter} onChange={handleSocialChange} className="ps-9" placeholder="username" />
                            </div>
                             <div className="relative">
                                <label className="block text-sm font-medium mb-1">GitHub</label>
                                <span className="absolute inset-y-0 start-0 flex items-center ps-3 top-7 text-gray-400"><GithubIcon className="w-4 h-4"/></span>
                                <Input name="github" value={profile.social.github} onChange={handleSocialChange} className="ps-9" placeholder="username" />
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Account Settings Section */}
                <Card className="mb-8">
                    <div className="p-4 border-b border-gray-200">
                        <h2 className="text-lg font-bold">إعدادات الحساب</h2>
                    </div>
                    <div className="p-6 space-y-4 divide-y divide-gray-200">
                         <div className="flex items-center justify-between pt-4 first:pt-0">
                            <div>
                                <h3 className="font-medium">البريد الإلكتروني</h3>
                                <p className="text-sm text-gray-500">{profile.email}</p>
                            </div>
                            <Button type="button" variant="secondary" className="bg-white border">تغيير</Button>
                        </div>
                         <div className="flex items-center justify-between pt-4 first:pt-0">
                            <div>
                                <h3 className="font-medium">كلمة المرور</h3>
                                <p className="text-sm text-gray-500">آخر تحديث منذ شهرين</p>
                            </div>
                            <Button type="button" variant="secondary" className="bg-white border">تغيير</Button>
                        </div>
                    </div>
                </Card>
                
                {/* Notifications Section */}
                <Card className="mb-8">
                    <div className="p-4 border-b border-gray-200">
                        <h2 className="text-lg font-bold">الإشعارات</h2>
                    </div>
                    <div className="p-6 space-y-4 divide-y divide-gray-200">
                        <div className="flex items-center justify-between pt-4 first:pt-0">
                            <div>
                                <h3 className="font-medium">متابعون جدد</h3>
                                <p className="text-sm text-gray-500">إشعار عند حصولك على متابع جديد.</p>
                            </div>
                            <ToggleSwitch checked={profile.notifications.newFollowers} onChange={(val) => handleNotificationChange('newFollowers', val)} />
                        </div>
                         <div className="flex items-center justify-between pt-4 first:pt-0">
                            <div>
                                <h3 className="font-medium">الإعجابات على الأوامر</h3>
                                <p className="text-sm text-gray-500">إشعار عند إعجاب شخص ما بأمر قمت بإضافته.</p>
                            </div>
                            <ToggleSwitch checked={profile.notifications.promptLikes} onChange={(val) => handleNotificationChange('promptLikes', val)} />
                        </div>
                         <div className="flex items-center justify-between pt-4 first:pt-0">
                            <div>
                                <h3 className="font-medium">النشرة البريدية</h3>
                                <p className="text-sm text-gray-500">تلقي تحديثات وعروض من برمباتي.</p>
                            </div>
                            <ToggleSwitch checked={profile.notifications.newsletter} onChange={(val) => handleNotificationChange('newsletter', val)} />
                        </div>
                    </div>
                </Card>

                {/* Danger Zone */}
                <Card className="border-red-300 bg-red-50">
                    <div className="p-4 border-b border-red-200">
                        <h2 className="text-lg font-bold text-red-800">المنطقة الخطرة</h2>
                    </div>
                    <div className="p-6">
                        <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                            <div>
                                <h3 className="font-medium text-red-900">حذف الحساب</h3>
                                <p className="text-sm text-red-700 mt-1">
                                    سيؤدي هذا إلى حذف حسابك وجميع بياناتك بشكل دائم. لا يمكن التراجع عن هذا الإجراء.
                                </p>
                            </div>
                            <Button type="button" variant="destructive" onClick={() => setIsDeleteModalOpen(true)} className="flex-shrink-0 w-full sm:w-auto">
                                حذف حسابي
                            </Button>
                        </div>
                    </div>
                </Card>

                {/* Sticky Footer for Actions */}
                <div className={`lg:sticky mt-2 bottom-0 bg-white/80 backdrop-blur-sm border-t border-gray-200 py-3 px-6 rounded-t-lg transition-transform duration-300 ${isDirty ? 'translate-y-0' : 'translate-y-full'}`}>
                    <div className="max-w-4xl mx-auto flex justify-between items-center">
                        <p className="text-sm font-medium">لديك تغييرات غير محفوظة!</p>
                        <div className="flex gap-3">
                            <Button type="button" variant="secondary" onClick={handleCancelChanges}>إلغاء</Button>
                            <Button type="submit">حفظ التغييرات</Button>
                        </div>
                    </div>
                </div>
            </form>

            {/* Delete Account Modal */}
            <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} size="lg">
                <div className="p-6 text-center">
                    <div className="mx-auto bg-red-100 w-12 h-12 rounded-full flex items-center justify-center">
                        <AlertCircleIcon className="w-6 h-6 text-red-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mt-5">هل أنت متأكد؟</h3>
                    <p className="text-sm text-gray-500 mt-2">
                        سيتم حذف حسابك نهائيًا. للتأكيد، يرجى كتابة اسم المستخدم الخاص بك: <strong className="text-red-600">{user.username}</strong>
                    </p>
                    <div className="mt-4">
                        <Input 
                            value={deleteConfirmation}
                            onChange={(e) => setDeleteConfirmation(e.target.value)}
                            placeholder="اكتب اسم المستخدم هنا"
                            className="text-center"
                        />
                    </div>
                    <div className="mt-6 flex justify-center gap-3">
                         <Button type="button" variant="secondary" onClick={() => setIsDeleteModalOpen(false)} className="bg-white border">
                             إلغاء
                         </Button>
                         <Button 
                            type="button" 
                            variant="destructive"
                            onClick={handleDeleteAccount}
                            disabled={deleteConfirmation !== user.username}
                         >
                             أنا أفهم، قم بالحذف
                         </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default EditProfilePage;