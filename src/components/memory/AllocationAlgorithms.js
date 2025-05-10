/**
 * Memory Allocation Algorithms Implementation
 * 
 * This file contains implementations of the following memory allocation algorithms:
 * - First Fit
 * - Next Fit
 * - Best Fit
 * - Worst Fit
 */

/**
 * First Fit Algorithm
 * Allocates the first memory block that is large enough to accommodate the process
 */
export const firstFit = (memoryBlocks, processes) => {
  // Create deep copies to avoid modifying the original arrays
  const blocks = JSON.parse(JSON.stringify(memoryBlocks));
  const procs = JSON.parse(JSON.stringify(processes));
  
  // Initialize allocation and fragmentation data
  const allocation = procs.map(() => null);
  const internalFragmentation = blocks.map(() => 0);
  
  // For each process, find the first block that can accommodate it
  for (let i = 0; i < procs.length; i++) {
    for (let j = 0; j < blocks.length; j++) {
      if (blocks[j].size >= procs[i].size) {
        // Allocate process to this block
        allocation[i] = j;
        // Calculate internal fragmentation
        internalFragmentation[j] = blocks[j].size - procs[i].size;
        // Reduce available block size
        blocks[j].size = 0; // Mark as fully allocated
        break;
      }
    }
  }
  
  // Calculate external fragmentation (sum of all free blocks that can't accommodate the largest unallocated process)
  let externalFragmentation = 0;
  let unallocatedProcesses = procs.filter((_, index) => allocation[index] === null);
  
  if (unallocatedProcesses.length > 0) {
    // Find the largest unallocated process
    const largestUnallocatedSize = Math.max(...unallocatedProcesses.map(p => p.size));
    
    // Sum up all free blocks that are too small for the largest unallocated process
    externalFragmentation = blocks
      .filter(block => block.size > 0 && block.size < largestUnallocatedSize)
      .reduce((sum, block) => sum + block.size, 0);
  }
  
  return {
    algorithm: 'First Fit',
    allocation,
    internalFragmentation,
    externalFragmentation,
    totalFragmentation: internalFragmentation.reduce((sum, frag) => sum + frag, 0) + externalFragmentation,
    unallocatedProcesses: procs.filter((_, index) => allocation[index] === null).map(p => p.id)
  };
};

/**
 * Next Fit Algorithm
 * Similar to First Fit, but starts searching from where the previous allocation ended
 */
export const nextFit = (memoryBlocks, processes) => {
  // Create deep copies to avoid modifying the original arrays
  const blocks = JSON.parse(JSON.stringify(memoryBlocks));
  const procs = JSON.parse(JSON.stringify(processes));
  
  // Initialize allocation and fragmentation data
  const allocation = procs.map(() => null);
  const internalFragmentation = blocks.map(() => 0);
  
  let lastAllocatedIndex = 0; // Start from the first block
  
  // For each process, find the next block that can accommodate it
  for (let i = 0; i < procs.length; i++) {
    let j = lastAllocatedIndex;
    let blocksChecked = 0;
    
    // Search until we've checked all blocks
    while (blocksChecked < blocks.length) {
      if (blocks[j].size >= procs[i].size) {
        // Allocate process to this block
        allocation[i] = j;
        // Calculate internal fragmentation
        internalFragmentation[j] = blocks[j].size - procs[i].size;
        // Reduce available block size
        blocks[j].size = 0; // Mark as fully allocated
        // Update last allocated index
        lastAllocatedIndex = (j + 1) % blocks.length;
        break;
      }
      
      // Move to next block (circular)
      j = (j + 1) % blocks.length;
      blocksChecked++;
    }
  }
  
  // Calculate external fragmentation (sum of all free blocks that can't accommodate the largest unallocated process)
  let externalFragmentation = 0;
  let unallocatedProcesses = procs.filter((_, index) => allocation[index] === null);
  
  if (unallocatedProcesses.length > 0) {
    // Find the largest unallocated process
    const largestUnallocatedSize = Math.max(...unallocatedProcesses.map(p => p.size));
    
    // Sum up all free blocks that are too small for the largest unallocated process
    externalFragmentation = blocks
      .filter(block => block.size > 0 && block.size < largestUnallocatedSize)
      .reduce((sum, block) => sum + block.size, 0);
  }
  
  return {
    algorithm: 'Next Fit',
    allocation,
    internalFragmentation,
    externalFragmentation,
    totalFragmentation: internalFragmentation.reduce((sum, frag) => sum + frag, 0) + externalFragmentation,
    unallocatedProcesses: procs.filter((_, index) => allocation[index] === null).map(p => p.id)
  };
};

/**
 * Best Fit Algorithm
 * Allocates the smallest memory block that is large enough to accommodate the process
 */
export const bestFit = (memoryBlocks, processes) => {
  // Create deep copies to avoid modifying the original arrays
  const blocks = JSON.parse(JSON.stringify(memoryBlocks));
  const procs = JSON.parse(JSON.stringify(processes));
  
  // Initialize allocation and fragmentation data
  const allocation = procs.map(() => null);
  const internalFragmentation = blocks.map(() => 0);
  
  // For each process, find the best fitting block
  for (let i = 0; i < procs.length; i++) {
    let bestBlockIndex = -1;
    let bestBlockSize = Infinity;
    
    // Find the smallest block that can accommodate the process
    for (let j = 0; j < blocks.length; j++) {
      if (blocks[j].size >= procs[i].size && blocks[j].size < bestBlockSize) {
        bestBlockIndex = j;
        bestBlockSize = blocks[j].size;
      }
    }
    
    // If a suitable block was found, allocate the process to it
    if (bestBlockIndex !== -1) {
      allocation[i] = bestBlockIndex;
      internalFragmentation[bestBlockIndex] = blocks[bestBlockIndex].size - procs[i].size;
      blocks[bestBlockIndex].size = 0; // Mark as fully allocated
    }
  }
  
  // Calculate external fragmentation
  let externalFragmentation = 0;
  let unallocatedProcesses = procs.filter((_, index) => allocation[index] === null);
  
  if (unallocatedProcesses.length > 0) {
    // Find the largest unallocated process
    const largestUnallocatedSize = Math.max(...unallocatedProcesses.map(p => p.size));
    
    // Sum up all free blocks that are too small for the largest unallocated process
    externalFragmentation = blocks
      .filter(block => block.size > 0 && block.size < largestUnallocatedSize)
      .reduce((sum, block) => sum + block.size, 0);
  }
  
  return {
    algorithm: 'Best Fit',
    allocation,
    internalFragmentation,
    externalFragmentation,
    totalFragmentation: internalFragmentation.reduce((sum, frag) => sum + frag, 0) + externalFragmentation,
    unallocatedProcesses: procs.filter((_, index) => allocation[index] === null).map(p => p.id)
  };
};

/**
 * Worst Fit Algorithm
 * Allocates the largest memory block that is large enough to accommodate the process
 */
export const worstFit = (memoryBlocks, processes) => {
  // Create deep copies to avoid modifying the original arrays
  const blocks = JSON.parse(JSON.stringify(memoryBlocks));
  const procs = JSON.parse(JSON.stringify(processes));
  
  // Initialize allocation and fragmentation data
  const allocation = procs.map(() => null);
  const internalFragmentation = blocks.map(() => 0);
  
  // For each process, find the worst fitting block
  for (let i = 0; i < procs.length; i++) {
    let worstBlockIndex = -1;
    let worstBlockSize = -1;
    
    // Find the largest block that can accommodate the process
    for (let j = 0; j < blocks.length; j++) {
      if (blocks[j].size >= procs[i].size && blocks[j].size > worstBlockSize) {
        worstBlockIndex = j;
        worstBlockSize = blocks[j].size;
      }
    }
    
    // If a suitable block was found, allocate the process to it
    if (worstBlockIndex !== -1) {
      allocation[i] = worstBlockIndex;
      internalFragmentation[worstBlockIndex] = blocks[worstBlockIndex].size - procs[i].size;
      blocks[worstBlockIndex].size = 0; // Mark as fully allocated
    }
  }
  
  // Calculate external fragmentation
  let externalFragmentation = 0;
  let unallocatedProcesses = procs.filter((_, index) => allocation[index] === null);
  
  if (unallocatedProcesses.length > 0) {
    // Find the largest unallocated process
    const largestUnallocatedSize = Math.max(...unallocatedProcesses.map(p => p.size));
    
    // Sum up all free blocks that are too small for the largest unallocated process
    externalFragmentation = blocks
      .filter(block => block.size > 0 && block.size < largestUnallocatedSize)
      .reduce((sum, block) => sum + block.size, 0);
  }
  
  return {
    algorithm: 'Worst Fit',
    allocation,
    internalFragmentation,
    externalFragmentation,
    totalFragmentation: internalFragmentation.reduce((sum, frag) => sum + frag, 0) + externalFragmentation,
    unallocatedProcesses: procs.filter((_, index) => allocation[index] === null).map(p => p.id)
  };
};

/**
 * Run all memory allocation algorithms and return their results
 */
export const runAllAlgorithms = (memoryBlocks, processes) => {
  return {
    firstFit: firstFit(memoryBlocks, processes),
    nextFit: nextFit(memoryBlocks, processes),
    bestFit: bestFit(memoryBlocks, processes),
    worstFit: worstFit(memoryBlocks, processes)
  };
};