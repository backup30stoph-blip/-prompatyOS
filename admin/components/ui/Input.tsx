import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => {
  return (
    <input
      className={`w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-orange-600 ${className}`}
      ref={ref}
      {...props}
    />
  );
});

Input.displayName = 'Input';
export default Input;