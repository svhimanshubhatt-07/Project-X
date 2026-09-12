import React, { useState, useRef } from 'react';
import { UploadCloud, File, X, CheckCircle2 } from 'lucide-react';
import clsx from 'clsx';
import { formatFileSize } from '../../utils/formatFileSize';

export interface FileUploaderProps {
  label?: string;
  helperText?: string;
  accept?: string;
  maxSizeMB?: number;
  value?: File | { name: string; size?: number; url?: string } | null;
  onChange: (file: File | null) => void;
  disabled?: boolean;
  className?: string;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  label,
  helperText = 'PDF, DOCX, PNG, JPG up to 10MB',
  accept = '.pdf,.doc,.docx,.png,.jpg,.jpeg',
  maxSizeMB = 10,
  value,
  onChange,
  disabled,
  className,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];

    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File size exceeds ${maxSizeMB}MB.`);
      return;
    }

    setError(null);
    onChange(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div className={clsx('flex flex-col gap-1.5 w-full', className)}>
      {label && <span className="text-xs font-semibold text-slate-300 select-none">{label}</span>}

      {value ? (
        <div className="flex items-center justify-between p-3.5 bg-[#091b27] rounded-xl border border-[#17384e]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
              <File className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-200 truncate max-w-xs">{value.name}</p>
              {value.size && (
                <p className="text-[11px] text-slate-500">{formatFileSize(value.size)}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            {!disabled && (
              <button
                type="button"
                onClick={() => onChange(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => !disabled && inputRef.current?.click()}
          className={clsx(
            'border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer select-none flex flex-col items-center justify-center gap-2',
            isDragging
              ? 'border-teal-400 bg-teal-500/10'
              : 'border-[#17384e] bg-[#091b27]/60 hover:border-teal-500/50 hover:bg-[#091b27]',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        >
          <input
            type="file"
            ref={inputRef}
            onChange={(e) => handleFiles(e.target.files)}
            accept={accept}
            disabled={disabled}
            className="hidden"
          />

          <div className="w-10 h-10 rounded-xl bg-[var(--bg-card-inner)] border border-[var(--border-subtle)] shadow-sm flex items-center justify-center text-[var(--brand-primary)]">
            <UploadCloud className="w-5 h-5" />
          </div>

          <div>
            <p className="text-xs font-semibold text-slate-300">
              <span className="text-[var(--brand-primary)] underline underline-offset-2">Click to upload</span>{' '}
              or drag & drop
            </p>
            <p className="text-[11px] text-slate-500 mt-1">{helperText}</p>
          </div>
        </div>
      )}

      {error && <p className="text-xs text-rose-400">{error}</p>}
    </div>
  );
};
