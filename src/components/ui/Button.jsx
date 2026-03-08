import { twMerge } from 'tailwind-merge';

export const Button = ({ children, variant = 'primary', className, ...props }) => {
  const baseStyles = "px-6 py-3 rounded-md font-semibold transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gold-500 hover:bg-gold-600 text-navy-900 shadow-lg shadow-gold-500/20",
    secondary: "bg-navy-700 hover:bg-navy-600 text-white border border-navy-600",
    outline: "bg-transparent border-2 border-gold-500 text-gold-500 hover:bg-gold-500 hover:text-navy-900",
    danger: "bg-red-600 hover:bg-red-700 text-white"
  };

  return (
    <button 
      className={twMerge(baseStyles, variants[variant], className)} 
      {...props}
    >
      {children}
    </button>
  );
};
