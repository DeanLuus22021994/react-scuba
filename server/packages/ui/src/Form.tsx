/**
 * Form components with validation support
 * @packageDocumentation
 */

import {
	type ReactNode,
	type HTMLAttributes,
	type InputHTMLAttributes,
	type TextareaHTMLAttributes,
	type SelectHTMLAttributes,
	forwardRef,
} from "react";
import { cn } from "./utils/classnames";

export interface FormFieldProps extends HTMLAttributes<HTMLDivElement> {
	children: ReactNode;
	error?: string;
}

export function FormField({
	children,
	error,
	className,
	...props
}: FormFieldProps) {
	return (
		<div className={cn("mb-4", className)} {...props}>
			{children}
			{error && (
				<p className="mt-1 text-sm text-red-600" role="alert">
					{error}
				</p>
			)}
		</div>
	);
}

export interface FormLabelProps extends HTMLAttributes<HTMLLabelElement> {
	children: ReactNode;
	required?: boolean;
}

export const FormLabel = forwardRef<HTMLLabelElement, FormLabelProps>(
	({ children, required, className, ...props }, ref) => {
		return (
			<label
				ref={ref}
				className={cn(
					"block text-sm font-medium text-gray-700 mb-1",
					className,
				)}
				{...props}
			>
				{children}
				{required && <span className="text-red-500 ml-1">*</span>}
			</label>
		);
	},
);

FormLabel.displayName = "FormLabel";

export interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
	error?: boolean;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
	({ error, className, ...props }, ref) => {
		return (
			<input
				ref={ref}
				className={cn(
					"w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm",
					"focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
					"disabled:bg-gray-100 disabled:cursor-not-allowed",
					error && "border-red-500 focus:ring-red-500 focus:border-red-500",
					className,
				)}
				{...props}
			/>
		);
	},
);

FormInput.displayName = "FormInput";

export interface FormTextareaProps
	extends TextareaHTMLAttributes<HTMLTextAreaElement> {
	error?: boolean;
}

export const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
	({ error, className, ...props }, ref) => {
		return (
			<textarea
				ref={ref}
				className={cn(
					"w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm",
					"focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
					"disabled:bg-gray-100 disabled:cursor-not-allowed",
					"resize-vertical min-h-[80px]",
					error && "border-red-500 focus:ring-red-500 focus:border-red-500",
					className,
				)}
				{...props}
			/>
		);
	},
);

FormTextarea.displayName = "FormTextarea";

export interface FormSelectProps
	extends SelectHTMLAttributes<HTMLSelectElement> {
	error?: boolean;
	children: ReactNode;
}

export const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(
	({ error, className, children, ...props }, ref) => {
		return (
			<select
				ref={ref}
				className={cn(
					"w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm",
					"focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
					"disabled:bg-gray-100 disabled:cursor-not-allowed",
					"bg-white",
					error && "border-red-500 focus:ring-red-500 focus:border-red-500",
					className,
				)}
				{...props}
			>
				{children}
			</select>
		);
	},
);

FormSelect.displayName = "FormSelect";

export interface FormCheckboxProps
	extends InputHTMLAttributes<HTMLInputElement> {
	label: string;
	error?: boolean;
}

export const FormCheckbox = forwardRef<HTMLInputElement, FormCheckboxProps>(
	({ label, error, className, ...props }, ref) => {
		return (
			<div className="flex items-center">
				<input
					ref={ref}
					type="checkbox"
					className={cn(
						"h-4 w-4 text-blue-600 border-gray-300 rounded",
						"focus:ring-2 focus:ring-blue-500",
						error && "border-red-500",
						className,
					)}
					{...props}
				/>
				<label className="ml-2 text-sm text-gray-700">{label}</label>
			</div>
		);
	},
);

FormCheckbox.displayName = "FormCheckbox";

export interface FormRadioProps extends InputHTMLAttributes<HTMLInputElement> {
	label: string;
	error?: boolean;
}

export const FormRadio = forwardRef<HTMLInputElement, FormRadioProps>(
	({ label, error, className, ...props }, ref) => {
		return (
			<div className="flex items-center">
				<input
					ref={ref}
					type="radio"
					className={cn(
						"h-4 w-4 text-blue-600 border-gray-300",
						"focus:ring-2 focus:ring-blue-500",
						error && "border-red-500",
						className,
					)}
					{...props}
				/>
				<label className="ml-2 text-sm text-gray-700">{label}</label>
			</div>
		);
	},
);

FormRadio.displayName = "FormRadio";

export interface FormErrorProps {
	message: string;
}

export function FormError({ message }: FormErrorProps) {
	return (
		<p className="mt-1 text-sm text-red-600" role="alert">
			{message}
		</p>
	);
}

export interface FormHelpProps {
	message: string;
}

export function FormHelp({ message }: FormHelpProps) {
	return <p className="mt-1 text-sm text-gray-600">{message}</p>;
}
