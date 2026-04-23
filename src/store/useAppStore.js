import { create } from 'zustand';

const useAppStore = create((set) => ({
  authToken: '',
  currentUser: null,
  selectedPatient: null,
  currentSession: null,

  setAuthToken: (token) => set({ authToken: token }),
  setCurrentUser: (user) => set({ currentUser: user }),
  setSelectedPatient: (patient) => set({ selectedPatient: patient }),
  setCurrentSession: (session) => set({ currentSession: session }),

  logout: () =>
    set({
      authToken: '',
      currentUser: null,
      selectedPatient: null,
      currentSession: null,
    }),
}));

export default useAppStore;
