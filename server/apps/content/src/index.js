/**
 * @react-scuba/content
 * Multi-Tenant Content Management System
 *
 * Provides centralized content management for React Scuba platform
 * Supports multi-tenant architecture with subdomain/domain/env resolution
 */

// Loader Exports
export {
	clearConfigCache,
	loadClientConfig,
	preloadConfigs,
} from "./loaders/configLoader.js";
// Provider Exports (React Components)
export {
	TenantProvider,
	useBlogPosts,
	useBranding,
	useCompanyInfo,
	useConfigSelector,
	useContactInfo,
	useCourses,
	useDiveSites,
	useFeatures,
	useGallery,
	useSocialLinks,
	useTeamMembers,
	useTenantConfig,
	useTestimonials,
} from "./providers/TenantProvider.tsx";
// Resolver Exports
export {
	createTenantResolver,
	resolveFromDomain,
	resolveFromEnv,
	resolveFromPath,
	resolveFromSubdomain,
	resolveTenantInBrowser,
	TenantResolver,
} from "./resolvers/tenantResolver.js";
// Type Exports
export * from "./types/ClientConfig.js";
// Utility Exports
export {
	formatBusinessHours,
	formatPrice,
	formatTeamMemberExperience,
	generateOrganizationSchema,
	getAvailableContactMethods,
	getCoursesByLevel,
	getDiveSitesByDifficulty,
	getPrimaryColorCSSVar,
	getSupportedCurrencies,
	isFeatureEnabled,
} from "./utils/configUtils.js";
// Validator Exports
export {
	ClientConfigSchema,
	safeValidateClientConfig,
	validateClientConfig,
} from "./validators/configValidator.js";

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
