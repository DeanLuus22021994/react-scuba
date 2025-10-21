import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/solid';
import { trackWhatsAppClick } from '../../utils/analytics';

const WhatsAppButton = ({
  source = 'unknown',
  messageType = 'general_inquiry',
  message = 'Hello! I would like to inquire about scuba diving.',
  className = '',
  variant = 'button', // 'button', 'icon', 'floating'
}) => {
  const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '230XXXXXXXX';
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

  const handleClick = () => {
    trackWhatsAppClick(source, messageType);
  };

  if (variant === 'floating') {
    return (
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        className="fixed bottom-6 right-6 z-50 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-all duration-300 hover:scale-110"
        aria-label="Chat on WhatsApp"
      >
        <ChatBubbleLeftRightIcon className="w-6 h-6" />
      </a>
    );
  }

  if (variant === 'icon') {
    return (
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        className={`inline-flex items-center text-green-600 hover:text-green-700 transition-colors ${className}`}
        aria-label="Chat on WhatsApp"
      >
        <ChatBubbleLeftRightIcon className="w-5 h-5" />
      </a>
    );
  }

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className={`inline-flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors ${className}`}
      aria-label="Chat on WhatsApp"
    >
      <ChatBubbleLeftRightIcon className="w-5 h-5" />
      <span>Chat on WhatsApp</span>
    </a>
  );
};

export default WhatsAppButton;
