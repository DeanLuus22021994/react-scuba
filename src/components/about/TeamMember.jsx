import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

const TeamMember = ({ member, index = 0 }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
        >
            <div className="relative h-64 overflow-hidden">
                <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                />
            </div>
            <div className="p-6">
                <h3 className="text-xl font-bold text-ocean-800 mb-2">{member.name}</h3>
                <p className="text-ocean-600 font-semibold mb-4">{member.role}</p>
                <p className="text-gray-700 mb-4">{member.bio}</p>
                <div className="space-y-2">
                    {member.certifications.map((cert, idx) => (
                        <div
                            key={idx}
                            className="inline-block bg-ocean-50 text-ocean-700 px-3 py-1 rounded-full text-sm mr-2 mb-2"
                        >
                            {cert}
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

TeamMember.propTypes = {
    member: PropTypes.shape({
        name: PropTypes.string.isRequired,
        role: PropTypes.string.isRequired,
        certifications: PropTypes.arrayOf(PropTypes.string).isRequired,
        image: PropTypes.string.isRequired,
        bio: PropTypes.string.isRequired,
    }).isRequired,
    index: PropTypes.number,
};

export default TeamMember;
