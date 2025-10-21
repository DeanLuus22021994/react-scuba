FROM mariadb:latest

# Install Node.js
RUN apt-get update && apt-get install -y \
  curl \
  gnupg \
  && curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
  && apt-get install -y nodejs \
  && rm -rf /var/lib/apt/lists/*

# Install essential tools and utilities
RUN apt-get update && apt-get install -y \
  # Basic shell and utilities
  bash \
  sudo \
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
  lsb-release \
  # Networking tools
  net-tools \
  iputils-ping \
  dnsutils \
  # Development tools
  jq \
  unzip \
  supervisor \
  && rm -rf /var/lib/apt/lists/*

# Copy MariaDB configuration
COPY my.cnf /etc/mysql/my.cnf
COPY init.sql /docker-entrypoint-initdb.d/

# Create supervisord configuration
RUN mkdir -p /var/log/supervisor
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Expose MariaDB port
EXPOSE 3306

# Create a non-root user with sudo access
RUN useradd -m -s /bin/bash vscode \
  && echo 'vscode ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers.d/vscode \
  && chmod 0440 /etc/sudoers.d/vscode \
  && mkdir -p /workspaces \
  && chown vscode:vscode /workspaces

# Set the default shell to bash
SHELL ["/bin/bash", "-c"]

# Switch to the vscode user
USER vscode

# Ensure the user has access to the workspace directory
RUN mkdir -p /workspaces

# Switch back to root for running supervisord
USER root

# Set the default command
CMD ["/usr/bin/supervisord"]
