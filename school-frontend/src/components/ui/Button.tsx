import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  loadingText?: string;
  variant?: "primary" | "secondary" | "outline"; // We can expand this later
  fullWidth?: boolean;
}

export default function Button({ 
  children, 
  isLoading, 
  loadingText,
  variant = "primary", 
  fullWidth = false, 
  className = "", 
  disabled,
  ...props 
}: ButtonProps) {
  
  const baseStyles = "flex cursor-pointer items-center justify-center overflow-hidden rounded-xl h-14 text-base font-bold leading-normal tracking-[0.015em] transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-primary text-white hover:bg-primary/90 hover:shadow-lg",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
    outline: "border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300",
  };

  const widthClass = fullWidth ? "w-full" : "";

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${widthClass} ${className}`}
      disabled={isLoading || disabled}
      {...props}
    >
      <span className="truncate">{isLoading ? (loadingText || "Loading...") : children}</span>
    </button>
  );
}
