import React from 'react';
import { Link } from 'react-router-dom';
import { 
    LogoIcon, TwitterIcon, GithubIcon, LinkedInIcon, FacebookIcon, InstagramIcon,
    TextIcon, ImageIcon, CodeIcon, WritingIcon, BookOpenIcon, InfoIcon, MailIcon,
    ShapesIcon, UsersIcon, VideoIcon
} from '../icons';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { PromptCategory, promptCategoryColors } from '../../types';

const Footer: React.FC = () => {
  const sectionLinks = [
    { to: `/prompts?category=${PromptCategory.TEXT}`, icon: <TextIcon />, children: 'برومبت نص', category: PromptCategory.TEXT },
    { to: `/prompts?category=${PromptCategory.IMAGE}`, icon: <ImageIcon />, children: 'برومبت صورة', category: PromptCategory.IMAGE },
    { to: `/prompts?category=${PromptCategory.VIDEO}`, icon: <VideoIcon />, children: 'برومبت فيديو', category: PromptCategory.VIDEO },
    { to: `/prompts?category=${PromptCategory.CODE}`, icon: <CodeIcon />, children: 'برومبت برمجة', category: PromptCategory.CODE },
    { to: `/prompts?category=${PromptCategory.WRITING}`, icon: <WritingIcon />, children: 'برومبت كتابة', category: PromptCategory.WRITING },
  ];
  
  return (
    <footer className="bg-white border-t border-slate-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 text-center md:text-right">
          {/* Column 1: Brand & Newsletter */}
          <div className="lg:col-span-4 space-y-6 flex flex-col items-center md:items-start">
            <Link to="/" className="flex items-center gap-2">
              <LogoIcon className="h-9 w-9 text-orange-500" />
              <span className="text-2xl font-bold text-slate-900">برمباتي</span>
            </Link>
            <p className="text-slate-600 text-sm leading-relaxed">
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
            <h3 className="text-base font-bold text-slate-800 tracking-wider flex items-center justify-center md:justify-start gap-2">
                <ShapesIcon className="text-orange-500 w-5 h-5"/>
                الأقسام
            </h3>
            <ul className="mt-4 space-y-3">
              {sectionLinks.map(link => (
                <li key={link.to}>
                   <FooterLink to={link.to} icon={link.icon} category={link.category}>
                    {link.children}
                  </FooterLink>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Column 3: About */}
          <div className="lg:col-span-2">
            <h3 className="text-base font-bold text-slate-800 tracking-wider flex items-center justify-center md:justify-start gap-2">
                <LogoIcon className="text-orange-500 w-5 h-5"/>
                عن برمباتي
            </h3>
            <ul className="mt-4 space-y-3">
              <li><FooterLink to="/blog" icon={<BookOpenIcon className="w-4 h-4 text-slate-400"/>}>المدونة</FooterLink></li>
              <li><FooterLink to="/about" icon={<InfoIcon className="w-4 h-4 text-slate-400"/>}>من نحن</FooterLink></li>
              <li><FooterLink to="/contact" icon={<MailIcon className="w-4 h-4 text-slate-400"/>}>اتصل بنا</FooterLink></li>
            </ul>
          </div>

          {/* Column 4: Legal & Social */}
           <div className="lg:col-span-3">
            <h3 className="text-base font-bold text-slate-800 tracking-wider flex items-center justify-center md:justify-start gap-2">
                <UsersIcon className="text-orange-500 w-5 h-5"/>
                تابعنا وتواصل معنا
            </h3>
             <div className="flex justify-center md:justify-start mt-4 space-x-4 space-x-reverse">
              <SocialLink href="#" icon={<TwitterIcon className="w-6 h-6"/>} ariaLabel="Twitter" />
              <SocialLink href="#" icon={<GithubIcon className="w-6 h-6"/>} ariaLabel="GitHub" />
              <SocialLink href="#" icon={<LinkedInIcon className="w-6 h-6"/>} ariaLabel="LinkedIn" />
              <SocialLink href="#" icon={<FacebookIcon className="w-6 h-6"/>} ariaLabel="Facebook" />
              <SocialLink href="#" icon={<InstagramIcon className="w-6 h-6"/>} ariaLabel="Instagram" />
            </div>
            <div className="mt-6 border-t border-slate-200 pt-6">
                <h3 className="text-base font-bold text-slate-800 tracking-wider">قانوني</h3>
                <ul className="mt-4 space-y-3">
                    <li><FooterLink to="/privacy">سياسة الخصوصية</FooterLink></li>
                    <li><FooterLink to="/terms">شروط الاستخدام</FooterLink></li>
                </ul>
            </div>
          </div>
        </div>
        
        <div className="mt-16 border-t border-slate-200 pt-8 text-center text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} برمباتي. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  );
};

// Helper component for footer links
const FooterLink: React.FC<{ to: string; icon?: React.ReactNode; children: React.ReactNode; category?: PromptCategory }> = ({ to, icon, children, category }) => (
    <Link to={to} className="flex items-center justify-center md:justify-start gap-2 text-sm text-slate-600 hover:text-orange-600 transition-colors group">
        {icon && (
          category ? 
          // FIX: Spread existing props to help TypeScript infer the element's prop types correctly and prevent an error when adding className.
          React.cloneElement(icon as React.ReactElement, { ...(icon as React.ReactElement).props, className: `w-4 h-4 ${promptCategoryColors[category].text}` }) :
          icon
        )}
        <span>{children}</span>
    </Link>
);

// Helper component for social links
const SocialLink: React.FC<{ href: string; icon: React.ReactNode; ariaLabel: string; }> = ({ href, icon, ariaLabel }) => (
    <a href={href} aria-label={ariaLabel} className="text-slate-500 hover:text-orange-600 transition-colors">
        {icon}
    </a>
);

export default Footer;