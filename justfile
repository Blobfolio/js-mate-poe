##
# Development Recipes
#
# This justfile is intended to be run from inside a Docker sandbox:
# https://github.com/Blobfolio/righteous-sandbox
#
# docker run \
#	--rm \
#	-v "{{ invocation_directory() }}":/share \
#	-it \
#	--name "righteous_sandbox" \
#	"righteous/sandbox:debian"
#
# Alternatively, you can just run cargo commands the usual way and ignore these
# recipes.
##

pkg_id         := "rs_mate_poe"
pkg_name       := "RS Mate Poe"

cargo_dir      := "/tmp/" + pkg_id + "-cargo"
demo_dir       := justfile_directory() + "/demo"
dist_dir       := justfile_directory() + "/dist"
skel_dir       := justfile_directory() + "/skel"
demo_asset_dir := demo_dir + "/assets"

cargo_release_dir := cargo_dir + "/wasm32-unknown-unknown/release"



# Build Library!
@build FEATURES="":
	# Dependency checks.
	just _require-app cargo
	just _require-app esbuild
	just _require-app wasm-bindgen
	just _require-app wasm-opt

	[ -z "$(which fyi)" ] || fyi task "Building JS Mate Poe…"

	# Reset the output directories.
	[ ! -d "{{ dist_dir }}" ] || rm -rf "{{ dist_dir }}"
	[ ! -d "{{ skel_dir }}/js/generated" ] || rm -rf "{{ skel_dir }}/js/generated"
	mkdir -p "{{ dist_dir }}" "{{ skel_dir }}/js/generated"

	# Start with Cargo.
	cargo build \
		--release \
		--features "{{ FEATURES }}" \
		--target wasm32-unknown-unknown \
		--target-dir "{{ cargo_dir }}"

	# Run Bindgen.
	wasm-bindgen \
		--out-dir "{{ cargo_release_dir }}" \
		--target web \
		--no-typescript \
		--omit-default-module-path \
		--encode-into always \
		--reference-types \
		"{{ cargo_release_dir }}/{{ pkg_id }}.wasm"

	# Remove the unused "fetch" stuff from the glue to save space (since it
	# isn't pruned automatically).
	cd "{{ cargo_release_dir }}" && patch -s -p1 -i "{{ skel_dir }}/js/glue.patch"

	# Copy the glue to somewhere more predictable.
	cp "{{ cargo_release_dir }}/{{ pkg_id }}.js" "{{ skel_dir }}/js/generated/glue.mjs"

	# Run Wasm-Opt.
	wasm-opt "{{ cargo_release_dir }}/{{ pkg_id }}_bg.wasm" \
		--enable-reference-types \
		-O3 \
		-o "{{ cargo_release_dir }}/{{ pkg_id }}.opt.wasm"

	# Remove the wasm-bindgen stuff.
	rm -rf \
		"{{ cargo_release_dir }}/{{ pkg_id }}_bg.wasm" \
		"{{ cargo_release_dir }}/{{ pkg_id }}.js" \
		"{{ cargo_release_dir }}/snippets"

	# Base64-encode the optimized wasm and throw it into a quickie JS module
	# so we can easily access it from our entry point.
	echo -n "export const wasmBase64 = '" > "{{ skel_dir }}/js/generated/wasm_base64.mjs"
	cat "{{ cargo_release_dir }}/{{ pkg_id }}.opt.wasm" | base64 -w0 >> "{{ skel_dir }}/js/generated/wasm_base64.mjs"
	echo "';" >> "{{ skel_dir }}/js/generated/wasm_base64.mjs"

	# Transpile the JS to a temporary location.
	esbuild \
		--banner:js="$( cat "{{ skel_dir }}/js/header.js" )" \
		--bundle "{{ skel_dir }}/js/library.mjs" \
		--minify \
		--log-level=warning \
		--outfile="{{ dist_dir }}/js-mate-poe.min.js"

	# Copy the demo HTML to the dist folder.
	cp "{{ skel_dir }}/html/index.html" "{{ dist_dir }}"

	# Gzip/Brotli the JS.
	[ -z "$(which channelz)" ] || channelz "{{ dist_dir }}/js-mate-poe.min.js"

	# Clean up.
	just _fix-chown "{{ dist_dir }}"

	[ -z "$(which fyi)" ] || fyi success "Built JS Mate Poe!"


# Build Firefox Extension Build Environment.
@build-firefox-src:
	# Dependency check.
	just _require-app cargo

	[ -z "$(which fyi)" ] || fyi task "Building Firefox Extension Build Environment…"

	# Make sure there's an up-to-date Cargo lock file.
	cargo update

	# Reset the output directories.
	[ ! -d "{{ dist_dir }}" ] || rm -rf "{{ dist_dir }}"
	mkdir -p \
		"{{ dist_dir }}/js-mate-poe_firefox/static/image" \
		"{{ dist_dir }}/js-mate-poe_firefox/static/options" \
		"{{ dist_dir }}/js-mate-poe_firefox/static/sound" \
		"{{ dist_dir }}/js-mate-poe_firefox/js/generated" \
		"{{ dist_dir }}/js-mate-poe_firefox/rust/skel/img" \
		"{{ dist_dir }}/js-mate-poe_firefox/rust/skel/js"

	# Copy docker bits.
	cp "{{ skel_dir }}/firefox/Dockerfile" "{{ dist_dir }}/js-mate-poe_firefox"
	cp -aR "{{ skel_dir }}/firefox/docker" "{{ dist_dir }}/js-mate-poe_firefox/docker"

	# Copy static assets over.
	cp "{{ skel_dir }}/firefox/build.sh" "{{ dist_dir }}/js-mate-poe_firefox"
	cp "{{ skel_dir }}/firefox/README.txt" "{{ dist_dir }}/js-mate-poe_firefox"
	cp "{{ skel_dir }}/firefox/manifest.json" "{{ dist_dir }}/js-mate-poe_firefox/static"
	cp "{{ skel_dir }}/firefox/options.html" "{{ dist_dir }}/js-mate-poe_firefox/static/options"
	cp "{{ skel_dir }}/firefox/options.css" "{{ dist_dir }}/js-mate-poe_firefox/static/options"
	cp "{{ skel_dir }}/img/icons/"*.svg "{{ dist_dir }}/js-mate-poe_firefox/static/image"
	cp "{{ skel_dir }}/sound/"*.flac "{{ dist_dir }}/js-mate-poe_firefox/static/sound"

	# Patch the readme to remove its warning.
	sed -i 's/## THIS IS ONLY A MESSAGE TEMPLATE  ##//g' "{{ dist_dir }}/js-mate-poe_firefox/README.txt"
	sed -i 's/## DO NOT FOLLOW THESE INSTRUCTIONS ##//g' "{{ dist_dir }}/js-mate-poe_firefox/README.txt"

	# Copy the remaining Javascript sources.
	cp "{{ skel_dir }}/firefox/"*.mjs "{{ dist_dir }}/js-mate-poe_firefox/js"
	cp "{{ skel_dir }}/js/header.js" "{{ dist_dir }}/js-mate-poe_firefox/js"

	# Copy the Rust sources we'll need (including anything build.rs cares
	# about).
	cp "{{ justfile_directory() }}/build.rs" "{{ dist_dir }}/js-mate-poe_firefox/rust"
	cp "{{ justfile_directory() }}/Cargo.toml" "{{ dist_dir }}/js-mate-poe_firefox/rust"
	cp "{{ justfile_directory() }}/Cargo.lock" "{{ dist_dir }}/js-mate-poe_firefox/rust"
	cp "{{ skel_dir }}/playlist.txt" "{{ dist_dir }}/js-mate-poe_firefox/rust/skel"
	cp "{{ skel_dir }}/img/poe.png" "{{ dist_dir }}/js-mate-poe_firefox/rust/skel/img"
	cp "{{ skel_dir }}/img/poe.txt" "{{ dist_dir }}/js-mate-poe_firefox/rust/skel/img"
	cp "{{ skel_dir }}/js/glue-extra.mjs" "{{ dist_dir }}/js-mate-poe_firefox/rust/skel/js"
	cp -aR "{{ skel_dir }}/scss" "{{ dist_dir }}/js-mate-poe_firefox/rust/skel"
	cp -aR "{{ justfile_directory() }}/src" "{{ dist_dir }}/js-mate-poe_firefox/rust"

	# Fix the permissions and ownership.
	just _fix-chown "{{ dist_dir }}/js-mate-poe_firefox"
	just _fix-chmod "{{ dist_dir }}/js-mate-poe_firefox"

	chmod 755 \
		"{{ dist_dir }}/js-mate-poe_firefox/build.sh" \
		"{{ dist_dir }}/js-mate-poe_firefox/docker/entrypoint.sh"

	# Package it up!
	cd "{{ dist_dir }}" && \
		tar -cvzf js-mate-poe_firefox.tar.gz js-mate-poe_firefox

	# Clean up.
	rm -rf "{{ dist_dir }}/js-mate-poe_firefox"
	just _fix-chown "{{ dist_dir }}"

	[ -z "$(which fyi)" ] || fyi success "Built Firefox Extension Build Environment!"


# Clean Cargo crap.
@clean:
	# Most things go here.
	[ ! -d "{{ cargo_dir }}" ] || rm -rf "{{ cargo_dir }}"

	# But some Cargo apps place shit in subdirectories even if
	# they place *other* shit in the designated target dir. Haha.
	[ ! -d "{{ justfile_directory() }}/target" ] || rm -rf "{{ justfile_directory() }}/target"

	cargo update -w


# Clippy.
@clippy:
	clear

	[ -z "$(which fyi)" ] || fyi task "Features: none (default)"
	RUSTFLAGS="-D warnings" cargo clippy \
		--release \
		--target wasm32-unknown-unknown \
		--target-dir "{{ cargo_dir }}"

	[ -z "$(which fyi)" ] || fyi task "Features: director"
	RUSTFLAGS="-D warnings" cargo clippy \
		--release \
		--features director \
		--target wasm32-unknown-unknown \
		--target-dir "{{ cargo_dir }}"

	[ -z "$(which fyi)" ] || fyi task "Features: firefox"
	RUSTFLAGS="-D warnings" cargo clippy \
		--release \
		--features firefox \
		--target wasm32-unknown-unknown \
		--target-dir "{{ cargo_dir }}"


# Build Demo.
@demo:
	just _require-app "guff"

	[ -z "$(which fyi)" ] || fyi task "Build: Reference pages"

	[ ! -d "{{ demo_asset_dir }}" ] || rm -rf "{{ demo_asset_dir }}"
	mkdir -p "{{ demo_asset_dir }}"

	# Tiles first.
	cp "{{ skel_dir }}/html/tiles.html" "{{ demo_dir }}"
	cp "{{ skel_dir }}/img/poe-full.png" "{{ demo_asset_dir }}/poe.png"
	guff -i "{{ skel_dir }}/scss/tiles.scss" -o "{{ demo_asset_dir }}/tiles.css"

	just _fix-chown "{{ demo_dir }}"


# Unit tests!
@test:
	clear
	# Note: we have to target x86-64 because private tests can't be run
	# under wasm yet.
	[ -z "$(which fyi)" ] || fyi task "Features: none (default)"
	cargo test \
		--target x86_64-unknown-linux-gnu \
		--target-dir "{{ cargo_dir }}"
	cargo test \
		--release \
		--target x86_64-unknown-linux-gnu \
		--target-dir "{{ cargo_dir }}"

	[ -z "$(which fyi)" ] || fyi task "Features: director"
	cargo test \
		--features director \
		--target x86_64-unknown-linux-gnu \
		--target-dir "{{ cargo_dir }}"
	cargo test \
		--release \
		--features director \
		--target x86_64-unknown-linux-gnu \
		--target-dir "{{ cargo_dir }}"

	[ -z "$(which fyi)" ] || fyi task "Features: firefox"
	cargo test \
		--features firefox \
		--target x86_64-unknown-linux-gnu \
		--target-dir "{{ cargo_dir }}"
	cargo test \
		--release \
		--features firefox \
		--target x86_64-unknown-linux-gnu \
		--target-dir "{{ cargo_dir }}"


# Get/Set version.
version: _pre_version
	#!/usr/bin/env bash

	# Current version.
	_ver1="$( toml get "{{ justfile_directory() }}/Cargo.toml" package.version | \
		sed 's/"//g' )"

	# Find out if we want to bump it.
	_ver2="$( whiptail --inputbox "Set {{ pkg_name }} version:" --title "Release Version" 0 0 "$_ver1" 3>&1 1>&2 2>&3 )"

	exitstatus=$?
	if [ $exitstatus != 0 ] || [ "$_ver1" = "$_ver2" ]; then
		exit 0
	fi

	[ -z "$(which fyi)" ] || fyi success "Setting version to $_ver2."

	# Set the release version!
	just _version "{{ justfile_directory() }}" "$_ver2"

	# Set Extension Version.
	sd '"version": "[\d.]+"' "\"version\": \"$_ver2\"" "{{ skel_dir }}/firefox/manifest.json"

	# Set JS Header Version.
	sd '@version [\d.]+' "@version $_ver2" "{{ skel_dir }}/js/header.js"


# Version requirements.
@_pre_version:
	just _require-app sd
	just _require-app toml
	just _require-app whiptail


# Set Cargo version for real.
@_version DIR VER:
	just _require "{{ DIR }}/Cargo.toml"

	# Set the release version!
	toml set "{{ DIR }}/Cargo.toml" package.version "{{ VER }}" > /tmp/Cargo.toml
	just _fix-chown "/tmp/Cargo.toml"
	mv "/tmp/Cargo.toml" "{{ DIR }}/Cargo.toml"


# Fix file/directory permissions.
@_fix-chmod PATH:
	[ ! -e "{{ PATH }}" ] || find "{{ PATH }}" -type f -exec chmod 0644 {} +
	[ ! -e "{{ PATH }}" ] || find "{{ PATH }}" -type d -exec chmod 0755 {} +


# Fix file/directory ownership.
@_fix-chown PATH:
	[ ! -e "{{ PATH }}" ] || chown -R --reference="{{ justfile() }}" "{{ PATH }}"


# Require Thing Exists.
[no-exit-message]
@_require PATH:
	[ -e "{{ PATH }}" ] || just _error "Missing {{ PATH }}"


# Require Program.
[no-exit-message]
@_require-app APP:
	[ -n "$(which "{{ APP }}")" ] || just _error "Missing dependency: {{ APP }}"


# Print error and exit.
[no-exit-message]
@_error MSG:
	echo "\e[1;91mError:\e[0m {{ MSG }}"
	exit 1
