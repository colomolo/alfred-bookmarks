#!/bin/bash

list=$(cat "${file_path}")
items=$(./parse_items.js "$list" "$show_checked")

printf "%s" "${items//\"/\\\"}"
