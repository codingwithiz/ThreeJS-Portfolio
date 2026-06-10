import { useEffect, useRef, useState } from 'react';

/**
 * Renders children only once the element scrolls near the viewport.
 * Used to defer mounting heavy WebGL canvases below the fold — fewer live
 * contexts at load = faster first paint and a lighter time on mobile GPUs.
 */
const InView = ({ children, className = '', rootMargin = '250px', fallback = null }) => {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);

  return (
    <div ref={ref} className={className}>
      {shown ? children : fallback}
    </div>
  );
};

export default InView;
