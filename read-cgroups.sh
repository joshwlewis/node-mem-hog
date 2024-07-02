#!/usr/bin/env bash

echo "/proc/cgroups"
cat /proc/cgroups

echo "/proc/self/cgroup"
cat /proc/self/cgroup || true

echo "/sys/fs/crgoup"
stat -fc %T /sys/fs/cgroup/ || true
ls -al /sys/fs/cgroup/ || true

echo "Reading /sys/fs/cgroup/memory/memory-limit-in-bytes"
cat "/sys/fs/cgroup/memory/memory-limit-in-bytes" || true

declare -a settings=(min low high max)
for setting in "${settings[@]}"; do
    echo "Reading /sys/fs/cgroup/memory.${setting}"
    cat "/sys/fs/cgroup/memory.${setting}" || true
done
