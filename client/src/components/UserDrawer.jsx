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

  const questions = [
    "Do you often find yourself overspending?",
    "Are you saving for a specific goal?",
    "Do you track your monthly expenses?",
    "Are you worried about debt?",
    "Do you have an emergency fund?",
    "Do you find budgeting overwhelming?",
    "Do you feel in control of your financial decisions?",
    "Are you satisfied with your current savings?",
    "Do you set financial goals regularly?",
    "Would you like to learn more about budgeting?",
  ];

  const [open, setOpen] = useState(false); // Controls the side drawer
  const [popupOpen, setPopupOpen] = useState(false); // Controls the popup form
  const [currentVal, setCurrentVal] = useState("");
  const [totalBudget, setTotalBudget] = useState("");
  const [progress, setProgress] = useState(null);
  const [budgetName, setBudgetName] = useState(""); // Input for budget name
  const [isSaved, setIsSaved] = useState(false); // Controls the saved message
  const [responses, setResponses] = useState(Array(questions.length).fill(null));
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [points, setPoints] = useState(0);

  //Is It Worth It Quiz segment

  //const [popupOpen, setPopupOpen] = useState(false);

  

  const togglePopup = () => setPopupOpen(!popupOpen);

  const handleAnswer = (answer) => {
    const currentResponse = responses[currentQuestionIndex];

    if (currentResponse === answer) {
      // If the user clicks the same answer again, do nothing
      return;
    }

    let newPoints = points;

    // Adjust points based on the answer change
    if (currentResponse === null) {
      // First-time answer
      newPoints += answer ? 1 : 0;
    } else if (currentResponse === true && answer === false) {
      // Switching from "Yes" to "No"
      newPoints -= 1;
    } else if (currentResponse === false && answer === true) {
      // Switching from "No" to "Yes"
      newPoints += 1;
    }

    // Update points and responses
    setPoints(newPoints);

    const updatedResponses = [...responses];
    updatedResponses[currentQuestionIndex] = answer;
    setResponses(updatedResponses);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleFinish = () => {
    togglePopup();

    if (points >= 5) {
      alert("You probably need a budget plan!");
    } else {
      alert("You're managing well, but a budget plan might still help!");
    }

    // Reset the quiz for future use
    setResponses(Array(10).fill(null));
    setPoints(0);
    setCurrentQuestionIndex(0);
  };

 
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
            </Button>

            {/* Popup Dialog for Create Budget Form */}
            <div>
      {/* Quiz Button */}
      <Button
        onClick={togglePopup}
        className="bg-orange-500 hover:bg-orange-300 w-60 h-10 rounded-lg font-Outfit text-2xl font-semibold text-white"
      >
        Is It Worth It?
      </Button>

      {/* Popup Dialog for the Quiz */}
      <Dialog
        open={popupOpen}
        onClose={togglePopup}
        fullWidth
        maxWidth="sm"
      >
        <div className="relative p-6">
          {/* Close Button */}
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

          {/* Quiz Content */}
          <div className="mt-4 text-center">
            <h2 className="text-2xl font-bold mb-4">Is It Worth It? Quiz</h2>

            {/* Question Display */}
            <p className="text-lg font-medium">{questions[currentQuestionIndex]}</p>

            {/* Answer Buttons */}
            <div className="flex justify-center mt-6 space-x-4">
              <Button
              //problem segment
                onClick={() => handleAnswer(true)}
                className={`py-2 px-4 rounded-lg ${
                  responses[currentQuestionIndex] === true
                    ? "bg-green-500 text-white"
                    : "bg-gray-300 text-black"
                }`}
              >
                Yes
              </Button>
              <Button
                //problem segment
                onClick={() => handleAnswer(false)}
                className={`py-2 px-4 rounded-lg ${
                  responses[currentQuestionIndex] === false
                    ? "bg-red-500 text-white"
                    : "bg-gray-300 text-black"
                }`}
              >
                No
              </Button>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-6">
              <Button
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
                className="bg-gray-300 hover:bg-gray-200 text-black py-2 px-4 rounded-lg"
              >
                &lt; Previous
              </Button>
              <Button
                onClick={handleNext}
                disabled={currentQuestionIndex === questions.length - 1}
                className="bg-gray-300 hover:bg-gray-200 text-black py-2 px-4 rounded-lg"
              >
                Next &gt;
              </Button>
            </div>

            {/* Finish Button */}
            {currentQuestionIndex === questions.length - 1 && (
              <Button
                onClick={() => alert("Thank you for taking the quiz!")}
                className="bg-green-500 hover:bg-green-400 text-white py-2 px-6 rounded-lg mt-6"
              >
                Finish
              </Button>
            )}
          </div>
        </div>
      </Dialog>
    </div>
          </List>
        </Box>
      </Drawer>
    </div>
  );
}
