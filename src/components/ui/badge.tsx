import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-lg px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider',
  {
    variants: {
      variant: {
        default: 'bg-erp-accent/10 text-erp-accentSecondary ring-1 ring-erp-accent/15',
        success: 'bg-erp-success/15 text-erp-success',
        warning: 'bg-erp-warning/15 text-erp-warning',
        danger: 'bg-erp-danger/15 text-erp-danger',
        muted: 'bg-erp-muted/10 text-erp-muted',
      },
    },
    defaultVariants: { variant: 'default' },
  },
);

export function Badge({
  className,
  variant,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
