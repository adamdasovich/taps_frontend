import React, { useState, useEffect, useCallback, useRef } from 'react'
import SeatingLayout from './SeatingLayout'

const BookingForm = (props) => {
    const [date, setDate] = useState('')
    const [times, setTimes] = useState('')
    const [guests, setGuests] = useState('')
    const [occasion, setOccasion] = useState('Birthday')
    const [selectedSeats, setSelectedSeats] = useState([])
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isLoadingSeats, setIsLoadingSeats] = useState(false)
    const [formError, setFormError] = useState(null)
    const [seatError, setSeatError] = useState(null)
    const [reservedSeats, setReservedSeats] = useState([])
    const [animated, setAnimated] = useState(false)
    
    // Use a ref to track if we've already fetched for this date/time combination
    const fetchedRef = useRef({});
    
    const MAX_SEATS = 4 // Maximum number of seats a user can select

    // Trigger animations after component mounts
    useEffect(() => {
        setTimeout(() => {
            setAnimated(true);
        }, 100);
    }, []);

    // Base seating layout with all seats available by default
    const baseSeatingLayout = [
        [
            null,
            null,
            null,
            { id: 'T1-1', type: 'table chair', available: true },
            { id: 'T1-2', type: 'table', available: true },
            null, // Represents a space or aisle
            { id: 'T2-1', type: 'bar stool', available: true },
            { id: 'T2-2', type: 'bar stool', available: true },
            null,
            { id: 'T3-1', type: 'bar stool', available: true },
            { id: 'T3-2', type: 'bar stool', available: true },
        ],
        [
            null,
            null,
            null,
            { id: 'T1-3', type: 'table', available: true },
            { id: 'T1-4', type: 'table', available: true },
            null, // Represents a space or aisle
            { id: 'T2-3', type: 'bar stool', available: true },
            { id: 'T2-4', type: 'bar stool', available: true },
            null,
            { id: 'T3-3', type: 'bar stool', available: true },
            { id: 'T3-4', type: 'bar stool', available: true },
        ],
        [
            null,
            null
        ],
        [
            { id: 'T4-1', type: 'table', available: true },
            { id: 'T4-2', type: 'table', available: true },
            null, // Represents a space or aisle
            null,
            null,
            null,
            null,
            null,
            { id: 'T5-1', type: 'bar stool', available: true },
            { id: 'T5-2', type: 'bar stool', available: true },
            { id: 'T6-1', type: 'bar stool', available: true },
        ],
        [
            { id: 'T4-3', type: 'table', available: true },
            { id: 'T4-4', type: 'table', available: true },
            null, // Represents a space or aisle
            null,
            null,
            null,
            null,
            { id: 'T5-3', type: 'bar stool', available: true },
        ],
        [
            null,
            null,
            null, // Represents a space or aisle
            null,
            null,
            null,
            null,
            { id: 'T6-2', type: 'bar stool', available: true },
        ],
        [
            { id: 'T7-1', type: 'table', available: true },
            { id: 'T7-2', type: 'table', available: true },
            null, // Represents a space or aisle
            null,
            null,
            null,
            null,
            { id: 'T8-1', type: 'bar stool', available: true },
        ],
        [
            { id: 'T7-3', type: 'table', available: true },
            { id: 'T7-4', type: 'table', available: true },
            null, // Represents a space or aisle
            null,
            null,
            null,
            null,
            { id: 'T8-2', type: 'bar stool', available: true },
        ],
        [
            null,
            null,
            null, // Represents a space or aisle
            null,
            null,
            null,
            null,
            { id: 'T9-1', type: 'bar stool', available: true },
        ]
    ];
    
    // Current seating layout with availability status
    const [seatingLayout, setSeatingLayout] = useState(baseSeatingLayout);

    // Reset seat error when guests change
    useEffect(() => {
        setSeatError(null);
    }, [guests]);

    // Create a deep copy of the seating layout
    const createLayoutCopy = useCallback(() => {
        return JSON.parse(JSON.stringify(baseSeatingLayout));
    }, []);

    // Update the seating layout based on reserved seats
    const updateSeatingLayout = useCallback((reservedSeats) => {
        // Start fresh with all seats available
        const updatedLayout = createLayoutCopy();
        
        // Mark seats as unavailable if they're reserved
        for (let rowIndex = 0; rowIndex < updatedLayout.length; rowIndex++) {
            const row = updatedLayout[rowIndex];
            for (let seatIndex = 0; seatIndex < row.length; seatIndex++) {
                const seat = row[seatIndex];
                if (seat && reservedSeats.includes(seat.id)) {
                    seat.available = false;
                }
            }
        }
        
        setSeatingLayout(updatedLayout);
    }, [createLayoutCopy]);

    // Fetch reserved seats when date and time are selected
    const fetchReservedSeats = useCallback(async () => {
        // Don't fetch if date or time is missing
        if (!date || !times) return;
        
        // Check if we've already fetched for this combination
        const key = `${date}-${times}`;
        if (fetchedRef.current[key]) {
            return;
        }
        
        // Mark as fetched to prevent duplicate requests
        fetchedRef.current[key] = true;
        
        setIsLoadingSeats(true);
        
        try {
            // Ensure time is in the right format
            let formattedTime = times;
            // If the time doesn't have seconds, add :00
            if (formattedTime.split(':').length === 2) {
                formattedTime = `${formattedTime}:00`;
            }
            
            console.log(`Fetching reserved seats for date=${date} and time=${formattedTime}`);
            
            const apiUrl = `http://localhost:8000/reservations/reserved_seats/?date=${date}&time=${formattedTime}`;
            console.log(`API URL: ${apiUrl}`);
            
            try {
                const response = await fetch(apiUrl, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                });
                
                if (!response.ok) {
                    const errorText = await response.text();
                    console.error(`Error response: ${errorText}`);
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                console.log("Reserved seats data:", data);
                setReservedSeats(data.reserved_seats || []);
                
                // Update the seating layout to mark reserved seats as unavailable
                updateSeatingLayout(data.reserved_seats || []);
            } catch (fetchError) {
                console.error("Fetch error details:", fetchError);
                
                // Provide a fallback to allow the form to work even if the API call fails
                console.log("Using empty reserved seats list as fallback");
                setReservedSeats([]);
                updateSeatingLayout([]);
                
                // Show a less alarming error to the user
                setFormError("Could not retrieve seat availability. All seats will be shown as available.");
            }
        } catch (error) {
            console.error("General error in fetchReservedSeats:", error);
            // Fall back to empty reserved seats
            setReservedSeats([]);
            updateSeatingLayout([]);
        } finally {
            setIsLoadingSeats(false);
        }
    }, [date, times, updateSeatingLayout]);

    // Effect to handle date/time changes
    useEffect(() => {
        // Clear selected seats when date or time changes
        setSelectedSeats([]);
        
        // Reset the fetchedRef for a new date/time
        if (date && times) {
            const key = `${date}-${times}`;
            if (!fetchedRef.current[key]) {
                fetchReservedSeats();
            }
        }
    }, [date, times]);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Validate number of seats selected
        if (selectedSeats.length === 0) {
            setSeatError('Please select at least one seat.');
            return;
        }
        
        if (selectedSeats.length > parseInt(guests, 10)) {
            setSeatError(`You've selected ${selectedSeats.length} seats but only have ${guests} guests. Please adjust your selection.`);
            return;
        }
        
        setIsSubmitting(true);
        setFormError(null);
        
        fetch('http://localhost:8000/reservations/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                date: date,
                time: times,
                guests: parseInt(guests, 10),
                occasion: occasion,
                seat_id: selectedSeats.join(','), // Join the array into a comma-separated string
                name: name,
                email: email
            })
        })
        .then(res => {
            if(!res.ok){
                throw new Error(`HTTP error! status: ${res.status}`)
            }
            return res.json()        
        })
        .then(data => {
            console.log('Success: ', data);
            setIsSubmitting(false);
            // Clear form fields after successful submission
            setDate('');
            setTimes('');
            setGuests('');
            setOccasion('Birthday');
            setSelectedSeats([]);
            setName('');
            setEmail('');
            // Also reset the fetchedRef
            fetchedRef.current = {};
            
            // Call parent component's submitForm function if it exists
            if (props.submitForm) {
                props.submitForm(data);
            }
        })
        .catch(err => {
            console.error('Error submitting reservation:', err);
            setFormError('Failed to submit reservation. Please try again.');
            setIsSubmitting(false);
        });                                                                                              
    }

    const handleDateChange = (e) => {
        setDate(e);
        if (props.dispatch) {
            props.dispatch(e);
        }
    }

    const handleSeatSelect = (seatId) => {
        setSelectedSeats(prevSeats => {
            // If seat is already selected, remove it (toggle functionality)
            if (prevSeats.includes(seatId)) {
                return prevSeats.filter(id => id !== seatId);
            }
            
            // If max seats already selected, show error and don't add new seat
            if (prevSeats.length >= MAX_SEATS) {
                setSeatError(`You can select a maximum of ${MAX_SEATS} seats.`);
                return prevSeats;
            }
            
            // Add the new seat
            setSeatError(null);
            return [...prevSeats, seatId];
        });
    }

    return (
        <div className="booking-page-container">
            <div className={`booking-form-container ${animated ? 'booking-animated' : ''}`}>
                <div className="booking-header">
                    <h2>Reserve Your Table</h2>
                    <div className="pub-divider booking-divider">
                        <span></span>
                        <div className="pub-icon booking-icon"></div>
                        <span></span>
                    </div>
                    <p className="booking-subtitle">Join us for great drinks and conversations!</p>
                </div>
                
                <form onSubmit={handleSubmit} className="reservation-form">
                    <fieldset>
                        {formError && <div className="error-message">{formError}</div>}
                        
                        <div className="form-grid">
                            <div className="form-group">
                                <label htmlFor='book-date'>Choose a Date: </label>
                                <input 
                                    id='book-date' 
                                    value={date} 
                                    onChange={(e) => handleDateChange(e.target.value)} 
                                    type='date' 
                                    required 
                                    className="booking-input"
                                />
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor='book-time'>Choose Time: </label>
                                <select 
                                    id='book-time' 
                                    value={times} 
                                    onChange={e => setTimes(e.target.value)}
                                    required
                                    className="booking-input"
                                >
                                    <option value=''>Select a time</option>
                                    {props.availableTimes && props.availableTimes.availableTimes && 
                                        props.availableTimes.availableTimes.map(time => (
                                            <option key={time} value={time}>{time}</option>
                                        ))
                                    }
                                </select>
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor='name-guests'>Your name: </label>
                                <input 
                                    id='name-guests' 
                                    value={name}  
                                    onChange={(e) => setName(e.target.value)} 
                                    type='text' 
                                    required 
                                    className="booking-input"
                                />
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor='email-guests'>Your email: </label>
                                <input 
                                    id='email-guests' 
                                    value={email}  
                                    onChange={(e) => setEmail(e.target.value)} 
                                    type='email' 
                                    required 
                                    className="booking-input"
                                />
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor='book-guests'>Number of guests: </label>
                                <input 
                                    id='book-guests' 
                                    min='1' 
                                    max={MAX_SEATS}
                                    value={guests}  
                                    onChange={(e) => setGuests(e.target.value)} 
                                    type='number' 
                                    required 
                                    className="booking-input"
                                />
                                <small className="booking-help-text">
                                    You can select up to {MAX_SEATS} seats.
                                </small>
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor='book-occasion'>Occasion</label>
                                <select 
                                    id='book-occasion' 
                                    value={occasion}
                                    onChange={(e) => setOccasion(e.target.value)}
                                    className="booking-input"
                                >
                                    <option value="Birthday">Birthday</option>
                                    <option value="Anniversary">Anniversary</option>
                                    <option value="Celebration">Celebration</option>
                                    <option value="Business Meeting">Business Meeting</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>
                        
                        <div className="seating-selection-container">
                            <h3 className="seating-title">Select Your Seats:</h3>
                            {seatError && <div className="error-message">{seatError}</div>}
                            
                            {isLoadingSeats ? (
                                <div className="loading-seats">Loading seat availability...</div>
                            ) : (
                                <>
                                    {(date && times) ? (
                                        <>
                                            <div className="seating-layout-container">
                                                <SeatingLayout 
                                                    layout={seatingLayout} 
                                                    onSeatSelect={handleSeatSelect} 
                                                    selectedSeats={selectedSeats}
                                                />
                                            </div>
                                            
                                            <div className="seating-legend">
                                                <div className="legend-item">
                                                    <span className="legend-color available"></span>
                                                    <span>Available</span>
                                                </div>
                                                <div className="legend-item">
                                                    <span className="legend-color selected"></span>
                                                    <span>Selected</span>
                                                </div>
                                                <div className="legend-item">
                                                    <span className="legend-color unavailable"></span>
                                                    <span>Reserved</span>
                                                </div>
                                            </div>
                                            
                                            {reservedSeats.length > 0 && (
                                                <div className="reserved-info">
                                                    Note: Red seats are already reserved for this time.
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <div className="seat-selection-notice">
                                            Please select a date and time to view available seats.
                                        </div>
                                    )}
                                </>
                            )}
                            
                            {selectedSeats.length > 0 && (
                                <div className="seat-info">
                                    <p className="selected-seats-text">Selected Seats: {selectedSeats.join(', ')}</p>
                                    <p className="seat-count">Selected {selectedSeats.length} of maximum {MAX_SEATS} seats</p>
                                </div>
                            )}
                        </div>
                        
                        <div className="submit-container">
                            <button 
                                type="submit"
                                className="submit-button"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Reserving...' : 'Reserve Now'}
                                <span className="button-icon">📝</span>
                            </button>
                        </div>
                    </fieldset>
                </form>
            </div>
        </div>
    )
}

export default BookingForm