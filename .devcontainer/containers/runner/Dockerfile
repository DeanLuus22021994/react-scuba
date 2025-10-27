FROM myoung34/github-runner:latest

# Add custom tools
RUN apt-get update && apt-get install -y \
  python3-pip \
  nodejs \
  npm \
  && rm -rf /var/lib/apt/lists/*

ENV RUNNER_WORKDIR=/work