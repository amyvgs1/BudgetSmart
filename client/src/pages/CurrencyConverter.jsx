import { useState } from 'react';
import axios from 'axios';

export default function CurrencyConverter() {
    const [amount, setAmount] = useState('');
    const [fromCurrency, setFromCurrency] = useState('USD');
    const [toCurrency, setToCurrency] = useState('EUR');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    // Limited currency options
    const currencies = {
        'USD': 'US Dollar',
        'EUR': 'Euro',
        'MXN': 'Mexican Peso',
        'CAD': 'Canadian Dollar',
        'GBP': 'British Pound',
        'JPY': 'Japanese Yen'
    };

    const handleConvert = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            const response = await axios.get(`https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${fromCurrency.toLowerCase()}.json`)
                .catch(() => {
                    // Fallback URL if primary fails
                    return axios.get(`https://latest.currency-api.pages.dev/v1/currencies/${fromCurrency.toLowerCase()}.json`);
                });
            
            const rate = response.data[fromCurrency.toLowerCase()][toCurrency.toLowerCase()];
            const convertedAmount = (parseFloat(amount) * rate).toFixed(2);
            
            setResult({
                amount: amount,
                from: fromCurrency,
                to: toCurrency,
                result: convertedAmount
            });
        } catch (error) {
            console.error('Conversion error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 pt-20 font-Outfit">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="mb-8 text-center">
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">Currency Converter</h1>
                </div>

                {/* Converter Card */}
                <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
                    <form onSubmit={handleConvert}>
                        {/* Amount Input */}
                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Amount
                            </label>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter amount"
                                required
                            />
                        </div>

                        {/* Currency Selection */}
                        <div className="grid grid-cols-[1fr,auto,1fr] gap-4 mb-6 items-center">
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    From Currency
                                </label>
                                <select
                                    value={fromCurrency}
                                    onChange={(e) => setFromCurrency(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    {Object.entries(currencies).map(([code, name]) => (
                                        <option key={code} value={code}>
                                            {code} - {name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Swap Button */}
                            <button
                                type="button"
                                onClick={() => {
                                    setFromCurrency(toCurrency);
                                    setToCurrency(fromCurrency);
                                    setResult(null);
                                }}
                                className="mt-6 w-10 h-10 rounded-full bg-blue-100 hover:bg-blue-200 transition-colors flex items-center justify-center font-bold text-blue-500"
                                aria-label="Swap currencies"
                            >
                                ⇄
                            </button>

                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    To Currency
                                </label>
                                <select
                                    value={toCurrency}
                                    onChange={(e) => setToCurrency(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    {Object.entries(currencies).map(([code, name]) => (
                                        <option key={code} value={code}>
                                            {code} - {name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Convert Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full bg-blue-500 text-white py-3 px-4 rounded-md hover:bg-blue-600 transition-colors
                                ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {loading ? 'Converting...' : 'Convert'}
                        </button>
                    </form>

                    {/* Result Display */}
                    {result && (
                        <div className="mt-6 p-4 bg-gray-50 rounded-md">
                            <h2 className="text-xl font-semibold text-gray-800 mb-2">Result</h2>
                            <p className="text-gray-600">
                                {result.amount} {result.from} = 
                                <span className="text-2xl font-bold text-blue-600 ml-2">
                                    {result.result} {result.to}
                                </span>
                            </p>
                        </div>
                    )}
                </div>

                {/* Currency Info */}
                <div className="max-w-2xl mx-auto mt-6 text-center text-gray-600">
                    <p className="text-sm">
                        Exchange rates are updated daily
                    </p>
                </div>
            </div>
        </div>
    );
}
