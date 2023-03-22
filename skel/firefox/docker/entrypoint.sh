#!/bin/bash
set -e

if [ ! -f "/mnt/build.sh" ]; then
	echo -e "\e[91;1mError:\e[0m This must be run from the directory containing the build.sh script."
	exit 1
fi

echo -e "\e[96;1mJS Mate Poe Firefox Extension\e[0m"
echo -e "\e[95;1mBuild Environment\e[0m"
echo ""
echo -e "To build the extension, type: \e[2m./build.sh\e[0m"
echo ""

# Drop to bash.
exec "/bin/bash"
