import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';

const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>((props, ref) => {
  return (
    <input
      {...props}
      ref={ref}
      className="w-full rounded-2xl border px-4 py-3 text-sm shadow-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20 theme-input"
    />
  );
});

Input.displayName = 'Input';

export default Input;
