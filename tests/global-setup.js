import { execSync, spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const dockerComposePath = path.resolve(__dirname, '../../docker-compose-examples/basic-stack');

let dockerProcess;

export async function setup() {
  console.warn('Starting Docker Compose stack for tests...');

  try {
    // Pull images first
    await new Promise((resolve, reject) => {
      const pullProcess = spawn('C:\\Program Files\\Docker\\Docker\\resources\\bin\\docker.exe', ['compose', 'pull'], {
        cwd: dockerComposePath,
        stdio: 'inherit',
      });
      pullProcess.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`docker compose pull exited with code ${code}`));
        }
      });
      pullProcess.on('error', reject);
    });

    // Start services in detached mode
    dockerProcess = spawn(
      'C:\\Program Files\\Docker\\Docker\\resources\\bin\\docker.exe',
      ['compose', 'up', '--build', '--force-recreate'],
      {
        cwd: dockerComposePath,
        stdio: 'inherit',
        detached: false,
      },
    );

    // Wait for services to be ready
    await new Promise((resolve, reject) => {
      let ready = false;
      const timeout = setTimeout(() => {
        if (!ready) {
          reject(new Error('Docker Compose services failed to start within timeout'));
        }
      }, 120000); // 2 minutes timeout

      dockerProcess.on('close', (code) => {
        if (code === 0) {
          ready = true;
          clearTimeout(timeout);
          resolve();
        } else {
          reject(new Error(`Docker Compose exited with code ${code}`));
        }
      });

      // For detached mode, we need to check if services are healthy
      // For now, wait a bit and assume ready
      setTimeout(() => {
        ready = true;
        clearTimeout(timeout);
        resolve();
      }, 30000); // Wait 30 seconds
    });

    console.warn('Docker Compose stack started successfully');
  } catch (error) {
    console.error('Failed to start Docker Compose:', error);
    throw error;
  }
}

export function teardown() {
  console.warn('Stopping Docker Compose stack...');

  if (dockerProcess) {
    dockerProcess.kill();
  }

  try {
    execSync('"C:\\Program Files\\Docker\\Docker\\resources\\bin\\docker.exe" compose down --volumes --remove-orphans', {
      cwd: dockerComposePath,
      stdio: 'inherit',
      shell: true,
    });
    console.warn('Docker Compose stack stopped successfully');
  } catch (error) {
    console.error('Failed to stop Docker Compose:', error);
    // Don't throw in teardown
  }
}
