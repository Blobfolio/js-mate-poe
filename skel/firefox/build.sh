#!/bin/bash

# Look for a file we placed inside the Docker to make sure we're actually
# inside said Docker…
if [ ! -f "/etc/inside-docker" ]; then
	echo -e "\e[91;1mError:\e[0m This is mean to be run inside the Docker environment."
	exit 1
fi

# Clear previous build artifacts.
[ ! -d "dist" ] || rm -rf dist
[ ! -d "js/generated" ] || rm -rf js/generated
[ ! -d "rust/target" ] || rm -rf rust/target

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
	echo -e "\e[91;1mError:\e[0m Cargo build failed!"
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
cat \
	target/wasm32-unknown-unknown/release/snippets/**/*.js \
	target/wasm32-unknown-unknown/release/rs_mate_poe.js \
	> ../js/generated/glue.mjs

# Optimize and output the wasm to the dist dir.
wasm-opt target/wasm32-unknown-unknown/release/rs_mate_poe_bg.wasm \
	--enable-reference-types \
	-O3 \
	-o ../dist/js-mate-poe.wasm

# Now we can build the Javascript. For this, we should move back to the
# top-level directory.
cd ..

# Compile the background script.
google-closure-compiler \
	--env BROWSER \
	--language_in STABLE \
	--js "js/is_real_object.mjs" \
	--js "js/settings.mjs" \
	--js "js/background.mjs" \
	--entry_point "js/background.mjs" \
	--js_output_file "/tmp/out.js" \
	--assume_function_wrapper \
	--isolation_mode IIFE \
	--browser_featureset_year 2021 \
	--compilation_level WHITESPACE_ONLY \
	--module_resolution BROWSER \
	--warning_level VERBOSE

# Add a header and move it into place.
cat js/header.js /tmp/out.js > dist/background.js
sed -i "s/* JS Mate Poe/* JS Mate Poe: Background/g" dist/background.js

# Compile the options script.
google-closure-compiler \
	--env BROWSER \
	--language_in STABLE \
	--js "js/is_real_object.mjs" \
	--js "js/settings.mjs" \
	--js "js/options.mjs" \
	--entry_point "js/options.mjs" \
	--js_output_file "/tmp/out.js" \
	--assume_function_wrapper \
	--isolation_mode IIFE \
	--browser_featureset_year 2021 \
	--compilation_level WHITESPACE_ONLY \
	--module_resolution BROWSER \
	--warning_level VERBOSE

# Add a header and move it into place.
cat js/header.js /tmp/out.js > dist/options/options.js
sed -i "s/* JS Mate Poe/* JS Mate Poe: Options/g" dist/options/options.js

# Compile the foreground script.
google-closure-compiler \
	--env BROWSER \
	--language_in STABLE \
	--js "js/is_real_object.mjs" \
	--js "js/generated/glue.mjs" \
	--js "js/foreground.mjs" \
	--entry_point "js/foreground.mjs" \
	--js_output_file "/tmp/out.js" \
	--assume_function_wrapper \
	--isolation_mode IIFE \
	--browser_featureset_year 2021 \
	--compilation_level WHITESPACE_ONLY \
	--module_resolution BROWSER \
	--warning_level VERBOSE

# Add a header and move it into place.
cat js/header.js /tmp/out.js > dist/foreground.js
sed -i "s/* JS Mate Poe/* JS Mate Poe: Foreground/g" dist/foreground.js

# Clean up.
rm /tmp/out.js
chown -R --reference=./Dockerfile dist js/generated

# Done!
echo -e "\e[92;1mSuccess:\e[0m All done!"
echo -e "The compiled extension can be found in \e[2m./dist\e[0m."
echo "You can exit out of the Docker now."
