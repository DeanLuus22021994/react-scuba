/**
 * Type Definitions
 * Shared interfaces and types for copilot context management
 */

export interface CopilotFile {
  path: string;
  templateFile: string;
  type: 'instructions' | 'ignore';
}

export interface CopilotPhase {
  id: string;
  name: string;
  files: CopilotFile[];
  dependencies: string[];
}
