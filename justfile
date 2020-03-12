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

src_dir    := justfile_directory() + "/src"
dist_dir   := justfile_directory() + "/dist"
demo_dir   := dist_dir + "/demo"
test_dir   := justfile_directory() + "/test"
tmp_dir    := "/tmp"

docker_sig := "/opt/righteous-sandbox.version"



##          ##
# MAIN TASKS #
##          ##

# Build site!
@build RELEASE="": _only-docker
	# Clear the screen so we can see what's relevant.
	clear

	# Keep track of time.
	echo "$( date +%s )" > "{{ tmp_dir }}/build.time"

	just _header "Building JS Mate Poe!"
	echo ""

	just _build-scss
	just _build-js

	# Clear old Gzip/Brotli files.
	find "{{ dist_dir }}" \( -name "*.br" -o -name '*.gz' \) -type f -delete

	# If releasing, redo Gzip/Brotli files.
	[ -z "{{ RELEASE }}" ] || just _build-encode

	just _fix-chmod "{{ dist_dir }}"
	just _fix-chown "{{ dist_dir }}"

	just _build-success


# Run unit tests.
@test: _no-docker
	just _header "Unit tests!"
	karma start \
		--single-run \
		--browsers ChromeHeadless \
		"{{ justfile_directory() }}/karma.conf.js"
	just _notify "Unit tests are looking good!"


# Watch for changes to JS files.
@watch: _only-docker
	just _header "Watching for Changes"

	watchexec \
		--postpone \
		--no-shell \
		--watch "{{ src_dir }}" \
		--debounce 1000 \
		--exts mjs,scss -- just build


##        ##
# BUILDING #
##        ##

# Compile JS Mate Poe Demo.
@_build-demo:
	just _info "Compiling JS Mate Poe Demo"

	# The main demo.
	google-closure-compiler \
		--env BROWSER \
		--language_in STABLE \
		--language_out STABLE \
		--externs "{{ src_dir }}/js/demo/externs.js" \
		--js "{{ src_dir }}/js/core.mjs" \
		--js "{{ src_dir }}/js/core/**.mjs" \
		--js "{{ src_dir }}/js/middleware/universe.browser.mjs" \
		--js "{{ src_dir }}/js/demo/**.mjs" \
		--js "!{{ src_dir }}/js/demo/app-director.mjs" \
		--js_output_file "{{ demo_dir }}/assets/demo.min.js" \
		--jscomp_off globalThis \
		--jscomp_off unknownDefines \
		--assume_function_wrapper \
		--compilation_level ADVANCED \
		--entry_point "{{ src_dir }}/js/demo/app-demo.mjs" \
		--browser_featureset_year 2019 \
		--isolation_mode IIFE \
		--module_resolution BROWSER \
		--strict_mode_input \
		--use_types_for_optimization \
		--warning_level VERBOSE

	# The director tool.
	google-closure-compiler \
		--env BROWSER \
		--language_in STABLE \
		--language_out STABLE \
		--externs "{{ src_dir }}/js/demo/externs.js" \
		--js "{{ src_dir }}/js/core.mjs" \
		--js "{{ src_dir }}/js/core/**.mjs" \
		--js "{{ src_dir }}/js/middleware/universe.browser.mjs" \
		--js "{{ src_dir }}/js/demo/**.mjs" \
		--js "!{{ src_dir }}/js/demo/app-demo.mjs" \
		--js_output_file "{{ demo_dir }}/assets/director.min.js" \
		--jscomp_off globalThis \
		--jscomp_off unknownDefines \
		--assume_function_wrapper \
		--compilation_level ADVANCED \
		--entry_point "{{ src_dir }}/js/demo/app-director.mjs" \
		--browser_featureset_year 2019 \
		--isolation_mode IIFE \
		--module_resolution BROWSER \
		--strict_mode_input \
		--use_types_for_optimization \
		--warning_level VERBOSE

	# Fix up the outputs.
	just _build-js-header "{{ demo_dir }}/assets/demo.min.js"
	just _build-js-header "{{ demo_dir }}/assets/director.min.js"


# Run static encoding.
@_build-encode:
	# Tackle Brotli.
	just _info "Encoding Brotli."
	find "{{ dist_dir }}" \( \
		-name '*.css' -o \
		-name '*.html' -o \
		-name '*.js' \
		\) \
		-type f \
		-print0 | \
		parallel -0 brotli -q 11

	# Tackle Gzip.
	just _info "Encoding Gzip."
	find "{{ dist_dir }}" \( \
		-name '*.css' -o \
		-name '*.html' -o \
		-name '*.js' \
		\) \
		-type f \
		-print0 | \
		parallel -0 gzip -k -9


# JS build task(s).
@_build-js:
	just _eslint

	just _build-js-chain
	just _build-js-mate-poe
	just _build-demo


# Build a JS module from the CSS.
@_build-js-css:
	# JS-Mate-Poe.
	[ -f "{{ tmp_dir }}/js-mate-poe.css" ] || just _die "Missing js-mate-poe.css."
	cp -a "{{ src_dir }}/skel/css.js-mate-poe.mjs" "{{ tmp_dir }}/css.tmp"
	echo "export const CssUrl = URL.createObjectURL(new Blob(['$( cat "{{ tmp_dir }}/js-mate-poe.css" )'], {type: 'text/css'}));" >> "{{ tmp_dir }}/css.tmp"
	mv "{{ tmp_dir }}/css.tmp" "{{ src_dir }}/js/js-mate-poe/css.url.mjs"
	just _fix-chown "{{ src_dir }}/js/js-mate-poe/css.url.mjs"


# Pull JS Chain.
@_build-js-chain:
	# Vue JS.
	[ -f "{{ demo_dir }}/assets/vue.min.js" ] || wget -q \
		-O "{{ demo_dir }}/assets/vue.min.js" \
		"https://raw.githubusercontent.com/vuejs/vue/dev/dist/vue.min.js"


# Compile JS header.
@_build-js-header OUT:
	cat "{{ src_dir }}/skel/header.min.js" "{{ OUT }}" > "{{ src_dir }}/js/tmp.js"
	mv "{{ src_dir }}/js/tmp.js" "{{ OUT }}"


# Compile JS Mate Poe.
@_build-js-mate-poe:
	just _info "Compiling JS Mate Poe"

	google-closure-compiler \
		--env BROWSER \
		--language_in STABLE \
		--language_out STABLE \
		--js "{{ src_dir }}/js/core.mjs" \
		--js "{{ src_dir }}/js/core/**.mjs" \
		--js "{{ src_dir }}/js/middleware/universe.browser.mjs" \
		--js "{{ src_dir }}/js/middleware/assets.url.mjs" \
		--js "{{ src_dir }}/js/js-mate-poe/**.mjs" \
		--js_output_file "{{ dist_dir }}/js-mate-poe.min.js" \
		--jscomp_off unknownDefines \
		--assume_function_wrapper \
		--compilation_level ADVANCED \
		--dependency_mode PRUNE \
		--entry_point "{{ src_dir }}/js/js-mate-poe/app.mjs" \
		--browser_featureset_year 2019 \
		--isolation_mode IIFE \
		--module_resolution BROWSER \
		--strict_mode_input \
		--use_types_for_optimization \
		--warning_level VERBOSE

	just _build-js-header "{{ dist_dir }}/js-mate-poe.min.js"


# CSS build task(s).
@_build-scss:
	just _info "Compiling CSS."

	just _sassc "{{ src_dir }}/scss/js-mate-poe.scss" \
		"{{ tmp_dir }}/js-mate-poe.css"
	just _sassc "{{ src_dir }}/scss/demo.scss" \
		"{{ demo_dir }}/assets/demo.css"
	just _sassc "{{ src_dir }}/scss/director.scss" \
		"{{ demo_dir }}/assets/director.css"

	just _build-js-css


# Print build success message (with elapsed time).
_build-success:
	#!/usr/bin/env bash

	if [ ! -f "{{ tmp_dir }}/build.time" ]; then
		just _success "Build complete!"
		exit 0
	fi

	declare -i _then
	declare -i _now
	declare -i _elapsed
	_then=$( cat "{{ tmp_dir }}/build.time" )
	_now=$( date +%s )
	_elapsed=$_now-$_then

	rm "{{ tmp_dir }}/build.time"
	echo ""
	just _success "Built in $_elapsed seconds!"



##     ##
# TOOLS #
##     ##

# CSSO.
@_csso IN OUT:
	csso -i "{{ IN }}" -o "{{ OUT }}"


# Eslint.
@_eslint:
	just _info "Linting Javascript."
	eslint \
		--color \
		--resolve-plugins-relative-to "/usr/lib/node_modules" \
		"{{ src_dir }}/js"/**/*.mjs


# Eslint Fix.
@_eslint-fix:
	just _info "Fixing Javascript."
	eslint \
		--color \
		--resolve-plugins-relative-to "/usr/lib/node_modules" \
		--fix \
		"{{ src_dir }}/js"/**/*.mjs || true


# SASSC.
@_sassc IN OUT:
	sassc --style=compressed "{{ IN }}" "{{ OUT }}"
	just _csso "{{ OUT }}" "{{ OUT }}"



##     ##
# OTHER #
##     ##

# Fix file/directory permissions.
@_fix-chmod PATH:
	[ ! -e "{{ PATH }}" ] || find "{{ PATH }}" -type f -exec chmod 0644 {} +
	[ ! -e "{{ PATH }}" ] || find "{{ PATH }}" -type d -exec chmod 0755 {} +


# Fix file/directory ownership.
@_fix-chown PATH:
	[ ! -e "{{ PATH }}" ] || chown -R --reference="{{ justfile() }}" "{{ PATH }}"


# Init.
@_init: _only-docker
	[ ! -f "{{ demo_dir }}/assets/vue.min.js" ] || rm "{{ demo_dir }}/assets/vue.min.js"
	[ ! -d "{{ justfile_directory() }}/node_modules" ] || rm -rf "{{ justfile_directory() }}/node_modules"
	[ ! -f "{{ justfile_directory() }}/package-lock.json" ] || rm "{{ justfile_directory() }}/package-lock.json"


# Tasks Not Allowed Inside Docker.
@_no-docker:
	[ ! -f "{{ docker_sig }}" ] || just _die "This task is meant to be run on a local machine."


# Only Allowed Inside Docker.
@_only-docker:
	[ -f "{{ docker_sig }}" ] || just _die "This task is meant to be run *inside* a container."



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
