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

cargo_release_dir := cargo_dir + "/wasm32-unknown-unknown/release"

release_ext_dir := release_dir + "/firefox"

generated_dir     := skel_dir + "/js/generated"
generated_lib_dir := generated_dir + "/lib"
generated_ext_dir := generated_dir + "/ext"

release_cargo := cargo_release_dir + "/" + pkg_id + ".wasm"
release_wasm  := cargo_release_dir + "/js-mate-poe.wasm"
release_js    := cargo_release_dir + "/js-mate-poe.js"

generated_ext_js   := generated_ext_dir + "/glue.mjs"
generated_lib_wasm := generated_lib_dir + "/wasm_base64.mjs"
generated_lib_js   := generated_lib_dir + "/glue.mjs"



# Build.
@build FEATURES="": _build-pre
	just _build-library "{{ FEATURES }}"
	just _build-firefox

	# Clean up.
	just _fix-chown "{{ release_dir }}"
	just _fix-chown "{{ generated_dir }}"
	just _fix-chmod "{{ justfile_directory() }}"


# Pre-Build.
@_build-pre:
	# (Re)create generated asset and release directories.
	[ ! -d "{{ generated_dir }}" ] || rm -rf "{{ generated_dir }}"
	[ ! -d "{{ release_dir }}" ] || rm -rf "{{ release_dir }}"
	mkdir -p \
		"{{ release_ext_dir }}/sound" \
		"{{ release_ext_dir }}/image" \
		"{{ generated_lib_dir }}" \
		"{{ generated_ext_dir }}"


# Build: Rust.
@_build-rust FEATURES="":
	# Cargo.
	cargo build \
		--release \
		--features "{{ FEATURES }}" \
		--target wasm32-unknown-unknown \
		--target-dir "{{ cargo_dir }}"

	# Snip Snip.
	wasm-snip \
		--snip-rust-panicking-code \
		-o "{{ release_cargo }}" \
		"{{ release_cargo }}"

	# Wasm-Bindgen.
	wasm-bindgen \
		--out-dir "{{ cargo_release_dir }}" \
		--target web \
		--no-typescript \
		--omit-default-module-path \
		--encode-into always \
		--reference-types \
		"{{ release_cargo }}"

	# Rename the JS.
	mv "{{ cargo_release_dir }}/{{ pkg_id }}.js" "{{ release_js }}"

	# Wasm-Opt.
	wasm-opt "{{ cargo_release_dir }}/{{ pkg_id }}_bg.wasm" \
		--enable-reference-types \
		--enable-multivalue \
		-O3 \
		-o "{{ release_wasm }}"


# Build: Library.
@_build-library FEATURES="":
	fyi task "Building JS library…"
	just _build-rust "{{ FEATURES }}"

	# Base64-encode the wasm.
	echo -n "export const wasmBase64 = '" > "{{ generated_lib_wasm }}"
	cat "{{ release_wasm }}" | base64 -w0 >> "{{ generated_lib_wasm }}"
	echo "';" >> "{{ generated_lib_wasm }}"

	# Patch and copy the bindgen glue.
	cd "{{ cargo_release_dir }}" && patch -s -p1 -i "{{ skel_dir }}/js/js.patch"
	cp "{{ release_js }}" "{{ generated_lib_js }}"

	# Compile the JS module into a normal script.
	google-closure-compiler \
		--env BROWSER \
		--language_in STABLE \
		--js "{{ generated_lib_js }}" \
		--js "{{ generated_lib_wasm }}" \
		--js "{{ skel_dir }}/js/base64_to_uint8array.mjs" \
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

	# Compress and wrap the script.
	cat "/tmp/library.js" | \
		terser \
			-c ecma=2021,passes=25 \
			-e currentScript:document.currentScript \
			-o "/tmp/library.min.js"

	# Copy into place.
	just _build-js-header "/tmp/library.min.js" "{{ release_dir }}/js-mate-poe.min.js"
	cp "{{ skel_dir }}/html/index.html" "{{ release_dir }}"
	channelz "{{ release_dir }}"

	# Clean up.
	rm /tmp/*.js
	fyi success "Built JS library!"


# Build: Firefox Extension.
@_build-firefox:
	fyi task "Building Firefox extension…"
	just _build-rust firefox

	# Copy most assets more or less as-are.
	cp "{{ release_js }}" "{{ generated_ext_js }}"
	cp "{{ release_wasm }}" "{{ release_ext_dir }}/js-mate-poe.wasm"
	cp "{{ skel_dir }}/firefox/manifest.json" "{{ release_ext_dir }}"
	cp "{{ skel_dir }}/img/icons/"*.svg "{{ release_ext_dir }}/image"
	cp "{{ skel_dir }}/sound/"*.flac "{{ release_ext_dir }}/sound"

	# Build the foreground script.
	google-closure-compiler \
		--env BROWSER \
		--language_in STABLE \
		--js "{{ generated_ext_js }}" \
		--js "{{ skel_dir }}/js/firefox-fg.mjs" \
		--entry_point "{{ skel_dir }}/js/firefox-fg.mjs" \
		--js_output_file "/tmp/foreground.js" \
		--assume_function_wrapper \
		--browser_featureset_year 2021 \
		--compilation_level WHITESPACE_ONLY \
		--isolation_mode NONE \
		--jscomp_off unknownDefines \
		--module_resolution BROWSER \
		--warning_level VERBOSE

	# Compress, wrap, but don't mangle it.
	cat "/tmp/foreground.js" | \
		terser \
			-c ecma=2021,passes=25 \
			-e browser:browser \
			-m \
			-o "/tmp/foreground.min.js"

	just _build-js-header "{{ skel_dir }}/js/firefox-bg.js" "{{ release_ext_dir }}/background.js"
	sd -s "JS Mate Poe" "JS Mate Poe: Background" "{{ release_ext_dir }}/background.js"

	just _build-js-header "/tmp/foreground.min.js" "{{ release_ext_dir }}/foreground.js"
	sd -s "JS Mate Poe" "JS Mate Poe: Foreground" "{{ release_ext_dir }}/foreground.js"

	# Clean up.
	rm /tmp/*.js
	fyi success "Built Firefox extension!"


# Build: Append JS Header.
@_build-js-header SRC DST:
	just _require "{{ SRC }}"
	cat "{{ skel_dir }}/js/header.js" "{{ SRC }}" > "{{ DST }}"


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

	fyi task "Features: firefox"
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

	fyi task "Features: firefox"
	cargo test \
		--release \
		--features firefox \
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
	sd '"version": "[\d.]+"' "\"version\": \"$_ver2\"" "{{ skel_dir }}/firefox/manifest.json"

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
	[ $(command -v wasm-bindgen) ] || cargo install wasm-bindgen-cli
	[ $(command -v wasm-opt) ] || cargo install wasm-opt
	[ $(command -v wasm-snip) ] || cargo install wasm-snip


# Require Thing Exists.
@_require PATH:
	[ -e "{{ PATH }}" ] || fyi error -e 1 "Missing {{ PATH }}"
