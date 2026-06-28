import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface OverlayProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  backdropClassName?: string;
  positionClassName?: string;
  contentClassName?: string;
  contentStyle?: React.CSSProperties;
  closeOnBackdropClick?: boolean;
  closeOnEscape?: boolean;
  disableBodyScroll?: boolean;
}

let activeOverlayCount = 0;
let previousBodyOverflow: string | null = null;

const lockBodyScroll = () => {
  if (typeof document === "undefined") return;

  activeOverlayCount += 1;
  if (activeOverlayCount === 1) {
    previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
  }
};

const unlockBodyScroll = () => {
  if (typeof document === "undefined") return;

  activeOverlayCount = Math.max(0, activeOverlayCount - 1);
  if (activeOverlayCount === 0) {
    document.body.style.overflow = previousBodyOverflow ?? "";
    previousBodyOverflow = null;
  }
};

const Overlay: React.FC<OverlayProps> = ({
  isOpen,
  onClose,
  children,
  className,
  backdropClassName,
  positionClassName,
  contentClassName,
  contentStyle,
  closeOnBackdropClick = true,
  closeOnEscape = true,
  disableBodyScroll = true,
}) => {
  const [isMounted, setIsMounted] = useState(isOpen);
  const [isVisible, setIsVisible] = useState(isOpen);

  useEffect(() => {
    if (!disableBodyScroll) return;

    if (isOpen) {
      lockBodyScroll();
      return () => unlockBodyScroll();
    }

    unlockBodyScroll();
    return undefined;
  }, [disableBodyScroll, isOpen]);

  useEffect(() => {
    if (isOpen) {
      setIsMounted(true);
      const frame = window.requestAnimationFrame(() => setIsVisible(true));
      return () => window.cancelAnimationFrame(frame);
    }

    setIsVisible(false);
    const timer = window.setTimeout(() => setIsMounted(false), 220);
    return () => window.clearTimeout(timer);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closeOnEscape, isOpen, onClose]);

  if (!isMounted || typeof document === "undefined") return null;

  return createPortal(
    <div
      className={`fixed inset-0 z-40 transition-opacity duration-300 ${isVisible ? "opacity-100" : "opacity-0"} ${backdropClassName ?? "bg-slate-950/70 backdrop-blur-xl"}`}
      onMouseDown={(event) => {
        if (closeOnBackdropClick && event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className={`relative flex min-h-screen w-full ${positionClassName ?? "items-start justify-center px-4 pt-24 sm:px-6 lg:px-8"}`}>
        <div
          className={`relative z-50 transition-all duration-300 ${isVisible ? "translate-y-0 scale-100 opacity-100" : "translate-y-2 scale-[0.98] opacity-0"} ${contentClassName ?? "w-full"}`}
          style={contentStyle}
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
