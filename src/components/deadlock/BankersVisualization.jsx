import React from 'react';
import { Paper, Typography, Box, Grid, Divider, Chip, Alert } from '@mui/material';
import { Check as CheckIcon, Close as CloseIcon } from '@mui/icons-material';

const BankersVisualization = ({ results }) => {
  if (!results) return null;
  
  const { initialState, requestResults } = results;
  
  // Helper function to render a matrix
  const renderMatrix = (matrix, title, rowLabel = 'Process', colLabel = 'Resource') => {
    if (!matrix || matrix.length === 0) return null;
    
    return (
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>{title}</Typography>
        <Box sx={{ overflowX: 'auto' }}>
          <table style={{ borderCollapse: 'collapse', width: '100%' }}>
            <thead>
              <tr>
                <th style={{ padding: '8px', textAlign: 'center' }}>{rowLabel} \ {colLabel}</th>
                {matrix[0].map((_, colIndex) => (
                  <th key={`header-${colIndex}`} style={{ padding: '8px', textAlign: 'center' }}>
                    {colLabel} {colIndex}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {matrix.map((row, rowIndex) => (
                <tr key={`row-${rowIndex}`}>
                  <td style={{ padding: '8px', fontWeight: 'bold', textAlign: 'center' }}>
                    {rowLabel} {rowIndex}
                  </td>
                  {row.map((value, colIndex) => (
                    <td 
                      key={`cell-${rowIndex}-${colIndex}`} 
                      style={{ 
                        padding: '8px', 
                        textAlign: 'center',
                        border: '1px solid #ddd'
                      }}
                    >
                      {value}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </Box>
      </Box>
    );
  };
  
  // Helper function to render a vector
  const renderVector = (vector, title) => {
    if (!vector || vector.length === 0) return null;
    
    return (
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>{title}</Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {vector.map((value, index) => (
            <Chip 
              key={`vector-${index}`} 
              label={`Resource ${index}: ${value}`} 
              variant="outlined" 
              color="primary"
            />
          ))}
        </Box>
      </Box>
    );
  };
  
  // Render safe sequence
  const renderSafeSequence = (safeSequence, isSafe) => {
    return (
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>Safety Status</Typography>
        <Alert severity={isSafe ? "success" : "error"} sx={{ mb: 2 }}>
          The system is currently in a {isSafe ? "safe" : "unsafe"} state.
        </Alert>
        
        {isSafe && safeSequence && safeSequence.length > 0 && (
          <Box>
            <Typography variant="body2" gutterBottom>Safe Sequence:</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {safeSequence.map((processId, index) => (
                <Chip 
                  key={`seq-${index}`} 
                  label={`P${processId}`} 
                  color="success"
                  sx={{ fontWeight: 'bold' }}
                />
              ))}
            </Box>
          </Box>
        )}
        
        {!isSafe && (
          <Typography color="error">
            No safe sequence exists. Deadlock may occur.
          </Typography>
        )}
      </Box>
    );
  };
  
  // Render request results
  const renderRequestResults = (requests) => {
    if (!requests || requests.length === 0) return null;
    
    return (
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>Resource Request Results</Typography>
        {requests.map((req, index) => (
          <Paper 
            key={`req-${index}`} 
            elevation={1} 
            sx={{ 
              p: 2, 
              mb: 2, 
              border: `1px solid ${req.granted ? '#4caf50' : '#f44336'}`,
              borderLeft: `5px solid ${req.granted ? '#4caf50' : '#f44336'}`
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {req.granted ? 
                    <CheckIcon color="success" /> : 
                    <CloseIcon color="error" />}
                  <Typography variant="subtitle1">
                    Request from Process {req.processId} is {req.granted ? 'GRANTED' : 'DENIED'}
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="body2">Requested Resources:</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                  {req.request.map((value, i) => (
                    <Chip 
                      key={`req-res-${i}`} 
                      label={`R${i}: ${value}`} 
                      variant="outlined" 
                      size="small"
                    />
                  ))}
                </Box>
              </Grid>
              
              {!req.granted && req.reason && (
                <Grid item xs={12}>
                  <Alert severity="warning">
                    Reason: {req.reason}
                    {req.resourceIndex !== undefined && ` (Resource ${req.resourceIndex})`}
                  </Alert>
                </Grid>
              )}
              
              {req.granted && req.safeSequence && (
                <Grid item xs={12}>
                  <Typography variant="body2">Resulting Safe Sequence:</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                    {req.safeSequence.map((processId, i) => (
                      <Chip 
                        key={`req-seq-${i}`} 
                        label={`P${processId}`} 
                        color="success"
                        size="small"
                      />
                    ))}
                  </Box>
                </Grid>
              )}
            </Grid>
          </Paper>
        ))}
      </Box>
    );
  };
  
  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>Banker's Algorithm Results</Typography>
      
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>Initial System State</Typography>
        
        {renderSafeSequence(initialState.safeSequence, initialState.safe)}
        
        {!initialState.safe && initialState.unfinishedProcesses && initialState.unfinishedProcesses.length > 0 && (
          <Alert severity="error" sx={{ mb: 3 }}>
            Processes that could lead to deadlock: {initialState.unfinishedProcesses.map(p => `P${p}`).join(', ')}
          </Alert>
        )}
      </Box>
      
      {requestResults && requestResults.length > 0 && (
        <>
          <Divider sx={{ my: 3 }} />
          {renderRequestResults(requestResults)}
        </>
      )}
    </Paper>
  );
};

export default BankersVisualization;