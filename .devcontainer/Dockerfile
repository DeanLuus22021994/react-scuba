# DevContainer - Python 3.14.0 Free-Threaded with Node.js 22
# SHA256: 2299dae542d395ce3883aca00d3c910307cd68e0b2f7336098c8e7b7eee9f3e9
FROM python:3.14.0-slim-bookworm

# Install Node.js 22 (required for VS Code compatibility)
RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash - && \
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
  && rm -rf /var/lib/apt/lists/*

# Configure Python free-threaded
ENV PYTHON_GIL=0 \
  PYTHONPROFILEIMPORTTIME=1 \
  PYTHONOPTIMIZE=2

# Verify free-threaded build
RUN python3 -c "import sys; assert not sys._is_gil_enabled(), 'GIL is not disabled!'"

# Install Python packages
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
