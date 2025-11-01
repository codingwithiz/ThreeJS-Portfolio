import React from 'react';

const ResumeModal = ({ isVisible, onClose }) => {
  const handleDownloadResume = () => {
    const link = document.createElement('a');
    link.href = '/assets/iz_resume.pdf';
    link.download = 'Lee Ing Zhen Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="relative w-[90vw] h-[90vh] max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <h2 className="text-xl font-bold">📄 Ing Zhen's Resume</h2>
          <div className="flex gap-2">
            <button onClick={handleDownloadResume} className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors duration-200 text-sm font-medium">
              ⬇️ Download PDF
            </button>
            <button onClick={onClose} className="px-3 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors duration-200">
              ✕
            </button>
          </div>
        </div>
        <div className="w-full h-full">
          <iframe src="/assets/iz_resume.pdf#toolbar=1&navpanes=1&scrollbar=1" className="w-full h-full border-none" title="Ing Zhen Resume" />
        </div>
      </div>
    </div>
  );
};

export default ResumeModal;