##
# Taskrunner
#
# This requires "just". See https://github.com/casey/just for more
# details.
#
# USAGE:
#   just --list
#   just <task>
##

base_dir  := `realpath $PWD`
dist_dir  := base_dir + "/dist"
src_dir   := base_dir + "/src"



##     ##
# BUILD #
##     ##

# Build site!
@build: _check_dependencies
	just _header "Building JS Mate Poe!"

	just _watch_css
	just _watch_js

	# Done!
	just _success "JS Mate Poe has been built: {{ dist_dir }}"


# Watch for changes to JS files.
@watch: _check_dependencies
	just _header "Watching for Changes"

	watchexec --postpone --no-shell --watch "{{ src_dir }}/css" --debounce 1000 --exts css -- just _watch_css & \
	watchexec --postpone --no-shell --watch "{{ src_dir }}/js" --debounce 1000 --exts mjs -- just _watch_js


# CSS build task(s).
@_watch_css:
	just _css_to_js


# JS build task(s).
@_watch_js:
	just _eslint

	just _google-closure-compiler "{{ src_dir }}/js/00.mjs" "{{ dist_dir }}/js-mate-poe.min.js"
	just _google-closure-compiler "{{ src_dir }}/js/01.mjs" "{{ dist_dir }}/demo.min.js"

	just _brotli "{{ dist_dir }}" "js"
	just _gzip "{{ dist_dir }}" "js"

	just _notify "JS is looking good!"



##   ##
# CSS #
##   ##

# CSSO.
@_csso:
	just _header "Minifying CSS."

	find "{{ src_dir }}/css" -name "*.css" -type f -print0 | \
		sort -z | \
		xargs -0 -I {} npx csso -i "{}" -o "{}.tmp"


# Build a JS module from the CSS.
@_css_to_js: _csso
	just _header "Rebuilding CSS module."

	# Make sure we have compressed files to use.
	[ -f "{{ src_dir }}/css/00.css.tmp" ] || just _die "Missing minified CSS."
	[ -f "{{ src_dir }}/css/01.css.tmp" ] || just _die "Missing minified CSS."

	# Start it.
	cp -a "{{ src_dir }}/skel/css.mjs" "{{ src_dir }}/skel/css.tmp"

	# The main CSS.
	echo '/**' >> "{{ src_dir }}/skel/css.tmp"
	echo ' * Main CSS' >> "{{ src_dir }}/skel/css.tmp"
	echo ' *' >> "{{ src_dir }}/skel/css.tmp"
	echo ' * @const {string}' >> "{{ src_dir }}/skel/css.tmp"
	echo ' */' >> "{{ src_dir }}/skel/css.tmp"
	echo "export const CSS = \`$( cat "{{ src_dir }}/css/00.css.tmp" )\`;" >> "{{ src_dir }}/skel/css.tmp"
	rm "{{ src_dir }}/css/00.css.tmp"

	echo '' >> "{{ src_dir }}/skel/css.tmp"

	# The debug CSS.
	echo '/**' >> "{{ src_dir }}/skel/css.tmp"
	echo ' * Debug CSS' >> "{{ src_dir }}/skel/css.tmp"
	echo ' *' >> "{{ src_dir }}/skel/css.tmp"
	echo ' * @const {string}' >> "{{ src_dir }}/skel/css.tmp"
	echo ' */' >> "{{ src_dir }}/skel/css.tmp"
	echo "export const DEBUG_CSS = \`$( cat "{{ src_dir }}/css/01.css.tmp" )\`;" >> "{{ src_dir }}/skel/css.tmp"
	rm "{{ src_dir }}/css/01.css.tmp"

	# Move the file to its normal place!
	mv "{{ src_dir }}/skel/css.tmp" "{{ src_dir }}/js/css.mjs"


##          ##
# JAVASCRIPT #
##          ##

# Eslint.
@_eslint:
	just _header "Linting Javascript."
	npx eslint --color "{{ src_dir }}/js"/*.mjs


# Eslint Fix.
@_eslint-fix:
	just _header "Fixing Javascript."
	npx eslint --color --fix "{{ src_dir }}/js"/*.mjs || true

# Closure Compiler.
@_google-closure-compiler IN OUT:
	just _header "Compiling $( basename "{{ IN }}" )."

	npx google-closure-compiler \
		--env BROWSER \
		--language_in STABLE \
		--language_out STABLE \
		--js "{{ src_dir }}/js"/*.mjs \
		--js_output_file "{{ OUT }}" \
		--jscomp_off unknownDefines \
		--assume_function_wrapper \
		--compilation_level ADVANCED \
		--entry_point "{{ IN }}" \
		--browser_featureset_year 2019 \
		--isolation_mode IIFE \
		--module_resolution BROWSER \
		--strict_mode_input \
		--use_types_for_optimization \
		--warning_level VERBOSE

	# Generate a truly final version.
	cat "{{ src_dir }}/skel/js-mate-poe.min.js" "{{ OUT }}" > "{{ src_dir }}/js/tmp.js"
	mv "{{ src_dir }}/js/tmp.js" "{{ OUT }}"



##     ##
# OTHER #
##     ##

# Compress files with Brotli.
@_brotli DIR EXT:
	just _info "Generating static Brotli files."

	[ -d "{{ DIR }}" ] || just _die "Invalid directory: {{ DIR }}"
	[ ! -z "{{ EXT }}" ] || just _die "An extension is required."

	# Remove existing Brotli files.
	find "{{ DIR }}" -name "*.br" -type f -delete

	# Encode!
	find "{{ DIR }}" -iname "*.{{ EXT }}" -type f -print0 | xargs -0 brotli -q 11


# Compress files with Gzip.
@_gzip DIR EXT:
	just _info "Generating static Gzip files."

	[ -d "{{ DIR }}" ] || just _die "Invalid directory: {{ DIR }}"
	[ ! -z "{{ EXT }}" ] || just _die "An extension is required."

	# Remove existing Gzip files.
	find "{{ DIR }}" -name "*.gz" -type f -delete

	# Encode!
	find "{{ DIR }}" -iname "*.{{ EXT }}" -type f -print0 | xargs -0 gzip -k -9



##           ##
# DEPENENCIES #
##           ##

# Install system requirements.
@_check_dependencies:
	just _header "Starting Up"
	just _info "Checking runtime dependencies."

	# WGET.
	[ $( command -v wget ) ] || just _install-os "wget"

	# Brotli.
	[ $( command -v brotli ) ] || just _install-os "brotli"

	# Gzip.
	[ $( command -v gzip ) ] || just _install-os "gzip"

	# Watchexec.
	[ $( command -v watchexec ) ] || just _install-cargo "watchexec"

	# Make sure we have NPM.
	[ $( command -v npm ) ] || just _die "NPM is required."

	# The lightest Node check.
	[ -d "{{ base_dir }}/node_modules" ] || npm i


# Install Apt application.
@_install-apt THING:
	just _header "Installing {{ THING }} via Apt"

	[ $( command -v "apt-get" ) ] || just _die "apt-get is required to install {{ THING }}."

	sudo apt-get update && sudo apt-get install {{ THING }} -y
	[ $( command -v "{{ THING }}" ) ] || exit 1

	just _success "{{ THING }} has been installed."


# Install Homebrew application.
@_install-brew THING:
	just _header "Installing {{ THING }} via Homebrew"

	[ $( command -v brew ) ] || just _die "Homebrew is required to install {{ THING }}."

	brew install {{ THING }}
	[ $( command -v "{{ THING }}" ) ] || exit 1

	just _success "{{ THING }} has been installed."


# Install Cargo application.
@_install-cargo THING:
	just _header "Installing {{ THING }} via Cargo"

	# Cargo
	[ $( command -v cargo ) ] || just _die "Cargo is required to install {{ THING }}."

	cargo install {{ THING }} --force
	[ $( command -v "{{ THING }}" ) ] || exit 1

	just _success "{{ THING }} has been installed."


# OS Install.
_install-os THING:
	#!/usr/bin/env bash
	if [ "linux" = "{{ os() }}" ]; then
		just _install-apt "{{ THING }}"
	elif [ "macos" = "{{ os() }}" ]; then
		just _install-brew "{{ THING }}"
	else
		just _error "Unsupported operating system."
		exit 1
	fi

	[ $( command -v {{ THING }} ) ] || exit 1



##             ##
# NOTIFICATIONS #
##             ##

# Task header.
@_header TASK:
	echo "\e[34;1m[Task] \e[0;1m{{ TASK }}\e[0m"

# Echo an informational comment.
@_info COMMENT:
	echo "\e[95;1m[Info] \e[0;1m{{ COMMENT }}\e[0m"

# Echo an error.
@_error COMMENT:
	>&2 echo "\e[31;1m[Error] \e[0;1m{{ COMMENT }}\e[0m"

# Error and exit.
@_die COMMENT:
	just _error "{{ COMMENT }}"
	exit 1

# Echo a success.
@_success COMMENT:
	echo "\e[92;1m[Success] \e[0;1m{{ COMMENT }}\e[0m"

# Fancy bubble notification for Linux.
@_notify COMMENT:
	[ ! $( command -v "notify-send" ) ] || notify-send -i "{{ src_dir }}/img/icon.png" --category dev.validate -h int:transient:1 -t 3000 "JS Mate Poe" "{{ COMMENT }}"
