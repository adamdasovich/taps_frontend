import React from 'react';

const SeatingLayout = ({ layout, onSeatSelect, selectedSeats = [] }) => {
    const handleSeatClick = (seatId) => {
        if (onSeatSelect) {
            onSeatSelect(seatId);
        }
    };

    // Helper function to ensure unique keys for empty cells
    const getEmptyKey = (rowIndex, seatIndex) => `empty-${rowIndex}-${seatIndex}`;

    return (
        <div className="seating-layout">
            {layout.map((row, rowIndex) => (
                <div key={`row-${rowIndex}`} className="seating-row">
                    {row.map((seat, seatIndex) => {
                        if (seat === null) {
                            // Empty space
                            return <div key={getEmptyKey(rowIndex, seatIndex)} className="seat empty"></div>;
                        }

                        const isSelected = selectedSeats.includes(seat.id);
                        const seatClasses = `seat ${seat.available ? 'available' : 'unavailable'} ${isSelected ? 'selected' : ''}`;
                        
                        return (
                            <div
                                key={`${seat.id}-${rowIndex}-${seatIndex}`} // Ensure keys are always unique
                                className={seatClasses}
                                onClick={() => seat.available && handleSeatClick(seat.id)}
                                title={`${seat.type} ${seat.id}`}
                            >
                                {seat.id.split('-')[1]}
                                {isSelected && <span className="seat-number">{selectedSeats.indexOf(seat.id) + 1}</span>}
                            </div>
                        );
                    })}
                </div>
            ))}
            
            <div className="seat-legend" style={{ marginTop: '15px', fontSize: '0.85em' }}>
                <div className="legend-item" style={{ display: 'inline-block', marginRight: '15px' }}>
                    <span className="seat-sample available" style={{ display: 'inline-block', width: '15px', height: '15px', backgroundColor: '#a8e0a8', borderRadius: '50%', marginRight: '5px' }}></span>
                    <span>Available</span>
                </div>
                <div className="legend-item" style={{ display: 'inline-block', marginRight: '15px' }}>
                    <span className="seat-sample selected" style={{ display: 'inline-block', width: '15px', height: '15px', backgroundColor: '#007bff', borderRadius: '50%', marginRight: '5px' }}></span>
                    <span>Selected</span>
                </div>
                <div className="legend-item" style={{ display: 'inline-block' }}>
                    <span className="seat-sample unavailable" style={{ display: 'inline-block', width: '15px', height: '15px', backgroundColor: '#f08080', borderRadius: '50%', marginRight: '5px' }}></span>
                    <span>Unavailable</span>
                </div>
            </div>
        </div>
    );
};

export default SeatingLayout;