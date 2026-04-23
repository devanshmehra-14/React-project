import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, FileText, ArrowRight } from 'lucide-react';
import useAppStore from '../store/useAppStore';
import Header from '../components/Header';
import { fetchPatients } from '../services/api';

export default function DashboardPage() {
  const currentUser = useAppStore((s) => s.currentUser);
  const setSelectedPatient = useAppStore((s) => s.setSelectedPatient);
  const setCurrentSession = useAppStore((s) => s.setCurrentSession);
  const navigate = useNavigate();

  const [patients, setPatients] = useState([]);

  useEffect(() => {
    fetchPatients().then(setPatients);
  }, []);

  const handleStartConsultation = (patient) => {
    setSelectedPatient(patient);
    setCurrentSession({ sessionId: `sess-${Date.now()}`, status: 'active' });
    navigate('/record');
  };

  return (
    <div className="min-h-screen bg-offwhite">
      <Header />

      <main className="max-w-5xl mx-auto px-6 py-10">
        {/* Welcome */}
        <section className="mb-10">
          <h1 className="text-3xl font-bold text-navy">
            Welcome, Dr. {currentUser?.name || 'Clinician'}
          </h1>
          <p className="text-navy/60 mt-1">
            Select a patient to begin a consultation session.
          </p>
        </section>

        {/* Patient Cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {patients.map((patient) => (
            <div
              key={patient.id}
              className="bg-white rounded-xl border border-navy/5 shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-teal/10 flex items-center justify-center">
                  <User className="w-6 h-6 text-teal" />
                </div>
                <div>
                  <h3 className="font-semibold text-navy text-lg">
                    {patient.name}
                  </h3>
                  <p className="text-sm text-navy/50">
                    NHS: {patient.nhsNumber}
                  </p>
                </div>
              </div>

              <div className="mt-auto pt-4 border-t border-navy/5">
                <button
                  onClick={() => handleStartConsultation(patient)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-teal text-offwhite font-medium rounded-lg hover:bg-teal/90 transition-all active:scale-[0.98]"
                >
                  <FileText className="w-4 h-4" />
                  Start Consultation
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
