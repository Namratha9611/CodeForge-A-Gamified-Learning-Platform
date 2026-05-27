import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useGameStore = create(
  persist(
    (set, get) => ({
      // Auth state
      user: null,
      token: null,
      isAuthenticated: false,

      // Game state
      zones: [],
      currentZone: null,
      bugs: [],
      currentBug: null,
      userProgress: null,
      tools: [],

      // UI state
      loading: false,
      error: null,

      // Auth actions
      login: (userData, token) => {
        set({
          user: userData,
          token,
          isAuthenticated: true,
          error: null
        });
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          zones: [],
          currentZone: null,
          bugs: [],
          currentBug: null,
          userProgress: null,
          tools: []
        });
      },

      setError: (error) => set({ error }),
      setLoading: (loading) => set({ loading }),

      // Game actions
      setZones: (zones) => set({ zones }),
      setCurrentZone: (zone) => set({ currentZone: zone }),
      setBugs: (bugs) => set({ bugs }),
      setCurrentBug: (bug) => set({ currentBug: bug }),
      setUserProgress: (progress) => set({ userProgress: progress }),
      setTools: (tools) => set({ tools }),

      // Update user XP and level
      updateUserXP: (xpEarned) => {
        const { user } = get();
        if (user) {
          const newXP = user.xp + xpEarned;
          const newLevel = Math.floor(newXP / 100) + 1;

          set({
            user: {
              ...user,
              xp: newXP,
              level: newLevel
            }
          });
        }
      },

      // Update user assessment data
      updateUserAssessment: (data) => {
        const { user } = get();
        if (user) {
          set({
            user: {
              ...user,
              skillScores: data.skillScores,
              weakAreas: data.weakAreas,
              recommendedQuests: data.recommendedQuests
            }
          });
        }
      },

      // Add completed challenge
      addCompletedChallenge: (challengeId) => {
        const { userProgress } = get();
        if (userProgress) {
          set({
            userProgress: {
              ...userProgress,
              completedChallenges: [...userProgress.completedChallenges, challengeId]
            }
          });
        }
      },

      // Unlock tool
      unlockTool: (tool) => {
        const { tools } = get();
        set({
          tools: [...tools, tool]
        });
      }
    }),
    {
      name: 'bug-hunter-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token
        // isAuthenticated removed to force login on refresh
      })
    }
  )
);

export default useGameStore;
