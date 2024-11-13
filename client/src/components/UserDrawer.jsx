import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { PieChart } from "@mui/x-charts/PieChart";
import Dialog from "@mui/material/Dialog";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { Box, List } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { supabase } from '../config/supabase';

export default function UserDrawer() {
  const [open, setOpen] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);
  const [currentSaved, setCurrentSaved] = useState(0);
  const [savingsGoal, setSavingsGoal] = useState(2000);
  const [progress, setProgress] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const userId = sessionStorage.getItem("user_id");
  const [quickAddAmount, setQuickAddAmount] = useState('');

  // Fetch current savings data
  useEffect(() => {
    const fetchSavingsData = async () => {
      try {
        const { data, error } = await supabase
          .from('user_savings')
          .select('total_saved, savings_goal')
          .eq('user_id', userId)
          .single();

        if (error) throw error;

        if (data) {
          setCurrentSaved(data.total_saved);
          setSavingsGoal(data.savings_goal);
          setProgress((data.total_saved / data.savings_goal) * 100);
        }
      } catch (error) {
        console.error('Error fetching savings:', error);
      }
    };

    if (popupOpen) {
      fetchSavingsData();
    }
  }, [popupOpen, userId]);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const togglePopup = () => {
    setPopupOpen(!popupOpen);
  };

  // Handle saving updates
  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from('user_savings')
        .update({ 
          savings_goal: savingsGoal,
          total_saved: currentSaved
        })
        .eq('user_id', userId);

      if (error) throw error;

      setProgress((currentSaved / savingsGoal) * 100);
      setIsSaved(true);
      setTimeout(() => {
        setIsSaved(false);
        togglePopup();
      }, 2000);

    } catch (error) {
      console.error('Error updating savings:', error);
      alert('Failed to update savings');
    }
  };

  // Calculate chart data
  const chartData = [
    { label: "Saved", value: currentSaved },
    { label: "Remaining", value: Math.max(savingsGoal - currentSaved, 0) }
  ];

  const navigate = useNavigate();

  // Create objects that contain name and destination
  const drawerContent = [
    { name: "Dashboard", url: "/dashboard" },
    { name: "Profile/Settings", url: "/profile" },
    { name: "Articles", url: "/articles" },
    { name: "Add Friends", url: "/addfriends" },
    { name: "My Budgets", url: "/mybudgets" },
    { name: "Leaderboard", url: "/leader" },
    { name: "Currency", url: "/currency" },
  ];

  const drawerBehavior = (url) => {
    navigate(url);
    toggleDrawer();
  };

  // Add function to handle quick add
  const handleQuickAdd = async (amount) => {
    try {
      const newTotal = currentSaved + amount;
      const { error } = await supabase
        .from('user_savings')
        .update({ 
          total_saved: newTotal
        })
        .eq('user_id', userId);

      if (error) throw error;

      setCurrentSaved(newTotal);
      setProgress((newTotal / savingsGoal) * 100);
      setQuickAddAmount('');
    } catch (error) {
      console.error('Error updating savings:', error);
      alert('Failed to update savings');
    }
  };

  return (
    <div className="h-full">
      <IconButton onClick={toggleDrawer}>
        <MenuIcon />
      </IconButton>
      <Drawer anchor="left" open={open} onClose={toggleDrawer}>
        <Box sx={{ width: 250 }} role="presentation">
          <List
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {drawerContent.map((element, index) => {
              return (
                <li key={index}>
                  <div
                    className="flex items-center text-2xl font-Outfit justify-center h-20 border-b border-t hover:bg-orange-300 hover:text-white p-10"
                    onClick={() => drawerBehavior(element.url)}
                  >
                    <h2>{element.name}</h2>
                  </div>
                </li>
              );
            })}

            <Button
              onClick={togglePopup}
              className="bg-orange-500 hover:bg-orange-300 w-60 h-10 rounded-lg font-Outfit text-2xl font-semibold text-white"
            >
              Update Savings
            </Button>

            {/* Popup Dialog for Create Budget Form */}
            <Dialog
              open={popupOpen}
              onClose={togglePopup}
              fullWidth
              maxWidth="sm"
            >
              <div className="relative p-6">
                {/* Red 'X' Button to close the dialog */}
                <IconButton
                  aria-label="close"
                  onClick={togglePopup}
                  sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    color: "red",
                  }}
                >
                  <CloseIcon />
                </IconButton>

                <div className="mt-4 flex flex-col items-center">
                  <h2 className="text-2xl font-semibold mb-4 text-center">Update Savings Progress</h2>
                  
                  <div className="space-y-4 w-full max-w-md">
                    <TextField
                      label="Current Savings"
                      type="number"
                      fullWidth
                      value={currentSaved}
                      onChange={(e) => {
                        const value = Number(e.target.value);
                        setCurrentSaved(value >= 0 ? value : 0);
                        setProgress((value / savingsGoal) * 100);
                      }}
                      required
                      margin="normal"
                      InputProps={{
                        startAdornment: <span className="text-gray-500 mr-1">$</span>,
                      }}
                    />

                    <TextField
                      label="Savings Goal"
                      type="number"
                      fullWidth
                      value={savingsGoal}
                      onChange={(e) => {
                        const value = Number(e.target.value);
                        setSavingsGoal(value > 0 ? value : 1);
                        setProgress((currentSaved / value) * 100);
                      }}
                      required
                      margin="normal"
                      InputProps={{
                        startAdornment: <span className="text-gray-500 mr-1">$</span>,
                      }}
                    />
                  </div>

                  {/* Quick Add Section */}
                  <div className="mt-6 p-4 border rounded-lg w-full max-w-md">
                    <h3 className="text-lg font-semibold mb-3 text-center">Quick Add to Savings</h3>
                    
                    {/* Preset Buttons */}
                    <div className="flex flex-wrap justify-center gap-2 mb-3">
                      {[10, 20, 50, 100].map((amount) => (
                        <button
                          key={amount}
                          onClick={() => handleQuickAdd(amount)}
                          className="px-4 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-full transition-colors"
                        >
                          +${amount}
                        </button>
                      ))}
                    </div>

                    {/* Custom Amount Input */}
                    <div className="flex justify-center gap-2">
                      <TextField
                        label="Custom Amount"
                        type="number"
                        size="small"
                        value={quickAddAmount}
                        onChange={(e) => setQuickAddAmount(e.target.value)}
                        InputProps={{
                          startAdornment: <span className="text-gray-500 mr-1">$</span>,
                        }}
                      />
                      <Button
                        onClick={() => {
                          if (quickAddAmount) {
                            handleQuickAdd(Number(quickAddAmount));
                          }
                        }}
                        variant="contained"
                        color="success"
                        disabled={!quickAddAmount}
                      >
                        Add
                      </Button>
                    </div>
                  </div>

                  {/* Progress Display */}
                  <div className="mt-6 bg-gray-100 p-6 rounded-lg w-full max-w-md">
                    <h3 className="text-xl font-semibold mb-2 text-center">Current Progress</h3>
                    <p className="text-lg mb-4 text-center">
                      ${currentSaved.toLocaleString()} saved of ${savingsGoal.toLocaleString()} goal
                      <br />
                      <span className={`font-bold ${progress >= 100 ? 'text-green-600' : 'text-blue-600'}`}>
                        {progress?.toFixed(1)}%
                      </span>
                    </p>
                    <div className="flex justify-center">
                      <PieChart
                        series={[
                          {
                            innerRadius: 10,
                            outerRadius: 100,
                            data: chartData,
                            colors: [progress >= 100 ? '#059669' : '#2563eb', '#e5e7eb']
                          },
                        ]}
                        width={400}
                        height={200}
                      />
                    </div>
                  </div>

                  <Button
                    onClick={handleSave}
                    variant="contained"
                    color="primary"
                    fullWidth
                    className="mt-4"
                    sx={{
                      backgroundColor: '#2563eb',
                      '&:hover': {
                        backgroundColor: '#1d4ed8',
                      },
                      maxWidth: '28rem',
                    }}
                  >
                    Update Savings
                  </Button>

                  {isSaved && (
                    <p className="text-green-600 font-semibold mt-2 text-center">
                      Savings Updated Successfully!
                    </p>
                  )}
                </div>
              </div>
            </Dialog>
          </List>
        </Box>
      </Drawer>
    </div>
  );
}
