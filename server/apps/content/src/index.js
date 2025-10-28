/**
 * @react-scuba/content
 * Multi-Tenant Content Management System
 *
 * Provides centralized content management for React Scuba platform
 * Supports multi-tenant architecture with subdomain/domain/env resolution
 */

// Type Exports
export * from "./types/ClientConfig.js";

// Validator Exports
export {
	ClientConfigSchema,
	validateClientConfig,
	safeValidateClientConfig,
} from "./validators/configValidator.js";

// Loader Exports
export {
	loadClientConfig,
	clearConfigCache,
	preloadConfigs,
} from "./loaders/configLoader.js";

// Resolver Exports
export {
	TenantResolver,
	createTenantResolver,
	resolveFromSubdomain,
	resolveFromDomain,
	resolveFromEnv,
	resolveFromPath,
	resolveTenantInBrowser,
} from "./resolvers/tenantResolver.js";

// Provider Exports (React Components)
export {
	TenantProvider,
	useTenantConfig,
	useConfigSelector,
	useCompanyInfo,
	useContactInfo,
	useTeamMembers,
	useBranding,
	useSocialLinks,
	useFeatures,
	useCourses,
	useDiveSites,
	useGallery,
	useTestimonials,
	useBlogPosts,
} from "./providers/TenantProvider.tsx";

// Utility Exports
export {
	formatTeamMemberExperience,
	getCoursesByLevel,
	getDiveSitesByDifficulty,
	formatBusinessHours,
	generateOrganizationSchema,
	getPrimaryColorCSSVar,
	isFeatureEnabled,
	getSupportedCurrencies,
	formatPrice,
	getAvailableContactMethods,
} from "./utils/configUtils.js";

// Convenience: Load and validate in one call
export async function getClientConfig(tenantSlug, options = {}) {
	const { loadClientConfig } = await import("./loaders/configLoader.js");
	return loadClientConfig(
		tenantSlug,
		options.configPath,
		options.useCache !== false,
	);
}

// Package metadata
export const version = "1.0.0";
export const name = "@react-scuba/content";
