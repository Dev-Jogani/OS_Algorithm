import { useState } from 'react'
import { Container, Typography, Box, Tabs, Tab, AppBar } from '@mui/material'
import './App.css'

// Memory Allocation Components
import MemoryInput from './components/memory/MemoryInput'
import MemoryVisualization from './components/memory/MemoryVisualization'
import { runAllAlgorithms } from './components/memory/AllocationAlgorithms'

// Banker's Algorithm Components
import BankersInput from './components/deadlock/BankersInput'
import BankersVisualization from './components/deadlock/BankersVisualization'
import { runBankersAlgorithm } from './components/deadlock/BankersAlgorithm'

function App() {
  // State for tab selection
  const [currentTab, setCurrentTab] = useState(0)
  
  // State for algorithm results
  const [memoryResults, setMemoryResults] = useState(null)
  const [bankersResults, setBankersResults] = useState(null)

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue)
  }

  // Handle memory allocation form submission
  const handleMemorySubmit = (data) => {
    const results = runAllAlgorithms(data.memoryBlocks, data.processes)
    
    // Add the original data to each algorithm result for visualization
    Object.keys(results).forEach(key => {
      results[key].memoryBlocks = data.memoryBlocks
      results[key].processes = data.processes
    })
    
    setMemoryResults(results)
  }

  // Handle banker's algorithm form submission
  const handleBankersSubmit = (data) => {
    const results = runBankersAlgorithm(data)
    setBankersResults(results)
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" align="center" gutterBottom>
        OS Algorithm Simulator
      </Typography>
      
      <AppBar position="static" color="default" sx={{ mb: 3 }}>
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="Memory Allocation" />
          <Tab label="Deadlock Prevention" />
        </Tabs>
      </AppBar>
      
      {/* Memory Allocation Tab */}
      {currentTab === 0 && (
        <Box>
          <Typography variant="h4" gutterBottom>
            Memory Allocation Algorithms
          </Typography>
          <Typography variant="body1" paragraph>
            This simulator demonstrates four memory allocation algorithms: First Fit, Next Fit, Best Fit, and Worst Fit.
            Enter memory blocks and processes to see how each algorithm performs.
          </Typography>
          
          <MemoryInput onSubmit={handleMemorySubmit} />
          
          {memoryResults && <MemoryVisualization results={memoryResults} />}
        </Box>
      )}
      
      {/* Banker's Algorithm Tab */}
      {currentTab === 1 && (
        <Box>
          <Typography variant="h4" gutterBottom>
            Banker's Algorithm (Deadlock Prevention)
          </Typography>
          <Typography variant="body1" paragraph>
            The Banker's Algorithm is used for deadlock avoidance. It determines whether allocating resources to a process will lead to a safe state.
            Enter the available resources, maximum claims, current allocations, and resource requests to see if the system remains in a safe state.
          </Typography>
          
          <BankersInput onSubmit={handleBankersSubmit} />
          
          {bankersResults && <BankersVisualization results={bankersResults} />}
        </Box>
      )}
    </Container>
  )
}

export default App
