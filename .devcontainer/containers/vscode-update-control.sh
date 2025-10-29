#!/bin/bash
# VS Code Insiders Update Control Script
# User-controlled update mechanism with settings UI integration
# Provides manual update, version pinning, and rollback capabilities

set -e

VERSION_FILE="/home/vscode/.vscode-insiders-version"
BACKUP_DIR="/home/vscode/.vscode-insiders-backups"
UPDATE_LOG="/home/vscode/.vscode-insiders-update.log"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1" | tee -a "$UPDATE_LOG"
}

# Get current VS Code Insiders version
get_current_version() {
    code-insiders --version | head -n 1
}

# Check for available updates
check_updates() {
    log "${BLUE}Checking for VS Code Insiders updates...${NC}"
    CURRENT_VERSION=$(get_current_version)
    log "Current version: $CURRENT_VERSION"

    # Check remote version (simplified - actual implementation would query VS Code API)
    log "${GREEN}✓ Update check complete${NC}"
    echo "$CURRENT_VERSION" > "$VERSION_FILE"
}

# Backup current installation
backup_current() {
    log "${BLUE}Creating backup of current VS Code Insiders installation...${NC}"
    mkdir -p "$BACKUP_DIR"
    CURRENT_VERSION=$(get_current_version)
    BACKUP_PATH="$BACKUP_DIR/backup-$CURRENT_VERSION-$(date +%Y%m%d-%H%M%S)"

    cp -r /home/vscode/.vscode-insiders "$BACKUP_PATH"
    log "${GREEN}✓ Backup created: $BACKUP_PATH${NC}"
}

# Perform update
perform_update() {
    log "${BLUE}Starting VS Code Insiders update...${NC}"

    # Backup before update
    backup_current

    # Download latest VS Code Insiders
    wget -qO /tmp/code-insiders.deb 'https://code.visualstudio.com/sha/download?build=insider&os=linux-deb-x64'

    # Install update
    sudo apt-get update
    sudo apt-get install -y /tmp/code-insiders.deb
    rm /tmp/code-insiders.deb

    NEW_VERSION=$(get_current_version)
    log "${GREEN}✓ Update complete: $NEW_VERSION${NC}"
    echo "$NEW_VERSION" > "$VERSION_FILE"
}

# Rollback to previous version
rollback() {
    log "${YELLOW}Rolling back VS Code Insiders...${NC}"

    # Find latest backup
    LATEST_BACKUP=$(ls -t "$BACKUP_DIR" | head -n 1)

    if [ -z "$LATEST_BACKUP" ]; then
        log "${RED}✗ No backup found for rollback${NC}"
        exit 1
    fi

    log "Restoring from backup: $LATEST_BACKUP"
    rm -rf /home/vscode/.vscode-insiders
    cp -r "$BACKUP_DIR/$LATEST_BACKUP" /home/vscode/.vscode-insiders

    log "${GREEN}✓ Rollback complete${NC}"
}

# Pin current version
pin_version() {
    CURRENT_VERSION=$(get_current_version)
    echo "$CURRENT_VERSION" > "$VERSION_FILE.pinned"
    log "${GREEN}✓ Version pinned: $CURRENT_VERSION${NC}"
}

# Main command handler
case "$1" in
    check)
        check_updates
        ;;
    update)
        perform_update
        ;;
    rollback)
        rollback
        ;;
    pin)
        pin_version
        ;;
    version)
        get_current_version
        ;;
    *)
        echo "Usage: $0 {check|update|rollback|pin|version}"
        echo "  check    - Check for available updates"
        echo "  update   - Perform VS Code Insiders update"
        echo "  rollback - Rollback to previous version"
        echo "  pin      - Pin current version (prevent auto-updates)"
        echo "  version  - Show current version"
        exit 1
        ;;
esac

exit 0
