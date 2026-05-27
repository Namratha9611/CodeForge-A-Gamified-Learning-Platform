import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../utils/api'

export const fetchUserProfile = createAsyncThunk(
  'user/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/users/profile')
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch profile')
    }
  }
)

export const fetchUserProgress = createAsyncThunk(
  'user/fetchProgress',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/users/progress')
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch progress')
    }
  }
)

export const submitAssessment = createAsyncThunk(
  'user/submitAssessment',
  async (assessmentData, { rejectWithValue }) => {
    try {
      const response = await api.post('/users/assessment', assessmentData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Assessment submission failed')
    }
  }
)

export const fetchAllUsers = createAsyncThunk(
  'user/fetchAllUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/users')
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch users')
    }
  }
)

export const deleteUser = createAsyncThunk(
  'user/deleteUser',
  async (userId, { rejectWithValue }) => {
    try {
      await api.delete(`/users/${userId}`)
      return userId
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete user')
    }
  }
)

const userSlice = createSlice({
  name: 'user',
  initialState: {
    profile: null,
    progress: null,
    allUsers: [],
    loading: false,
    error: null,
  },
  reducers: {
    updateXP: (state, action) => {
      if (state.profile) {
        state.profile.xp += action.payload
      }
    },
    updateLevel: (state, action) => {
      if (state.profile) {
        state.profile.level = action.payload
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false
        state.profile = action.payload
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(fetchUserProgress.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchUserProgress.fulfilled, (state, action) => {
        state.loading = false
        state.progress = action.payload
      })
      .addCase(fetchUserProgress.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(submitAssessment.fulfilled, (state, action) => {
        state.progress = action.payload
      })
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false
        state.allUsers = action.payload
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(deleteUser.pending, (state) => {
        state.loading = true
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false
        state.allUsers = state.allUsers.filter(user => user._id !== action.payload)
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { updateXP, updateLevel } = userSlice.actions
export default userSlice.reducer

