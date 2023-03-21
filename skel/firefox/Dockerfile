FROM rust:bullseye

LABEL Name="JS Mate Poe Firefox Extension Build Environment"

RUN set -eux; \
	rustup target add wasm32-unknown-unknown && \
	\
	curl -fsSL https://deb.nodesource.com/setup_14.x | bash - && \
	apt-get install -y nodejs && \
	npm i -g google-closure-compiler@20221102.0.1 web-ext && \
	\
	cargo install --locked wasm-bindgen-cli wasm-opt && \
	touch /etc/inside-docker

WORKDIR /mnt
CMD /bin/bash
