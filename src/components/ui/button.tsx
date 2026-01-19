import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  "inline-flex items-center transition-all justify-center duration-400 gap-2 whitespace-nowrap rounded-md text-sm  font-medium  disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/80 cursor-pointer hover:scale-98 ease-in-out rounded-2xl',

        white: 'bg-white text-primary hover:bg-white/80 cursor-pointer hover:scale-98 ease-in-out',
        destructive: 'bg-destructive/15       ease-in-out text-destructive  hover:bg-destructive/25 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',

        outline: 'border border-primary/50 hover:text-primary  cursor-pointer  hover:bg-primary/10   ease-in-out    shadow-sm  dark:bg-input/30 dark:border-input dark:hover:bg-input/50',

        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        primary: 'bg-blue-100  text-blue-600  ease-in-out   hover:bg-blue-200 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',

        navigation: 'w-full justify-start gap-3 h-auto transition-all  cursor-pointer text-gray-800 hover:bg-blue-50 hover:text-blue-600  hover:shadow-sm ',

        ghost: 'hover:bg-accent cursor-pointer  hover:text-accent-foreground dark:hover:bg-accent/50',

        link: 'text-primary  cursor-pointer    hover:underline',

        link_white: 'text-white  cursor-pointer    hover:underline',

        red: 'text-white bg-red-800 hover:bg-red-800  cursor-pointer  ease-in-out   hover:scale-98',
        black: 'text-white bg-gray-800 hover:bg-gray-600   cursor-pointer ',
      },
      size: {
        default: 'h-9 px-4 py-2 has-[>svg]:px-3',
        sm: 'h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5',
        lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
        icon: 'size-9',
        'icon-sm': 'size-8',
        'icon-lg': 'size-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : 'button';

  return <Comp data-slot="button" className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}

export { Button, buttonVariants };
