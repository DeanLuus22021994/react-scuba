import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { zodResolver } from '@hookform/resolvers/zod';
import PropTypes from 'prop-types';
import { Fragment, useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';
import { useCurrency } from '../../hooks/useCurrency';
import { checkCalendarAvailability, createCalendarBooking } from '../../services/api';
import {
  trackCalendarBookingComplete,
  trackFormAbandon,
  trackFormStart,
} from '../../utils/analytics';
import logger from '../../utils/logger';
import Loading from '../common/Loading';

const bookingSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(8, 'Please enter a valid phone number'),
  participants: z
    .number()
    .min(1, 'At least 1 participant required')
    .max(12, 'Maximum 12 participants'),
  experienceLevel: z.string().min(1, 'Please select experience level'),
  specialRequests: z.string().optional(),
});

const EXPERIENCE_LEVELS = [
  'Beginner - Never dived before',
  'Discover Scuba Diver',
  'Open Water Diver',
  'Advanced Open Water Diver',
  'Rescue Diver',
  'Divemaster or higher',
];

const BOOKING_TYPES = {
  course: [
    { id: 'discover-scuba', name: 'Discover Scuba Diving', duration: '1 day', price: 4500 },
    { id: 'open-water', name: 'Open Water Diver', duration: '3-4 days', price: 15000 },
    { id: 'advanced', name: 'Advanced Open Water', duration: '2-3 days', price: 12000 },
    { id: 'rescue', name: 'Rescue Diver', duration: '3-4 days', price: 14000 },
    { id: 'divemaster', name: 'Divemaster Course', duration: '6-8 weeks', price: 45000 },
  ],
  dive: [
    { id: 'single-dive', name: 'Single Dive', duration: '2-3 hours', price: 2500 },
    { id: 'double-dive', name: 'Double Dive', duration: '4-5 hours', price: 4000 },
    { id: 'night-dive', name: 'Night Dive', duration: '2-3 hours', price: 3500 },
    { id: 'wreck-dive', name: 'Wreck Dive', duration: '3-4 hours', price: 3000 },
  ],
};

const BookingModal = ({
  isOpen,
  onClose,
  bookingType = 'dive', // 'course' or 'dive'
  preSelectedItem = null,
  source = 'unknown',
}) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('09:00');
  const [selectedItem, setSelectedItem] = useState(preSelectedItem);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStartTime, setFormStartTime] = useState(null);
  const { currency, convert, format } = useCurrency();

  const items = BOOKING_TYPES[bookingType] || BOOKING_TYPES.dive;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
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

  const participants = watch('participants');

  useEffect(() => {
    if (isOpen && !formStartTime) {
      setFormStartTime(Date.now());
      trackFormStart('booking_form', source);
    }
  }, [isOpen, formStartTime, source]);

  useEffect(() => {
    if (preSelectedItem) {
      setSelectedItem(preSelectedItem);
    }
  }, [preSelectedItem]);

  const handleClose = () => {
    if (formStartTime && !isSubmitting) {
      const timeSpent = (Date.now() - formStartTime) / 1000;
      const formData = watch();
      const filledFields = Object.values(formData).filter(
        (val) => val && String(val).length > 0
      ).length;
      const totalFields = Object.keys(formData).length;
      const completionPercentage = (filledFields / totalFields) * 100;

      if (completionPercentage > 10 && timeSpent > 5) {
        trackFormAbandon('booking_form', source, Math.round(completionPercentage));
      }
    }

    reset();
    setSelectedDate(null);
    setSelectedTime('09:00');
    setSelectedItem(preSelectedItem);
    setFormStartTime(null);
    onClose();
  };

  const checkAvailability = async (date, time) => {
    if (!selectedItem || !date) return true;

    setIsCheckingAvailability(true);
    try {
      const result = await checkCalendarAvailability({
        date: date.toISOString(),
        time,
        itemId: selectedItem,
        participants,
      });
      return result.available;
    } catch (error) {
      logger.error('Availability check error:', error);
      toast.error('Could not check availability. Please try again.');
      return false;
    } finally {
      setIsCheckingAvailability(false);
    }
  };

  const onSubmit = async (data) => {
    if (!selectedItem) {
      toast.error(`Please select a ${bookingType}`);
      return;
    }

    if (!selectedDate) {
      toast.error('Please select a date');
      return;
    }

    // Check availability before booking
    const isAvailable = await checkAvailability(selectedDate, selectedTime);
    if (!isAvailable) {
      toast.error('Sorry, this time slot is not available. Please choose another.');
      return;
    }

    setIsSubmitting(true);

    try {
      const item = items.find((i) => i.id === selectedItem);
      const totalPrice = item.price * participants;
      const convertedPrice = convert(totalPrice, 'MUR', currency);

      const bookingData = {
        ...data,
        itemId: selectedItem,
        itemName: item.name,
        itemType: bookingType,
        date: selectedDate.toISOString(),
        time: selectedTime,
        price: totalPrice,
        currency: 'MUR',
        convertedPrice,
        convertedCurrency: currency,
        source,
      };

      const result = await createCalendarBooking(bookingData);

      if (result.success) {
        toast.success("Booking request sent! We'll confirm your booking shortly.");
        trackCalendarBookingComplete(bookingType, item.name, convertedPrice, currency);
        handleClose();
      } else {
        toast.error('Failed to create booking. Please try again or contact us directly.');
      }
    } catch (error) {
      logger.error('Booking error:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFilteredTimes = () => {
    const times = [];
    for (let hour = 8; hour <= 16; hour++) {
      times.push(`${hour.toString().padStart(2, '0')}:00`);
      if (hour < 16) {
        times.push(`${hour.toString().padStart(2, '0')}:30`);
      }
    }
    return times;
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                <div className="flex items-center justify-between mb-6">
                  <Dialog.Title className="text-2xl font-bold text-gray-900">
                    Book {bookingType === 'course' ? 'a Course' : 'a Dive'}
                  </Dialog.Title>
                  <button
                    onClick={handleClose}
                    className="text-gray-400 hover:text-gray-500 transition-colors"
                    aria-label="Close"
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Select Course/Dive */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Select {bookingType === 'course' ? 'Course' : 'Dive Type'} *
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {items.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setSelectedItem(item.id)}
                          className={`p-4 border-2 rounded-lg text-left transition-all ${
                            selectedItem === item.id
                              ? 'border-ocean-500 bg-ocean-50'
                              : 'border-gray-200 hover:border-ocean-300'
                          }`}
                        >
                          <div className="font-semibold text-gray-900">{item.name}</div>
                          <div className="text-sm text-gray-600 mt-1">{item.duration}</div>
                          <div className="text-ocean-600 font-semibold mt-2">
                            {format(convert(item.price, 'MUR', currency), currency)}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Date and Time Selection */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="preferred-date"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Preferred Date *
                      </label>
                      <DatePicker
                        id="preferred-date"
                        selected={selectedDate}
                        onChange={(date) => setSelectedDate(date)}
                        minDate={new Date()}
                        filterDate={(date) => date.getDay() !== 0} // Exclude Sundays
                        dateFormat="MMMM d, yyyy"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500"
                        placeholderText="Select a date..."
                        aria-label="Preferred Date"
                        inline
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="time"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Preferred Time *
                      </label>
                      <select
                        id="time"
                        value={selectedTime}
                        onChange={(e) => setSelectedTime(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500"
                      >
                        {getFilteredTimes().map((time) => (
                          <option key={time} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>
                      {isCheckingAvailability && (
                        <div className="mt-2 flex items-center text-sm text-gray-600">
                          <Loading size="small" />
                          <span className="ml-2">Checking availability...</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Personal Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Full Name *
                      </label>
                      <input
                        {...register('name')}
                        type="text"
                        id="name"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500"
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Email *
                      </label>
                      <input
                        {...register('email')}
                        type="email"
                        id="email"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500"
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Phone *
                      </label>
                      <input
                        {...register('phone')}
                        type="tel"
                        id="phone"
                        placeholder="+230 XXXX XXXX"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500"
                      />
                      {errors.phone && (
                        <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="participants"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Number of Participants *
                      </label>
                      <input
                        {...register('participants', { valueAsNumber: true })}
                        type="number"
                        id="participants"
                        min="1"
                        max="12"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500"
                      />
                      {errors.participants && (
                        <p className="mt-1 text-sm text-red-600">{errors.participants.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="experienceLevel"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Experience Level *
                    </label>
                    <select
                      {...register('experienceLevel')}
                      id="experienceLevel"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500"
                    >
                      <option value="">Select your experience...</option>
                      {EXPERIENCE_LEVELS.map((level) => (
                        <option key={level} value={level}>
                          {level}
                        </option>
                      ))}
                    </select>
                    {errors.experienceLevel && (
                      <p className="mt-1 text-sm text-red-600">{errors.experienceLevel.message}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="specialRequests"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Special Requests (Optional)
                    </label>
                    <textarea
                      {...register('specialRequests')}
                      id="specialRequests"
                      rows={3}
                      placeholder="Medical conditions, equipment rental needs, dietary restrictions, etc."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500 resize-none"
                    />
                  </div>

                  {/* Price Summary */}
                  {selectedItem && participants > 0 && (
                    <div className="bg-ocean-50 p-4 rounded-lg border border-ocean-200">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700 font-medium">Estimated Total:</span>
                        <span className="text-2xl font-bold text-ocean-600">
                          {selectedItem && items.find((i) => i.id === selectedItem)
                            ? format(
                                convert(
                                  items.find((i) => i.id === selectedItem).price * participants,
                                  'MUR',
                                  currency
                                ),
                                currency
                              )
                            : format(0, currency)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        Final price may vary based on equipment rental and additional services.
                      </p>
                    </div>
                  )}

                  <div className="flex gap-4 pt-4">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={
                        isSubmitting || isCheckingAvailability || !selectedItem || !selectedDate
                      }
                      className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? 'Processing...' : 'Request Booking'}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

BookingModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  bookingType: PropTypes.oneOf(['dive', 'course']),
  preSelectedItem: PropTypes.object,
  source: PropTypes.string,
};

export default BookingModal;
