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
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
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
        className={`w-full px-3 py-2 text-sm border rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${icon ? 'pr-10' : ''} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
        style={{
          backgroundColor: 'var(--admin-surface)',
          borderColor: 'var(--admin-border)',
          color: 'var(--admin-text-primary)',
        }}
        onFocus={(e) => {
          e.target.style.borderColor = 'var(--admin-primary)';
          e.target.style.boxShadow = '0 0 0 3px rgba(0, 81, 75, 0.1)';
          onFocus?.(e);
        }}
        onBlur={(e) => {
          e.target.style.borderColor = 'var(--admin-border)';
          e.target.style.boxShadow = 'none';
          onBlur?.(e);
        }}
      />
    </div>
  );
};
