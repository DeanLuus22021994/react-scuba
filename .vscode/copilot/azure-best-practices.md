# Azure Development Best Practices for React Scuba

## Azure Integration Overview

React Scuba can be deployed and enhanced using various Azure services. This guide provides best practices for integrating Azure services into the multi-tenant dive shop management platform.

## Azure Service Architecture

### Recommended Azure Services

#### Core Infrastructure

- **Azure Container Apps**: Host the React frontend and Express.js API
- **Azure Database for PostgreSQL**: Primary database for dive shop data
- **Azure Storage Account**: Store client images and dive logs
- **Azure CDN**: Global content delivery for multi-tenant assets

#### AI & Analytics

- **Azure OpenAI Service**: Power AI features for dive planning and recommendations
- **Azure Cognitive Search**: Enhanced search across dive sites and courses
- **Azure Application Insights**: Performance monitoring and analytics

#### Security & Identity

- **Azure AD B2C**: Multi-tenant authentication for dive shops and customers
- **Azure Key Vault**: Secure storage for API keys and certificates
- **Azure Private Link**: Secure database connections

### Multi-Tenant Architecture on Azure

#### Tenant Isolation Strategies

##### Database per Tenant (Recommended)

```typescript
// Client-specific database connections
const getDatabaseConnection = (clientId: string) => {
  return new Pool({
    host: `${clientId}-db.postgres.database.azure.com`,
    database: "diveshop",
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: { rejectUnauthorized: true },
  });
};
```

##### Schema-based Isolation (Alternative)

```sql
-- Schema per client approach
CREATE SCHEMA client_di_authority_johannesburg;
CREATE SCHEMA client_ocean_spirit_mauritius;

-- Client-specific tables
CREATE TABLE client_di_authority_johannesburg.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL,
  dive_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Azure Deployment Patterns

### Container Apps Configuration

#### Frontend Deployment (React App)

```yaml
# azure-container-apps-frontend.yml
apiVersion: v1
kind: ConfigMap
metadata:
  name: react-scuba-frontend-config
data:
  VITE_API_BASE_URL: "https://api-react-scuba.azurecontainerapps.io"
  VITE_CLIENT_RESOLVER_ENDPOINT: "/api/client-config"
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: react-scuba-frontend
spec:
  template:
    spec:
      containers:
        - name: frontend
          image: reactscuba.azurecr.io/frontend:latest
          ports:
            - containerPort: 80
          env:
            - name: VITE_AZURE_AD_CLIENT_ID
              valueFrom:
                secretKeyRef:
                  name: azure-ad-config
                  key: client-id
```

#### Backend API Deployment

```yaml
# azure-container-apps-api.yml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: react-scuba-api
spec:
  template:
    spec:
      containers:
        - name: api
          image: reactscuba.azurecr.io/api:latest
          ports:
            - containerPort: 3000
          env:
            - name: DATABASE_URL
              valueFrom:
                secretKeyRef:
                  name: database-config
                  key: connection-string
            - name: AZURE_STORAGE_ACCOUNT
              valueFrom:
                secretKeyRef:
                  name: storage-config
                  key: account-name
```

### Azure DevOps Pipeline

#### Build Pipeline (azure-pipelines.yml)

```yaml
trigger:
  - main
  - feature/*

pool:
  vmImage: "ubuntu-latest"

variables:
  CONTAINER_REGISTRY: "reactscuba.azurecr.io"

stages:
  - stage: Build
    jobs:
      - job: BuildAndTest
        steps:
          - task: NodeTool@0
            inputs:
              versionSpec: "20.x"

          - script: |
              cd server
              npm ci
              npm run build
              npm run test:coverage
            displayName: "Build and Test Monorepo"

          - task: Docker@2
            inputs:
              containerRegistry: $(CONTAINER_REGISTRY)
              repository: "frontend"
              command: "buildAndPush"
              Dockerfile: "server/apps/web/Dockerfile"
              tags: |
                $(Build.BuildId)
                latest

  - stage: Deploy
    dependsOn: Build
    jobs:
      - deployment: DeployToProduction
        environment: "production"
        strategy:
          runOnce:
            deploy:
              steps:
                - task: AzureContainerApps@1
                  inputs:
                    azureSubscription: "ReactScubaSubscription"
                    containerAppName: "react-scuba-frontend"
                    resourceGroup: "rg-react-scuba-prod"
                    imageToDeploy: "$(CONTAINER_REGISTRY)/frontend:$(Build.BuildId)"
```

## Azure Database Configuration

### PostgreSQL Flexible Server Setup

#### Multi-Tenant Database Configuration

```sql
-- Master database setup for multi-tenant architecture
CREATE DATABASE react_scuba_master;

-- Client-specific databases
CREATE DATABASE react_scuba_di_authority;
CREATE DATABASE react_scuba_ocean_spirit;

-- Shared configuration table in master database
CREATE TABLE client_configurations (
    client_id VARCHAR(50) PRIMARY KEY,
    database_name VARCHAR(100) NOT NULL,
    connection_string TEXT NOT NULL,
    azure_ad_tenant_id UUID,
    storage_container VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Insert client configurations
INSERT INTO client_configurations VALUES
('di-authority-johannesburg', 'react_scuba_di_authority',
 'postgresql://username:password@di-authority-db.postgres.database.azure.com/react_scuba_di_authority',
 '12345678-1234-5678-9012-123456789012',
 'di-authority-assets'),
('ocean-spirit-mauritius', 'react_scuba_ocean_spirit',
 'postgresql://username:password@ocean-spirit-db.postgres.database.azure.com/react_scuba_ocean_spirit',
 '87654321-4321-8765-2109-876543210987',
 'ocean-spirit-assets');
```

#### Connection Pooling with Azure

```typescript
// Azure PostgreSQL connection pool configuration
import { Pool } from "pg";
import { DefaultAzureCredential } from "@azure/identity";

class AzureDatabaseManager {
  private pools: Map<string, Pool> = new Map();
  private credential = new DefaultAzureCredential();

  async getClientPool(clientId: string): Promise<Pool> {
    if (!this.pools.has(clientId)) {
      const config = await this.getClientDatabaseConfig(clientId);

      const pool = new Pool({
        host: config.host,
        database: config.database,
        user: config.user,
        password: config.password,
        ssl: {
          rejectUnauthorized: true,
          ca: await this.getAzurePostgreSQLCA(),
        },
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
      });

      this.pools.set(clientId, pool);
    }

    return this.pools.get(clientId)!;
  }
}
```

## Azure Storage Integration

### Client Asset Management

```typescript
// Azure Blob Storage for client-specific assets
import { BlobServiceClient } from "@azure/storage-blob";
import { DefaultAzureCredential } from "@azure/identity";

class ClientAssetManager {
  private blobServiceClient: BlobServiceClient;

  constructor() {
    const credential = new DefaultAzureCredential();
    this.blobServiceClient = new BlobServiceClient(
      `https://${process.env.AZURE_STORAGE_ACCOUNT}.blob.core.windows.net`,
      credential
    );
  }

  async uploadClientImage(
    clientId: string,
    imageType: "logo" | "hero" | "gallery",
    file: Buffer,
    fileName: string
  ): Promise<string> {
    const containerName = `client-${clientId}-assets`;
    const blobName = `${imageType}/${fileName}`;

    const containerClient =
      this.blobServiceClient.getContainerClient(containerName);
    await containerClient.createIfNotExists({
      access: "blob",
    });

    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    await blockBlobClient.upload(file, file.length);

    return blockBlobClient.url;
  }

  async getClientAssetUrl(
    clientId: string,
    assetPath: string
  ): Promise<string> {
    const containerName = `client-${clientId}-assets`;
    const blobClient = this.blobServiceClient
      .getContainerClient(containerName)
      .getBlobClient(assetPath);

    return blobClient.url;
  }
}
```

## Azure AD B2C Integration

### Multi-Tenant Authentication Setup

#### B2C Configuration for Each Client

```typescript
// Azure AD B2C configuration per client
interface ClientB2CConfig {
  clientId: string;
  tenantId: string;
  policyName: string;
  redirectUri: string;
}

const clientConfigurations: Record<string, ClientB2CConfig> = {
  "di-authority-johannesburg": {
    clientId: process.env.DI_AUTHORITY_B2C_CLIENT_ID!,
    tenantId: "diauthority.onmicrosoft.com",
    policyName: "B2C_1_SignUpSignIn_DiAuthority",
    redirectUri: "https://di-authority.dive-platforms.com/auth/callback",
  },
  "ocean-spirit-mauritius": {
    clientId: process.env.OCEAN_SPIRIT_B2C_CLIENT_ID!,
    tenantId: "oceanspirit.onmicrosoft.com",
    policyName: "B2C_1_SignUpSignIn_OceanSpirit",
    redirectUri: "https://ocean-spirit.dive-platforms.com/auth/callback",
  },
};

// MSAL configuration factory
import { Configuration } from "@azure/msal-browser";

export function createMSALConfig(clientId: string): Configuration {
  const config = clientConfigurations[clientId];

  return {
    auth: {
      clientId: config.clientId,
      authority: `https://${config.tenantId}.b2clogin.com/${config.tenantId}/${config.policyName}`,
      redirectUri: config.redirectUri,
      knownAuthorities: [`${config.tenantId}.b2clogin.com`],
    },
    cache: {
      cacheLocation: "localStorage",
      storeAuthStateInCookie: false,
    },
  };
}
```

## Azure AI Services Integration

### OpenAI Service for Dive Recommendations

```typescript
// Azure OpenAI integration for intelligent dive recommendations
import { OpenAIApi, Configuration } from "azure-openai";

class DiveRecommendationService {
  private openai: OpenAIApi;

  constructor() {
    const configuration = new Configuration({
      apiKey: process.env.AZURE_OPENAI_API_KEY,
      basePath: `https://${process.env.AZURE_OPENAI_RESOURCE_NAME}.openai.azure.com/openai/deployments/${process.env.AZURE_OPENAI_DEPLOYMENT_NAME}`,
      apiVersion: "2024-02-15-preview",
    });

    this.openai = new OpenAIApi(configuration);
  }

  async generateDiveRecommendations(
    customerProfile: CustomerProfile,
    location: string,
    preferences: DivePreferences
  ): Promise<DiveRecommendation[]> {
    const prompt = `
      Generate dive site recommendations for a customer with the following profile:
      - Experience Level: ${customerProfile.experienceLevel}
      - Certification: ${customerProfile.certificationLevel}
      - Preferred Depth: ${preferences.maxDepth}m
      - Interests: ${preferences.interests.join(", ")}
      - Location: ${location}

      Provide 3-5 specific dive site recommendations with detailed descriptions.
    `;

    const response = await this.openai.createCompletion({
      model: "gpt-35-turbo",
      prompt,
      max_tokens: 500,
      temperature: 0.7,
    });

    return this.parseDiveRecommendations(response.data.choices[0].text);
  }
}
```

### Cognitive Search for Dive Sites

```typescript
// Azure Cognitive Search for dive site discovery
import { SearchClient, AzureKeyCredential } from "@azure/search-documents";

interface DiveSite {
  id: string;
  name: string;
  location: string;
  maxDepth: number;
  visibility: number;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  marineLife: string[];
  features: string[];
  clientId: string;
}

class DiveSiteSearchService {
  private searchClient: SearchClient<DiveSite>;

  constructor() {
    const endpoint = `https://${process.env.AZURE_SEARCH_SERVICE_NAME}.search.windows.net`;
    const credential = new AzureKeyCredential(
      process.env.AZURE_SEARCH_API_KEY!
    );

    this.searchClient = new SearchClient(
      endpoint,
      "dive-sites-index",
      credential
    );
  }

  async searchDiveSites(
    query: string,
    clientId: string,
    filters?: {
      maxDepth?: number;
      difficulty?: string;
      location?: string;
    }
  ): Promise<DiveSite[]> {
    let filter = `clientId eq '${clientId}'`;

    if (filters) {
      if (filters.maxDepth) {
        filter += ` and maxDepth le ${filters.maxDepth}`;
      }
      if (filters.difficulty) {
        filter += ` and difficulty eq '${filters.difficulty}'`;
      }
      if (filters.location) {
        filter += ` and search.ismatch('${filters.location}', 'location')`;
      }
    }

    const searchResults = await this.searchClient.search(query, {
      filter,
      top: 20,
      orderBy: ["search.score() desc"],
      select: [
        "id",
        "name",
        "location",
        "maxDepth",
        "visibility",
        "difficulty",
        "marineLife",
        "features",
      ],
    });

    const results: DiveSite[] = [];
    for await (const result of searchResults.results) {
      results.push(result.document);
    }

    return results;
  }
}
```

## Monitoring & Analytics

### Application Insights Configuration

```typescript
// Azure Application Insights integration
import { ApplicationInsights } from "@microsoft/applicationinsights-web";
import { ReactPlugin } from "@microsoft/applicationinsights-react-js";

class AzureMonitoringService {
  private appInsights: ApplicationInsights;
  private reactPlugin: ReactPlugin;

  constructor() {
    this.reactPlugin = new ReactPlugin();

    this.appInsights = new ApplicationInsights({
      config: {
        connectionString: process.env.APPLICATIONINSIGHTS_CONNECTION_STRING,
        extensions: [this.reactPlugin],
        extensionConfig: {
          [this.reactPlugin.identifier]: {
            history: window.history,
          },
        },
      },
    });

    this.appInsights.loadAppInsights();
  }

  trackClientEvent(
    clientId: string,
    eventName: string,
    properties?: Record<string, string>
  ) {
    this.appInsights.trackEvent({
      name: eventName,
      properties: {
        clientId,
        ...properties,
      },
    });
  }

  trackDiveBooking(clientId: string, bookingDetails: BookingDetails) {
    this.appInsights.trackEvent({
      name: "DiveBookingCompleted",
      properties: {
        clientId,
        diveType: bookingDetails.diveType,
        numberOfDivers: bookingDetails.divers.length.toString(),
        totalAmount: bookingDetails.totalAmount.toString(),
      },
      measurements: {
        bookingValue: bookingDetails.totalAmount,
        diveDepth: bookingDetails.maxDepth,
      },
    });
  }
}
```

## Security Best Practices

### Key Vault Integration

```typescript
// Azure Key Vault for secure configuration management
import { SecretClient } from "@azure/keyvault-secrets";
import { DefaultAzureCredential } from "@azure/identity";

class SecureConfigurationManager {
  private secretClient: SecretClient;

  constructor() {
    const credential = new DefaultAzureCredential();
    const vaultUrl = `https://${process.env.AZURE_KEY_VAULT_NAME}.vault.azure.net`;

    this.secretClient = new SecretClient(vaultUrl, credential);
  }

  async getClientDatabasePassword(clientId: string): Promise<string> {
    const secretName = `db-password-${clientId}`;
    const secret = await this.secretClient.getSecret(secretName);
    return secret.value!;
  }

  async getStorageAccountKey(): Promise<string> {
    const secret = await this.secretClient.getSecret("storage-account-key");
    return secret.value!;
  }

  async getOpenAIApiKey(): Promise<string> {
    const secret = await this.secretClient.getSecret("openai-api-key");
    return secret.value!;
  }
}
```

### Network Security

- **Private Endpoints**: Use Azure Private Link for database connections
- **WAF Protection**: Deploy Azure Web Application Firewall
- **DDoS Protection**: Enable Azure DDoS Protection Standard
- **SSL/TLS**: Implement end-to-end encryption with Azure-managed certificates

## Cost Optimization

### Resource Management Strategies

1. **Auto-scaling**: Configure Container Apps with appropriate scaling rules
2. **Reserved Instances**: Use reserved capacity for predictable workloads
3. **Storage Tiers**: Implement lifecycle policies for blob storage
4. **Database Optimization**: Use read replicas and connection pooling

### Multi-Tenant Cost Allocation

```typescript
// Cost tracking per client using Azure Cost Management APIs
class ClientCostTracker {
  async getClientResourceCosts(clientId: string, timeRange: string) {
    const resourceTags = {
      "client-id": clientId,
      environment: "production",
    };

    // Query Azure Cost Management API
    const costs = await this.queryCostManagementAPI({
      timeframe: timeRange,
      filters: {
        tags: resourceTags,
      },
    });

    return {
      compute: costs.containerApps,
      storage: costs.blobStorage,
      database: costs.postgresql,
      networking: costs.cdn + costs.bandwidth,
      ai: costs.openAI + costs.cognitiveSearch,
    };
  }
}
```

This comprehensive guide provides the foundation for deploying and managing React Scuba on Azure with proper multi-tenant architecture, security, and cost optimization strategies.
