/**
 * API request and response types
 */

export interface ApiResponse<T = unknown> {
	success: boolean;
	data?: T;
	error?: string;
	message?: string;
}

export interface BookingRequest {
	name: string;
	email: string;
	phone: string;
	date?: string;
	participants?: number;
	message?: string;
	courseId?: string;
	diveSiteId?: string;
	type: "course" | "dive" | "contact";
}

export interface BookingResponse {
	id: string;
	confirmationNumber: string;
	status: "pending" | "confirmed" | "cancelled";
	createdAt: string;
}

export interface ContactRequest {
	name: string;
	email: string;
	phone: string;
	subject: string;
	message: string;
}

export interface ExchangeRateApiResponse {
	base: string;
	rates: {
		USD: number;
		EUR: number;
		GBP: number;
		AUD: number;
	};
	timestamp: number;
}
