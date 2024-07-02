#!/usr/bin/env bash

declare -a settings=(setting-in-bytes min low high max)

echo "Reading cgroups memory settings"
for setting in "${settings[@]}"; do
    echo "Reading memory.${setting}"
    cat "/sys/fs/cgroup/memory/memory.${setting}"
done
