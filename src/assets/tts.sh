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
text_dir=${script_dir}/audio_text
audio_dir=${script_dir}/audio

for text_file in ${text_dir}/*; do
    filename=$(basename $text_file)
    basename=$(rstrip $filename ".txt")
    audio_file=${audio_dir}/${basename}.mp3
    if [[ ! -f $audio_file ]]; then
        gtts-cli --tld cn --lang zh-CN -f $text_file -o $audio_file
    fi
done