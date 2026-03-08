import { twMerge } from 'tailwind-merge';

export const Input = ({ label, error, className, ...props }) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && <label className="text-sm font-medium text-slate-300">{label}</label>}
      <input 
        className={twMerge(
          "bg-navy-800 border border-navy-600 text-white px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all placeholder:text-slate-500",
          error && "border-red-500 focus:ring-red-500",
          className
        )}
        {...props}
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
};
