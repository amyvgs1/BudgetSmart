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
import SavingsManager from './SavingsManager';
import { supabase } from "../config/supabase";
import Calculator from './Calculator';
import calc from "../assets/calc.png";

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

  const [open, setOpen] = useState(false);
  const [savingsOpen, setSavingsOpen] = useState(false);
  const [currentSavings, setCurrentSavings] = useState(0);
  const [quizOpen, setQuizOpen] = useState(false);
  const [responses, setResponses] = useState(Array(questions.length).fill(null));
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [points, setPoints] = useState(0);
  const [showCalculator, setShowCalculator] = useState(false);

  useEffect(() => {
    fetchSavingsData();
  }, []);

  const fetchSavingsData = async () => {
    try {
      const userId = localStorage.getItem("user_id");
      const { data, error } = await supabase
        .from('user_savings')
        .select('total_saved')
        .eq('user_id', userId)
        .single();

      if (error) throw error;
      setCurrentSavings(data.total_saved);
    } catch (error) {
      console.error('Error fetching savings:', error);
    }
  };

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const toggleQuiz = () => setQuizOpen(!quizOpen);

  const handleAnswer = (answer) => {
    const currentResponse = responses[currentQuestionIndex];

    if (currentResponse === answer) return;

    let newPoints = points;
    if (currentResponse === null) {
      newPoints += answer ? 1 : 0;
    } else if (currentResponse === true && answer === false) {
      newPoints -= 1;
    } else if (currentResponse === false && answer === true) {
      newPoints += 1;
    }

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
    toggleQuiz();
    if (points >= 5) {
      alert("You probably need a budget plan!");
    } else {
      alert("You're managing well, but a budget plan might still help!");
    }
    setResponses(Array(10).fill(null));
    setPoints(0);
    setCurrentQuestionIndex(0);
  };

  const navigate = useNavigate();

  const drawerContent = [
    { name: "Dashboard", url: "/dashboard", bgColor: "bg-blue-400", icon: "🏠" },
    { name: "Profile/Settings", url: "/profile", bgColor: "bg-orange-400", icon: "👤" },
    { name: "Articles", url: "/articles", bgColor: "bg-red-400", icon: "📚" },
    { name: "Add Friends", url: "/friends", bgColor: "bg-green-400", icon: "👥" },
    { name: "My Budgets", url: "/mybudgets", bgColor: "bg-purple-400", icon: "💰" },
    { name: "Leaderboard", url: "/leaderboard", bgColor: "bg-yellow-400", icon: "🏆" },
    { name: "Currency", url: "/converter", bgColor: "bg-indigo-400", icon: "💱" },
  ];

  const drawerBehavior = (url) => {
    navigate(url);
    toggleDrawer();
  };

  const toggleCalculator = () => {
    setShowCalculator(!showCalculator);
  };

  return (
    <div className="h-full">
      <IconButton onClick={toggleDrawer}>
        <MenuIcon />
      </IconButton>
      <Drawer anchor="left" open={open} onClose={toggleDrawer}>
        <Box sx={{ width: 300, height: '100%', display: 'flex', flexDirection: 'column' }} role="presentation">
          <List sx={{ p: 2, flex: 1 }}>
            {drawerContent.map((item, index) => (
              <div
                key={index}
                onClick={() => drawerBehavior(item.url)}
                className={`${item.bgColor} hover:opacity-90 transition-all duration-200 
                           rounded-lg shadow-lg p-4 mb-3 cursor-pointer transform hover:scale-105`}
              >
                <div className="flex items-center text-white">
                  <span className="text-2xl mr-3">{item.icon}</span>
                  <h2 className="text-xl font-semibold">{item.name}</h2>
                </div>
              </div>
            ))}

            <div
              onClick={() => setSavingsOpen(true)}
              className="bg-orange-500 hover:opacity-90 transition-all duration-200 
                         rounded-lg shadow-lg p-4 mb-3 cursor-pointer transform hover:scale-105"
            >
              <div className="flex items-center text-white">
                <span className="text-2xl mr-3">💵</span>
                <h2 className="text-xl font-semibold">Manage Savings</h2>
              </div>
            </div>

            <div
              onClick={toggleQuiz}
              className="bg-green-500 hover:opacity-90 transition-all duration-200 
                         rounded-lg shadow-lg p-4 mb-3 cursor-pointer transform hover:scale-105"
            >
              <div className="flex items-center text-white">
                <span className="text-2xl mr-3">🤔</span>
                <h2 className="text-xl font-semibold">Is It Worth It?</h2>
              </div>
            </div>
          </List>

          <div className="p-4 border-t mt-auto">
            <div 
              onClick={toggleCalculator}
              className="flex items-center justify-center cursor-pointer hover:bg-gray-100 rounded-full p-2"
            >
              <img src={calc} alt="Calculator" className="w-8 h-8" />
            </div>
          </div>

          {showCalculator && (
            <div className="absolute bottom-16 left-0 right-0 mx-4">
              <Calculator />
            </div>
          )}
        </Box>
      </Drawer>

      <SavingsManager
        open={savingsOpen}
        onClose={() => setSavingsOpen(false)}
      />

      <Dialog
        open={quizOpen}
        onClose={toggleQuiz}
        fullWidth
        maxWidth="sm"
      >
        <div className="relative p-6">
          <IconButton
            onClick={toggleQuiz}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              color: "red",
            }}
          >
            <CloseIcon />
          </IconButton>

          <div className="mt-4 text-center">
            <h2 className="text-2xl font-bold mb-4">Is It Worth It? Quiz</h2>
            <p className="text-lg font-medium mb-6">{questions[currentQuestionIndex]}</p>

            <div className="flex justify-center space-x-4 mb-6">
              <Button
                variant="contained"
                color={responses[currentQuestionIndex] === true ? "success" : "inherit"}
                onClick={() => handleAnswer(true)}
              >
                Yes
              </Button>
              <Button
                variant="contained"
                color={responses[currentQuestionIndex] === false ? "error" : "inherit"}
                onClick={() => handleAnswer(false)}
              >
                No
              </Button>
            </div>

            <div className="flex justify-between">
              <Button
                variant="contained"
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
              >
                Previous
              </Button>
              {currentQuestionIndex === questions.length - 1 ? (
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleFinish}
                >
                  Finish
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleNext}
                >
                  Next
                </Button>
              )}
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
