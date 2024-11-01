import React, { useState } from "react";
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

export default function UserDrawer() {
  const [open, setOpen] = useState(false); // Controls the side drawer
  const [popupOpen, setPopupOpen] = useState(false); // Controls the popup form
  const [currentVal, setCurrentVal] = useState("");
  const [totalBudget, setTotalBudget] = useState("");
  const [progress, setProgress] = useState(null);
  const [budgetName, setBudgetName] = useState(""); // Input for budget name
  const [isSaved, setIsSaved] = useState(false); // Controls the saved message

  // For PieChart data
  const chartData =
    progress !== null
      ? [
          { label: "Achieved", value: progress },
          { label: "Remaining", value: 100 - progress },
        ]
      : [];

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const togglePopup = () => {
    setPopupOpen(!popupOpen);
  };

  // Handle form submit to calculate the budget progress
  const handleSubmit = (e) => {
    e.preventDefault();
    const currentValFloat = parseFloat(currentVal);
    const totalBudgetFloat = parseFloat(totalBudget);

    if (
      isNaN(currentValFloat) ||
      isNaN(totalBudgetFloat) ||
      totalBudgetFloat <= 0 ||
      currentValFloat < 0
    ) {
      alert("Please enter valid values.");
      return;
    }

    const progressPercentage = (
      (currentValFloat / totalBudgetFloat) *
      100
    ).toFixed(2);
    setProgress(parseFloat(progressPercentage));
  };

  // Handle Save Budget
  const handleSave = () => {
    if (budgetName) {
      setIsSaved(true); // Show the 'Budget Saved' message
      setTimeout(() => {
        setIsSaved(false); // Hide the message after 3 seconds
      }, 3000);
    } else {
      alert("Please enter a name for the budget.");
    }
  };

  const navigate = useNavigate();

  // Create objects that contain name and destination
  const drawerContent = [
    { name: "Dashboard", url: "/dashboard" },
    { name: "Profile/Settings", url: "/profile" },
    { name: "Articles", url: "/articles" },
    { name: "Add Friends", url: "/addfriends" },
    { name: "My Budgets", url: "/mybudgets" },
    { name: "Leaderboard", url: "/leader" },
  ];

  const drawerBehavior = (url) => {
    navigate(url);
    toggleDrawer();
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
              Create Budget
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

                {/* Form Content */}
                <form onSubmit={handleSubmit} className="mt-4">
                  <TextField
                    label="Current Value"
                    type="number"
                    fullWidth
                    value={currentVal}
                    onChange={(e) => setCurrentVal(e.target.value)}
                    required
                    margin="normal"
                  />
                  <TextField
                    label="Total Budget"
                    type="number"
                    fullWidth
                    value={totalBudget}
                    onChange={(e) => setTotalBudget(e.target.value)}
                    required
                    margin="normal"
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                  >
                    Calculate Progress
                  </Button>
                </form>

                {/* Render the Pie Chart if progress is available */}
                {progress !== null && (
                  <div className="mt-6 bg-gray-100 p-6 rounded-lg text-center max-w-lg mx-auto">
                    <h3 className="text-2xl font-semibold mb-2">Progress</h3>
                    <p className="text-lg">
                      You have achieved{" "}
                      <span className="font-bold text-blue-600">
                        {progress}%
                      </span>{" "}
                      of your goal!
                    </p>
                    <PieChart
                      series={[
                        {
                          innerRadius: 10,
                          outerRadius: 100,
                          startAngle: -90,
                          endAngle: 90,
                          data: chartData,
                        },
                      ]}
                      width={400}
                      height={200}
                    />
                  </div>
                )}

                {/* Save Budget Section */}
                <div className="mt-6">
                  <TextField
                    label="Save Budget As"
                    type="text"
                    fullWidth
                    value={budgetName}
                    onChange={(e) => setBudgetName(e.target.value)}
                    required
                    margin="normal"
                  />
                  <Button
                    onClick={handleSave}
                    variant="contained"
                    color="success"
                    fullWidth
                  >
                    Save
                  </Button>

                  {/* Show "Budget Saved" message */}
                  {isSaved && (
                    <p className="text-green-600 font-semibold mt-2 text-center">
                      Budget Saved!
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
