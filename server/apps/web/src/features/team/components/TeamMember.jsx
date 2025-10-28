import { memo } from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

const TeamMember = memo(({ member, index = 0 }) => {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      // Could trigger a modal or detail view here
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      role="article"
      tabIndex={0}
      aria-labelledby={`team-member-${member.name.toLowerCase().replace(/\s+/g, '-')}`}
      onKeyDown={handleKeyDown}
      className="h-full flex flex-col bg-gradient-to-br from-white to-ocean-50/30 rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 group contain-layout contain-paint"
    >
      <div className="relative h-72 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-ocean-900/80 via-ocean-600/30 to-transparent z-10 opacity-60 group-hover:opacity-40 transition-opacity duration-300" />
        <img
          src={member.image}
          alt={member.name}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute bottom-0 left-0 right-0 z-20 p-6 text-white">
          <h3 id={`team-member-${member.name.toLowerCase().replace(/\s+/g, '-')}`} className="text-2xl font-bold mb-1 drop-shadow-lg">{member.name}</h3>
          <p className="text-ocean-100 font-medium text-sm drop-shadow-md">{member.role}</p>
        </div>
      </div>
      <div className="p-6 flex-grow flex flex-col">
        <p className="text-gray-700 leading-relaxed mb-6 flex-grow">{member.bio}</p>
        <div className="flex flex-wrap gap-2" role="list" aria-label="Certifications">
          {member.certifications.map((cert, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.1 + idx * 0.05 }}
              role="listitem"
              aria-label={`Certification: ${cert}`}
              className="inline-flex items-center bg-gradient-to-r from-ocean-500 to-ocean-600 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-md hover:shadow-lg hover:from-ocean-600 hover:to-ocean-700 transition-all duration-200"
            >
              <svg aria-hidden="true" className="w-3 h-3 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              {cert}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
});

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

TeamMember.displayName = 'TeamMember';

export default TeamMember;
