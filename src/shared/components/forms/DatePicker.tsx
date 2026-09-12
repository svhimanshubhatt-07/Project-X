import React, { InputHTMLAttributes, forwardRef } from 'react';
import { Input, InputProps } from '../ui/Input';
import { Calendar } from 'lucide-react';

export interface DatePickerProps extends Omit<InputProps, 'type'> {}

export const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>((props, ref) => {
  return (
    <Input
      ref={ref}
      type="date"
      leftIcon={<Calendar className="w-4 h-4" />}
      className="[color-scheme:light]"
      {...props}
    />
  );
});

DatePicker.displayName = 'DatePicker';
