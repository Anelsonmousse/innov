"use client";
import { ButtonHTMLAttributes, ReactNode, forwardRef } from "react";
import { motion, MotionProps } from "framer-motion";
import { twMerge } from "tailwind-merge";

const variants = {
  solid: "bg-main text-white",
  outline: "bg-transparent border text-black border-gray-light",
  plain: "bg-transparent border-none",
};

const Button = ({ children, className, color, variant, ...props }, ref) => {
  return (
    <motion.button
      className={twMerge(
        "px-8 py-3 rounded-lg outline-none",
        !variant || !variants[variant] ? variants["solid"] : variants[variant],
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default Button;
