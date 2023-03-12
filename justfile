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

pkg_id      := "rs_mate_poe"
pkg_name    := "RS Mate Poe"

cargo_dir   := "/tmp/" + pkg_id + "-cargo"
doc_dir     := justfile_directory() + "/doc"
release_dir := justfile_directory() + "/release"
skel_dir    := justfile_directory() + "/skel"
wasm_dir    := release_dir + "/wasm"



# Build.
@build FEATURES="":
	# Nuke any previous wasm output.
	[ ! -d "{{ wasm_dir }}" ] || rm -rf "{{ wasm_dir }}"
	[ ! -d "{{ skel_dir }}/js/wasm" ] || rm -rf "{{ skel_dir }}/js/wasm"
	mkdir "{{ wasm_dir }}"

	# Build One.
	fyi print -p "Stage #1" "Compile wasm binary."
	[ -z "{{ FEATURES }}" ] || cargo build \
		--release \
		--features "{{ FEATURES }}" \
		--target wasm32-unknown-unknown \
		--target-dir "{{ cargo_dir }}"
	[ ! -z "{{ FEATURES }}" ] || cargo build \
		--release \
		--target wasm32-unknown-unknown \
		--target-dir "{{ cargo_dir }}"

	# Build Two.
	fyi print -p "Stage #2" "Run wasm-bindgen."
	wasm-bindgen \
		--out-dir "{{ skel_dir }}/js/wasm" \
		--target web \
		--no-typescript \
		--omit-default-module-path \
		--encode-into always \
		--reference-types \
		"{{ cargo_dir }}/wasm32-unknown-unknown/release/{{ pkg_id }}.wasm"

	# Build Three.
	fyi print -p "Stage #3" "Run wasm-opt."
	wasm-opt "{{ skel_dir }}/js/wasm/{{ pkg_id }}_bg.wasm" \
		--enable-reference-types \
		--enable-multivalue \
		-O3 -Oz \
		-o "{{ wasm_dir }}/js-mate-poe.wasm"

	# Build Four.
	fyi print -p "Stage #4" "Compile and minify JS bootstrap."
	just _build-js

	# Done!
	just _fix-chown "{{ release_dir }}"
	just _fix-chown "{{ skel_dir }}"
	fyi success "Done!"


# Build JS.
@_build-js:
	# Make sure we ran build first.
	[ -d "{{ wasm_dir }}" ] || fyi error -e 1 "Missing {{ wasm_dir }}"
	[ -f "{{ skel_dir }}/js/wasm/{{ pkg_id }}.js" ] || fyi error -e 1 "Missing {{ pkg_id }}.js"

	# Remove this long-ass console message from the JS.
	sd -s 'console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);' '' \
		"{{ skel_dir }}/js/wasm/{{ pkg_id }}.js"

	# Compile the JS module into a normal script.
	google-closure-compiler \
		--env BROWSER \
		--language_in STABLE \
		--js "{{ skel_dir }}/js/wasm/{{ pkg_id }}.js" \
		--js "{{ skel_dir }}/js/entrypoint.mjs" \
		--js_output_file "/tmp/{{ pkg_id }}.js" \
		--compilation_level WHITESPACE_ONLY \
		--entry_point "{{ skel_dir }}/js/entrypoint.mjs" \
		--browser_featureset_year 2021 \
		--isolation_mode IIFE \
		--module_resolution BROWSER \
		--warning_level VERBOSE

	# Compress the script.
	cat "/tmp/{{ pkg_id }}.js" | \
		terser -c ecma=2021,passes=25 -m -o "/tmp/{{ pkg_id }}.min.js"

	# Add the version header.
	cat \
		"$( find "{{ cargo_dir }}/wasm32-unknown-unknown/release" -name 'header.js' -type f -printf "%T@ %p\n"  | sort -n | cut -d' ' -f 2- | tail -n 1 )" \
		"/tmp/{{ pkg_id }}.min.js" > "{{ wasm_dir }}/js-mate-poe.min.js"

	channelz "{{ release_dir }}"


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
	# Make sure nightly is installed; this version generates better docs.
	# env RUSTUP_PERMIT_COPY_RENAME=true rustup install nightly

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


# Set version for real.
@_version DIR VER:
	[ -f "{{ DIR }}/Cargo.toml" ] || exit 1

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
