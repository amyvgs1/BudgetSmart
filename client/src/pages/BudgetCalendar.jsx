import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const BudgetCalendar = () => {
    const [date, setDate] = useState(new Date());
    const [events, setEvents] = useState([]);
    /*
    // Use mock data for testing purposes
    useEffect(() => {
        setEvents([
            {
                budget_id: 1,
                budget_name: "BudgetTest1",   
                total_budget: 100,
                start_date: new Date("2024-11-03T00:00:00"),
                end_date: new Date("2024-11-06T23:59:59")
            }
        ]);
    }, []);
    */
     // Fetch budget plans from the API when the component mounts
     useEffect(() => {
        fetchBudgetPlans();
    }, []);

    const fetchBudgetPlans = async () => {
        try {
            const response = await axios.get('http://localhost:8081/budget_plan');
            console.log("Fetched budget plans:", response.data); 
            // Convert start_date and end_date to Date objects
            const formattedData = response.data.map(event => ({
                ...event,
                start_date: new Date(event.start_date),
                end_date: new Date(event.end_date)
            }));
            setEvents(formattedData);
        } catch (error) {
            console.error("Error fetching budget plans:", error.message);
        }
    };

    // Filter budget plans for the selected date, including dates in between start and end date
    const eventsForSelectedDate = events.filter(event => {
        const eventStartDate = new Date(event.start_date);
        const eventEndDate = new Date(event.end_date);
        const selectedDate = new Date(date);

        // Check if selectedDate is within the range of start_date and end_date
        return selectedDate >= eventStartDate && selectedDate <= eventEndDate;
    });

    return (
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6 mt-8">
            <h1 className="text-2xl font-semibold text-center text-blue-600 mb-4">Budget Calendar</h1>

            <Calendar 
                onChange={setDate} 
                value={date} 
                className="mb-6 border rounded-lg p-4" 
            />

            <h2 className="text-lg font-semibold text-gray-700 mb-2">Events on {date.toDateString()}</h2>
            <ul className="mb-4">
                {eventsForSelectedDate.length > 0 ? (
                    eventsForSelectedDate.map(event => (
                        <li key={event.budget_id} className="bg-blue-100 text-blue-700 p-2 rounded mb-2 shadow-sm">
                            <p><strong>Budget Name:</strong> {event.budget_name}</p>
                            <p><strong>Total Budget:</strong> {event.total_budget}</p>
                            <p><strong>Start Date:</strong> {new Date(event.start_date).toLocaleDateString()}</p>
                            <p><strong>End Date:</strong> {new Date(event.end_date).toLocaleDateString()}</p>
                        </li>
                    ))
                ) : (
                    <p className="text-gray-500">No events for this date.</p>
                )}
            </ul>
        </div>
    );
};

export default BudgetCalendar;





