#!/usr/bin/env bash

echo "/proc/cgroups"
cat /proc/cgroups

echo "/proc/self/cgroup"
cat /proc/self/cgroup || true

echo "/sys/fs/crgoup"
stat -fc %T /sys/fs/cgroup/ || true
ls -al /sys/fs/cgroup/ || true

declare -a settings=(limit-in-bytes min low high max)
echo "Reading cgroups settings from /sys/fs/cgroup/memory"
for setting in "${settings[@]}"; do
    echo "Reading memory.${setting}"
    cat "/sys/fs/cgroup/memory/memory.${setting}" || true
done
