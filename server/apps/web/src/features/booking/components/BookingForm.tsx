import { type FC, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export interface BookingFormProps {
  onSubmit: (data: BookingFormData) => void;
  isLoading?: boolean;
  bookingType?: 'dive' | 'course' | 'discover' | 'advanced';
  courseId?: string;
  diveSiteId?: string;
}

export interface BookingFormData {
  name: string;
  email: string;
  phone: string;
  preferredDate: Date;
  participants: number;
  bookingType: 'dive' | 'course' | 'discover' | 'advanced';
  courseId?: string;
  diveSiteId?: string;
  specialRequests?: string;
}

/**
 * BookingForm Component
 *
 * Complete booking form with validation, date picker, and participant selection.
 */
const BookingForm: FC<BookingFormProps> = ({
  onSubmit,
  isLoading = false,
  bookingType = 'dive',
  courseId,
  diveSiteId,
}) => {
  const [formData, setFormData] = useState<BookingFormData>({
    name: '',
    email: '',
    phone: '',
    preferredDate: new Date(Date.now() + 86400000), // Tomorrow
    participants: 1,
    bookingType,
    ...(courseId && { courseId }),
    ...(diveSiteId && { diveSiteId }),
    specialRequests: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name || formData.name.length < 2) {
      newErrors['name'] = 'Name must be at least 2 characters';
    }

    if (!(formData.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))) {
      newErrors['email'] = 'Valid email is required';
    }

    if (!formData.phone || formData.phone.length < 8) {
      newErrors['phone'] = 'Valid phone number is required';
    }

    if (!formData.preferredDate || formData.preferredDate < new Date()) {
      newErrors['preferredDate'] = 'Please select a future date';
    }

    if (!formData.participants || formData.participants < 1 || formData.participants > 20) {
      newErrors['participants'] = 'Participants must be between 1 and 20';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  const handleChange = (field: keyof BookingFormData, value: string | number | Date) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Full Name *
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          className={`mt-1 block w-full px-4 py-2 border ${
            errors['name'] ? 'border-red-500' : 'border-gray-300'
          } rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500`}
          disabled={isLoading}
          required
        />
        {errors['name'] && <p className="mt-1 text-sm text-red-600">{errors['name']}</p>}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email *
        </label>
        <input
          type="email"
          id="email"
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          className={`mt-1 block w-full px-4 py-2 border ${
            errors['email'] ? 'border-red-500' : 'border-gray-300'
          } rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500`}
          disabled={isLoading}
          required
        />
        {errors['email'] && <p className="mt-1 text-sm text-red-600">{errors['email']}</p>}
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
          Phone *
        </label>
        <input
          type="tel"
          id="phone"
          value={formData.phone}
          onChange={(e) => handleChange('phone', e.target.value)}
          placeholder="+230 XXXX XXXX"
          className={`mt-1 block w-full px-4 py-2 border ${
            errors['phone'] ? 'border-red-500' : 'border-gray-300'
          } rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500`}
          disabled={isLoading}
          required
        />
        {errors['phone'] && <p className="mt-1 text-sm text-red-600">{errors['phone']}</p>}
      </div>

      <div>
        <label htmlFor="preferredDate" className="block text-sm font-medium text-gray-700">
          Preferred Date *
        </label>
        <DatePicker
          selected={formData.preferredDate}
          onChange={(date: Date | null) => {
            handleChange('preferredDate', date || new Date());
          }}
          minDate={new Date()}
          dateFormat="MMMM d, yyyy"
          className={`mt-1 block w-full px-4 py-2 border ${
            errors['preferredDate'] ? 'border-red-500' : 'border-gray-300'
          } rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500`}
          disabled={isLoading}
          required
        />
        {errors['preferredDate'] && (
          <p className="mt-1 text-sm text-red-600">{errors['preferredDate']}</p>
        )}
      </div>

      <div>
        <label htmlFor="participants" className="block text-sm font-medium text-gray-700">
          Number of Participants *
        </label>
        <input
          type="number"
          id="participants"
          value={formData.participants}
          onChange={(e) => handleChange('participants', Number.parseInt(e.target.value, 10))}
          min="1"
          max="20"
          className={`mt-1 block w-full px-4 py-2 border ${
            errors['participants'] ? 'border-red-500' : 'border-gray-300'
          } rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500`}
          disabled={isLoading}
          required
        />
        {errors['participants'] && <p className="mt-1 text-sm text-red-600">{errors['participants']}</p>}
      </div>

      <div>
        <label htmlFor="specialRequests" className="block text-sm font-medium text-gray-700">
          Special Requests
        </label>
        <textarea
          id="specialRequests"
          value={formData.specialRequests}
          onChange={(e) => handleChange('specialRequests', e.target.value)}
          rows={3}
          placeholder="Medical conditions, equipment rental, dietary restrictions, etc."
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500 resize-none"
          disabled={isLoading}
        />
      </div>

      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 bg-ocean-600 text-white px-6 py-3 rounded-lg hover:bg-ocean-700 focus:outline-none focus:ring-2 focus:ring-ocean-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {isLoading ? 'Submitting...' : 'Submit Booking'}
        </button>
      </div>
    </form>
  );
};

export default BookingForm;
