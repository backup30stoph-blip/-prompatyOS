import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { GithubIcon } from '../components/icons';

const LoginPage: React.FC = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/profile');
    }
  }, [user, navigate]);

  return (
    <div className="flex items-center justify-center py-12">
      <Card className="w-full max-w-sm text-center">
        <h2 className="text-2xl font-bold text-center text-[#303841] mb-2">تسجيل الدخول</h2>
        <p className="text-gray-600 mb-8">
          للوصول إلى ملفك الشخصي وإضافة الأوامر.
        </p>
        <Button 
          onClick={login} 
          className="w-full flex items-center justify-center gap-3 !bg-[#333] hover:!bg-[#111] focus:!ring-[#333]"
        >
            <GithubIcon className="w-5 h-5" />
            <span>المتابعة باستخدام GitHub</span>
        </Button>
         <p className="text-xs text-gray-500 mt-6">
            بالتسجيل، أنت توافق على شروط الخدمة وسياسة الخصوصية.
        </p>
      </Card>
    </div>
  );
};

export default LoginPage;
