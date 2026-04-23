import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, Square, User } from 'lucide-react';
import useAppStore from '../store/useAppStore';
import Header from '../components/Header';
import { MOCK_TRANSCRIPTIONS } from '../services/api';

export default function RecordingPage() {
  const selectedPatient = useAppStore((s) => s.selectedPatient);
  const currentSession = useAppStore((s) => s.currentSession);
  const navigate = useNavigate();

  const [isRecording, setIsRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [transcriptionIndex, setTranscriptionIndex] = useState(0);
  const [transcriptions, setTranscriptions] = useState([]);
  const timerRef = useRef(null);
  const transcriptionRef = useRef(null);

  const formatTime = useCallback((seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    return `${m}:${s}`;
  }, []);

  // Timer: useEffect with setInterval — clear interval on cleanup
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isRecording]);

  // Mock transcription: setInterval cycles through sentences every 3 seconds
  useEffect(() => {
    if (!isRecording) return;
    transcriptionRef.current = setInterval(() => {
      setTranscriptionIndex((prev) => {
        const next = (prev + 1) % MOCK_TRANSCRIPTIONS.length;
        setTranscriptions((t) => [...t, MOCK_TRANSCRIPTIONS[next]]);
        return next;
      });
    }, 3000);
    return () => {
      if (transcriptionRef.current) {
        clearInterval(transcriptionRef.current);
        transcriptionRef.current = null;
      }
    };
  }, [isRecording]);

  const handleToggle = () => {
    if (isRecording) {
      setIsRecording(false);
      navigate('/note');
    } else {
      setIsRecording(true);
      setElapsed(0);
      setTranscriptions([]);
      setTranscriptionIndex(0);
    }
  };

  if (!selectedPatient) {
    return (
      <div className="min-h-screen bg-offwhite">
        <Header />
        <main className="max-w-3xl mx-auto px-6 py-10 text-center text-navy/60">
          No patient selected. Please return to the dashboard.
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-offwhite">
      <Header />

      <main className="max-w-3xl mx-auto px-6 py-10">
        {/* Patient Info */}
        <div className="flex items-center gap-3 mb-8">
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

        {/* Recording Controls */}
        <div className="flex flex-col items-center gap-6 mb-10">
          <button
            onClick={handleToggle}
            className={`w-20 h-20 rounded-full flex items-center justify-center transition-all active:scale-95 shadow-lg ${
              isRecording
                ? 'bg-danger hover:bg-danger/90 animate-pulse-slow'
                : 'bg-teal hover:bg-teal/90'
            }`}
            aria-label={isRecording ? 'Stop recording' : 'Start recording'}
          >
            {isRecording ? (
              <Square className="w-8 h-8 text-white" fill="white" />
            ) : (
              <Mic className="w-8 h-8 text-white" />
            )}
          </button>

          <div className="text-center">
            <p className="text-4xl font-mono font-bold text-navy tracking-widest">
              {formatTime(elapsed)}
            </p>
            <p className="text-sm text-navy/40 mt-1">
              {isRecording ? 'Recording in progress...' : 'Tap to start recording'}
            </p>
          </div>
        </div>

        {/* Transcription Preview */}
        <div className="bg-white rounded-xl border border-navy/5 shadow-sm p-6">
          <h2 className="text-sm font-semibold text-navy/60 uppercase tracking-wider mb-4">
            Live Transcription
          </h2>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {transcriptions.length === 0 && isRecording && (
              <p className="text-navy/30 italic">Listening...</p>
            )}
            {transcriptions.length === 0 && !isRecording && (
              <p className="text-navy/30 italic">
                Transcription will appear here once recording begins.
              </p>
            )}
            {transcriptions.map((line, i) => (
              <p key={i} className="text-navy/80 text-sm leading-relaxed">
                {line}
              </p>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
