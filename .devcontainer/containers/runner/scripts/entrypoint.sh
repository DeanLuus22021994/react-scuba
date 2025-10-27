#!/bin/sh
set -e

# Environment variables
: "${GITHUB_OWNER?Missing GITHUB_OWNER}"
: "${GITHUB_REPO?Missing GITHUB_REPO}"
: "${GITHUB_PAT?Missing GITHUB_PAT}"
: "${RUNNER_NAME?Missing RUNNER_NAME}"

# API URL for registration token
API_URL="https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/actions/runners/registration-token"

echo "Requesting registration token from GitHub API..."

# Fetch the token
RUNNER_TOKEN=$(curl -s -X POST -H "Authorization: token ${GITHUB_PAT}" -H "Accept: application/vnd.github.v3+json" "${API_URL}" | jq -r .token)

if [ -z "$RUNNER_TOKEN" ] || [ "$RUNNER_TOKEN" = "null" ]; then
    echo "Error: Failed to get runner registration token. Check GITHUB_PAT permissions."
    exit 1
fi

echo "Successfully fetched registration token."

# Unregister runner on exit
cleanup() {
    echo "Caught SIGTERM. Unregistering runner..."
    ./config.sh remove --token "${RUNNER_TOKEN}"
    exit 0
}

trap cleanup TERM

# Configure the runner
echo "Configuring runner..."
./config.sh \
    --url "https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}" \
    --token "${RUNNER_TOKEN}" \
    --name "${RUNNER_NAME}" \
    --work "/home/runner/_work" \
    --labels "self-hosted,linux,x64,alpine" \
    --unattended \
    --replace

# Start the runner
echo "Starting runner..."
./run.sh

# Wait for runner to exit (should not happen unless there's an error)
wait $!
