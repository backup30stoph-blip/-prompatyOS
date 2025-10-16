import React from 'react';
import { Link } from 'react-router-dom';
import { 
    LogoIcon, TwitterIcon, GithubIcon, LinkedInIcon, FacebookIcon, InstagramIcon,
    TextIcon, ImageIcon, CodeIcon, WritingIcon, BookOpenIcon, InfoIcon, MailIcon,
    ShapesIcon, UsersIcon, VideoIcon
} from '../icons';
import Input from '../ui/Input';
import Button from '../ui/Button';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 text-center md:text-right">
          {/* Column 1: Brand & Newsletter */}
          <div className="lg:col-span-4 space-y-6 flex flex-col items-center md:items-start">
            <Link to="/" className="flex items-center gap-2">
              <LogoIcon className="h-9 w-9 text-[#0A2647]" />
              <span className="text-2xl font-bold text-[#0A2647]">برمباتي</span>
            </Link>
            <p className="text-gray-600 text-sm leading-relaxed">
              وجهتك الأولى لاستكشاف ومشاركة أوامر الذكاء الاصطناعي باللغة العربية. انضم إلى نشرتنا البريدية للحصول على أحدث الأوامر والنصائح مباشرة في بريدك.
            </p>
            <form className="flex gap-2 w-full max-w-sm">
              <Input type="email" placeholder="بريدك الإلكتروني" className="flex-grow" />
              <Button type="submit">اشترك</Button>
            </form>
          </div>
          
          {/* Spacer Column */}
          <div className="hidden lg:block lg:col-span-1"></div>

          {/* Column 2: Sections */}
          <div className="lg:col-span-2">
            <h3 className="text-base font-bold text-gray-800 tracking-wider flex items-center justify-center md:justify-start gap-2">
                <ShapesIcon className="text-[#0A2647] w-5 h-5"/>
                الأقسام
            </h3>
            <ul className="mt-4 space-y-3">
              <li><FooterLink to="/prompts?category=TEXT" icon={<TextIcon className="w-4 h-4"/>}>برومبت نص</FooterLink></li>
              <li><FooterLink to="/prompts?category=IMAGE" icon={<ImageIcon className="w-4 h-4"/>}>برومبت صورة</FooterLink></li>
              <li><FooterLink to="/prompts?category=VIDEO" icon={<VideoIcon className="w-4 h-4"/>}>برومبت فيديو</FooterLink></li>
              <li><FooterLink to="/prompts?category=CODE" icon={<CodeIcon className="w-4 h-4"/>}>برومبت برمجة</FooterLink></li>
              <li><FooterLink to="/prompts?category=WRITING" icon={<WritingIcon className="w-4 h-4"/>}>برومبت كتابة</FooterLink></li>
            </ul>
          </div>
          
          {/* Column 3: About */}
          <div className="lg:col-span-2">
            <h3 className="text-base font-bold text-gray-800 tracking-wider flex items-center justify-center md:justify-start gap-2">
                <LogoIcon className="text-[#0A2647] w-5 h-5"/>
                عن برمباتي
            </h3>
            <ul className="mt-4 space-y-3">
              <li><FooterLink to="/blog" icon={<BookOpenIcon className="w-4 h-4"/>}>المدونة</FooterLink></li>
              <li><FooterLink to="/about" icon={<InfoIcon className="w-4 h-4"/>}>من نحن</FooterLink></li>
              <li><FooterLink to="/contact" icon={<MailIcon className="w-4 h-4"/>}>اتصل بنا</FooterLink></li>
            </ul>
          </div>

          {/* Column 4: Legal & Social */}
           <div className="lg:col-span-3">
            <h3 className="text-base font-bold text-gray-800 tracking-wider flex items-center justify-center md:justify-start gap-2">
                <UsersIcon className="text-[#0A2647] w-5 h-5"/>
                تابعنا وتواصل معنا
            </h3>
             <div className="flex justify-center md:justify-start mt-4 space-x-4 space-x-reverse">
              <SocialLink href="#" icon={<TwitterIcon className="w-6 h-6"/>} ariaLabel="Twitter" />
              <SocialLink href="#" icon={<GithubIcon className="w-6 h-6"/>} ariaLabel="GitHub" />
              <SocialLink href="#" icon={<LinkedInIcon className="w-6 h-6"/>} ariaLabel="LinkedIn" />
              <SocialLink href="#" icon={<FacebookIcon className="w-6 h-6"/>} ariaLabel="Facebook" />
              <SocialLink href="#" icon={<InstagramIcon className="w-6 h-6"/>} ariaLabel="Instagram" />
            </div>
            <div className="mt-6 border-t border-gray-200 pt-6">
                <h3 className="text-base font-bold text-gray-800 tracking-wider">قانوني</h3>
                <ul className="mt-4 space-y-3">
                    <li><FooterLink to="/privacy">سياسة الخصوصية</FooterLink></li>
                    <li><FooterLink to="/terms">شروط الاستخدام</FooterLink></li>
                </ul>
            </div>
          </div>
        </div>
        
        <div className="mt-16 border-t border-gray-200 pt-8 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} برمباتي. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  );
};

// Helper component for footer links
const FooterLink: React.FC<{ to: string; icon?: React.ReactNode; children: React.ReactNode; }> = ({ to, icon, children }) => (
    <Link to={to} className="flex items-center justify-center md:justify-start gap-2 text-sm text-gray-600 hover:text-[#0A2647] transition-colors group">
        {icon && <span className="text-gray-400 group-hover:text-[#0A2647] transition-colors">{icon}</span>}
        <span>{children}</span>
    </Link>
);

// Helper component for social links
const SocialLink: React.FC<{ href: string; icon: React.ReactNode; ariaLabel: string; }> = ({ href, icon, ariaLabel }) => (
    <a href={href} aria-label={ariaLabel} className="text-gray-500 hover:text-[#0A2647] transition-colors">
        {icon}
    </a>
);

export default Footer;