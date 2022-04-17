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

	[ -z "{{ RELEASE }}" ] || just test

	# Keep track of time.
	echo "$( date +%s )" > "{{ tmp_dir }}/build.time"

	just _header "Building JS Mate Poe!"
	echo ""

	just _build-scss
	just _build-js

	# Clear old Gzip/Brotli files.
	find "{{ dist_dir }}" \( -name "*.br" -o -name '*.gz' \) -type f -delete

	# If releasing, redo Gzip/Brotli files.
	[ -z "{{ RELEASE }}" ] || channelz -p "{{ dist_dir }}"

	just _fix-chmod "{{ dist_dir }}"
	just _fix-chown "{{ dist_dir }}"

	just _build-success


# Set version and rebuild.
release VERSION="": _only-docker
	#!/usr/bin/env bash

	_version="{{ VERSION }}"
	_now="$( just version )"
	[ ! -z "${_version}" ] || _version=$_now

	_regex="^[0-9]+\.[0-9]+\.[0-9]+$"
	if [[ $_version =~ $_regex ]]; then
		if [ "${_version}" != "${_now}" ]; then
			just _confirm "Change the version from ${_now} to ${_version}?" || exit 1

			# Patch the version!
			jq --arg _version "$_version" '.version = $_version' "{{ justfile_directory() }}/package.json" > "{{ tmp_dir }}/package.json"
			mv "{{ tmp_dir }}/package.json" "{{ justfile_directory() }}/package.json"
			just _fix-chown "{{ justfile_directory() }}/package.json"
			sd -s "Version: '${_now}'" "Version: '${_version}'" "{{ src_dir }}/js/core/def.mjs"
			sd -s "@version ${_now}" "@version ${_version}" "{{ src_dir }}/skel/header.min.js"
		fi

		just _success "Version changed to ${_version}."
		just build Y
		exit
	fi

	just _error "Invalid version."
	exit 1

# Run unit tests.
@test: _init-test-chain
	just _header "Unit tests!"

	karma start \
		--single-run \
		--browsers Other \
		"{{ justfile_directory() }}/karma.conf.js"


# Print version and exit.
@version: _only-docker
	cat package.json | jq '.version' | sd '"' ''


# Watch for changes to JS files.
@watch: _only-docker
	just _header "Watching for Changes"

	watchexec \
		--postpone \
		--no-shell \
		--watch "{{ src_dir }}" \
		--debounce 1000 \
		--ignore "{{ src_dir }}/js/js-mate-poe-ce/poe_css.mjs" \
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
		--browser_featureset_year 2021 \
		--isolation_mode IIFE \
		--module_resolution BROWSER \
		--strict_mode_input \
		--use_types_for_optimization \
		--warning_level VERBOSE

	# The director tool.
	google-closure-compiler \
		--env BROWSER \
		--language_in STABLE \
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
		--browser_featureset_year 2021 \
		--isolation_mode IIFE \
		--module_resolution BROWSER \
		--strict_mode_input \
		--use_types_for_optimization \
		--warning_level VERBOSE

	# Fix up the outputs.
	just _build-js-header "{{ demo_dir }}/assets/demo.min.js"
	just _build-js-header "{{ demo_dir }}/assets/director.min.js"



# JS build task(s).
@_build-js:
	just _eslint

	just _build-js-chain
	just _build-js-mate-poe-ce
	just _build-demo


# Build a JS module from the CSS.
@_build-js-css:
	# JS-Mate-Poe CE.
	[ -f "{{ tmp_dir }}/js-mate-poe-ce.css" ] || just _die "Missing js-mate-poe-ce.css."
	cp "{{ src_dir }}/skel/css.js-mate-poe.mjs" "{{ tmp_dir }}/css.tmp"
	echo "export const PoeCss = '$( cat "{{ tmp_dir }}/js-mate-poe-ce.css" )';" >> "{{ tmp_dir }}/css.tmp"
	mv "{{ tmp_dir }}/css.tmp" "{{ src_dir }}/js/js-mate-poe-ce/poe_css.mjs"
	just _fix-chown "{{ src_dir }}/js/js-mate-poe-ce/poe_css.mjs"


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


# Compile JS Mate Poe CE.
@_build-js-mate-poe-ce:
	just _info "Compiling JS Mate Poe: CE"

	google-closure-compiler \
		--env BROWSER \
		--language_in STABLE \
		--js "{{ src_dir }}/js/core.mjs" \
		--js "{{ src_dir }}/js/core/**.mjs" \
		--js "{{ src_dir }}/js/middleware/universe.browser.mjs" \
		--js "{{ src_dir }}/js/middleware/assets.url.mjs" \
		--js "{{ src_dir }}/js/js-mate-poe-ce/**.mjs" \
		--js_output_file "{{ dist_dir }}/js-mate-poe.min.js" \
		--jscomp_off unknownDefines \
		--assume_function_wrapper \
		--compilation_level ADVANCED \
		--dependency_mode PRUNE \
		--entry_point "{{ src_dir }}/js/js-mate-poe-ce/app.mjs" \
		--browser_featureset_year 2022 \
		--isolation_mode IIFE \
		--module_resolution BROWSER \
		--strict_mode_input \
		--use_types_for_optimization \
		--warning_level VERBOSE

	just _build-js-header "{{ dist_dir }}/js-mate-poe.min.js"


# CSS build task(s).
@_build-scss:
	just _info "Compiling CSS."

	just _scss "{{ src_dir }}/scss/js-mate-poe-ce.scss" \
		"{{ tmp_dir }}/js-mate-poe-ce.css"
	just _scss "{{ src_dir }}/scss/demo.scss" \
		"{{ demo_dir }}/assets/demo.css"
	just _scss "{{ src_dir }}/scss/director.scss" \
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


# SCSS.
@_scss IN OUT:
	guff -i "{{ IN }}" -o "{{ OUT }}"



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
	just _build-js-chain


# Init for Testing.
_init-test-chain: _only-docker
	#!/usr/bin/env bash

	[ ! -f "{{ tmp_dir }}/.test-chained" ] || exit 0

	just _info "Installing dependencies for tests."

	# Install NPM crap.
	npm i -g \
		chai \
		karma \
		karma-chai \
		karma-chrome-launcher \
		karma-mocha \
		mocha

	apt-get update -qq
	apt-fast install --no-install-recommends -y \
		chromium \
		chromium-shell

	touch "{{ tmp_dir }}/.test-chained"



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

# Confirm a yes/no response.
@_confirm COMMENT:
	whiptail --title "Confirmation Required" --yesno "{{ COMMENT }}" 0 0 10
