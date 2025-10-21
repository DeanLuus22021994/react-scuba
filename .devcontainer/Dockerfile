FROM node:22-slim

# Install essential tools and utilities
RUN apt-get update && apt-get install -y \
    # Basic shell and utilities
    bash \
    sudo \
    curl \
    wget \
    git \
    # Build tools
    build-essential \
    # System utilities
    procps \
    htop \
    nano \
    vim \
    # Package management and certificates
    ca-certificates \
    gnupg \
    lsb-release \
    # Networking tools
    net-tools \
    iputils-ping \
    dnsutils \
    # Development tools
    jq \
    unzip \
    && rm -rf /var/lib/apt/lists/*

# Install GitHub CLI
RUN curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg \
    && chmod go+r /usr/share/keyrings/githubcli-archive-keyring.gpg \
    && echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | tee /etc/apt/sources.list.d/github-cli.list > /dev/null \
    && apt-get update \
    && apt-get install -y gh \
    && rm -rf /var/lib/apt/lists/*

# Create a non-root user with sudo access
RUN useradd -m -s /bin/bash vscode \
    && echo 'vscode ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers.d/vscode \
    && chmod 0440 /etc/sudoers.d/vscode

# Set the default shell to bash
SHELL ["/bin/bash", "-c"]

# Switch to the vscode user
USER vscode
