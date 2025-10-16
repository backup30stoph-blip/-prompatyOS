import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={`w-full bg-white border border-gray-300 text-[#1C2B3A] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#205295] focus:border-[#205295] placeholder:text-gray-400 transition ${className}`}
      ref={ref}
      {...props}
    />
  );
});

Textarea.displayName = 'Textarea';
export default Textarea;