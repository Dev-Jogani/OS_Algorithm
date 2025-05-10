import React from 'react';
import { AppBar, Tabs, Tab, Typography, Box } from '@mui/material';

const Navigation = ({ currentTab, handleTabChange }) => {
  return (
    <>
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
    </>
  );
};

export default Navigation;