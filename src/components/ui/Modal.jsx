// src/components/ui/Modal.jsx
export default function Modal({ isOpen, onClose, children, maxWidth = 'max-w-5xl' }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>
      
      {/* max-w-5xl membuat container lebih lebar dari sebelumnya */}
      <div className={`relative w-full ${maxWidth} bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300`}>
        <div className="max-h-[90vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
