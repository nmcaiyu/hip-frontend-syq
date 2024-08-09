#!/usr/bin/env bash

basename() {
    # Usage: basename "path" ["suffix"]
    local tmp

    tmp=${1%"${1##*[!/]}"}
    tmp=${tmp##*/}
    tmp=${tmp%"${2/"$tmp"}"}

    printf '%s\n' "${tmp:-/}"
}

rstrip() {
    # Usage: rstrip "string" "pattern"
    printf '%s\n' "${1%%$2}"
}

script_dir=$(dirname $(realpath $0))
svg_dir=${script_dir}/svg
png_dir=${script_dir}/png

for file in ${svg_dir}/*; do
    filename=$(basename $file)
    basename=$(rstrip $filename ".svg")
    inkscape $file -o ${png_dir}/${basename}.png
done
