import React from 'react';
import Card from '../components/ui/Card';

const DashboardPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">لوحة التحكم</h1>
      <Card>
        <div className="p-6">
          <h2 className="text-xl font-semibold">مرحباً بك في لوحة التحكم!</h2>
          <p className="mt-2 text-gray-600">
            من هنا يمكنك إدارة المحتوى والمستخدمين في موقعك. استخدم القائمة الجانبية للتنقل بين الأقسام.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default DashboardPage;
