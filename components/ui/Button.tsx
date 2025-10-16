import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'destructive';
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseClasses = 'inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-semibold transition-all duration-300 focus:outline-none focus:ring-4 disabled:opacity-60 disabled:cursor-not-allowed shadow-sm hover:shadow-md disabled:shadow-none';
  
  const variantClasses = {
    primary: 'bg-[#0A2647] text-white hover:bg-[#1A3F75] focus:ring-[#0A2647]/50',
    secondary: 'bg-gray-100 text-[#1C2B3A] border border-gray-300 hover:bg-gray-200 focus:ring-gray-300/50',
    destructive: 'bg-[#D72323] text-white hover:bg-[#b80202] focus:ring-[#D72323]/50',
  };

  return (
    <button className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;