'use client';

import { useToastContext } from '@/components/ui/ToastProvider';

export const useToast = () => useToastContext().toast;
