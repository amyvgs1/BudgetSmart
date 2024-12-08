import { useState, useEffect } from 'react';
import { Dialog, Button, TextField, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import CloseIcon from '@mui/icons-material/Close';
import { supabase } from "../config/supabase";

export default function SavingsManager({ open, onClose }) {
    const [customAmount, setCustomAmount] = useState("");
    const [recentTransactions, setRecentTransactions] = useState([]);
    const [currentSavings, setCurrentSavings] = useState(0);
    const [showCustomInput, setShowCustomInput] = useState(false);

    useEffect(() => {
        if (open) {
            fetchSavingsData();
            fetchRecentTransactions();
        }
    }, [open]);

    const fetchSavingsData = async () => {
        try {
            const userId = localStorage.getItem("user_id");
            const { data, error } = await supabase
                .from('user_savings')
                .select('total_saved')
                .eq('user_id', userId)
                .single();

            if (error) throw error;
            setCurrentSavings(data.total_saved || 0);
        } catch (error) {
            console.error('Error fetching savings:', error);
        }
    };

    const fetchRecentTransactions = async () => {
        try {
            const userId = localStorage.getItem("user_id");
            const { data, error } = await supabase
                .from('savings_transactions')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false })
                .limit(3);

            if (error) throw error;
            setRecentTransactions(data || []);
        } catch (error) {
            console.error('Error fetching transactions:', error);
        }
    };

    const handleTransaction = async (amount, type) => {
        try {
            const userId = localStorage.getItem("user_id");
            const transactionAmount = type === 'withdrawal' ? -amount : amount;
            const newTotal = currentSavings + transactionAmount;

            // Update user_savings
            const { error: savingsError } = await supabase
                .from('user_savings')
                .update({ total_saved: newTotal })
                .eq('user_id', userId);

            if (savingsError) throw savingsError;

            // Log transaction
            const { error: transactionError } = await supabase
                .from('savings_transactions')
                .insert([{
                    user_id: userId,
                    amount: transactionAmount,  // Store negative value for withdrawals
                    type: type,
                    description: `Quick ${type} of $${Math.abs(amount)}`
                }]);

            if (transactionError) throw transactionError;

            // Refresh data
            await fetchSavingsData();
            await fetchRecentTransactions();
            setCustomAmount("");
            setShowCustomInput(false);

        } catch (error) {
            console.error('Error processing transaction:', error);
            alert('Failed to process transaction. Please try again.');
        }
    };

    const handleCustomTransaction = async (e) => {
        e.preventDefault();
        const amount = parseFloat(customAmount);
        if (isNaN(amount) || amount <= 0) {
            alert('Please enter a valid amount');
            return;
        }
        await handleTransaction(amount, 'deposit');
    };

    return (
        <Dialog 
            open={open} 
            onClose={onClose}
            maxWidth="sm"
            fullWidth
        >
            <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Savings Manager</h2>
                    <IconButton onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </div>

                <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-2">
                        Current Savings: ${currentSavings.toFixed(2)}
                    </h3>
                </div>

                <div className="flex gap-3 mb-4">
                    <Button
                        onClick={() => handleTransaction(100, 'deposit')}
                        variant="contained"
                        color="success"
                        startIcon={<AddIcon />}
                        fullWidth
                    >
                        Add $100
                    </Button>
                    <Button
                        onClick={() => handleTransaction(100, 'withdrawal')}
                        variant="contained"
                        color="error"
                        startIcon={<RemoveIcon />}
                        fullWidth
                    >
                        Withdraw $100
                    </Button>
                </div>

                <Button
                    onClick={() => setShowCustomInput(!showCustomInput)}
                    variant="outlined"
                    fullWidth
                    className="mb-4"
                >
                    Custom Amount
                </Button>

                {showCustomInput && (
                    <div className="mb-4">
                        <TextField
                            label="Amount"
                            type="number"
                            value={customAmount}
                            onChange={(e) => setCustomAmount(e.target.value)}
                            fullWidth
                            required
                            margin="normal"
                        />
                        <div className="flex gap-3">
                            <Button
                                onClick={() => handleTransaction(parseFloat(customAmount), 'deposit')}
                                variant="contained"
                                color="success"
                                fullWidth
                                disabled={!customAmount || parseFloat(customAmount) <= 0}
                            >
                                Add to Savings
                            </Button>
                            <Button
                                onClick={() => handleTransaction(parseFloat(customAmount), 'withdrawal')}
                                variant="contained"
                                color="error"
                                fullWidth
                                disabled={!customAmount || parseFloat(customAmount) <= 0}
                            >
                                Withdraw from Savings
                            </Button>
                        </div>
                    </div>
                )}

                <div className="mt-6">
                    <h3 className="text-xl font-semibold mb-3">Recent Transactions</h3>
                    {recentTransactions.length === 0 ? (
                        <p className="text-gray-500">No recent transactions</p>
                    ) : (
                        recentTransactions.map((transaction) => (
                            <div 
                                key={transaction.transaction_id} 
                                className="flex justify-between items-center py-2 border-b"
                            >
                                <span>{transaction.description}</span>
                                <span className={
                                    transaction.type === 'deposit' 
                                        ? 'text-green-600 font-semibold' 
                                        : 'text-red-600 font-semibold'
                                }>
                                    {transaction.type === 'deposit' ? '+' : '-'}
                                    ${Math.abs(transaction.amount)}
                                </span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </Dialog>
    );
} 