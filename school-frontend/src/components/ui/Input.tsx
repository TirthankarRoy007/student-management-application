import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: string; // Material Symbol name
}

export default function Input({ label, icon, className = "", ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-[#111418] dark:text-gray-200 text-sm font-semibold leading-normal">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </span>
        )}
        <input 
          className={`form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#111418] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#dbe0e6] dark:border-gray-700 bg-white dark:bg-background-dark h-14 placeholder:text-[#617589] ${icon ? 'pl-12' : 'pl-4'} pr-4 text-base font-normal leading-normal ${className}`}
          {...props}
        />
      </div>
    </div>
  );
}
