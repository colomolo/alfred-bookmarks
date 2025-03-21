#!/bin/bash

list=$(cat "${file_path}")
items=$(./parse_items.js "$list")

printf "%s" "${items//\"/\\\"}"
