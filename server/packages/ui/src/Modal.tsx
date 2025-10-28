/**
 * Modal component for overlay dialogs
 * @packageDocumentation
 */

import { type ReactNode, type HTMLAttributes, useEffect } from "react";
import { cn } from "./utils/classnames";

export interface ModalProps {
	children: ReactNode;
	open: boolean;
	onClose?: () => void;
	size?: "sm" | "md" | "lg" | "xl";
	closeOnOverlay?: boolean;
	className?: string;
}

const modalSizes = {
	sm: "max-w-sm",
	md: "max-w-md",
	lg: "max-w-lg",
	xl: "max-w-xl",
};

export function Modal({
	children,
	open,
	onClose,
	size = "md",
	closeOnOverlay = true,
	className,
}: ModalProps) {
	// Lock body scroll when modal is open
	useEffect(() => {
		if (open) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "unset";
		}

		return () => {
			document.body.style.overflow = "unset";
		};
	}, [open]);

	// Close on Escape key
	useEffect(() => {
		const handleEscape = (event: KeyboardEvent) => {
			if (event.key === "Escape" && onClose) {
				onClose();
			}
		};

		if (open) {
			document.addEventListener("keydown", handleEscape);
		}

		return () => {
			document.removeEventListener("keydown", handleEscape);
		};
	}, [open, onClose]);

	if (!open) return null;

	const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
		if (closeOnOverlay && onClose && event.target === event.currentTarget) {
			onClose();
		}
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center">
			{/* Overlay */}
			<div
				className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
				onClick={handleOverlayClick}
				aria-hidden="true"
			/>

			{/* Modal */}
			<div
				className={cn(
					"relative z-10 w-full mx-4 bg-white rounded-lg shadow-xl",
					modalSizes[size],
					className,
				)}
				role="dialog"
				aria-modal="true"
			>
				{children}
			</div>
		</div>
	);
}

export interface ModalHeaderProps extends HTMLAttributes<HTMLDivElement> {
	children: ReactNode;
	onClose?: () => void;
	showCloseButton?: boolean;
}

export function ModalHeader({
	children,
	onClose,
	showCloseButton = true,
	className,
	...props
}: ModalHeaderProps) {
	return (
		<div
			className={cn(
				"flex items-center justify-between p-4 border-b border-gray-200",
				className,
			)}
			{...props}
		>
			<div className="text-lg font-semibold text-gray-900">{children}</div>
			{showCloseButton && onClose && (
				<button
					type="button"
					onClick={onClose}
					className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
					aria-label="Close modal"
				>
					<svg
						className="w-5 h-5"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				</button>
			)}
		</div>
	);
}

export interface ModalBodyProps extends HTMLAttributes<HTMLDivElement> {
	children: ReactNode;
}

export function ModalBody({ children, className, ...props }: ModalBodyProps) {
	return (
		<div className={cn("p-4", className)} {...props}>
			{children}
		</div>
	);
}

export interface ModalFooterProps extends HTMLAttributes<HTMLDivElement> {
	children: ReactNode;
}

export function ModalFooter({
	children,
	className,
	...props
}: ModalFooterProps) {
	return (
		<div
			className={cn(
				"flex items-center justify-end space-x-3 p-4 border-t border-gray-200",
				className,
			)}
			{...props}
		>
			{children}
		</div>
	);
}
