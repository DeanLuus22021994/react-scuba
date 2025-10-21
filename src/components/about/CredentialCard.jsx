import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

const CredentialCard = ({ credential, index = 0 }) => {
    const Icon = credential.icon;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
        >
            <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-ocean-100 rounded-full flex items-center justify-center">
                        <Icon className="h-6 w-6 text-ocean-600" />
                    </div>
                </div>
                <div className="flex-1">
                    <h3 className="text-lg font-bold text-ocean-800 mb-2">{credential.title}</h3>
                    <p className="text-gray-700">{credential.description}</p>
                </div>
            </div>
        </motion.div>
    );
};

CredentialCard.propTypes = {
    credential: PropTypes.shape({
        icon: PropTypes.elementType.isRequired,
        title: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
    }).isRequired,
    index: PropTypes.number,
};

export default CredentialCard;
