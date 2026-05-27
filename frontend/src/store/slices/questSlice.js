import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../utils/api'

export const fetchQuests = createAsyncThunk(
  'quest/fetchQuests',
  async (filters = {}, { rejectWithValue }) => {
    try {
      // Build query params only for non-empty filters
      const params = new URLSearchParams()
      if (filters.domain) params.append('domain', filters.domain)
      if (filters.difficulty) params.append('difficulty', filters.difficulty)
      
      const queryString = params.toString()
      const url = queryString ? `/quests?${queryString}` : '/quests'
      const response = await api.get(url)
      return response.data
    } catch (error) {
      console.error('Fetch quests error:', error)
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch quests')
    }
  }
)

export const fetchQuestDetail = createAsyncThunk(
  'quest/fetchDetail',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/quests/${id}`)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch quest')
    }
  }
)

export const submitQuest = createAsyncThunk(
  'quest/submit',
  async ({ questId, code, language, timeTakenSeconds = 0, hintsUsed = 0 }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/quests/${questId}/submit`, {
        code, language, timeTakenSeconds, hintsUsed
      })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Submission failed')
    }
  }
)

const questSlice = createSlice({
  name: 'quest',
  initialState: {
    quests: [],
    currentQuest: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrentQuest: (state) => {
      state.currentQuest = null
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuests.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchQuests.fulfilled, (state, action) => {
        state.loading = false
        state.error = null
        state.quests = Array.isArray(action.payload) ? action.payload : []
      })
      .addCase(fetchQuests.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Failed to fetch quests'
        state.quests = []
      })
      .addCase(fetchQuestDetail.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchQuestDetail.fulfilled, (state, action) => {
        state.loading = false
        state.error = null
        state.currentQuest = action.payload
      })
      .addCase(fetchQuestDetail.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Failed to fetch quest'
        state.currentQuest = null
      })
      .addCase(submitQuest.pending, (state) => {
        state.loading = true
      })
      .addCase(submitQuest.fulfilled, (state, action) => {
        state.loading = false
        state.error = null
      })
      .addCase(submitQuest.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Submission failed'
      })
  },
})

export const { clearCurrentQuest, clearError } = questSlice.actions
export default questSlice.reducer

