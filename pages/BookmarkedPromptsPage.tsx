
import React from 'react';

const BookmarkedPromptsPage: React.FC = () => {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-[#303841]">الأوامر المحفوظة</h1>
        <p className="text-gray-600 mt-2">
          هنا تجد جميع الأوامر التي حفظتها للرجوع إليها لاحقًا.
        </p>
      </header>
      
      <div className="text-center py-16 text-gray-600 bg-white border border-gray-200 rounded-lg">
          <p>لم تقم بحفظ أي أوامر بعد.</p>
          <p className="text-sm mt-2">(ميزة الحفظ قيد التطوير)</p>
      </div>
    </div>
  );
};

export default BookmarkedPromptsPage;
