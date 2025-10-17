import React from 'react';
import Card from './ui/Card';

const PromptCardSkeleton: React.FC = () => {
  return (
    <Card className="h-full flex flex-col animate-pulse">
      <div className="p-5 flex-grow">
        <div className="h-5 bg-slate-200 rounded w-3/4 mb-4"></div>
        <div className="space-y-2">
          <div className="h-4 bg-slate-200 rounded w-full"></div>
          <div className="h-4 bg-slate-200 rounded w-5/6"></div>
        </div>
      </div>
      <div className="p-5 border-t border-slate-100 mt-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="h-6 w-20 bg-slate-200 rounded-full"></div>
            <div className="h-6 w-16 bg-slate-200 rounded-full"></div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-slate-200 rounded-full"></div>
            <div className="h-4 w-24 bg-slate-200 rounded"></div>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-4 w-10 bg-slate-200 rounded"></div>
            <div className="h-4 w-10 bg-slate-200 rounded"></div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default PromptCardSkeleton;