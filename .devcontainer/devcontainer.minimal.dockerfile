# DevContainer - Orchestrated development environment
FROM node:25-bookworm-slim
RUN apt-get update && apt-get install -y curl wget ca-certificates git python3 python3-pip zsh vim nano && rm -rf /var/lib/apt/lists/*
RUN sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" "" --unattended
RUN npm install -g typescript ts-node eslint prettier vite vitest
RUN pip3 install --break-system-packages black ruff mypy pytest
RUN mkdir -p /workspace /cache && useradd -m -s /bin/zsh -u 1000 vscode && chown -R vscode:vscode /workspace /cache
USER vscode
WORKDIR /workspace
ENV NODE_ENV=development SHELL=/bin/zsh
CMD ["sleep", "infinity"]
