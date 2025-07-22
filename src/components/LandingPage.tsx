import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Shield, Clock, Users, Smartphone, Activity } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">MediCare</span>
            </div>
            <div className="space-x-4">
              <Link
                to="/login"
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Healthcare <span className="text-blue-600">Coordination</span>
            <br />Made Simple
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Connect doctors, patients, caretakers, and family members in one comprehensive
            platform for seamless healthcare management and real-time monitoring.
          </p>
          <div className="space-x-4">
            <Link
              to="/register"
              className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors inline-block"
            >
              Start Your Journey
            </Link>
            <Link
              to="/login"
              className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-colors inline-block"
            >
              Login Now
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Comprehensive Healthcare Management
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our platform brings together all stakeholders in healthcare for better coordination and outcomes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Real-time Medicine Tracking
            </h3>
            <p className="text-gray-600">
              Monitor medicine intake in real-time with SMS alerts and automatic notifications
              to caretakers and family members.
            </p>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Multi-role Access
            </h3>
            <p className="text-gray-600">
              Dedicated dashboards for doctors, patients, pharmacists, caretakers,
              and family members with role-specific features.
            </p>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Smartphone className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              SMS Integration
            </h3>
            <p className="text-gray-600">
              Automatic SMS reminders and alerts ensure no medication is missed,
              with instant confirmation links.
            </p>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Activity className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Live Health Monitoring
            </h3>
            <p className="text-gray-600">
              Real-time updates on patient health status, medicine adherence,
              and appointment scheduling.
            </p>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Secure & Compliant
            </h3>
            <p className="text-gray-600">
              Healthcare-grade security with encrypted data storage and
              HIPAA-compliant user access controls.
            </p>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Heart className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Care Coordination
            </h3>
            <p className="text-gray-600">
              Seamless communication between all healthcare stakeholders
              for optimal patient care and outcomes.
            </p>
          </div>
        </div>
      </section>

      {/* User Roles Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Designed for Everyone in Healthcare
            </h2>
            <p className="text-lg text-gray-600">
              Each role gets a specialized dashboard with features tailored to their needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              { role: 'Doctor', description: 'Manage patients, prescriptions, and appointments', color: 'blue' },
              { role: 'Patient', description: 'Track medicines, schedule appointments', color: 'green' },
              { role: 'Pharmacist', description: 'Manage prescriptions and medicine distribution', color: 'purple' },
              { role: 'Caretaker', description: 'Monitor patient care and medicine intake', color: 'orange' },
              { role: 'Family', description: 'Stay updated on patient health status', color: 'pink' }
            ].map((item, index) => (
              <div key={index} className="bg-white rounded-lg p-6 text-center shadow-md hover:shadow-lg transition-shadow">
                <div className={`bg-${item.color}-100 w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center`}>
                  <Users className={`h-8 w-8 text-${item.color}-600`} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.role}</h3>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Healthcare Management?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of healthcare professionals already using MediCare
            to provide better patient care and coordination.
          </p>
          <Link
            to="/register"
            className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
          >
            Get Started Today
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center space-x-2 mb-8">
            <Heart className="h-8 w-8 text-blue-400" />
            <span className="text-2xl font-bold">MediCare</span>
          </div>
          <div className="text-center text-gray-400">
            <p>&copy; 2024 MediCare. Transforming healthcare through technology.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;