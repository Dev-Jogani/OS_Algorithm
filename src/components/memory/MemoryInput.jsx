import React, { useState } from 'react';
import { TextField, Button, Grid, Typography, Paper, Box } from '@mui/material';

const MemoryInput = ({ onSubmit }) => {
  const [memoryBlocks, setMemoryBlocks] = useState([{ id: 1, size: '' }]);
  const [processes, setProcesses] = useState([{ id: 1, size: '' }]);

  const addMemoryBlock = () => {
    const newId = memoryBlocks.length > 0 ? Math.max(...memoryBlocks.map(block => block.id)) + 1 : 1;
    setMemoryBlocks([...memoryBlocks, { id: newId, size: '' }]);
  };

  const removeMemoryBlock = (id) => {
    if (memoryBlocks.length > 1) {
      setMemoryBlocks(memoryBlocks.filter(block => block.id !== id));
    }
  };

  const updateMemoryBlock = (id, size) => {
    setMemoryBlocks(memoryBlocks.map(block => 
      block.id === id ? { ...block, size: size } : block
    ));
  };

  const addProcess = () => {
    const newId = processes.length > 0 ? Math.max(...processes.map(process => process.id)) + 1 : 1;
    setProcesses([...processes, { id: newId, size: '' }]);
  };

  const removeProcess = (id) => {
    if (processes.length > 1) {
      setProcesses(processes.filter(process => process.id !== id));
    }
  };

  const updateProcess = (id, size) => {
    setProcesses(processes.map(process => 
      process.id === id ? { ...process, size: size } : process
    ));
  };

  const handleSubmit = () => {
    // Validate inputs
    const validMemoryBlocks = memoryBlocks
      .filter(block => block.size !== '')
      .map(block => ({ ...block, size: parseInt(block.size) }));
    
    const validProcesses = processes
      .filter(process => process.size !== '')
      .map(process => ({ ...process, size: parseInt(process.size) }));

    if (validMemoryBlocks.length === 0 || validProcesses.length === 0) {
      alert('Please enter at least one memory block and one process');
      return;
    }

    onSubmit({
      memoryBlocks: validMemoryBlocks,
      processes: validProcesses
    });
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h5" gutterBottom>Memory Allocation Input</Typography>
      
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>Memory Blocks</Typography>
        {memoryBlocks.map((block) => (
          <Grid container spacing={2} key={block.id} sx={{ mb: 1 }}>
            <Grid item xs={8}>
              <TextField
                fullWidth
                label={`Block ${block.id} Size`}
                type="number"
                value={block.size}
                onChange={(e) => updateMemoryBlock(block.id, e.target.value)}
                InputProps={{ inputProps: { min: 1 } }}
              />
            </Grid>
            <Grid item xs={4}>
              <Button 
                variant="outlined" 
                color="error" 
                onClick={() => removeMemoryBlock(block.id)}
                disabled={memoryBlocks.length <= 1}
              >
                Remove
              </Button>
            </Grid>
          </Grid>
        ))}
        <Button variant="contained" color="primary" onClick={addMemoryBlock} sx={{ mt: 1 }}>
          Add Memory Block
        </Button>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>Processes</Typography>
        {processes.map((process) => (
          <Grid container spacing={2} key={process.id} sx={{ mb: 1 }}>
            <Grid item xs={8}>
              <TextField
                fullWidth
                label={`Process ${process.id} Size`}
                type="number"
                value={process.size}
                onChange={(e) => updateProcess(process.id, e.target.value)}
                InputProps={{ inputProps: { min: 1 } }}
              />
            </Grid>
            <Grid item xs={4}>
              <Button 
                variant="outlined" 
                color="error" 
                onClick={() => removeProcess(process.id)}
                disabled={processes.length <= 1}
              >
                Remove
              </Button>
            </Grid>
          </Grid>
        ))}
        <Button variant="contained" color="primary" onClick={addProcess} sx={{ mt: 1 }}>
          Add Process
        </Button>
      </Box>

      <Button 
        variant="contained" 
        color="success" 
        onClick={handleSubmit} 
        fullWidth
        sx={{ mt: 2 }}
      >
        Run Allocation Algorithms
      </Button>
    </Paper>
  );
};

export default MemoryInput;