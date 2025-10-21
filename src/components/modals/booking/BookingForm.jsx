import { zodResolver } from '@hookform/resolvers/zod';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { EXPERIENCE_LEVELS } from '../../../data/bookingTypes';
import DateTimeSelector from './DateTimeSelector';

const bookingSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    phone: z.string().min(8, 'Please enter a valid phone number'),
    participants: z.number().min(1, 'At least 1 participant required').max(12, 'Maximum 12 participants'),
    experienceLevel: z.string().min(1, 'Please select experience level'),
    specialRequests: z.string().optional(),
});

const BookingForm = ({
    onSubmit,
    selectedItem,
    items,
    onItemChange,
    selectedDate,
    onDateChange,
    selectedTime,
    onTimeChange,
    participants,
    onParticipantsChange,
    totalPrice,
    isSubmitting,
}) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm({
        resolver: zodResolver(bookingSchema),
        defaultValues: {
            name: '',
            email: '',
            phone: '',
            participants: 1,
            experienceLevel: '',
            specialRequests: '',
        },
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Item Selection */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select {items[0]?.duration ? 'Course' : 'Dive'} *
                </label>
                <select
                    value={selectedItem?.id || ''}
                    onChange={(e) => {
                        const item = items.find((i) => i.id === e.target.value);
                        onItemChange(item);
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
                    required
                >
                    <option value="">Select an option</option>
                    {items.map((item) => (
                        <option key={item.id} value={item.id}>
                            {item.name} - {item.duration}
                        </option>
                    ))}
                </select>
            </div>

            {/* Date and Time */}
            <DateTimeSelector
                selectedDate={selectedDate}
                onDateChange={onDateChange}
                selectedTime={selectedTime}
                onTimeChange={onTimeChange}
            />

            {/* Personal Information */}
            <div className="grid md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                    </label>
                    <input
                        type="text"
                        {...register('name')}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent ${errors.name ? 'border-red-500' : 'border-gray-300'
                            }`}
                        placeholder="John Doe"
                    />
                    {errors.name && (
                        <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                    </label>
                    <input
                        type="email"
                        {...register('email')}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent ${errors.email ? 'border-red-500' : 'border-gray-300'
                            }`}
                        placeholder="john@example.com"
                    />
                    {errors.email && (
                        <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                    )}
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                    </label>
                    <input
                        type="tel"
                        {...register('phone')}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent ${errors.phone ? 'border-red-500' : 'border-gray-300'
                            }`}
                        placeholder="+230 5xxx xxxx"
                    />
                    {errors.phone && (
                        <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Number of Participants *
                    </label>
                    <input
                        type="number"
                        {...register('participants', { valueAsNumber: true })}
                        min="1"
                        max="12"
                        value={participants}
                        onChange={(e) => onParticipantsChange(parseInt(e.target.value) || 1)}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent ${errors.participants ? 'border-red-500' : 'border-gray-300'
                            }`}
                    />
                    {errors.participants && (
                        <p className="text-red-500 text-xs mt-1">{errors.participants.message}</p>
                    )}
                </div>
            </div>

            {/* Experience Level */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Experience Level *
                </label>
                <select
                    {...register('experienceLevel')}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent ${errors.experienceLevel ? 'border-red-500' : 'border-gray-300'
                        }`}
                >
                    <option value="">Select your experience level</option>
                    {EXPERIENCE_LEVELS.map((level) => (
                        <option key={level} value={level}>
                            {level}
                        </option>
                    ))}
                </select>
                {errors.experienceLevel && (
                    <p className="text-red-500 text-xs mt-1">{errors.experienceLevel.message}</p>
                )}
            </div>

            {/* Special Requests */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Special Requests (Optional)
                </label>
                <textarea
                    {...register('specialRequests')}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
                    placeholder="Any special requirements or questions..."
                />
            </div>

            {/* Price Summary */}
            {selectedItem && (
                <div className="bg-ocean-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-700">
                            {selectedItem.name} × {participants}
                        </span>
                        <span className="font-semibold text-ocean-800">{totalPrice}</span>
                    </div>
                    <p className="text-xs text-gray-600">
                        Final price will be confirmed based on availability and any special requirements
                    </p>
                </div>
            )}

            {/* Submit Button */}
            <button
                type="submit"
                disabled={isSubmitting || !selectedItem || !selectedDate || !selectedTime}
                className="w-full bg-ocean-600 hover:bg-ocean-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
                {isSubmitting ? 'Processing...' : 'Confirm Booking Request'}
            </button>

            <p className="text-xs text-gray-500 text-center">
                This is a booking request. We'll confirm availability and contact you within 24 hours.
            </p>
        </form>
    );
};

BookingForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    selectedItem: PropTypes.object,
    items: PropTypes.array.isRequired,
    onItemChange: PropTypes.func.isRequired,
    selectedDate: PropTypes.instanceOf(Date),
    onDateChange: PropTypes.func.isRequired,
    selectedTime: PropTypes.string.isRequired,
    onTimeChange: PropTypes.func.isRequired,
    participants: PropTypes.number.isRequired,
    onParticipantsChange: PropTypes.func.isRequired,
    totalPrice: PropTypes.string.isRequired,
    isSubmitting: PropTypes.bool.isRequired,
};

export default BookingForm;
