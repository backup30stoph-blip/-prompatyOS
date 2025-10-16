import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    children: React.ReactNode;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(({ className, children, ...props }, ref) => {
  return (
    <select
      className={`w-full bg-white border border-gray-300 text-[#1C2B3A] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#205295] focus:border-[#205295] transition ${className}`}
      ref={ref}
      {...props}
    >
        {children}
    </select>
  );
});

Select.displayName = 'Select';
export default Select;