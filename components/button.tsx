"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";
import { Spinner } from "./icons";
import { classNames } from "@/lib";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isSubmitting?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, disabled, isSubmitting = false, ...props }, ref) => {
    /**
     * variables
     */
    disabled = (() => {
      if (isSubmitting) {
        return true;
      }
      return disabled;
    })();

    return (
      <button
        ref={ref}
        {...{ disabled, ...props }}
        className={classNames(
          "active:shadow-[inset_0_0_100px_100px_rgba(0,0,0,0.1)]",
          "flex gap-2 items-center justify-center",
          "text-sm font-medium whitespace-nowrap",
          "disabled:pointer-events-none",
          "outline-0 select-none",
          "rounded-md",
          "py-4 px-8",
          props.className
        )}
      >
        {isSubmitting && <Spinner />}
        {children}
      </button>
    );
  }
);
