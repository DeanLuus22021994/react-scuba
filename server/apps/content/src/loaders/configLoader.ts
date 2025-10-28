/**
 * Client Configuration Loader
 * Loads and caches client configurations from JSON files
 */

import { readFile } from "fs/promises";
import { join, resolve } from "path";
import { validateClientConfig } from "../validators/configValidator.js";

// Configuration cache
const configCache = new Map();

/**
 * Load client configuration from JSON file
 * @param tenantSlug - URL-safe tenant identifier
 * @param configPath - Base path to client configs directory
 * @param useCache - Whether to use cached configuration
 * @returns Validated ClientConfig
 */
export async function loadClientConfig(
	tenantSlug,
	configPath = "../../clients",
	useCache = true,
) {
	// Check cache first
	if (useCache && configCache.has(tenantSlug)) {
		return configCache.get(tenantSlug);
	}

	try {
		// Resolve config file path
		const configFilePath = resolve(join(configPath, tenantSlug, "config.json"));

		// Read configuration file
		const configData = await readFile(configFilePath, "utf-8");
		const rawConfig = JSON.parse(configData);

		// Validate configuration
		const validatedConfig = validateClientConfig(rawConfig);

		// Cache for future requests
		if (useCache) {
			configCache.set(tenantSlug, validatedConfig);
		}

		return validatedConfig;
	} catch (error) {
		if (error.code === "ENOENT") {
			throw new Error(`Configuration not found for tenant: ${tenantSlug}`);
		}
		if (error.name === "ZodError") {
			throw new Error(
				`Invalid configuration for tenant ${tenantSlug}: ${error.message}`,
			);
		}
		throw error;
	}
}

/**
 * Clear configuration cache for a tenant or all tenants
 * @param tenantSlug - Specific tenant to clear, or undefined for all
 */
export function clearConfigCache(tenantSlug) {
	if (tenantSlug) {
		configCache.delete(tenantSlug);
	} else {
		configCache.clear();
	}
}

/**
 * Preload multiple client configurations
 * @param tenantSlugs - Array of tenant slugs to preload
 * @param configPath - Base path to client configs
 */
export async function preloadConfigs(tenantSlugs, configPath) {
	const promises = tenantSlugs.map((slug) =>
		loadClientConfig(slug, configPath, true).catch((err) => ({
			slug,
			error: err.message,
		})),
	);

	const results = await Promise.all(promises);
	const errors = results.filter((r) => r && r.error);

	if (errors.length > 0) {
		console.warn("Some configurations failed to preload:", errors);
	}

	return results.filter((r) => !r.error);
}
