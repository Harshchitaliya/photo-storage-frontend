import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

const Portal = ({ children, wrapperId = 'portal-wrapper' }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    let wrapper = document.getElementById(wrapperId);
    if (!wrapper) {
      wrapper = document.createElement('div');
      wrapper.setAttribute('id', wrapperId);
      document.body.appendChild(wrapper);
    }
    
    return () => {
      const existingWrapper = document.getElementById(wrapperId);
      if (existingWrapper && existingWrapper.parentNode) {
        existingWrapper.parentNode.removeChild(existingWrapper);
      }
    };
  }, [wrapperId]);

  if (!mounted) return null;

  return createPortal(
    children,
    document.getElementById(wrapperId)
  );
};

export default Portal; 