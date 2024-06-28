const v8 = require("v8");
const allocationStep = 8 * 1024 * 1024; // 8mbin bytes.
const minHeadroom = 60 * 1024 * 1024; // 60mb in bytes.
const interval = 100;
let allocations = [];
let intervals = 0;
const heapLimit = v8.getHeapStatistics().heap_size_limit;
const startTime = Date.now();
const maxRunTime = Math.floor(3 * 60 * 1000); // 3 minutes in ms;
const shutdownTime = startTime + maxRunTime;

function allocateMemory(size) {
  const numbers = size / 8;
  const arr = [];
  arr.length = numbers;
  for (let i = 0; i < numbers; i++) {
    arr[i] = i;
  }
  return arr;
}

function toMb(val) {
  return Math.floor(val / 1024 / 1024);
}

setInterval(() => {
  intervals = intervals + 1;
  const memStats = process.memoryUsage();
  const { heapTotal, heapUsed } = memStats;
  console.log(
    `stable: heapTotal = ${toMb(heapTotal)}; heapUsed = ${toMb(heapUsed)}; heapLimit = ${toMb(heapLimit)}; intervals = ${intervals}`,
  );

  if (heapTotal + allocationStep < heapLimit - minHeadroom) {
    console.log(
      `stable: headroom = ${toMb(heapLimit - heapTotal)}; allocating = ${toMb(allocationStep)};`,
    );
    allocations.push(allocateMemory(allocationStep));
  }

  if (Date.now() > shutdownTime) {
    console.log("stable: shutting down.");
    process.exit(0);
  }
}, interval);
