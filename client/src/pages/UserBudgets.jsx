import React, { useState } from 'react';
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'; 
import BudgetCalendar from './BudgetCalendar'; 
import BudgetListDisplay from '../components/BudgetListComponents/BudgetListDisplay';
import CreateBudget from '../components/BudgetListComponents/CreateBudget';

export const UserBudgets = () => {
  const [open, setOpen] = useState(false); // Controls calendar modal
  const [refreshCalendar, setRefreshCalendar] = useState(false); // Refreshes calendar content

  const [showLists, setShowLists] = useState(true);
  const [budgetLists, addBudgetLists] = useState([]);

  // logic for adding budgets
  const addBudgets = (newItem) => {
    addBudgetLists([...budgetLists, newItem]);
  }

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
      {showLists ? <BudgetListDisplay setShowLists={setShowLists} /> : <CreateBudget addBudgetLists={addBudgets} setShowLists={setShowLists} />}

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
