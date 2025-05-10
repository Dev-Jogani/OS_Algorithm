import React, { useState } from 'react';
import { TextField, Button, Grid, Typography, Paper, Box, IconButton } from '@mui/material';
import { Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';

const BankersInput = ({ onSubmit }) => {
  const [numProcesses, setNumProcesses] = useState(3);
  const [numResources, setNumResources] = useState(3);
  const [available, setAvailable] = useState(Array(3).fill(''));
  const [max, setMax] = useState(Array(3).fill().map(() => Array(3).fill('')));
  const [allocation, setAllocation] = useState(Array(3).fill().map(() => Array(3).fill('')));
  const [requests, setRequests] = useState([{ processId: 0, request: Array(3).fill('') }]);

  // Handle changes to the number of processes
  const handleNumProcessesChange = (e) => {
    const newNumProcesses = parseInt(e.target.value) || 0;
    if (newNumProcesses < 1) return;
    
    setNumProcesses(newNumProcesses);
    
    // Adjust max and allocation matrices
    if (newNumProcesses > max.length) {
      // Add new rows
      setMax([...max, ...Array(newNumProcesses - max.length).fill().map(() => Array(numResources).fill(''))]);
      setAllocation([...allocation, ...Array(newNumProcesses - allocation.length).fill().map(() => Array(numResources).fill(''))]);
    } else {
      // Remove rows
      setMax(max.slice(0, newNumProcesses));
      setAllocation(allocation.slice(0, newNumProcesses));
      
      // Update requests to remove any with processId >= newNumProcesses
      setRequests(requests.filter(req => req.processId < newNumProcesses));
    }
  };

  // Handle changes to the number of resources
  const handleNumResourcesChange = (e) => {
    const newNumResources = parseInt(e.target.value) || 0;
    if (newNumResources < 1) return;
    
    setNumResources(newNumResources);
    
    // Adjust available vector
    if (newNumResources > available.length) {
      // Add new elements
      setAvailable([...available, ...Array(newNumResources - available.length).fill('')]);
    } else {
      // Remove elements
      setAvailable(available.slice(0, newNumResources));
    }
    
    // Adjust max and allocation matrices
    setMax(max.map(row => {
      if (newNumResources > row.length) {
        // Add new columns
        return [...row, ...Array(newNumResources - row.length).fill('')];
      } else {
        // Remove columns
        return row.slice(0, newNumResources);
      }
    }));
    
    setAllocation(allocation.map(row => {
      if (newNumResources > row.length) {
        // Add new columns
        return [...row, ...Array(newNumResources - row.length).fill('')];
      } else {
        // Remove columns
        return row.slice(0, newNumResources);
      }
    }));
    
    // Update requests
    setRequests(requests.map(req => {
      const newRequest = req.request.length > newNumResources ? 
        req.request.slice(0, newNumResources) : 
        [...req.request, ...Array(newNumResources - req.request.length).fill('')];
      
      return { ...req, request: newRequest };
    }));
  };

  // Handle changes to available resources
  const handleAvailableChange = (index, value) => {
    const newAvailable = [...available];
    newAvailable[index] = value;
    setAvailable(newAvailable);
  };

  // Handle changes to max matrix
  const handleMaxChange = (processIndex, resourceIndex, value) => {
    const newMax = [...max];
    newMax[processIndex][resourceIndex] = value;
    setMax(newMax);
  };

  // Handle changes to allocation matrix
  const handleAllocationChange = (processIndex, resourceIndex, value) => {
    const newAllocation = [...allocation];
    newAllocation[processIndex][resourceIndex] = value;
    setAllocation(newAllocation);
  };

  // Add a new request
  const addRequest = () => {
    setRequests([...requests, { processId: 0, request: Array(numResources).fill('') }]);
  };

  // Remove a request
  const removeRequest = (index) => {
    if (requests.length > 1) {
      const newRequests = [...requests];
      newRequests.splice(index, 1);
      setRequests(newRequests);
    }
  };

  // Handle changes to request processId
  const handleRequestProcessIdChange = (index, value) => {
    const processId = parseInt(value) || 0;
    if (processId < 0 || processId >= numProcesses) return;
    
    const newRequests = [...requests];
    newRequests[index].processId = processId;
    setRequests(newRequests);
  };

  // Handle changes to request resources
  const handleRequestResourceChange = (requestIndex, resourceIndex, value) => {
    const newRequests = [...requests];
    newRequests[requestIndex].request[resourceIndex] = value;
    setRequests(newRequests);
  };

  // Submit the form
  const handleSubmit = () => {
    // Validate and convert inputs to numbers
    const validAvailable = available.map(val => parseInt(val) || 0);
    
    const validMax = max.map(row => 
      row.map(val => parseInt(val) || 0)
    );
    
    const validAllocation = allocation.map(row => 
      row.map(val => parseInt(val) || 0)
    );
    
    const validRequests = requests.map(req => ({
      processId: req.processId,
      request: req.request.map(val => parseInt(val) || 0)
    }));

    // Check if allocation exceeds max
    let validationError = false;
    for (let i = 0; i < numProcesses; i++) {
      for (let j = 0; j < numResources; j++) {
        if (validAllocation[i][j] > validMax[i][j]) {
          alert(`Error: Allocation for Process ${i} and Resource ${j} exceeds maximum claim`);
          validationError = true;
          break;
        }
      }
      if (validationError) break;
    }

    if (!validationError) {
      onSubmit({
        available: validAvailable,
        max: validMax,
        allocation: validAllocation,
        requests: validRequests
      });
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h5" gutterBottom>Banker's Algorithm Input</Typography>
      
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Number of Processes"
            type="number"
            value={numProcesses}
            onChange={handleNumProcessesChange}
            InputProps={{ inputProps: { min: 1 } }}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Number of Resources"
            type="number"
            value={numResources}
            onChange={handleNumResourcesChange}
            InputProps={{ inputProps: { min: 1 } }}
          />
        </Grid>
      </Grid>

      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>Available Resources</Typography>
        <Grid container spacing={2}>
          {available.map((value, index) => (
            <Grid item xs={4} sm={3} md={2} key={`available-${index}`}>
              <TextField
                fullWidth
                label={`Resource ${index}`}
                type="number"
                value={value}
                onChange={(e) => handleAvailableChange(index, e.target.value)}
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>Maximum Claim (Max)</Typography>
        {max.map((row, processIndex) => (
          <Box key={`max-row-${processIndex}`} sx={{ mb: 2 }}>
            <Typography variant="subtitle1" gutterBottom>Process {processIndex}</Typography>
            <Grid container spacing={2}>
              {row.map((value, resourceIndex) => (
                <Grid item xs={4} sm={3} md={2} key={`max-${processIndex}-${resourceIndex}`}>
                  <TextField
                    fullWidth
                    label={`Resource ${resourceIndex}`}
                    type="number"
                    value={value}
                    onChange={(e) => handleMaxChange(processIndex, resourceIndex, e.target.value)}
                    InputProps={{ inputProps: { min: 0 } }}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        ))}
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>Current Allocation</Typography>
        {allocation.map((row, processIndex) => (
          <Box key={`allocation-row-${processIndex}`} sx={{ mb: 2 }}>
            <Typography variant="subtitle1" gutterBottom>Process {processIndex}</Typography>
            <Grid container spacing={2}>
              {row.map((value, resourceIndex) => (
                <Grid item xs={4} sm={3} md={2} key={`allocation-${processIndex}-${resourceIndex}`}>
                  <TextField
                    fullWidth
                    label={`Resource ${resourceIndex}`}
                    type="number"
                    value={value}
                    onChange={(e) => handleAllocationChange(processIndex, resourceIndex, e.target.value)}
                    InputProps={{ inputProps: { min: 0 } }}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        ))}
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>Resource Requests (Optional)</Typography>
        {requests.map((req, requestIndex) => (
          <Box key={`request-${requestIndex}`} sx={{ mb: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={8} sm={4}>
                <TextField
                  fullWidth
                  label="Process ID"
                  type="number"
                  value={req.processId}
                  onChange={(e) => handleRequestProcessIdChange(requestIndex, e.target.value)}
                  InputProps={{ inputProps: { min: 0, max: numProcesses - 1 } }}
                />
              </Grid>
              <Grid item xs={4} sm={2}>
                <IconButton 
                  color="error" 
                  onClick={() => removeRequest(requestIndex)}
                  disabled={requests.length <= 1}
                >
                  <RemoveIcon />
                </IconButton>
              </Grid>
              {req.request.map((value, resourceIndex) => (
                <Grid item xs={4} sm={3} md={2} key={`request-${requestIndex}-${resourceIndex}`}>
                  <TextField
                    fullWidth
                    label={`Resource ${resourceIndex}`}
                    type="number"
                    value={value}
                    onChange={(e) => handleRequestResourceChange(requestIndex, resourceIndex, e.target.value)}
                    InputProps={{ inputProps: { min: 0 } }}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        ))}
        <Button 
          variant="outlined" 
          startIcon={<AddIcon />} 
          onClick={addRequest}
          sx={{ mt: 1 }}
        >
          Add Request
        </Button>
      </Box>

      <Button 
        variant="contained" 
        color="success" 
        onClick={handleSubmit} 
        fullWidth
        sx={{ mt: 2 }}
      >
        Run Banker's Algorithm
      </Button>
    </Paper>
  );
};

export default BankersInput;