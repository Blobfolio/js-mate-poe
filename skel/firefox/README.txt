## THIS IS ONLY A MESSAGE TEMPLATE  ##
## DO NOT FOLLOW THESE INSTRUCTIONS ##
CONTENTS
========

The source material for the JS Mate Poe Firefox browser extension is split into four directories:

	* static: things that don't need building, like images, sounds, the manifest, etc.
	* js:     Javascript module sources
	* rust:   Rust sources
	* docker: Docker setup files (not directly part of this extension)

Compilation is a multi-step process, so a Docker file and build script are included in the top-level directory to simplify it (and make the process more reproducible).


BUILD ENVIRONMENT
=================

The build itself should be done from within the provided Docker container.

Docker, therefore, is the only real host dependency to compile this extension. If you don't already have Docker on your system, refer to their installation instructions at: https://docs.docker.com/get-docker/


BUILD THE EXTENSION!
====================

The following commands should be run from the top-level folder in this source archive — i.e. the folder containing this README — from a Unix-style terminal emulator (like the ones shipped with MacOS, Linux, etc.).

The following three steps are all it takes to set up the environment and build the extension:

	1. Install the Docker build environment container image.
		docker build -t firefox/poe -f Dockerfile ./

	2. Launch the Docker image. Note: this should be done from the directory containing this README file.
		docker run --rm -v "$PWD":/mnt -it --name poe firefox/poe

	3. Execute the build script from inside the container:
		./build.sh

That's it!

The new "dist" folder at the top-level contains the complete, compiled extension.

You'll also find one additional source file located at "js/generated/glue.mjs". This is auto-generated by wasm-bindgen during the Rust portion of the build, and required by the "foreground.mjs" module during its compilation. (Almost all of the content script's content comes from this glue file.)

When you're done testing, you can remove this Docker container and its dependenies by running:
	docker rmi firefox/poe
	docker image prune

Thanks for reviewing!
