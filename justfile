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

pkg_id        := "rs_mate_poe"
pkg_name      := "RS Mate Poe"

cargo_dir     := "/tmp/" + pkg_id + "-cargo"
doc_dir       := justfile_directory() + "/doc"
dist_dir      := justfile_directory() + "/dist"
skel_dir      := justfile_directory() + "/skel"

cargo_release_dir := cargo_dir + "/wasm32-unknown-unknown/release"



# Build Library!
@build FEATURES="": _init
	# Dependency checks.
	just _require-app cargo
	just _require-app google-closure-compiler
	just _require-app terser

	[ ! $(command -v fyi) ] || fyi task "Building JS Mate Poe…"

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

	# Remove the unused "fetch" stuff from the glue.
	cd "{{ cargo_release_dir }}" && patch -s -p1 -i "{{ skel_dir }}/js/glue.patch"

	# Merge the snippet and glue together (in that order), and copy to our
	# local "generated" directory.
	cat \
		"$( find "{{ cargo_release_dir }}" -name glue-header.mjs -printf "%T@ %p\n" | sort -n | cut -d' ' -f 2- | tail -n 1 )" \
		"{{ cargo_release_dir }}/{{ pkg_id }}.js" \
		> "{{ skel_dir }}/js/generated/glue.mjs"

	# Run Wasm-Opt.
	wasm-opt "{{ cargo_release_dir }}/{{ pkg_id }}_bg.wasm" \
		--enable-reference-types \
		-O3 \
		-o "{{ cargo_release_dir }}/{{ pkg_id }}.opt.wasm"

	# Remove the wasm-bindgen stuff.
	rm -rf \
		"{{ cargo_release_dir }}/{{ pkg_id }}_bg.wasm" \
		"{{ cargo_release_dir }}/{{ pkg_id }}.js"

	# Base64-encode the optimized wasm and throw it into a quickie JS module
	# so we can easily access it from our entry point.
	echo -n "export const wasmBase64 = '" > "{{ skel_dir }}/js/generated/wasm_base64.mjs"
	cat "{{ cargo_release_dir }}/{{ pkg_id }}.opt.wasm" | base64 -w0 >> "{{ skel_dir }}/js/generated/wasm_base64.mjs"
	echo "';" >> "{{ skel_dir }}/js/generated/wasm_base64.mjs"

	# Transpile the JS to a temporary location.
	google-closure-compiler \
		--env BROWSER \
		--language_in STABLE \
		--js "{{ skel_dir }}/js/generated/glue.mjs" \
		--js "{{ skel_dir }}/js/generated/wasm_base64.mjs" \
		--js "{{ skel_dir }}/js/base64_to_uint8.mjs" \
		--js "{{ skel_dir }}/js/library.mjs" \
		--entry_point "{{ skel_dir }}/js/library.mjs" \
		--js_output_file "/tmp/library.js" \
		--assume_function_wrapper \
		--browser_featureset_year 2021 \
		--compilation_level WHITESPACE_ONLY \
		--isolation_mode NONE \
		--jscomp_off unknownDefines \
		--module_resolution BROWSER \
		--warning_level VERBOSE

	# Compress and enclose the temporary JS into _another_ temporary file.
	cat "/tmp/library.js" | \
		terser \
			-c ecma=2021,passes=25 \
			-e currentScript:document.currentScript \
			-m \
			-o "/tmp/library.min.js"

	# Add a header to the JS and move it into place, along with the demo HTML
	# index file.
	cat "{{ skel_dir }}/js/header.js" "/tmp/library.min.js" > "{{ dist_dir }}/js-mate-poe.min.js"
	cp "{{ skel_dir }}/html/index.html" "{{ dist_dir }}"

	# Gzip/Brotli the JS.
	[ ! $(command -v channelz) ] || channelz "{{ dist_dir }}/js-mate-poe.min.js"

	# Clean up.
	rm /tmp/library*.js
	just _fix-chown "{{ dist_dir }}"

	[ ! $(command -v fyi) ] || fyi success "Built JS Mate Poe!"


# Build Firefox Extension Build Environment.
@build-firefox-src:
	# Dependency check.
	just _require-app cargo

	[ ! $(command -v fyi) ] || fyi task "Building Firefox Extension Build Environment…"

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
	cp "{{ skel_dir }}/js/imports.mjs" "{{ dist_dir }}/js-mate-poe_firefox/rust/skel/js"
	cp -aR "{{ skel_dir }}/scss" "{{ dist_dir }}/js-mate-poe_firefox/rust/skel/scss"
	cp -aR "{{ justfile_directory() }}/src" "{{ dist_dir }}/js-mate-poe_firefox/rust/src"

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

	[ ! $(command -v fyi) ] || fyi success "Built Firefox Extension Build Environment!"


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

	[ ! $(command -v fyi) ] || fyi task "Features: none (default)"
	RUSTFLAGS="-D warnings" cargo clippy \
		--release \
		--target wasm32-unknown-unknown \
		--target-dir "{{ cargo_dir }}"

	[ ! $(command -v fyi) ] || fyi task "Features: director"
	RUSTFLAGS="-D warnings" cargo clippy \
		--release \
		--features director \
		--target wasm32-unknown-unknown \
		--target-dir "{{ cargo_dir }}"

	[ ! $(command -v fyi) ] || fyi task "Features: firefox"
	RUSTFLAGS="-D warnings" cargo clippy \
		--release \
		--features firefox \
		--target wasm32-unknown-unknown \
		--target-dir "{{ cargo_dir }}"


# Unit tests!
@test:
	clear
	# Note: we have to target x86-64 because private tests can't be run
	# under wasm yet.
	[ ! $(command -v fyi) ] || fyi task "Features: none (default)"
	cargo test \
		--release \
		--target x86_64-unknown-linux-gnu \
		--target-dir "{{ cargo_dir }}"

	[ ! $(command -v fyi) ] || fyi task "Features: director"
	cargo test \
		--release \
		--features director \
		--target x86_64-unknown-linux-gnu \
		--target-dir "{{ cargo_dir }}"

	[ ! $(command -v fyi) ] || fyi task "Features: firefox"
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

	[ ! $(command -v fyi) ] || fyi success "Setting version to $_ver2."

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


# Initialization.
@_init:
	[ $(command -v wasm-bindgen) ] || cargo install wasm-bindgen-cli
	[ $(command -v wasm-opt) ] || cargo install wasm-opt


# Require Thing Exists.
@_require PATH:
	[ -e "{{ PATH }}" ] || just _error "Missing {{ PATH }}"


# Require Program.
@_require-app APP:
	[ $(command -v "{{ APP }}") ] || just _error "Missing dependency: {{ APP }}"


# Print error and exit.
@_error MSG:
	[ ! $(command -v fyi) ] || fyi error -e 1 "{{ MSG }}"
	[ $(command -v fyi) ] || echo "{{ MSG }}"
	exit 1
