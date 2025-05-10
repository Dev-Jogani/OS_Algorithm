/**
 * Banker's Algorithm Implementation for Deadlock Prevention
 * 
 * This file contains the implementation of the Banker's Algorithm
 * which is used for deadlock prevention in operating systems.
 */

/**
 * Checks if the system is in a safe state using the Banker's Algorithm
 * 
 * @param {Array} available - Available resources
 * @param {Array} max - Maximum demand of each process
 * @param {Array} allocation - Resources currently allocated to each process
 * @returns {Object} Result of the safety algorithm
 */
export const isSafeState = (available, max, allocation) => {
  // Create deep copies to avoid modifying the original arrays
  const availableResources = [...available];
  const maxDemand = JSON.parse(JSON.stringify(max));
  const currentAllocation = JSON.parse(JSON.stringify(allocation));
  
  // Calculate need matrix (max - allocation)
  const need = maxDemand.map((process, i) => {
    return process.map((resource, j) => resource - currentAllocation[i][j]);
  });
  
  // Initialize tracking variables
  const numProcesses = maxDemand.length;
  const numResources = available.length;
  const finished = Array(numProcesses).fill(false);
  const safeSequence = [];
  
  // Count of processes that have finished
  let count = 0;
  
  // While there are still processes to finish
  while (count < numProcesses) {
    // Find a process that can be executed
    let found = false;
    
    for (let i = 0; i < numProcesses; i++) {
      // Skip if process is already finished
      if (finished[i]) continue;
      
      // Check if all resources needed by this process can be allocated
      let canAllocate = true;
      for (let j = 0; j < numResources; j++) {
        if (need[i][j] > availableResources[j]) {
          canAllocate = false;
          break;
        }
      }
      
      // If all resources can be allocated
      if (canAllocate) {
        // Add resources back to available pool
        for (let j = 0; j < numResources; j++) {
          availableResources[j] += currentAllocation[i][j];
        }
        
        // Mark process as finished and add to safe sequence
        finished[i] = true;
        safeSequence.push(i);
        count++;
        found = true;
      }
    }
    
    // If no process could be found in this iteration, system is in unsafe state
    if (!found) {
      return {
        safe: false,
        safeSequence: [],
        unfinishedProcesses: finished.map((status, index) => !status ? index : null).filter(p => p !== null)
      };
    }
  }
  
  // If we've reached here, all processes can finish - system is in safe state
  return {
    safe: true,
    safeSequence,
    unfinishedProcesses: []
  };
};

/**
 * Resource Request Algorithm
 * Determines if a resource request can be granted immediately
 * 
 * @param {Array} available - Available resources
 * @param {Array} max - Maximum demand of each process
 * @param {Array} allocation - Resources currently allocated to each process
 * @param {number} processId - ID of the process making the request
 * @param {Array} request - Resources requested by the process
 * @returns {Object} Result of the request algorithm
 */
export const resourceRequest = (available, max, allocation, processId, request) => {
  // Create deep copies to avoid modifying the original arrays
  const availableResources = [...available];
  const maxDemand = JSON.parse(JSON.stringify(max));
  const currentAllocation = JSON.parse(JSON.stringify(allocation));
  
  // Calculate need matrix (max - allocation)
  const need = maxDemand.map((process, i) => {
    return process.map((resource, j) => resource - currentAllocation[i][j]);
  });
  
  const numResources = available.length;
  
  // Check if request exceeds maximum claim
  for (let j = 0; j < numResources; j++) {
    if (request[j] > need[processId][j]) {
      return {
        granted: false,
        reason: 'Request exceeds maximum claim',
        resourceIndex: j
      };
    }
  }
  
  // Check if resources are available
  for (let j = 0; j < numResources; j++) {
    if (request[j] > availableResources[j]) {
      return {
        granted: false,
        reason: 'Resources not available',
        resourceIndex: j
      };
    }
  }
  
  // Try to allocate resources temporarily
  for (let j = 0; j < numResources; j++) {
    availableResources[j] -= request[j];
    currentAllocation[processId][j] += request[j];
    need[processId][j] -= request[j];
  }
  
  // Check if resulting state is safe
  const safetyResult = isSafeState(availableResources, maxDemand, currentAllocation);
  
  if (safetyResult.safe) {
    return {
      granted: true,
      safeSequence: safetyResult.safeSequence
    };
  } else {
    return {
      granted: false,
      reason: 'Resulting state would be unsafe',
      unsafeProcesses: safetyResult.unfinishedProcesses
    };
  }
};

/**
 * Run Banker's Algorithm simulation
 * 
 * @param {Object} data - Input data for the simulation
 * @returns {Object} Results of the simulation
 */
export const runBankersAlgorithm = (data) => {
  const { available, max, allocation, requests } = data;
  
  // Check if initial state is safe
  const initialSafetyCheck = isSafeState(available, max, allocation);
  
  // Process each request if initial state is safe
  const requestResults = [];
  
  if (initialSafetyCheck.safe && requests && requests.length > 0) {
    // Create copies for simulation
    let currentAvailable = [...available];
    let currentAllocation = JSON.parse(JSON.stringify(allocation));
    
    // Process each request sequentially
    for (const req of requests) {
      const { processId, request } = req;
      
      const requestResult = resourceRequest(
        currentAvailable, 
        max, 
        currentAllocation, 
        processId, 
        request
      );
      
      requestResults.push({
        processId,
        request,
        ...requestResult
      });
      
      // If request was granted, update the current state for next requests
      if (requestResult.granted) {
        for (let j = 0; j < request.length; j++) {
          currentAvailable[j] -= request[j];
          currentAllocation[processId][j] += request[j];
        }
      }
    }
  }
  
  return {
    initialState: {
      safe: initialSafetyCheck.safe,
      safeSequence: initialSafetyCheck.safeSequence,
      unfinishedProcesses: initialSafetyCheck.unfinishedProcesses
    },
    requestResults
  };
};