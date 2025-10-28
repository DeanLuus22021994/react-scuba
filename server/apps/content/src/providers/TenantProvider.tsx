/**
 * React Context Provider for Tenant Configuration
 * Provides client configuration data throughout the React app
 */

import {
	createContext,
	type ReactNode,
	useContext,
	useEffect,
	useState,
} from "react";
import type { ClientConfig, TenantContext } from "../types/ClientConfig.js";

interface TenantProviderProps {
	children: ReactNode;
	tenantSlug?: string;
	initialConfig?: ClientConfig;
}

// Create the context
const TenantConfigContext = createContext<TenantContext | undefined>(undefined);

/**
 * Provider component that manages tenant configuration state
 */
export function TenantProvider({
	children,
	tenantSlug,
	initialConfig,
}: TenantProviderProps) {
	const [config, setConfig] = useState<ClientConfig | null>(
		initialConfig || null,
	);
	const [isLoading, setIsLoading] = useState(!initialConfig);
	const [error, setError] = useState<Error | null>(null);

	const reload = async () => {
		if (!tenantSlug) {
			setError(new Error("No tenant slug provided"));
			setIsLoading(false);
			return;
		}

		try {
			setIsLoading(true);
			setError(null);

			// Dynamic import to avoid bundling server code in client
			const { getClientConfig } = await import("../index");
			const clientConfig = await getClientConfig(tenantSlug);

			setConfig(clientConfig);
		} catch (err) {
			setError(
				err instanceof Error ? err : new Error("Failed to load configuration"),
			);
		} finally {
			setIsLoading(false);
		}
	};

	// Load configuration on mount or tenant change
	useEffect(() => {
		if (tenantSlug && !initialConfig) {
			reload();
		}
	}, [tenantSlug, initialConfig]);

	const contextValue: TenantContext = {
		config: config as ClientConfig,
		isLoading,
		error,
		reload,
	};

	return (
		<TenantConfigContext.Provider value={contextValue}>
			{children}
		</TenantConfigContext.Provider>
	);
}

/**
 * Hook to access tenant configuration
 * @returns TenantContext with config, loading state, and reload function
 */
export function useTenantConfig(): TenantContext {
	const context = useContext(TenantConfigContext);

	if (context === undefined) {
		throw new Error("useTenantConfig must be used within a TenantProvider");
	}

	return context;
}

/**
 * Hook to access specific parts of the configuration
 * @param selector - Function to select specific data from config
 * @returns Selected data or undefined if loading/error
 */
export function useConfigSelector<T>(
	selector: (config: ClientConfig) => T,
): T | undefined {
	const { config, isLoading, error } = useTenantConfig();

	if (isLoading || error || !config) {
		return undefined;
	}

	return selector(config);
}

// Convenience hooks for common configuration sections
export const useCompanyInfo = () =>
	useConfigSelector((config) => config.company);

export const useContactInfo = () =>
	useConfigSelector((config) => config.contact);

export const useTeamMembers = () => useConfigSelector((config) => config.team);

export const useBranding = () => useConfigSelector((config) => config.branding);

export const useSocialLinks = () =>
	useConfigSelector((config) => config.social);

export const useFeatures = () => useConfigSelector((config) => config.features);

export const useCourses = () =>
	useConfigSelector((config) => config.courses || []);

export const useDiveSites = () =>
	useConfigSelector((config) => config.diveSites || []);

export const useGallery = () => useConfigSelector((config) => config.gallery);

export const useTestimonials = () =>
	useConfigSelector((config) => config.testimonials || []);

export const useBlogPosts = () =>
	useConfigSelector((config) => config.blog || []);
