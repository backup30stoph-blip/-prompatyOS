import React from 'react';

// Using an existing icon for some flair
import { SparklesIcon } from './icons';

interface AdsenseAdProps {
  type: 'display' | 'feed' | 'article';
  className?: string;
}

const AdsenseAd: React.FC<AdsenseAdProps> = ({ type, className = '' }) => {
  const styles = {
    display: 'h-48', // Standard display ad, e.g., 728x90 or 300x250
    feed: 'h-48',    // In-feed ad
    article: 'h-48', // In-article ad
  };

  return (
    <div className={`bg-gray-200 border border-dashed border-gray-400 rounded-lg flex items-center justify-center text-gray-500 ${styles[type]} ${className}`}>
        <div className="text-center">
            <SparklesIcon className="w-8 h-8 mx-auto text-gray-400 mb-2"/>
            <p className="font-semibold">مساحة إعلانية</p>
            <p className="text-xs">({type})</p>
        </div>
    </div>
  );
};

export default AdsenseAd;
