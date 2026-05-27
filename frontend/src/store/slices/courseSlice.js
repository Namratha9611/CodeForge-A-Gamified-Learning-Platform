import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../utils/api'

// Admin course thunks
export const fetchAdminCourses = createAsyncThunk(
  'courses/fetchAdminCourses',
  async (params = {}) => {
    const { domain, difficulty, page, limit } = params
    const queryParams = new URLSearchParams()
    if (domain) queryParams.append('domain', domain)
    if (difficulty) queryParams.append('difficulty', difficulty)
    if (page) queryParams.append('page', page)
    if (limit) queryParams.append('limit', limit)

    const response = await api.get(`/courses/admin/all?${queryParams}`)
    return response.data
  }
)

export const createCourse = createAsyncThunk(
  'courses/createCourse',
  async (courseData) => {
    const response = await api.post('/courses', courseData)
    return response.data
  }
)

export const updateCourse = createAsyncThunk(
  'courses/updateCourse',
  async ({ id, courseData }) => {
    const response = await api.put(`/courses/${id}`, courseData)
    return response.data
  }
)

export const deleteCourse = createAsyncThunk(
  'courses/deleteCourse',
  async (courseId) => {
    await api.delete(`/courses/${courseId}`)
    return courseId
  }
)

export const fetchAdminCourseById = createAsyncThunk(
  'courses/fetchAdminCourseById',
  async (courseId) => {
    const response = await api.get(`/courses/admin/${courseId}`)
    return response.data
  }
)

const courseSlice = createSlice({
  name: 'courses',
  initialState: {
    currentCourse: null,
    currentLesson: null,
    currentLessonQuiz: null,
    adminCourses: [],
    adminCourse: null,
    studentAICourses: [],
    loading: false,
    error: null,
    pagination: {
      currentPage: 1,
      totalPages: 1,
      total: 0,
    },
  },
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearCurrentCourse: (state) => {
      state.currentCourse = null
    },
    clearCurrentLesson: (state) => {
      state.currentLesson = null
    },
  },
  extraReducers: (builder) => {
    builder


      // Admin Courses
      .addCase(fetchAdminCourses.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAdminCourses.fulfilled, (state, action) => {
        state.loading = false
        state.adminCourses = action.payload.courses
        state.pagination = {
          currentPage: action.payload.currentPage,
          totalPages: action.payload.totalPages,
          total: action.payload.total,
        }
      })
      .addCase(fetchAdminCourses.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })

      // Create Course
      .addCase(createCourse.fulfilled, (state, action) => {
        state.adminCourses.unshift(action.payload)
      })
      .addCase(createCourse.rejected, (state, action) => {
        state.error = action.error.message
      })

      // Update Course
      .addCase(updateCourse.fulfilled, (state, action) => {
        const index = state.adminCourses.findIndex(c => c._id === action.payload._id)
        if (index !== -1) {
          state.adminCourses[index] = action.payload
        }
        if (state.adminCourse && state.adminCourse._id === action.payload._id) {
          state.adminCourse = action.payload
        }
      })
      .addCase(updateCourse.rejected, (state, action) => {
        state.error = action.error.message
      })

      // Delete Course
      .addCase(deleteCourse.fulfilled, (state, action) => {
        state.adminCourses = state.adminCourses.filter(c => c._id !== action.payload)
      })
      .addCase(deleteCourse.rejected, (state, action) => {
        state.error = action.error.message
      })

      // Fetch Admin Course by ID
      .addCase(fetchAdminCourseById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAdminCourseById.fulfilled, (state, action) => {
        state.loading = false
        state.adminCourse = action.payload
      })
      .addCase(fetchAdminCourseById.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
  },
})

export const { clearError, clearCurrentCourse, clearCurrentLesson } = courseSlice.actions
export default courseSlice.reducer
