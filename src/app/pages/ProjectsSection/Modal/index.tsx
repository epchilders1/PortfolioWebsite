'use client';

import { useCallback, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import * as FocusTrapModule from 'focus-trap-react';
import { AnimatePresence, motion } from 'framer-motion';
import clsx from 'clsx';
import Confetti from 'react-confetti'
import type ModalProps from './modal.type';

const FocusTrap = FocusTrapModule.FocusTrap ?? FocusTrapModule.default;

export default function Modal({
  children,
  showModal,
  setShowModal,
  containerClasses,
  unBoundWidth,
}: ModalProps) {
  const desktopModalRef = useRef(null);
  const mobileModalRef = useRef(null);

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowModal(false);
      }
    },
    [setShowModal],
  );

  useEffect(() => {
    document.addEventListener('keydown', onKeyDown);
    
    return () => document.removeEventListener('keydown', onKeyDown);
    
  }, [onKeyDown]);

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showModal]);

  const modalContent = (
    <AnimatePresence>
      {showModal && (
        <>
          <motion.div
            key="backdrop"
            className="fixed inset-0 z-9998 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
          />

          <FocusTrap 
            focusTrapOptions={{ 
              initialFocus: false,
              allowOutsideClick: true,
              fallbackFocus: () => document.body,
              checkCanFocusTrap: (trapContainers:any) => {
                return new Promise((resolve) => {
                  setTimeout(() => {
                    const hasFocusable = trapContainers.some((container:any) => 
                      container.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
                    );
                    resolve(hasFocusable);
                  }, 100);
                });
              }
            }}
          >
            <motion.div
              ref={desktopModalRef}
              key="desktop-modal"
              className="fixed inset-0 z-9999 hidden min-h-screen items-center justify-center md:flex md:px-4"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onMouseDown={(e: React.MouseEvent) => {
                if (desktopModalRef.current === e.target) {
                  setShowModal(false);
                }
              }}
            >
                <div
                className={clsx(
                  `overflow-y-auto max-h-[90vh] relative transform rounded-xl border border-white/10 p-6 text-left shadow-2xl transition-all`,
                  !unBoundWidth && !containerClasses && 'w-full max-w-md',
                  containerClasses,
                )}
                >
                {children}
                </div>
            </motion.div>
          </FocusTrap>

          <motion.div
            ref={mobileModalRef}
            key="mobile-modal"
            className="fixed inset-0 z-9999 flex items-center justify-center p-4 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e: React.MouseEvent) => {
              if (mobileModalRef.current === e.target) {
                setShowModal(false);
              }
            }}
          >
            <motion.div
              className={clsx(
                `w-full transform rounded-xl border border-white/10 p-6 text-left shadow-2xl transition-all max-w-[95vw] overflow-y-auto max-h-[90vh]`,
                containerClasses,
              )}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
              {children}
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return typeof document !== 'undefined' 
    ? createPortal(modalContent, document.body)
    : null;
}