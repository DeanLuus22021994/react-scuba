FROM moby/buildkit:latest
EXPOSE 1234
ENTRYPOINT ["buildkitd"]
CMD ["--addr", "tcp://0.0.0.0:1234", \
  "--oci-worker-gc=true", \
  "--oci-worker-gc-keepstorage=5000"]