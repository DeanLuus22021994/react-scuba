/**
 * Button component with multiple variants
 * @packageDocumentation
 */

import { type ButtonHTMLAttributes, forwardRef, type ReactNode } from "react";
import { cn } from "./utils/classnames";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: "primary" | "secondary" | "ghost" | "outline" | "danger";
	size?: "sm" | "md" | "lg";
	loading?: boolean;
	leftIcon?: ReactNode;
	rightIcon?: ReactNode;
	children: ReactNode;
}

const buttonVariants = {
	primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
	secondary: "bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500",
	ghost: "bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500",
	outline:
		"border-2 border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500",
	danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
};

const buttonSizes = {
	sm: "px-3 py-1.5 text-sm",
	md: "px-4 py-2 text-base",
	lg: "px-6 py-3 text-lg",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{
			variant = "primary",
			size = "md",
			loading = false,
			leftIcon,
			rightIcon,
			children,
			className,
			disabled,
			...props
		},
		ref,
	) => {
		const baseClasses = [
			"inline-flex items-center justify-center gap-2 rounded-lg font-medium",
			"transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2",
			"disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",
		];

		const variantClasses = buttonVariants[variant];
		const sizeClasses = buttonSizes[size];

		return (
			<button
				ref={ref}
				className={cn(baseClasses, variantClasses, sizeClasses, className)}
				disabled={disabled || loading}
				{...props}
			>
				{loading ? (
					<svg
						className="animate-spin h-4 w-4"
						fill="none"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
						role="img"
						aria-label="Loading"
					>
						<circle
							className="opacity-25"
							cx="12"
							cy="12"
							r="10"
							stroke="currentColor"
							strokeWidth="4"
						/>
						<path
							className="opacity-75"
							d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
							fill="currentColor"
						/>
					</svg>
				) : (
					leftIcon
				)}
				{children}
				{!loading && rightIcon}
			</button>
		);
	},
);

Button.displayName = "Button";
