#!/bin/bash

# Look for a file we placed inside the Docker to make sure we're actually
# inside said Docker…
if [ ! -f "/etc/inside-docker" ]; then
	echo "This is mean to be run inside the Docker environment."
	exit 1
fi

# Clear previous build artifacts.
[ ! -d dist ] || rm -rf dist
[ ! -d js/generated ] || rm -rf js/generated
[ ! -d target ] || rm -rf target

# Regenerate the output folders.
cp -aR static dist
mkdir js/generated

# Build Rust first. The commands need to be run from inside the "rust" folder,
# so let's move there before we do anything else.
cd rust

# Basic cargo build pass.
cargo build \
	--release \
	--features firefox \
	--target wasm32-unknown-unknown

# This is the only piece that is likely to fail; let's make sure the output
# file was created before continuing.
if [ ! -f "target/wasm32-unknown-unknown/release/rs_mate_poe.wasm" ]; then
	echo "That didn't work!"
	exit 1
fi

# Generate bindings.
wasm-bindgen \
	--out-dir target/wasm32-unknown-unknown/release \
	--target web \
	--no-typescript \
	--omit-default-module-path \
	--encode-into always \
	--reference-types \
	target/wasm32-unknown-unknown/release/rs_mate_poe.wasm

# Copy the glue for later.
cp target/wasm32-unknown-unknown/release/rs_mate_poe.js ../js/generated/glue.mjs

# Optimize and output the wasm to the dist dir.
wasm-opt target/wasm32-unknown-unknown/release/rs_mate_poe_bg.wasm \
	--enable-reference-types \
	--enable-multivalue \
	-O3 \
	-o ../dist/js-mate-poe.wasm

# Now we can build the Javascript. For this, we should move back to the
# top-level directory.
cd ..

# The background script has no dependencies, so we can just chuck a header on
# top and copy it into place.
cat js/header.js js/background.mjs > dist/background.js
sed -i "s/* JS Mate Poe/* JS Mate Poe: Background/g" dist/background.js

# The foreground, however, does have dependencies, so we need to run
# google-closure-compiler to flatten it into a regular ol' script.
google-closure-compiler \
	--env BROWSER \
	--language_in STABLE \
	--js "js/generated/glue.mjs" \
	--js "js/foreground.mjs" \
	--entry_point "js/foreground.mjs" \
	--js_output_file "/tmp/foreground.js" \
	--assume_function_wrapper \
	--browser_featureset_year 2021 \
	--compilation_level WHITESPACE_ONLY \
	--isolation_mode NONE \
	--jscomp_off unknownDefines \
	--module_resolution BROWSER \
	--warning_level VERBOSE

# As with the background, we just need to chuck a header onto it and copy it
# over.
cat js/header.js /tmp/foreground.js > dist/foreground.js
sed -i "s/* JS Mate Poe/* JS Mate Poe: Foreground/g" dist/foreground.js

# Fix permissions. (Docker is probably running as root.)
chown -R --reference=./Dockerfile dist js/generated

# Done!
echo "All done!"
echo "The compiled extension can be found in the 'dist' folder!"
echo "You can exit out of the Docker now."
