# Stage One.
FROM rust:1.69-bullseye AS stage1
RUN set -eux; \
	mkdir /tmp/cargo && \
	cargo install --root /tmp/cargo --locked --version 0.2.86 wasm-bindgen-cli && \
	cargo install --root /tmp/cargo --locked --version 0.112.0 wasm-opt

# Stage Two.
FROM rust:1.69-bullseye

LABEL Name="JS Mate Poe Firefox Extension Build Environment"

COPY docker/nodesource-archive-keyring.gpg /usr/share/keyrings/
COPY docker/nodesource.sources /etc/apt/sources.list.d/
COPY docker/entrypoint.sh /opt/

COPY --from=stage1 /tmp/cargo/bin/wasm* /usr/local/cargo/bin/

RUN set -eux; \
	rustup target add wasm32-unknown-unknown && \
	\
	apt-get update && \
	DEBIAN_FRONTEND=noninteractive apt-get install -y nodejs && \
	npm set cache /tmp/npm-cache && \
	npm set package-lock false && \
	npm set save false && \
	npm set unsafe-perm true && \
	npm i -g google-closure-compiler@20221102.0.1 web-ext && \
	\
	touch /etc/inside-docker && \
	\
	apt-get clean -y && \
	rm -rf /tmp/* /var/lib/apt/lists/*

WORKDIR /mnt
ENTRYPOINT /opt/entrypoint.sh
CMD /bin/bash
