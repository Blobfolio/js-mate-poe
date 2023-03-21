FROM rust:bullseye

LABEL Name="JS Mate Poe Firefox Extension Build Environment"

COPY docker/nodesource-archive-keyring.gpg /usr/share/keyrings/nodesource-archive-keyring.gpg
COPY docker/nodesource.sources /etc/apt/sources.list.d/nodesource.sources

COPY docker/entrypoint.sh /opt/entrypoint.sh

RUN set -eux; \
	rustup target add wasm32-unknown-unknown && \
	cargo install --locked wasm-bindgen-cli wasm-opt --target-dir "/tmp/cargo" && \
	\
	apt-get update && \
	DEBIAN_FRONTEND=noninteractive apt-get install -y nodejs && \
	npm set cache /tmp/npm-cache && \
	npm set package-lock false && \
	npm set save false && \
	npm set unsafe-perm true && \
	npm update -g npm && \
	npm i -g google-closure-compiler@20221102.0.1 web-ext && \
	\
	touch /etc/inside-docker && \
	\
	apt-get clean -y && \
	rm -rf /tmp/* /var/lib/apt/lists/*

WORKDIR /mnt
ENTRYPOINT /opt/entrypoint.sh
CMD /bin/bash
