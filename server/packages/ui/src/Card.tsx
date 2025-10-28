/**
 * Card component for content containers
 * @packageDocumentation
 */

import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "./utils/classnames";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
	children: ReactNode;
	variant?: "default" | "outlined" | "elevated";
	padding?: "none" | "sm" | "md" | "lg";
}

const cardVariants = {
	default: "bg-white shadow-sm",
	outlined: "bg-white border border-gray-200",
	elevated: "bg-white shadow-lg",
};

const cardPadding = {
	none: "",
	sm: "p-3",
	md: "p-4",
	lg: "p-6",
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
	(
		{ children, variant = "default", padding = "md", className, ...props },
		ref,
	) => {
		return (
			<div
				ref={ref}
				className={cn(
					"rounded-lg",
					cardVariants[variant],
					cardPadding[padding],
					className,
				)}
				{...props}
			>
				{children}
			</div>
		);
	},
);

Card.displayName = "Card";

export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
	children: ReactNode;
}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
	({ children, className, ...props }, ref) => {
		return (
			<div
				ref={ref}
				className={cn("border-b border-gray-200 pb-3 mb-3", className)}
				{...props}
			>
				{children}
			</div>
		);
	},
);

CardHeader.displayName = "CardHeader";

export interface CardBodyProps extends HTMLAttributes<HTMLDivElement> {
	children: ReactNode;
}

export const CardBody = forwardRef<HTMLDivElement, CardBodyProps>(
	({ children, className, ...props }, ref) => {
		return (
			<div ref={ref} className={cn("flex-1", className)} {...props}>
				{children}
			</div>
		);
	},
);

CardBody.displayName = "CardBody";

export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
	children: ReactNode;
}

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
	({ children, className, ...props }, ref) => {
		return (
			<div
				ref={ref}
				className={cn("border-t border-gray-200 pt-3 mt-3", className)}
				{...props}
			>
				{children}
			</div>
		);
	},
);

CardFooter.displayName = "CardFooter";
