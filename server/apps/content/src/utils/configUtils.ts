/**
 * Utility functions for tenant configuration
 * Helper functions for common configuration operations
 */

import type {
	ClientConfig,
	Course,
	DiveSite,
	TeamMember,
} from "../types/ClientConfig.js";

/**
 * Format a team member's experience display
 */
export function formatTeamMemberExperience(member: TeamMember): string {
	const parts: string[] = [];

	if (member.yearsExperience) {
		parts.push(`${member.yearsExperience} years experience`);
	}

	if (member.certifications && member.certifications.length > 0) {
		parts.push(`${member.certifications.length} certification(s)`);
	}

	return parts.join(" • ");
}

/**
 * Get courses by difficulty level
 */
export function getCoursesByLevel(
	courses: Course[],
	level: Course["level"],
): Course[] {
	return courses.filter((course) => course.level === level);
}

/**
 * Get dive sites by difficulty
 */
export function getDiveSitesByDifficulty(
	sites: DiveSite[],
	difficulty: DiveSite["difficulty"],
): DiveSite[] {
	return sites.filter((site) => site.difficulty === difficulty);
}

/**
 * Format business hours for display
 */
export function formatBusinessHours(
	businessHours: ClientConfig["contact"]["businessHours"],
): string {
	const days = [
		"monday",
		"tuesday",
		"wednesday",
		"thursday",
		"friday",
		"saturday",
		"sunday",
	];
	const openDays = days
		.filter((day) => businessHours[day] && !businessHours[day].closed)
		.map((day) => {
			const hours = businessHours[day];
			if (!hours) return "";
			const dayName = day.charAt(0).toUpperCase() + day.slice(1);
			return `${dayName}: ${hours.open} - ${hours.close}`;
		})
		.filter(Boolean);

	return openDays.join("\n");
}

/**
 * Generate structured data for SEO
 */
export function generateOrganizationSchema(config: ClientConfig): object {
	return {
		"@context": "https://schema.org",
		"@type": "Organization",
		name: config.company.name,
		description: config.company.description,
		url: config.seo.baseUrl,
		logo: config.branding.logo,
		contactPoint: {
			"@type": "ContactPoint",
			telephone: config.contact.phone,
			email: config.contact.email,
			contactType: "customer service",
		},
		address: {
			"@type": "PostalAddress",
			streetAddress: config.contact.address.street,
			addressLocality: config.contact.address.city,
			addressRegion: config.contact.address.state,
			postalCode: config.contact.address.postalCode,
			addressCountry: config.contact.address.country,
		},
		geo: {
			"@type": "GeoCoordinates",
			latitude: config.contact.address.coordinates.latitude,
			longitude: config.contact.address.coordinates.longitude,
		},
		sameAs: Object.keys(config.social)
		.map(key => config.social[key as keyof typeof config.social])
		.filter(Boolean),
	};
}

/**
 * Get the primary color CSS custom property
 */
export function getPrimaryColorCSSVar(config: ClientConfig): string {
	return `--primary-color: ${config.branding.colors.primary};`;
}

/**
 * Check if a feature is enabled
 */
export function isFeatureEnabled(
	config: ClientConfig,
	feature: keyof ClientConfig["features"],
): boolean {
	return config.features[feature] === true;
}

/**
 * Get supported currencies
 */
export function getSupportedCurrencies(config: ClientConfig): string[] {
	return config.pricing.currencies;
}

/**
 * Format price with currency
 */
export function formatPrice(
	amount: number,
	currency: string = "USD",
	locale: string = "en-US",
): string {
	return new Intl.NumberFormat(locale, {
		style: "currency",
		currency: currency.toUpperCase(),
	}).format(amount);
}

/**
 * Get contact methods available for the tenant
 */
export function getAvailableContactMethods(config: ClientConfig): Array<{
	type: string;
	value: string;
	label: string;
}> {
	const methods: Array<{ type: string; value: string; label: string }> = [];

	if (config.contact.phone) {
		methods.push({
			type: "phone",
			value: config.contact.phone,
			label: "Call Us",
		});
	}

	if (config.contact.whatsapp) {
		methods.push({
			type: "whatsapp",
			value: config.contact.whatsapp,
			label: "WhatsApp",
		});
	}

	if (config.contact.email) {
		methods.push({
			type: "email",
			value: config.contact.email,
			label: "Email Us",
		});
	}

	return methods;
}
