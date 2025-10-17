import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  onClick,
  type = 'button',
  disabled = false,
}) => {
  const baseClasses = 'font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed dark:focus:ring-gray-600 dark:focus:ring-offset-gray-800';
  
  const variantClasses = {
    primary: 'bg-cosmt-primary text-white hover:bg-cosmt-primary-dark rounded dark:bg-cosmt-primary dark:hover:bg-cosmt-primary-dark',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 rounded dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-cosmt-primary hover:text-cosmt-primary rounded dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:border-cosmt-primary dark:hover:text-cosmt-primary',
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };
  
  return (
    <button
      type={type}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
