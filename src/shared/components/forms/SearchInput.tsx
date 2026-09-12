import React, { forwardRef } from 'react';
import { Input, InputProps } from '../ui/Input';
import { Search } from 'lucide-react';

export interface SearchInputProps extends InputProps {}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>((props, ref) => {
  return (
    <Input
      ref={ref}
      type="search"
      leftIcon={<Search className="w-4 h-4 text-slate-400" />}
      placeholder="Search..."
      {...props}
    />
  );
});

SearchInput.displayName = 'SearchInput';
