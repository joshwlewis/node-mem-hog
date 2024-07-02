const v8 = require("v8");
const allocationSize = 8 * 1024 * 1024; // 8mb in bytes.
const minHeadroom = 60 * 1024 * 1024; // 60mb in bytes.
const interval = 100;
let allocations = [];
let intervals = Math.floor(Math.random() * 100);
const heapLimit = v8.getHeapStatistics().heap_size_limit;
const startTime = Date.now();
const maxRunTime = Math.floor(3 * 60 * 1000); // 3 minutes in ms;
const shutdownTime = startTime + maxRunTime;
let allocationSteps = 0;

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
  const { heapTotal, heapUsed } = process.memoryUsage();
  console.log(
    `bursty: heapTotal = ${toMb(heapTotal)}; heapUsed = ${toMb(heapUsed)}; heapLimit = ${toMb(heapLimit)}; intervals = ${intervals}`,
  );

  // 10 out of 100 iterations should be near max heap.
  if (intervals % 100 < 10) {
    let headroom = heapLimit - minHeadroom - heapTotal;
    if (allocationSteps == 0) {
      allocationSteps = Math.floor(headroom / (allocationSize * 5));
    }
    // allocate a big chunk memory over several iterations and several intervals.
    if (allocationSteps > 0) {
      console.log(
        `bursty: headroom = ${toMb(headroom)}; allocating = ${toMb(allocationSize * allocationSteps)}; over = ${allocationSteps};`,
      );
      for (let i = 0; i < allocationSteps; i++) {
        allocations.push(allocateMemory(allocationSize));
      }
    }
  } else {
    if (allocations.length > 1) {
      console.log("bursty: deallocating");
      allocations = [];
      allocationSteps = 0;
      intervals = intervals + Math.floor(Math.random() * 50);
      if (global.gc) {
        console.log("bursty: running gc");
        global.gc();
      }
    }
  }

  if (Date.now() > shutdownTime) {
    console.log("bursty: shutting down.");
    process.exit(0);
  }
}, interval);
