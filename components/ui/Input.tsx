import React from 'react';

interface InputProps {
  type?: 'text' | 'email' | 'password' | 'search' | 'number' | 'tel' | 'url';
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  className?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  required?: boolean;
  id?: string;
  name?: string;
  autoComplete?: string;
}

export const Input: React.FC<InputProps> = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  onFocus,
  className = '',
  icon,
  disabled = false,
  required = false,
  id,
  name,
  autoComplete,
}) => {
  return (
    <div className="relative">
      {icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
          {icon}
        </div>
      )}
      <input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        onFocus={onFocus}
        disabled={disabled}
        required={required}
        autoComplete={autoComplete}
        className={`cosmt-input-base ${icon ? 'pl-10' : ''} ${disabled ? 'bg-gray-50 cursor-not-allowed' : ''} ${className}`}
      />
    </div>
  );
};
