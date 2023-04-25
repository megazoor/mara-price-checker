#!/bin/bash

function file_tree() {
  local indent="${2:-0}"
  local prefix="${3:-|__}"
  for item in "$1"/*; do
    if [ "$(basename "$item")" != "node_modules" ]; then
      printf "%*s%s %s\n" "$indent" "" "$prefix" "$(basename "$item")"
      if [ -d "$item" ]; then
        file_tree "$item" $((indent + 4)) "|__"
      fi
    fi
  done
}

function print_code() {
  local prefix="###"
  for item in $(find "$1" -type f \( -iname "*.html" -o -iname "*.js" -o -iname "*.json" \) ! -path "*/node_modules/*" ! -name "package-lock.json"); do
    echo -e "\n$prefix $(basename "$item")\n"
    cat "$item"
  done
}


dir="${1:-.}"
printf "%s\n" "$(basename "$dir")" > tree.md
file_tree "$dir" >> tree.md
print_code "$dir" > code_full.md
