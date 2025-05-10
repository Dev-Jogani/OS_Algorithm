import React from 'react';
import { Paper, Typography, Box, Grid, Divider } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const MemoryVisualization = ({ results }) => {
  if (!results) return null;
  
  const { firstFit, nextFit, bestFit, worstFit } = results;
  const algorithms = [firstFit, nextFit, bestFit, worstFit];
  
  // Prepare data for fragmentation comparison chart
  const fragmentationChartData = {
    labels: ['First Fit', 'Next Fit', 'Best Fit', 'Worst Fit'],
    datasets: [
      {
        label: 'Internal Fragmentation',
        data: algorithms.map(algo => algo.internalFragmentation.reduce((sum, val) => sum + val, 0)),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
      },
      {
        label: 'External Fragmentation',
        data: algorithms.map(algo => algo.externalFragmentation),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
      },
      {
        label: 'Total Fragmentation',
        data: algorithms.map(algo => algo.totalFragmentation),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };
  
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Fragmentation Comparison',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Memory Units',
        },
      },
    },
  };
  
  // Helper function to render memory blocks
  const renderMemoryBlocks = (algorithm, memoryBlocks, processes) => {
    return (
      <Box sx={{ mt: 2 }}>
        <Typography variant="h6" gutterBottom>{algorithm.algorithm} Results</Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" gutterBottom>Memory Blocks Allocation</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {memoryBlocks.map((block, index) => {
                // Find which process is allocated to this block
                const allocatedProcessIndex = algorithm.allocation.findIndex(alloc => alloc === index);
                const isAllocated = allocatedProcessIndex !== -1;
                const processId = isAllocated ? processes[allocatedProcessIndex].id : null;
                const internalFrag = algorithm.internalFragmentation[index];
                
                return (
                  <Box 
                    key={`block-${index}`}
                    sx={{
                      height: 50,
                      display: 'flex',
                      position: 'relative',
                      border: '1px solid #ccc',
                      borderRadius: 1,
                      overflow: 'hidden',
                    }}
                  >
                    {isAllocated ? (
                      <>
                        <Box 
                          sx={{
                            width: `${((block.size - internalFrag) / block.size) * 100}%`,
                            bgcolor: 'success.main',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                          }}
                        >
                          P{processId}
                        </Box>
                        {internalFrag > 0 && (
                          <Box 
                            sx={{
                              width: `${(internalFrag / block.size) * 100}%`,
                              bgcolor: 'warning.main',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'white',
                            }}
                          >
                            {internalFrag}
                          </Box>
                        )}
                      </>
                    ) : (
                      <Box 
                        sx={{
                          width: '100%',
                          bgcolor: 'grey.300',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        Free ({block.size})
                      </Box>
                    )}
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        position: 'absolute', 
                        top: 0, 
                        right: 2,
                        bgcolor: 'rgba(255,255,255,0.7)',
                        px: 0.5,
                        borderRadius: 1,
                      }}
                    >
                      Block {index} ({block.size})
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" gutterBottom>Process Allocation Status</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {processes.map((process, index) => {
                const blockIndex = algorithm.allocation[index];
                const isAllocated = blockIndex !== null;
                
                return (
                  <Box 
                    key={`process-${index}`}
                    sx={{
                      height: 40,
                      display: 'flex',
                      alignItems: 'center',
                      px: 2,
                      border: '1px solid #ccc',
                      borderRadius: 1,
                      bgcolor: isAllocated ? 'success.light' : 'error.light',
                      color: 'white',
                    }}
                  >
                    <Typography>
                      Process {process.id} (Size: {process.size}) - 
                      {isAllocated 
                        ? `Allocated to Block ${blockIndex}` 
                        : 'Not Allocated'}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          </Grid>
        </Grid>
        
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1">Fragmentation Summary:</Typography>
          <Typography>Internal Fragmentation: {algorithm.internalFragmentation.reduce((sum, val) => sum + val, 0)} units</Typography>
          <Typography>External Fragmentation: {algorithm.externalFragmentation} units</Typography>
          <Typography>Total Fragmentation: {algorithm.totalFragmentation} units</Typography>
          {algorithm.unallocatedProcesses.length > 0 && (
            <Typography>Unallocated Processes: {algorithm.unallocatedProcesses.join(', ')}</Typography>
          )}
        </Box>
        
        <Divider sx={{ my: 3 }} />
      </Box>
    );
  };
  
  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>Memory Allocation Results</Typography>
      
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>Fragmentation Comparison</Typography>
        <Bar data={fragmentationChartData} options={chartOptions} height={80} />
      </Box>
      
      {/* Render detailed results for each algorithm */}
      {renderMemoryBlocks(firstFit, firstFit.memoryBlocks, firstFit.processes)}
      {renderMemoryBlocks(nextFit, nextFit.memoryBlocks, nextFit.processes)}
      {renderMemoryBlocks(bestFit, bestFit.memoryBlocks, bestFit.processes)}
      {renderMemoryBlocks(worstFit, worstFit.memoryBlocks, worstFit.processes)}
    </Paper>
  );
};

export default MemoryVisualization;