# AI Toolkit Best Practices for React Scuba

## Agent Development Guidelines

### Project Context

React Scuba is a multi-tenant dive shop management platform that benefits from AI-powered development tools. This document provides best practices for using AI Toolkit within this monorepo environment.

## Agent Framework Integration

### Recommended Agent Types

1. **Code Generation Agents**: For creating React components, API routes, and database models
2. **Testing Agents**: For generating unit tests and E2E test scenarios
3. **Documentation Agents**: For updating project documentation and code comments
4. **Refactoring Agents**: For modernizing code and applying best practices

### Agent Configuration Patterns

#### TypeScript/React Agents

```typescript
import { Agent } from "@ai-toolkit/agent-framework";

const reactComponentAgent = new Agent({
  name: "ReactScubaComponentGenerator",
  description: "Generate React components following React Scuba patterns",
  capabilities: [
    "typescript",
    "react-19",
    "tailwind-css",
    "multi-tenant-aware",
  ],
  context: {
    projectType: "turbo-monorepo",
    frontend: "react-vite",
    styling: "tailwind-v4",
    stateManagement: "zustand",
  },
});
```

#### Multi-Tenant Content Agents

```typescript
const contentAgent = new Agent({
  name: "MultiTenantContentProvider",
  description: "Generate client-specific content and configurations",
  capabilities: [
    "multi-tenant-config",
    "theme-generation",
    "content-localization",
  ],
  context: {
    clientConfigPath: "server/clients/",
    templatePath: "server/clients/_template/",
    contentProvider: "@react-scuba/content",
  },
});
```

## Model Selection Guidelines

### Recommended Models by Task

#### Code Generation Tasks

- **Primary**: GitHub Copilot with GPT-4 Turbo
- **Alternative**: Claude Sonnet for complex refactoring
- **Specialized**: Codestral for TypeScript-heavy tasks

#### Architecture & Planning Tasks

- **Primary**: Claude Sonnet (excellent for system design)
- **Secondary**: GPT-4 for detailed implementation planning

#### Documentation & Communication

- **Primary**: GPT-4 (natural language excellence)
- **Technical Docs**: GitHub Copilot (code-aware documentation)

### Model Configuration

```json
{
  "preferredModels": {
    "codeGeneration": "github-copilot",
    "architecture": "claude-sonnet-3.5",
    "documentation": "gpt-4",
    "testing": "github-copilot"
  },
  "fallbackStrategy": "round-robin",
  "contextWindow": {
    "small": 4096,
    "medium": 16384,
    "large": 128000
  }
}
```

## Evaluation Best Practices

### Test Dataset Creation

Create evaluation datasets that reflect real React Scuba scenarios:

```python
# Example evaluation dataset
test_cases = [
    {
        "input": "Create a dive booking component for client di-authority-johannesburg",
        "expected_features": [
            "client-specific theming",
            "TypeScript props",
            "form validation with Zod",
            "accessibility compliance"
        ]
    },
    {
        "input": "Generate API route for dive certification tracking",
        "expected_patterns": [
            "Express.js 5 syntax",
            "PostgreSQL integration",
            "multi-tenant data isolation",
            "proper error handling"
        ]
    }
]
```

### Evaluation Metrics

1. **Code Quality**: Biome linting compliance, TypeScript strictness
2. **Architecture Compliance**: Follows Turbo monorepo patterns
3. **Multi-Tenant Awareness**: Properly handles client isolation
4. **Performance**: Bundle size impact, runtime performance
5. **Testing Coverage**: Generated tests achieve 80%+ coverage

### Automated Evaluation Pipeline

```bash
# Run evaluation pipeline
npm run ai-toolkit:evaluate
npm run lint                    # Code quality check
npm run test:coverage          # Test coverage validation
npm run build:analyze          # Bundle size analysis
```

## Tracing & Monitoring

### Agent Execution Tracing

Enable comprehensive tracing for agent performance monitoring:

```typescript
import { trace } from "@ai-toolkit/tracing";

const tracer = trace.getTracer("react-scuba-agents");

export async function generateComponent(prompt: string) {
  return tracer.startActiveSpan("component-generation", async (span) => {
    span.setAttributes({
      "agent.name": "ReactComponentAgent",
      "project.workspace": "apps/web",
      "prompt.length": prompt.length,
    });

    // Agent execution logic
    const result = await agent.execute(prompt);

    span.setAttributes({
      "result.success": !!result,
      "result.files_generated": result.files?.length || 0,
    });

    return result;
  });
}
```

### Performance Monitoring

Track key metrics for agent performance:

- **Response Time**: Time from prompt to code generation
- **Code Quality Score**: Automated linting and type-checking results
- **Success Rate**: Percentage of successful code generations
- **Context Utilization**: How well agents use workspace context

## Integration with VS Code

### MCP Server Configuration

React Scuba includes MCP servers for enhanced AI capabilities:

```json
{
  "mcpServers": {
    "react-scuba-filesystem": {
      "command": "node",
      "args": [".vscode/mcp-servers/filesystem/server.js"],
      "env": {
        "WORKSPACE_ROOT": "${workspaceFolder}",
        "MONOREPO_TYPE": "turbo"
      }
    },
    "react-scuba-github": {
      "command": "python",
      "args": [".vscode/mcp-servers/github/server.py"],
      "env": {
        "GITHUB_REPO": "react-scuba",
        "BRANCH_STRATEGY": "feature-branches"
      }
    }
  }
}
```

### Copilot Chat Integration

Leverage GitHub Copilot Chat with workspace context:

```markdown
# Example prompts for React Scuba development

@workspace Create a new dive shop client configuration for "Blue Water Diving" in Australia

@workspace Generate a React component for displaying dive certification cards with multi-tenant theming

@workspace Write API tests for the booking system with proper multi-tenant data isolation

@workspace Refactor the authentication system to support OAuth providers for each client
```

## Deployment Considerations

### Docker Integration

AI agents can be deployed as Docker containers for consistent environments:

```dockerfile
# Example AI agent Dockerfile
FROM python:3.14-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 8080

CMD ["python", "-m", "react_scuba_agents.server"]
```

### Scaling Strategies

- **Horizontal Scaling**: Deploy multiple agent instances behind a load balancer
- **Resource Limits**: Set appropriate CPU/memory limits for agent containers
- **Caching**: Implement response caching for common code generation tasks
- **Rate Limiting**: Protect against excessive API usage

## Security Guidelines

### Code Generation Security

1. **Input Validation**: Sanitize all user inputs to AI agents
2. **Output Scanning**: Scan generated code for security vulnerabilities
3. **Dependency Checking**: Validate that generated code uses approved dependencies
4. **Secrets Management**: Ensure no sensitive data is exposed in generated code

### Multi-Tenant Security

- **Data Isolation**: Ensure agents respect client data boundaries
- **Permission Checking**: Verify agent has permission for requested operations
- **Audit Logging**: Log all agent activities for security auditing
- **Client Context**: Maintain proper client context throughout agent execution

## Troubleshooting Common Issues

### Agent Performance Problems

1. **Context Window Limits**: Break large requests into smaller chunks
2. **Model Selection**: Switch to more appropriate model for specific tasks
3. **Caching Issues**: Clear agent caches and restart services
4. **Resource Constraints**: Increase memory/CPU allocation for agents

### Integration Issues

1. **VS Code Extension Conflicts**: Disable conflicting extensions
2. **MCP Server Failures**: Check server logs and restart services
3. **Authentication Problems**: Verify API keys and permissions
4. **Workspace Context**: Ensure proper workspace structure and configuration
