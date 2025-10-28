/**
 * Zod Schema Validator for ClientConfig
 * Ensures all client configurations meet the required schema
 */

import { z } from "zod";

// Team Member Schema
const TeamMemberSchema = z.object({
	id: z.string(),
	name: z.string().min(1),
	role: z.string().min(1),
	bio: z.string(),
	certifications: z.array(z.string()).optional(),
	image: z.string(),
	languages: z.array(z.string()).optional(),
	specialties: z.array(z.string()).optional(),
	yearsExperience: z.number().optional(),
	education: z.array(z.string()).optional(),
	linkedin: z.string().url().optional(),
});

// Course Schema
const CourseSchema = z.object({
	id: z.string(),
	name: z.string().min(1),
	level: z.enum(["beginner", "intermediate", "advanced", "professional"]),
	price: z.number().positive(),
	currency: z.string().length(3),
	duration: z.string(),
	maxStudents: z.number().optional(),
	minAge: z.number().optional(),
	prerequisites: z.array(z.string()).optional(),
	description: z.string(),
	curriculum: z.array(z.string()).optional(),
	included: z.array(z.string()).optional(),
	certificationBody: z.string().optional(),
	image: z.string().optional(),
});

// Dive Site Schema
const DiveSiteSchema = z.object({
	id: z.string(),
	name: z.string().min(1),
	description: z.string(),
	difficulty: z.enum(["beginner", "intermediate", "advanced"]),
	depth: z.object({
		min: z.number(),
		max: z.number(),
		unit: z.enum(["meters", "feet"]),
	}),
	coordinates: z.object({
		latitude: z.number().min(-90).max(90),
		longitude: z.number().min(-180).max(180),
	}),
	marineLife: z.array(z.string()),
	features: z.array(z.string()).optional(),
	bestSeason: z.string().optional(),
	visibility: z.string().optional(),
	current: z.string().optional(),
	temperature: z.string().optional(),
	image: z.string().optional(),
});

// Gallery Image Schema
const GalleryImageSchema = z.object({
	id: z.string(),
	src: z.string().url(),
	thumbnail: z.string().url().optional(),
	alt: z.string(),
	title: z.string().optional(),
	category: z.string(),
	photographer: z.string().optional(),
	date: z.string().optional(),
});

// Testimonial Schema
const TestimonialSchema = z.object({
	id: z.string(),
	name: z.string().min(1),
	role: z.string().optional(),
	content: z.string().min(10),
	rating: z.number().min(1).max(5).optional(),
	date: z.string().optional(),
	avatar: z.string().optional(),
	location: z.string().optional(),
});

// Blog Post Schema
const BlogPostSchema = z.object({
	id: z.string(),
	title: z.string().min(1),
	slug: z.string().min(1),
	excerpt: z.string(),
	content: z.string().optional(),
	author: z.string(),
	date: z.string(),
	category: z.string(),
	tags: z.array(z.string()).optional(),
	image: z.string().optional(),
	url: z.string().url().optional(),
});

// Service Schema (for professional services companies)
const ServiceSchema = z.object({
	id: z.string(),
	name: z.string().min(1),
	description: z.string(),
	icon: z.string().optional(),
	features: z.array(z.string()).optional(),
	benefits: z.array(z.string()).optional(),
	pricing: z
		.object({
			model: z.enum(["fixed", "hourly", "subscription", "custom"]),
			amount: z.number().optional(),
			currency: z.string().length(3).optional(),
			period: z.string().optional(),
		})
		.optional(),
	deliverables: z.array(z.string()).optional(),
	timeline: z.string().optional(),
	image: z.string().optional(),
});

// Product Schema
const ProductSchema = z.object({
	id: z.string(),
	name: z.string().min(1),
	description: z.string(),
	category: z.string(),
	features: z.array(z.string()).optional(),
	pricing: z
		.object({
			amount: z.number(),
			currency: z.string().length(3),
			period: z.string().optional(),
		})
		.optional(),
	documentation: z.string().url().optional(),
	demo: z.string().url().optional(),
	image: z.string().optional(),
});

// Case Study Schema
const CaseStudySchema = z.object({
	id: z.string(),
	title: z.string().min(1),
	client: z.string(),
	industry: z.string(),
	challenge: z.string(),
	solution: z.string(),
	results: z.array(z.string()).optional(),
	technologies: z.array(z.string()).optional(),
	duration: z.string().optional(),
	teamSize: z.number().optional(),
	image: z.string().optional(),
	url: z.string().url().optional(),
});

// Main Client Config Schema
export const ClientConfigSchema = z.object({
	tenant: z.object({
		id: z.string().uuid(),
		slug: z.string().regex(/^[a-z0-9-]+$/),
		name: z.string().min(1),
		status: z.enum(["active", "inactive", "suspended"]),
		createdAt: z.string().datetime(),
		updatedAt: z.string().datetime(),
	}),
	company: z.object({
		name: z.string().min(1),
		tagline: z.string(),
		description: z.string(),
		about: z.string(),
		coreValues: z.array(z.string()).optional(),
		certifications: z.array(z.string()).optional(),
		established: z.number().optional(),
	}),
	contact: z.object({
		phone: z.string(),
		whatsapp: z.string(),
		email: z.string().email(),
		address: z.object({
			street: z.string(),
			city: z.string(),
			state: z.string().optional(),
			postalCode: z.string(),
			country: z.string(),
			coordinates: z.object({
				latitude: z.number().min(-90).max(90),
				longitude: z.number().min(-180).max(180),
			}),
		}),
		businessHours: z.record(
			z.string(),
			z.object({
				open: z.string(),
				close: z.string(),
				closed: z.boolean().optional(),
			}),
		),
	}),
	team: z.array(TeamMemberSchema),
	services: z.array(ServiceSchema).optional(),
	products: z.array(ProductSchema).optional(),
	courses: z.array(CourseSchema).optional(),
	diveSites: z.array(DiveSiteSchema).optional(),
	caseStudies: z.array(CaseStudySchema).optional(),
	gallery: z.array(GalleryImageSchema),
	testimonials: z.array(TestimonialSchema).optional(),
	blog: z.array(BlogPostSchema).optional(),
	branding: z.object({
		logo: z.string(),
		favicon: z.string(),
		heroImage: z.string(),
		bannerImage: z.string().optional(),
		colors: z.object({
			primary: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
			secondary: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
			accent: z
				.string()
				.regex(/^#[0-9A-Fa-f]{6}$/)
				.optional(),
		}),
	}),
	social: z.object({
		facebook: z.string().url().optional(),
		instagram: z.string().url().optional(),
		twitter: z.string().url().optional(),
		youtube: z.string().url().optional(),
		tripAdvisor: z.string().url().optional(),
		google: z.string().url().optional(),
		linkedin: z.string().url().optional(),
	}),
	seo: z.object({
		title: z.string().min(1),
		description: z.string().min(10).max(160),
		keywords: z.array(z.string()),
		author: z.string().optional(),
		baseUrl: z.string().url(),
		ogImage: z.string().optional(),
	}),
	analytics: z
		.object({
			googleAnalyticsId: z.string().optional(),
			googleTagManagerId: z.string().optional(),
			facebookPixelId: z.string().optional(),
		})
		.optional(),
	features: z.object({
		booking: z.boolean(),
		gallery: z.boolean(),
		blog: z.boolean(),
		testimonials: z.boolean(),
		multiCurrency: z.boolean(),
		whatsappWidget: z.boolean(),
		liveChat: z.boolean().optional(),
	}),
	pricing: z.object({
		defaultCurrency: z.string().length(3),
		currencies: z.array(z.string().length(3)),
	}),
	config: z.record(z.string(), z.any()).optional(),
});

/**
 * Validate a client configuration object
 * @param config - Raw configuration object
 * @returns Validated ClientConfig or throws ZodError
 */
export function validateClientConfig(config: unknown) {
	return ClientConfigSchema.parse(config);
}

/**
 * Safely validate configuration with detailed error messages
 * @param config - Raw configuration object
 * @returns Result object with success status and data/errors
 */
export function safeValidateClientConfig(config: unknown) {
	const result = ClientConfigSchema.safeParse(config);

	if (!result.success) {
		return {
			success: false,
			errors: result.error.issues.map((err: any) => ({
				path: err.path.join("."),
				message: err.message,
				code: err.code,
			})),
		};
	}

	return {
		success: true,
		data: result.data,
	};
}
