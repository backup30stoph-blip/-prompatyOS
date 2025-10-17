import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    children: React.ReactNode;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(({ className, children, ...props }, ref) => {
  return (
    <select
      className={`w-full bg-white border border-slate-300 text-slate-800 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition ${className}`}
      ref={ref}
      {...props}
    >
        {children}
    </select>
  );
});

Select.displayName = 'Select';
export default Select;