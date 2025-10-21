import { PhoneIcon } from '@heroicons/react/24/outline';
import PropTypes from 'prop-types';
import { trackPhoneClick } from '../../utils/analytics';

const PhoneLink = ({ source = 'unknown', className = '', children }) => {
    const phoneNumber = import.meta.env.VITE_PHONE_NUMBER || '+230XXXXXXXX';

    const handleClick = () => {
        trackPhoneClick(source);
    };

    return (
        <a
            href={`tel:${phoneNumber}`}
            onClick={handleClick}
            className={`inline-flex items-center gap-2 text-ocean-600 hover:text-ocean-700 transition-colors ${className}`}
            aria-label="Call us"
        >
            <PhoneIcon className="w-5 h-5" />
            {children || phoneNumber}
        </a>
    );
};

PhoneLink.propTypes = {
    source: PropTypes.string,
    className: PropTypes.string,
    children: PropTypes.node,
};

export default PhoneLink;
