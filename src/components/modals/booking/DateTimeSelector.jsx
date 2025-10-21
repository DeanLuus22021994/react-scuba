import PropTypes from 'prop-types';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const DateTimeSelector = ({ selectedDate, onDateChange, selectedTime, onTimeChange, excludeDates = [] }) => {
    // Generate time slots from 8:00 AM to 4:30 PM in 30-minute intervals
    const timeSlots = [];
    for (let hour = 8; hour <= 16; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
            if (hour === 16 && minute > 0) break; // Stop at 4:30 PM
            const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
            timeSlots.push(timeString);
        }
    }

    const filterPassedDates = (date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date >= today;
    };

    const filterSundays = (date) => {
        return date.getDay() !== 0; // 0 is Sunday
    };

    return (
        <div className="grid md:grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Date *
                </label>
                <DatePicker
                    selected={selectedDate}
                    onChange={onDateChange}
                    minDate={new Date()}
                    excludeDates={excludeDates}
                    filterDate={(date) => filterPassedDates(date) && filterSundays(date)}
                    dateFormat="dd/MM/yyyy"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
                    placeholderText="Select a date"
                    required
                />
                <p className="text-xs text-gray-500 mt-1">We are closed on Sundays</p>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Time *
                </label>
                <select
                    value={selectedTime}
                    onChange={(e) => onTimeChange(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
                    required
                >
                    <option value="">Select time</option>
                    {timeSlots.map((time) => (
                        <option key={time} value={time}>
                            {time}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};

DateTimeSelector.propTypes = {
    selectedDate: PropTypes.instanceOf(Date),
    onDateChange: PropTypes.func.isRequired,
    selectedTime: PropTypes.string.isRequired,
    onTimeChange: PropTypes.func.isRequired,
    excludeDates: PropTypes.arrayOf(PropTypes.instanceOf(Date)),
};

export default DateTimeSelector;
