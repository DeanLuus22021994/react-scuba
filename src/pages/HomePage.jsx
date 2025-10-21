import SEO from '../components/common/SEO';

const HomePage = () => {
  return (
    <>
      <SEO page="home" />

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-gradient-to-br from-ocean-500 to-ocean-700">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
            Discover the Underwater Paradise
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Professional PADI certified scuba diving courses and guided tours in the crystal-clear waters of Mauritius
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn-primary text-lg px-8 py-4">
              Book Your Dive
            </button>
            <button className="btn-secondary text-lg px-8 py-4">
              View Courses
            </button>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Services
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From beginner courses to advanced certifications, we offer comprehensive scuba diving services
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Service 1 */}
            <div className="p-6 bg-ocean-50 rounded-lg shadow-md hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-ocean-500 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">PADI Courses</h3>
              <p className="text-gray-600 mb-4">
                Get certified with our comprehensive PADI courses from beginner to professional level
              </p>
              <button className="text-ocean-600 font-semibold hover:text-ocean-700">
                Learn More →
              </button>
            </div>

            {/* Service 2 */}
            <div className="p-6 bg-ocean-50 rounded-lg shadow-md hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-ocean-500 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Guided Dives</h3>
              <p className="text-gray-600 mb-4">
                Explore Mauritius' best dive sites with our experienced instructors and dive guides
              </p>
              <button className="text-ocean-600 font-semibold hover:text-ocean-700">
                Explore Sites →
              </button>
            </div>

            {/* Service 3 */}
            <div className="p-6 bg-ocean-50 rounded-lg shadow-md hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-ocean-500 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Photo Dives</h3>
              <p className="text-gray-600 mb-4">
                Capture stunning underwater moments with our specialized photography dive packages
              </p>
              <button className="text-ocean-600 font-semibold hover:text-ocean-700">
                View Gallery →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-ocean-600 text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Dive In?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join us for an unforgettable underwater adventure in the beautiful waters of Mauritius
          </p>
          <button className="btn-secondary bg-white text-ocean-600 hover:bg-gray-100 text-lg px-8 py-4">
            Contact Us Today
          </button>
        </div>
      </section>
    </>
  );
};

export default HomePage;
