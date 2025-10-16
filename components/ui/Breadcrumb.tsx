import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeftIcon } from '../icons';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className = '' }) => {
  return (
    <nav aria-label="breadcrumb" className={`flex items-center text-sm text-gray-600 ${className}`}>
      <ol className="flex items-center space-x-2 space-x-reverse">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {item.href ? (
              <Link to={item.href} className="hover:text-[#0A2647] hover:underline transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className="font-semibold text-gray-800 truncate">{item.label}</span>
            )}
            {index < items.length - 1 && (
              <ChevronLeftIcon className="w-4 h-4 text-gray-400 mx-1 flex-shrink-0" />
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
