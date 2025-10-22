export function setup() {
  console.warn('Docker Compose services should be running externally for tests');
  console.warn('Skipping Docker startup in global setup - services assumed to be running');
}

export function teardown() {
  console.warn('Docker Compose services are managed externally - not stopping in teardown');
}
