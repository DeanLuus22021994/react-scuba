import { execSync } from 'child_process';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

interface MCPServer {
  name: string;
  configPath: string;
  dockerfile: string;
  imageName: string;
  port: number;
}

const servers: MCPServer[] = [
  { name: 'github', configPath: '.vscode/mcp-servers/github.json', dockerfile: '.devcontainer/containers/dockerfile.mcp.github', imageName: 'ghcr.io/github/github-mcp-server:latest', port: 9090 },
  { name: 'filesystem', configPath: '.vscode/mcp-servers/filesystem.json', dockerfile: '.devcontainer/containers/dockerfile.mcp.filesystem', imageName: 'mcp-filesystem:latest', port: 9091 },
  { name: 'postgres', configPath: '.vscode/mcp-servers/postgres.json', dockerfile: '.devcontainer/containers/dockerfile.db.postgres', imageName: 'mcp-postgres:latest', port: 9092 },
  { name: 'mariadb', configPath: '.vscode/mcp-servers/mariadb.json', dockerfile: '.devcontainer/containers/dockerfile.db.mariadb', imageName: 'mcp-mariadb:latest', port: 9093 },
  { name: 'sqlite', configPath: '.vscode/mcp-servers/sqlite.json', dockerfile: '.devcontainer/containers/dockerfile.mcp.sqlite', imageName: 'mcp-sqlite:latest', port: 9094 },
  { name: 'memory', configPath: '.vscode/mcp-servers/memory.json', dockerfile: '.devcontainer/containers/dockerfile.mcp.memory', imageName: 'mcp-memory:latest', port: 9095 },
  { name: 'git', configPath: '.vscode/mcp-servers/git.json', dockerfile: '.devcontainer/containers/dockerfile.mcp.git', imageName: 'mcp-git:latest', port: 9096 },
  { name: 'fetch', configPath: '.vscode/mcp-servers/fetch.json', dockerfile: '.devcontainer/containers/dockerfile.mcp.fetch', imageName: 'mcp-fetch:latest', port: 9097 },
  { name: 'markitdown', configPath: '.vscode/mcp-servers/markitdown.json', dockerfile: '.devcontainer/containers/dockerfile.mcp.markitdown', imageName: 'markitdown-mcp:latest', port: 9098 }
];

const rootDir = process.cwd();
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m'
};

function log(message: string, color: keyof typeof colors = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function exec(command: string, cwd: string = rootDir): string {
  try {
    return execSync(command, { cwd, encoding: 'utf-8', stdio: 'pipe' });
  } catch (error: any) {
    throw new Error(`Command failed: ${command}\n${error.stderr || error.message}`);
  }
}

function validateJSON(path: string): boolean {
  const fullPath = join(rootDir, path);
  if (!existsSync(fullPath)) {
    log(`  ✗ File not found: ${path}`, 'red');
    return false;
  }
  try {
    const content = readFileSync(fullPath, 'utf-8');
    JSON.parse(content);
    log(`  ✓ Valid JSON: ${path}`, 'green');
    return true;
  } catch (error: any) {
    log(`  ✗ Invalid JSON: ${path} - ${error.message}`, 'red');
    return false;
  }
}

function validateDockerfile(path: string): boolean {
  const fullPath = join(rootDir, path);
  if (!existsSync(fullPath)) {
    log(`  ✗ Dockerfile not found: ${path}`, 'red');
    return false;
  }
  log(`  ✓ Dockerfile exists: ${path}`, 'green');
  return true;
}

function buildDockerImage(server: MCPServer, noCache: boolean = false): boolean {
  log(`\n🔨 Building ${server.name}...`, 'cyan');
  
  if (server.name === 'github') {
    log(`  ↓ Pulling official image: ${server.imageName}`, 'gray');
    try {
      exec(`docker pull ${server.imageName}`);
      log(`  ✓ Image pulled successfully`, 'green');
      return true;
    } catch (error: any) {
      log(`  ✗ Failed to pull image: ${error.message}`, 'red');
      return false;
    }
  }

  const contextDir = join(rootDir, '.devcontainer/containers');
  const dockerfileName = server.dockerfile.split('/').pop()!;
  const buildArgs = [
    'docker build',
    '-t', server.imageName,
    '-f', dockerfileName,
    noCache ? '--no-cache' : '',
    '--progress=plain',
    '.'
  ].filter(Boolean).join(' ');

  try {
    log(`  ${buildArgs}`, 'gray');
    const output = exec(buildArgs, contextDir);
    log(`  ✓ Build successful: ${server.imageName}`, 'green');
    return true;
  } catch (error: any) {
    log(`  ✗ Build failed: ${error.message}`, 'red');
    return false;
  }
}

function testDockerRun(server: MCPServer): boolean {
  log(`\n🧪 Testing ${server.name}...`, 'cyan');
  
  const containerName = `${server.name}-mcp-test`;
  
  try {
    exec(`docker rm -f ${containerName} 2>nul || true`);
  } catch {}

  const runArgs = [
    'docker run',
    '-d',
    '--name', containerName,
    '--rm',
    '--network', 'mcp-cluster',
    '-e', 'LOG_LEVEL=debug',
    server.imageName
  ].join(' ');

  try {
    log(`  Starting test container...`, 'gray');
    exec(runArgs);
    
    setTimeout(() => {
      try {
        const status = exec(`docker inspect -f {{.State.Status}} ${containerName}`).trim();
        if (status === 'running') {
          log(`  ✓ Container started successfully`, 'green');
          exec(`docker logs ${containerName}`);
        } else {
          log(`  ✗ Container not running: ${status}`, 'red');
        }
      } catch (error: any) {
        log(`  ✗ Container check failed: ${error.message}`, 'red');
      } finally {
        try {
          exec(`docker stop ${containerName}`);
        } catch {}
      }
    }, 3000);
    
    return true;
  } catch (error: any) {
    log(`  ✗ Test failed: ${error.message}`, 'red');
    return false;
  }
}

function createNetwork(): boolean {
  try {
    const networks = exec('docker network ls --format "{{.Name}}"');
    if (networks.includes('mcp-cluster')) {
      log('✓ Network mcp-cluster already exists', 'green');
      return true;
    }
    exec('docker network create --subnet=172.28.0.0/16 mcp-cluster');
    log('✓ Network mcp-cluster created', 'green');
    return true;
  } catch (error: any) {
    log(`✗ Network creation failed: ${error.message}`, 'red');
    return false;
  }
}

async function main() {
  const args = process.argv.slice(2);
  const noCache = args.includes('--no-cache');
  const buildOnly = args.includes('--build-only');
  const testOnly = args.includes('--test-only');
  const serverFilter = args.find(arg => !arg.startsWith('--'));

  log('\n╔════════════════════════════════════════════╗', 'cyan');
  log('║   MCP Server Validation & Build Pipeline  ║', 'cyan');
  log('╚════════════════════════════════════════════╝\n', 'cyan');

  const filteredServers = serverFilter 
    ? servers.filter(s => s.name === serverFilter)
    : servers;

  if (filteredServers.length === 0) {
    log(`No servers match filter: ${serverFilter}`, 'red');
    process.exit(1);
  }

  log('📋 Validation Phase\n', 'yellow');
  
  let validationPassed = true;
  for (const server of filteredServers) {
    log(`\nValidating ${server.name}:`, 'cyan');
    const configValid = validateJSON(server.configPath);
    const dockerfileValid = validateDockerfile(server.dockerfile);
    if (!configValid || !dockerfileValid) {
      validationPassed = false;
    }
  }

  if (!validationPassed) {
    log('\n✗ Validation failed. Fix errors before building.', 'red');
    process.exit(1);
  }

  log('\n✓ All validations passed!\n', 'green');

  if (testOnly) {
    log('Skipping build phase (--test-only)', 'yellow');
  } else {
    log('🏗️  Build Phase\n', 'yellow');
    
    if (!createNetwork()) {
      log('\n✗ Network setup failed', 'red');
      process.exit(1);
    }

    const buildResults: { server: string; success: boolean }[] = [];

    for (const server of filteredServers) {
      const success = buildDockerImage(server, noCache);
      buildResults.push({ server: server.name, success });
    }

    log('\n📊 Build Summary\n', 'yellow');
    const successful = buildResults.filter(r => r.success).length;
    const failed = buildResults.filter(r => !r.success).length;

    log(`✓ Successful: ${successful}/${buildResults.length}`, 'green');
    if (failed > 0) {
      log(`✗ Failed: ${failed}/${buildResults.length}`, 'red');
      buildResults.filter(r => !r.success).forEach(r => {
        log(`  - ${r.server}`, 'red');
      });
      process.exit(1);
    }
  }

  if (buildOnly) {
    log('\nSkipping test phase (--build-only)', 'yellow');
    log('\n✅ Build pipeline completed successfully!\n', 'green');
    process.exit(0);
  }

  log('\n🧪 Test Phase\n', 'yellow');
  
  for (const server of filteredServers) {
    testDockerRun(server);
  }

  setTimeout(() => {
    log('\n✅ All operations completed!\n', 'green');
    process.exit(0);
  }, 5000);
}

main().catch(error => {
  log(`\n✗ Fatal error: ${error.message}`, 'red');
  process.exit(1);
});