import React, { ReactNode } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { AlertTriangle, Info, CheckCircle2, ShieldAlert } from 'lucide-react';
import clsx from 'clsx';

export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: ReactNode;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'primary' | 'success';
  isLoading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'primary',
  isLoading = false,
}) => {
  const icons = {
    danger: <ShieldAlert className="w-6 h-6 text-rose-500" />,
    warning: <AlertTriangle className="w-6 h-6 text-amber-500" />,
    primary: <Info className="w-6 h-6 text-orange-500" />,
    success: <CheckCircle2 className="w-6 h-6 text-emerald-500" />,
  };

  const iconBgs = {
    danger: 'bg-rose-500/10 border-rose-500/20',
    warning: 'bg-amber-500/10 border-amber-500/20',
    primary: 'bg-teal-500/10 border-teal-500/20',
    success: 'bg-emerald-500/10 border-emerald-500/20',
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className="flex flex-col items-center text-center p-2">
        <div
          className={clsx(
            'w-14 h-14 rounded-2xl flex items-center justify-center border mb-4',
            iconBgs[variant]
          )}
        >
          {icons[variant]}
        </div>

        <h3 className="text-lg font-bold text-slate-100 font-heading">{title}</h3>
        <div className="text-xs text-slate-400 mt-2 leading-relaxed">{message}</div>

        <div className="mt-6 flex items-center gap-3 w-full">
          <Button
            variant="outline"
            className="flex-1"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button
            variant={variant === 'danger' ? 'danger' : variant === 'success' ? 'success' : 'primary'}
            className="flex-1"
            onClick={onConfirm}
            isLoading={isLoading}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
