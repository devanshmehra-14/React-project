import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, ClipboardList, Save, ArrowLeft, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import useAppStore from '../store/useAppStore';
import Header from '../components/Header';
import { fetchSoapNote, saveToEhr } from '../services/api';

export default function NotePage() {
  const selectedPatient = useAppStore((s) => s.selectedPatient);
  const currentSession = useAppStore((s) => s.currentSession);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!currentSession?.sessionId) return;
    fetchSoapNote(currentSession.sessionId).then((data) => {
      setNote(data);
      setLoading(false);
    });
  }, [currentSession?.sessionId]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveToEhr(currentSession.sessionId, note);
      toast.success('SOAP note saved to EHR successfully');
    } catch {
      toast.error('Failed to save note. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (!selectedPatient) {
    return (
      <div className="min-h-screen bg-offwhite">
        <Header />
        <main className="max-w-4xl mx-auto px-6 py-10 text-center text-navy/60">
          No patient selected. Please return to the dashboard.
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-offwhite">
      <Header />

      <main className="max-w-4xl mx-auto px-6 py-10">
        {/* Patient Info */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="mr-2 p-2 rounded-lg hover:bg-navy/5 transition-colors"
            aria-label="Back to dashboard"
          >
            <ArrowLeft className="w-5 h-5 text-navy/50" />
          </button>
          <div className="w-10 h-10 rounded-full bg-teal/10 flex items-center justify-center">
            <User className="w-5 h-5 text-teal" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-navy">
              {selectedPatient.name}
            </h1>
            <p className="text-sm text-navy/50">
              NHS: {selectedPatient.nhsNumber}
            </p>
          </div>
          <span className="ml-auto text-xs font-mono text-navy/30">
            {currentSession?.sessionId}
          </span>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-12 h-12 border-4 border-cyan/20 border-t-cyan rounded-full animate-spin" />
            <p className="text-navy/60 font-medium">Generating SOAP note...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <SectionPanel
                title="Subjective"
                icon={<ClipboardList className="w-4 h-4" />}
                color="cyan"
              >
                {note.subjective}
              </SectionPanel>

              <SectionPanel
                title="Objective"
                icon={<ClipboardList className="w-4 h-4" />}
                color="teal"
              >
                {note.objective}
              </SectionPanel>

              <SectionPanel
                title="Assessment"
                icon={<ClipboardList className="w-4 h-4" />}
                color="cyan"
              >
                {note.assessment}
              </SectionPanel>

              <SectionPanel
                title="Plan"
                icon={<ClipboardList className="w-4 h-4" />}
                color="teal"
              >
                {note.plan}
              </SectionPanel>
            </div>

            {/* ICD-10 Suggestion */}
            <div className="bg-navy/5 border border-navy/10 rounded-xl p-5 mb-8 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-cyan mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-navy/50 uppercase tracking-wider mb-1">
                  ICD-10 Suggestion
                </p>
                <p className="text-navy font-semibold">{note.icd10}</p>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-8 py-3 bg-cyan text-navy font-semibold rounded-lg hover:bg-cyan/90 transition-all active:scale-[0.98] shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-5 h-5" />
                {saving ? 'Saving...' : 'Save to EHR'}
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

function SectionPanel({ title, icon, color, children }) {
  const borderColor = color === 'cyan' ? 'border-cyan/20' : 'border-teal/20';
  const iconColor = color === 'cyan' ? 'text-cyan' : 'text-teal';
  const bgAccent = color === 'cyan' ? 'bg-cyan/5' : 'bg-teal/5';

  return (
    <div className={`bg-white rounded-xl border ${borderColor} shadow-sm overflow-hidden`}>
      <div className={`px-5 py-3 ${bgAccent} border-b ${borderColor} flex items-center gap-2`}>
        <span className={iconColor}>{icon}</span>
        <h3 className="font-semibold text-navy text-sm uppercase tracking-wider">
          {title}
        </h3>
      </div>
      <div className="p-5">
        <p className="text-navy/80 text-sm leading-relaxed whitespace-pre-line">
          {children}
        </p>
      </div>
    </div>
  );
}
