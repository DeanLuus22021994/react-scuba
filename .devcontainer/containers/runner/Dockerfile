# Stage 1: Build environment for downloading and extracting the runner
FROM alpine:3.20 AS builder

# Set runner version and architecture
ARG RUNNER_VERSION="2.317.0"
ARG TARGETARCH

# Determine runner architecture
RUN case ${TARGETARCH} in \
  "amd64") ARCH="x64" ;; \
  "arm64") ARCH="arm64" ;; \
  esac && \
  echo "ARCH=${ARCH}" >> /etc/environment

# Install build dependencies
RUN apk add --no-cache \
  curl \
  tar \
  jq

# Download and extract GitHub Actions runner
WORKDIR /actions-runner
RUN . /etc/environment && \
  curl -o actions-runner-linux-${ARCH}-${RUNNER_VERSION}.tar.gz -L \
  https://github.com/actions/runner/releases/download/v${RUNNER_VERSION}/actions-runner-linux-${ARCH}-${RUNNER_VERSION}.tar.gz && \
  tar xzf ./actions-runner-linux-${ARCH}-${RUNNER_VERSION}.tar.gz && \
  rm actions-runner-linux-${ARCH}-${RUNNER_VERSION}.tar.gz

# ---

# Stage 2: Final runtime image
FROM alpine:3.20

# Avoid prompts
ENV DEBIAN_FRONTEND=noninteractive

# Install runtime dependencies
# libicu is required by the runner
RUN apk add --no-cache \
  git \
  icu-libs \
  curl \
  jq \
  tini \
  dos2unix

# Create a non-root user
RUN addgroup -S runner && adduser -S runner -G runner
USER runner
WORKDIR /home/runner

# Copy runner files from builder stage
COPY --from=builder --chown=runner:runner /actions-runner .

# Copy entrypoint script
COPY --chown=runner:runner scripts/entrypoint.sh ./entrypoint.sh
RUN dos2unix ./entrypoint.sh && chmod +x ./entrypoint.sh

# Set entrypoint
ENTRYPOINT ["/sbin/tini", "--", "/home/runner/entrypoint.sh"]
