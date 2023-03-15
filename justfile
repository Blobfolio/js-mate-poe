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
release_dir   := justfile_directory() + "/release"
skel_dir      := justfile_directory() + "/skel"
generated_dir := skel_dir + "/js/generated"



# Build.
@build FEATURES="":
	# Nuke any previous wasm output.
	[ ! -d "{{ release_dir }}" ] || rm -rf "{{ release_dir }}"
	[ ! -d "{{ generated_dir }}" ] || rm -rf "{{ generated_dir }}"
	mkdir "{{ release_dir }}"

	# Build One.
	fyi print -p "Stage #1" "Compile wasm binary."
	cargo build \
		--release \
		--features "{{ FEATURES }}" \
		--target wasm32-unknown-unknown \
		--target-dir "{{ cargo_dir }}"

	# Build Two.
	fyi print -p "Stage #2" "Run wasm-bindgen."
	wasm-bindgen \
		--out-dir "{{ generated_dir }}" \
		--target web \
		--no-typescript \
		--omit-default-module-path \
		--encode-into always \
		--reference-types \
		"{{ cargo_dir }}/wasm32-unknown-unknown/release/{{ pkg_id }}.wasm"

	# Patch away some tediousness from the JS.
	cd "{{ generated_dir }}" && patch -p1 -i ../js.patch

	# Build Three.
	fyi print -p "Stage #3" "Run wasm-opt."
	wasm-opt "{{ generated_dir }}/{{ pkg_id }}_bg.wasm" \
		--enable-reference-types \
		--enable-multivalue \
		-O3 -Oz \
		-o "{{ generated_dir }}/js-mate-poe.wasm"
	rm "{{ generated_dir }}/{{ pkg_id }}_bg.wasm"

	# Build Four.
	fyi print -p "Stage #4" "Compile javascript."
	just _build-js

	# Encode some things!
	channelz "{{ release_dir }}"
	just _fix-chown "{{ release_dir }}"
	just _fix-chown "{{ skel_dir }}"

	# Done!
	fyi success "Done!"


# Build Combined JS.
@_build-js:
	# Make sure we ran the other builds first.
	just _require "{{ generated_dir }}/js-mate-poe.wasm"
	just _require "{{ generated_dir }}/{{ pkg_id }}.js"

	# Base64-encode the wasm.
	echo -n "export const wasmFile = '" > "{{ generated_dir }}/wasm_file.mjs"
	cat "{{ generated_dir }}/js-mate-poe.wasm" | base64 -w0 >> "{{ generated_dir }}/wasm_file.mjs"
	echo "';" >> "{{ generated_dir }}/wasm_file.mjs"

	just _fix-chown "{{ skel_dir }}"

	# Compile the JS module into a normal script.
	google-closure-compiler \
		--env BROWSER \
		--language_in STABLE \
		--js "{{ generated_dir }}/{{ pkg_id }}.js" \
		--js "{{ generated_dir }}/wasm_file.mjs" \
		--js "{{ skel_dir }}/js/b64_to_blob.mjs" \
		--js "{{ skel_dir }}/js/entry.mjs" \
		--entry_point "{{ skel_dir }}/js/entry.mjs" \
		--js_output_file "/tmp/{{ pkg_id }}.js" \
		--assume_function_wrapper \
		--browser_featureset_year 2021 \
		--compilation_level WHITESPACE_ONLY \
		--isolation_mode NONE \
		--jscomp_off unknownDefines \
		--module_resolution BROWSER \
		--warning_level VERBOSE

	# Compress the script.
	cat "/tmp/{{ pkg_id }}.js" | \
		terser \
			-c ecma=2021,passes=25 \
			-e currentScript:document.currentScript \
			-m \
			-o "/tmp/{{ pkg_id }}.min.js"

	# Add the version header.
	cat \
		"{{ skel_dir }}/js/header.js" \
		"/tmp/{{ pkg_id }}.min.js" > "{{ release_dir }}/js-mate-poe.min.js"

	# Copy the example HTML.
	cp -a "{{ skel_dir }}/html/index.html" "{{ release_dir }}/index.html"


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

	fyi task "Features: none (default)"
	RUSTFLAGS="-D warnings" cargo clippy \
		--release \
		--target wasm32-unknown-unknown \
		--target-dir "{{ cargo_dir }}"

	fyi task "Features: director"
	RUSTFLAGS="-D warnings" cargo clippy \
		--release \
		--features director \
		--target wasm32-unknown-unknown \
		--target-dir "{{ cargo_dir }}"

	fyi task "Features: flac"
	RUSTFLAGS="-D warnings" cargo clippy \
		--release \
		--features flac \
		--target wasm32-unknown-unknown \
		--target-dir "{{ cargo_dir }}"


# Generate CREDITS.
@credits:
	cargo bashman --no-bash --no-man
	just _fix-chown "{{ justfile_directory() }}/CREDITS.md"


# Build Docs.
@doc:
	# Make the docs.
	cargo rustdoc \
		--release \
		--target x86_64-unknown-linux-gnu \
		--target-dir "{{ cargo_dir }}"

	# Move the docs and clean up ownership.
	[ ! -d "{{ doc_dir }}" ] || rm -rf "{{ doc_dir }}"
	mv "{{ cargo_dir }}/x86_64-unknown-linux-gnu/doc" "{{ justfile_directory() }}"
	just _fix-chown "{{ doc_dir }}"


# Unit tests!
@test:
	clear
	# Note: we have to target x86-64 because private tests can't be run
	# under wasm yet.
	fyi task "Features: none (default)"
	cargo test \
		--release \
		--target x86_64-unknown-linux-gnu \
		--target-dir "{{ cargo_dir }}"

	fyi task "Features: director"
	cargo test \
		--release \
		--features director \
		--target x86_64-unknown-linux-gnu \
		--target-dir "{{ cargo_dir }}"


# Get/Set version.
version:
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

	fyi success "Setting version to $_ver2."

	# Set the release version!
	just _version "{{ justfile_directory() }}" "$_ver2"

	# Set Extension Version.
	jq --arg _version "$_version" '.version = $_version' "{{ skel_dir }}/firefox/manifest.json" > /tmp/manifest.json
	mv /tmp/manifest.json "{{ skel_dir }}/firefox/manifest.json"
	just _fix-chown "{{ skel_dir }}"

	# Set JS Header Version.
	sd '@version [\d.]+' "@version $_ver2" "{{ skel_dir }}/js/header.js"


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
	[ $(command -v wasm-pack) ] || cargo install wasm-pack


# Require Thing Exists.
@_require PATH:
	[ -e "{{ PATH }}" ] || fyi error -e 1 "Missing {{ PATH }}"
