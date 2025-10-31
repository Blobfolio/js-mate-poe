# Stage One.
FROM rust:1.91-trixie AS stage1
RUN set -eux; \
	mkdir /tmp/cargo && \
	cargo install --root /tmp/cargo --locked --version 0.2.105 wasm-bindgen-cli

# Stage Two.
FROM rust:1.91-trixie

LABEL Name="JS Mate Poe Firefox Extension Build Environment"

COPY docker/nodesource.sources /etc/apt/sources.list.d/
COPY docker/entrypoint.sh /opt/

COPY --from=stage1 /tmp/cargo/bin/wasm* /usr/local/cargo/bin/

RUN set -eux; \
	rustup target add wasm32-unknown-unknown && \
	\
	apt-get update && \
	DEBIAN_FRONTEND=noninteractive apt-get install -y esbuild nodejs && \
	npm set cache /tmp/npm-cache && \
	npm set package-lock false && \
	npm set save false && \
	npm i -g web-ext && \
	\
	touch /etc/inside-docker && \
	\
	apt-get clean -y && \
	rm -rf /tmp/* /var/lib/apt/lists/*

WORKDIR /mnt
ENTRYPOINT /opt/entrypoint.sh
CMD /bin/bash
