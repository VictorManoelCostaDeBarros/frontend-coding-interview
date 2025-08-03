import React, { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  rightElement?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({ 
  label, 
  error, 
  rightElement, 
  className = '', 
  ...props 
}) => {
  return (
    <div className="w-full h-[71px]">
      <div className="flex justify-between items-center mb-2">
        <label className="text-[14px] font-bold text-gray-900 leading-[1.15] font-['Helvetica']">
          {label}
        </label>
        {rightElement && (
          <div className="text-[14px] text-blue-600 leading-[1.15] font-['Helvetica']">
            {rightElement}
          </div>
        )}
      </div>
      <input
        className={`
          w-[319px] h-[44px] px-[10px] py-2 border border-gray-300 rounded-lg
          text-[16px] text-gray-900 placeholder-gray-500 leading-[1.15] font-['Helvetica']
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          ${error ? 'border-red-500' : ''}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}; 