import { createPortal } from 'react-dom';

// On <body>: the page shell is a CSS container, which would trap position:fixed.
const Alert = ({ type, text }) =>
  createPortal(
    <div
      role="alert"
      className="fixed bottom-5 left-5 z-50 flex max-w-[calc(100vw-2.5rem)] items-center gap-3 rounded-lg border-2 border-night bg-night px-4 py-3 text-sm text-ink">
      <span aria-hidden="true" className={`h-2 w-2 shrink-0 rounded-full ${type === 'danger' ? 'bg-clay' : 'bg-sage'}`} />
      {text}
    </div>,
    document.body,
  );

export default Alert;
