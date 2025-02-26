import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface TutorialState {
  isActive: boolean;
  currentStep: number;
  hasSeen: boolean;
  startTutorial: () => void;
  nextStep: () => void;
  skipTutorial: () => void;
  resetTutorial: () => void;
}

export const useTutorial = create<TutorialState>()(
  persist(
    (set) => ({
      isActive: false,
      currentStep: 1,
      hasSeen: false,
      startTutorial: () => set({ isActive: true, currentStep: 1 }),
      nextStep: () => set((state) => ({ currentStep: state.currentStep + 1 })),
      skipTutorial: () => set({ isActive: false, hasSeen: true }),
      resetTutorial: () => set({ isActive: false, currentStep: 1 }),
    }),
    {
      name: 'tutorial-storage',
    }
  )
);
