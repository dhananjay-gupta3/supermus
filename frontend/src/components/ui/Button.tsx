import { motion, type HTMLMotionProps } from 'framer-motion';

interface ButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'primary' | 'secondary';
}

const styleMap = {
  primary:
    'bg-sky-500 text-slate-950 hover:bg-sky-400 focus:ring-sky-400',
  secondary:
    'bg-slate-100 text-slate-950 hover:bg-slate-200 focus:ring-slate-300 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600 dark:focus:ring-slate-500'
};

export default function Button({
  children,
  variant = 'primary',
  ...props
}: ButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      whileHover={{ scale: 1.01 }}
      className={`inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold transition focus:outline-none focus:ring-4 ${styleMap[variant]}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}
