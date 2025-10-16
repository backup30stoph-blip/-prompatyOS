import React from 'react';

const FollowersPage: React.FC = () => {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-[#303841]">المتابعون</h1>
        <p className="text-gray-600 mt-2">
          قائمة المستخدمين الذين يتابعونك.
        </p>
      </header>
      
      <div className="text-center py-16 text-gray-600 bg-white border border-gray-200 rounded-lg">
          <p>صفحة المتابعين.</p>
          <p className="text-sm mt-2">(هذه الميزة قيد التطوير)</p>
      </div>
    </div>
  );
};

export default FollowersPage;
