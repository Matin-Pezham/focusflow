import React, { useEffect } from "react";
import { createPortal } from "react-dom";

interface OverlayProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  backdropClassName?: string;
  positionClassName?: string;
  contentClassName?: string;
}

const Overlay: React.FC<OverlayProps> = ({
  isOpen,
  onClose,
  children,
  className,
  backdropClassName,
  positionClassName,
  contentClassName,
}) => {
  useEffect(() => {
    if (!isOpen || typeof document === "undefined") return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className={`fixed inset-0 z-40 ${backdropClassName ?? "bg-slate-950/60 backdrop-blur-xl"}`}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className={`relative flex min-h-screen w-full ${positionClassName ?? "items-start justify-center px-4 pt-24 sm:px-6 lg:px-8"}`}>
        <div
          className={`relative z-50 ${contentClassName ?? "w-full"}`}
          onMouseDown={(event) => event.stopPropagation()}
          role="dialog"
          aria-modal="true"
        >
          <div className={className}>{children}</div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Overlay;
