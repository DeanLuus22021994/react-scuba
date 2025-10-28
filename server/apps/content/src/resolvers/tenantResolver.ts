/**
 * Tenant Resolution System
 * Determines tenant slug from request context (subdomain, domain, env, path)
 */

type TenantResolutionStrategy = "subdomain" | "domain" | "env" | "path";

interface TenantResolverOptions {
	strategy?: TenantResolutionStrategy;
	fallbackSlug?: string | null;
	baseDomain?: string | null;
	domainMap?: Record<string, string>;
	pathPrefix?: string;
	envVarName?: string;
}

interface TenantContext {
	hostname?: string;
	pathname?: string;
}

/**
 * Resolve tenant from subdomain
 * Example: ocean-spirit.scuba-platform.com -> ocean-spirit
 */
export function resolveFromSubdomain(
	hostname: string,
	baseDomain: string,
): string | null {
	if (!hostname || !baseDomain) return null;

	const parts = hostname.split(".");
	const baseParts = baseDomain.split(".");

	// If hostname has more parts than base domain, first part is subdomain
	if (parts.length > baseParts.length) {
		return parts[0] || null;
	}

	return null;
}

/**
 * Resolve tenant from custom domain mapping
 * Example: osdiving.com -> ocean-spirit-mauritius
 */
export function resolveFromDomain(
	hostname: string,
	domainMap: Record<string, string>,
): string | null {
	return domainMap[hostname] || null;
}

/**
 * Resolve tenant from environment variable
 */
export function resolveFromEnv(envVarName = "TENANT_SLUG"): string | null {
	return process.env[envVarName] || null;
}

/**
 * Resolve tenant from URL path
 * Example: /clients/ocean-spirit/... -> ocean-spirit
 */
export function resolveFromPath(
	pathname: string,
	pathPrefix = "/clients/",
): string | null {
	if (!pathname.startsWith(pathPrefix)) return null;

	const parts = pathname.slice(pathPrefix.length).split("/");
	return parts[0] || null;
}

/**
 * Main tenant resolver with fallback strategies
 */
export class TenantResolver {
	strategy: TenantResolutionStrategy;
	fallbackSlug: string | null;
	baseDomain: string | null;
	domainMap: Record<string, string>;
	pathPrefix: string;
	envVarName: string;

	constructor(options: TenantResolverOptions = {}) {
		this.strategy = options.strategy || "env";
		this.fallbackSlug = options.fallbackSlug || null;
		this.baseDomain = options.baseDomain || null;
		this.domainMap = options.domainMap || {};
		this.pathPrefix = options.pathPrefix || "/clients/";
		this.envVarName = options.envVarName || "TENANT_SLUG";
	}

	/**
	 * Resolve tenant slug from request context
	 * @param context - Object with hostname, pathname, env
	 * @returns Tenant slug or null
	 */
	resolve(context: TenantContext = {}): string | null {
		let tenantSlug: string | null = null;

		switch (this.strategy) {
			case "subdomain":
				tenantSlug =
					context.hostname && this.baseDomain
						? resolveFromSubdomain(context.hostname, this.baseDomain)
						: null;
				break;

			case "domain":
				tenantSlug = context.hostname
					? resolveFromDomain(context.hostname, this.domainMap)
					: null;
				break;

			case "env":
				tenantSlug = resolveFromEnv(this.envVarName);
				break;

			case "path":
				tenantSlug = context.pathname
					? resolveFromPath(context.pathname, this.pathPrefix)
					: null;
				break;

			default:
				console.warn(`Unknown resolution strategy: ${this.strategy}`);
		}

		// Fallback to default if resolution failed
		return tenantSlug || this.fallbackSlug;
	}

	/**
	 * Resolve with multiple fallback strategies
	 * Tries strategies in order until one succeeds
	 */
	resolveWithFallbacks(
		context: TenantContext,
		strategies: TenantResolutionStrategy[] = [],
	): string | null {
		for (const strategy of strategies) {
			this.strategy = strategy;
			const slug = this.resolve(context);
			if (slug) return slug;
		}

		return this.fallbackSlug;
	}
}

/**
 * Create tenant resolver with default configuration
 */
export function createTenantResolver(
	options: TenantResolverOptions,
): TenantResolver {
	return new TenantResolver(options);
}

/**
 * Browser-compatible tenant resolution
 * Resolves from window.location
 */
export function resolveTenantInBrowser(
	options: TenantResolverOptions = {},
): string | null {
	if (typeof window === "undefined") {
		throw new Error("Browser resolution requires window object");
	}

	const resolver = new TenantResolver(options);
	const context: TenantContext = {
		hostname: window.location.hostname,
		pathname: window.location.pathname,
	};

	return resolver.resolve(context);
}
