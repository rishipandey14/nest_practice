import { memoryUsage } from 'node:process';

export function getMemoryUsage() {
    const memory = memoryUsage();

    return {
        heapUsedMB: memory.heapUsed / 1024 / 1024,
        heapTotalMB: memory.heapTotal / 1024 / 1024,
        rssMB: memory.rss / 1024 / 1024,
        externalMB: memory.external / 1024 / 1024,
    };
}

export function getLogMemory(label: string) {
    const memory = memoryUsage();

    console.log(`[MEMORY] ${label}`, {
        heapUsedMB: (memory.heapUsed / 1024 / 1024).toFixed(2),
        heapTotalMB: (memory.heapTotal / 1024 / 1024).toFixed(2),
        rssMB: (memory.rss / 1024 / 1024).toFixed(2),
        externalMB: (memory.external / 1024 / 1024).toFixed(2),
    });

    return memory;
}

export function startTimer() {
    return performance.now();
}

export function elapsedMs(startTime: number) {
    return performance.now() - startTime;
}
