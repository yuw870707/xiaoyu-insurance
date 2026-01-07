import { useState, useRef } from 'react';
import { X, Upload, File, Trash2 } from 'lucide-react';

interface ClaimsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface UploadedFile {
  id: string;
  name: string;
  file: File;
}

export default function ClaimsModal({ isOpen, onClose }: ClaimsModalProps) {
  const [description, setDescription] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles: UploadedFile[] = Array.from(files).map((file) => ({
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        file,
      }));
      setUploadedFiles([...uploadedFiles, ...newFiles]);
    }
    // 重置 input，允许重复选择同一文件
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveFile = (id: string) => {
    setUploadedFiles(uploadedFiles.filter((f) => f.id !== id));
  };

  const handleSubmit = () => {
    if (!description.trim()) {
      alert('请填写理赔描述');
      return;
    }
    // 模拟提交
    console.log('理赔申请提交:', { description, files: uploadedFiles });
    alert('理赔申请已提交！顾问小宇将在24小时内联系您。');
    // 重置表单
    setDescription('');
    setUploadedFiles([]);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* 背景遮罩 */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* 弹窗容器 - Bottom Sheet 风格 */}
      <div className="relative bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden animate-slide-up">
        {/* 拖拽指示条 */}
        <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mt-2 mb-4" />

        {/* Header */}
        <div className="px-6 pt-2 pb-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 flex items-center">
              <span className="mr-2">☂️</span>
              极速理赔通道
            </h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            >
              <X size={18} className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* 内容区域 */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {/* 理赔描述 */}
          <div className="mb-6">
            <label className="block text-sm font-bold text-slate-700 mb-2">
              理赔描述
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="请简单描述发生的情况..."
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D31145] resize-none"
            />
          </div>

          {/* 资料上传区 */}
          <div className="mb-6">
            <label className="block text-sm font-bold text-slate-700 mb-2">
              上传资料
            </label>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.jpg,.png,.jpeg"
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-[#D31145] hover:bg-red-50/50 transition-all"
            >
              <Upload size={32} className="text-gray-400 mb-2" />
              <span className="text-sm font-medium text-gray-600 text-center">
                点击上传医疗报告/理赔申请书
              </span>
              <span className="text-xs text-gray-400 mt-1">
                支持 PDF/Word/图片格式
              </span>
            </label>

            {/* 已上传文件列表 */}
            {uploadedFiles.length > 0 && (
              <div className="mt-4 space-y-2">
                {uploadedFiles.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex items-center space-x-2 flex-1 min-w-0">
                      <File size={16} className="text-[#D31145] flex-shrink-0" />
                      <span className="text-sm text-gray-700 truncate">
                        {file.name}
                      </span>
                    </div>
                    <button
                      onClick={() => handleRemoveFile(file.id)}
                      className="ml-2 p-1 hover:bg-red-100 rounded transition-colors"
                    >
                      <Trash2 size={16} className="text-red-500" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
          <button
            onClick={handleSubmit}
            className="w-full py-3 bg-[#D31145] text-white rounded-xl font-bold shadow-lg hover:bg-[#B80E3A] active:scale-95 transition-all"
          >
            提交理赔申请
          </button>
        </div>
      </div>
    </div>
  );
}
