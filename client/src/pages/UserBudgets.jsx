import React, { useState } from 'react';
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'; 
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";
import { TreeItem } from "@mui/x-tree-view/TreeItem";
import BudgetCalendar from './BudgetCalendar'; 

export const UserBudgets = () => {
  const [open, setOpen] = useState(false); // Controls calendar modal
  const [refreshCalendar, setRefreshCalendar] = useState(false); // Refreshes calendar content

  // Open the calendar modal
  const handleOpenCalendar = () => {
    setRefreshCalendar(!refreshCalendar); // Toggle refresh to reload calendar data
    setOpen(true); // Open the modal
  };

  // Close the calendar modal
  const handleCloseCalendar = () => {
    setOpen(false);
  };

  return (
    <>
      <div className="flex">
        {/* Sidebar Tree View */}
        <Box sx={{ minHeight: 352, minWidth: 250, p: 10, borderRight: '1px solid #ddd' }}>
          <SimpleTreeView>
            <TreeItem itemId="uBudget1" label="User Budget 1">
              <TreeItem itemId="grid-community" label="@mui/x-data-grid" />
              <TreeItem itemId="grid-pro" label="@mui/x-data-grid-pro" />
              <TreeItem itemId="grid-premium" label="@mui/x-data-grid-premium" />
            </TreeItem>
            <TreeItem itemId="pickers" label="User Budget 2">
              <TreeItem itemId="pickers-community" label="@mui/x-date-pickers" />
              <TreeItem itemId="pickers-pro" label="@mui/x-date-pickers-pro" />
            </TreeItem>
            <TreeItem itemId="charts" label="User Budget 3">
              <TreeItem itemId="charts-community" label="@mui/x-charts" />
            </TreeItem>
            <TreeItem itemId="tree-view" label="User Budget 4">
              <TreeItem itemId="tree-view-community" label="@mui/x-tree-view" />
            </TreeItem>
          </SimpleTreeView>
        </Box>
      </div>

      <IconButton 
        onClick={handleOpenCalendar} 
        color="primary" 
        sx={{ 
          position: 'fixed', 
          bottom: 16, 
          right: 16, 
          backgroundColor: 'white', 
          boxShadow: 3,
          '&:hover': { backgroundColor: '#f0f0f0' } 
        }}
      >
        <CalendarMonthIcon fontSize="large" />
      </IconButton>

      {/* Budget Calendar Popup */}
      <Dialog open={open} onClose={handleCloseCalendar} maxWidth="md" fullWidth>
        <DialogContent>
          <BudgetCalendar refresh={refreshCalendar} />
          <Box display="flex" justifyContent="center" mt={2}>
            <IconButton onClick={handleCloseCalendar} color="primary">
              Close
            </IconButton>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UserBudgets;
