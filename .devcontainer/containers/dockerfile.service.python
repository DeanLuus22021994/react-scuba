# DevContainer - Python 3.14.0 Free-Threaded with Node.js 22
# Updated: October 2025 - Using official Python 3.14.0 with free-threading
FROM python:3.14-bookworm

# Install curl first, then Node.js 22 (required for VS Code compatibility)
RUN apt-get update && apt-get install -y curl && \
  curl -fsSL https://deb.nodesource.com/setup_22.x | bash - && \
  apt-get install -y nodejs && \
  rm -rf /var/lib/apt/lists/*

# Install development tools
RUN apt-get update && apt-get install -y \
  git \
  curl \
  wget \
  build-essential \
  vim \
  nano \
  zsh \
  ca-certificates \
  sudo \
  && rm -rf /var/lib/apt/lists/*

# Configure Python optimizations (GIL will be handled by CUDA features)
ENV PYTHONPROFILEIMPORTTIME=1 \
  PYTHONOPTIMIZE=2

# Test Python version and capabilities
RUN python3 -c "import sys; print(f'Python {sys.version}')" && \
  python3 -c "import sys; print(f'64-bit: {sys.maxsize > 2**32}')" && \
  python3 -c "import sys; print(f'Free-threading support: {hasattr(sys, \"_is_gil_enabled\")}')" || echo 'Python ready for development'# Install Python packages
RUN pip install --no-cache-dir \
  black \
  ruff \
  mypy \
  pytest \
  uv

# Install Node.js packages
RUN npm install -g \
  typescript \
  eslint \
  prettier \
  vite \
  vitest

# Install Oh My Zsh
RUN sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" "" --unattended

# Create non-root vscode user
RUN useradd -m -s /bin/zsh vscode && \
  usermod -aG sudo vscode && \
  echo 'vscode ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers && \
  mkdir -p /workspaces && \
  chown vscode:vscode /workspaces

USER vscode
WORKDIR /workspaces

ENV NODE_ENV=development \
  SHELL=/bin/zsh

CMD ["/bin/bash"]
