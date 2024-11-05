import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const Portal = ({ children, wrapperId = "portal-wrapper", position }) => {
  const [mounted, setMounted] = useState(false);
  const [style, setStyle] = useState({});

  useEffect(() => {
    setMounted(true);
    let wrapper = document.getElementById(wrapperId);
    if (!wrapper) {
      wrapper = document.createElement("div");
      wrapper.setAttribute("id", wrapperId);
      document.body.appendChild(wrapper);
    }
    if (position) {
      setStyle({
        position: "absolute",
        top: `${position?.top || 0}px`,
        left: `${position?.left || 0}px`,
        zIndex: "1000",
      });
    }
    return () => {
      const existingWrapper = document.getElementById(wrapperId);
      if (existingWrapper && existingWrapper.parentNode) {
        existingWrapper.parentNode.removeChild(existingWrapper);
      }
    };
  }, [wrapperId, position]);

  if (!mounted) return null;

  return createPortal(
    <div style={style}>{children}</div>,
    document.getElementById(wrapperId)
  );
};

export default Portal;
