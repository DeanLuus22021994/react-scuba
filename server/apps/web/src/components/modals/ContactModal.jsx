import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { zodResolver } from '@hookform/resolvers/zod';
import PropTypes from 'prop-types';
import { Fragment, useEffect, useState, useRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ReCAPTCHA from 'react-google-recaptcha';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';
import { submitContactForm } from '../../services/api';
import { trackContactSubmit, trackFormAbandon, trackFormStart } from '../../utils/analytics';
import logger from '../../utils/logger';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(8, 'Please enter a valid phone number'),
  inquiryType: z.string().min(1, 'Please select an inquiry type'),
  preferredContact: z.string().min(1, 'Please select preferred contact method'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

const INQUIRY_TYPES = [
  'General Inquiry',
  'Course Information',
  'Dive Booking',
  'Equipment Rental',
  'Group Booking',
  'Other',
];

const CONTACT_METHODS = ['Email', 'Phone', 'WhatsApp'];

const ContactModal = ({
  isOpen,
  onClose,
  initialSubject = '',
  source = 'unknown',
  utmParams = {},
  inquiryType = '',
  preSelectedDate = null,
}) => {
  const [selectedDate, setSelectedDate] = useState(preSelectedDate);
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStartTime, setFormStartTime] = useState(null);
  const firstInputRef = useRef(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      inquiryType: inquiryType || '',
      preferredContact: '',
      message: initialSubject || '',
    },
  });

  const recaptchaSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

  useEffect(() => {
    if (isOpen && !formStartTime) {
      setFormStartTime(Date.now());
      trackFormStart('contact_form', source);
      // Focus first input when modal opens
      setTimeout(() => firstInputRef.current?.focus(), 100);
    }
  }, [isOpen, formStartTime, source]);

  const handleClose = () => {
    if (formStartTime && !isSubmitting) {
      const timeSpent = (Date.now() - formStartTime) / 1000;
      const formData = watch();
      const filledFields = Object.values(formData).filter((val) => val && val.length > 0).length;
      const totalFields = Object.keys(formData).length;
      const completionPercentage = (filledFields / totalFields) * 100;

      if (completionPercentage > 10 && timeSpent > 5) {
        trackFormAbandon('contact_form', source, Math.round(completionPercentage));
      }
    }

    reset();
    setSelectedDate(null);
    setRecaptchaToken(null);
    setFormStartTime(null);
    onClose();
  };

  const onSubmit = async (data) => {
    if (!recaptchaToken) {
      toast.error('Please complete the reCAPTCHA verification');
      return;
    }

    setIsSubmitting(true);

    try {
      const submissionData = {
        ...data,
        preferredDate: selectedDate ? selectedDate.toISOString() : null,
        source,
        utmParams,
        recaptchaToken,
      };

      const result = await submitContactForm(submissionData);

      if (result.success) {
        toast.success("Thank you! We'll get back to you soon.");
        trackContactSubmit(source, data.inquiryType);
        handleClose();
      } else {
        toast.error('Failed to send message. Please try again or contact us directly.');
      }
    } catch (error) {
      logger.error('Contact form error:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
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
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                <div className="flex items-center justify-between mb-6">
                  <Dialog.Title className="text-2xl font-bold text-gray-900">
                    Contact Us
                  </Dialog.Title>
                  <button
                    onClick={handleClose}
                    className="text-gray-400 hover:text-gray-500 transition-colors"
                    aria-label="Close"
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Name *
                      </label>
                      <input
                        {...register('name')}
                        ref={firstInputRef}
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
                        htmlFor="inquiryType"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Inquiry Type *
                      </label>
                      <select
                        {...register('inquiryType')}
                        id="inquiryType"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500"
                      >
                        <option value="">Select type...</option>
                        {INQUIRY_TYPES.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                      {errors.inquiryType && (
                        <p className="mt-1 text-sm text-red-600">{errors.inquiryType.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="preferredContact"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Preferred Contact Method *
                      </label>
                      <select
                        {...register('preferredContact')}
                        id="preferredContact"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500"
                      >
                        <option value="">Select method...</option>
                        {CONTACT_METHODS.map((method) => (
                          <option key={method} value={method}>
                            {method}
                          </option>
                        ))}
                      </select>
                      {errors.preferredContact && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.preferredContact.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="preferredDate"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Preferred Date (Optional)
                      </label>
                      <DatePicker
                        selected={selectedDate}
                        onChange={(date) => setSelectedDate(date)}
                        minDate={new Date()}
                        dateFormat="MMMM d, yyyy"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500"
                        placeholderText="Select a date..."
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Message *
                    </label>
                    <textarea
                      {...register('message')}
                      id="message"
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500 resize-none"
                    />
                    {errors.message && (
                      <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
                    )}
                  </div>

                  {recaptchaSiteKey && (
                    <div className="flex justify-center">
                      <ReCAPTCHA
                        sitekey={recaptchaSiteKey}
                        onChange={(token) => setRecaptchaToken(token)}
                        onExpired={() => setRecaptchaToken(null)}
                      />
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
                      disabled={isSubmitting || (recaptchaSiteKey ? !recaptchaToken : false)}
                      className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? 'Sending...' : 'Send Message'}
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

ContactModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  initialSubject: PropTypes.string,
  source: PropTypes.string,
  utmParams: PropTypes.object,
  inquiryType: PropTypes.string,
  preSelectedDate: PropTypes.instanceOf(Date),
};

export default ContactModal;
