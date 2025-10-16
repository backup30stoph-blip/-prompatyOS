import React, { useState, useEffect } from 'react';
import Modal from './ui/Modal';
import Button from './ui/Button';
import Input from './ui/Input';
import { KeyIcon, CheckCircleIcon, TrashIcon, CloseIcon, InfoIcon, SaveIcon } from './icons';
import { useApiKey } from '../contexts/ApiKeyContext';
import { useToast } from '../contexts/ToastContext';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose }) => {
  const { isApiKeySet, saveApiKey, deleteApiKey } = useApiKey();
  const { addToast } = useToast();
  const [keyInput, setKeyInput] = useState('');

  useEffect(() => {
    // Clear input when modal is opened/closed or status changes
    setKeyInput('');
  }, [isOpen, isApiKeySet]);

  const handleSave = () => {
    if (!keyInput.trim()) {
      addToast('يرجى إدخال مفتاح API صالح.', 'error');
      return;
    }
    saveApiKey(keyInput.trim());
    addToast('تم حفظ مفتاح API بنجاح!', 'success');
    onClose();
  };

  const handleDelete = () => {
    deleteApiKey();
    addToast('تم حذف مفتاح API.', 'success');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${isApiKeySet ? 'bg-green-100' : 'bg-blue-100'}`}>
              <KeyIcon className={`w-6 h-6 ${isApiKeySet ? 'text-green-600' : 'text-blue-600'}`} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#1C2B3A]">إدارة مفتاح Gemini API</h2>
              <p className="text-sm text-gray-600">
                مفتاحك يُحفظ في متصفحك فقط.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:bg-gray-100 -mt-1 -me-1">
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-6">
          {isApiKeySet ? (
            <div className="space-y-4">
              <div className="p-4 rounded-lg flex items-center gap-3 bg-green-50 border border-green-200">
                <CheckCircleIcon className="w-6 h-6 text-green-600 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-semibold text-green-800">
                    مفتاح API الخاص بك نشط حاليًا
                  </h3>
                  <p className="text-xs mt-1 text-green-700">
                    يمكنك الآن استخدام جميع الميزات التي تعمل بالذكاء الاصطناعي.
                  </p>
                </div>
              </div>
              <Button onClick={handleDelete} variant="destructive" className="w-full">
                <TrashIcon className="w-4 h-4 me-2" />
                حذف المفتاح الحالي
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <label htmlFor="apiKeyInput" className="block text-sm font-medium text-gray-700">
                أدخل مفتاح Gemini API الخاص بك
              </label>
              <Input
                id="apiKeyInput"
                type="password"
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                placeholder="AIzaSy..."
                className="text-left dir-ltr"
              />
              <Button onClick={handleSave} className="w-full">
                <SaveIcon className="w-4 h-4 me-2" />
                حفظ المفتاح
              </Button>
            </div>
          )}
        </div>

        <div className="mt-6 text-xs text-gray-600 bg-blue-50 p-4 rounded-lg flex items-start gap-3 border border-blue-200">
          <InfoIcon className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-blue-800 mb-1">كيف أحصل على مفتاح API؟</h4>
            <p className="leading-relaxed">
              يمكنك الحصول على مفتاح API مجاني لـ Gemini من Google AI Studio. المفتاح ضروري لتشغيل ميزات التوليد بالذكاء الاصطناعي في هذا التطبيق.
              {' '}
              <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="font-bold text-blue-700 hover:underline">
                احصل على مفتاحك من هنا
              </a>.
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ApiKeyModal;