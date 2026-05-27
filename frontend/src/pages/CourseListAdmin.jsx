import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchAdminCourses, deleteCourse } from '../store/slices/courseSlice'
import { BookOpen, Edit, Trash2, Plus, Eye, EyeOff, Search, Filter } from 'lucide-react'

export default function CourseListAdmin() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { adminCourses, loading, pagination } = useSelector((state) => state.courses)
  
  const [filters, setFilters] = useState({
    domain: '',
    difficulty: '',
    search: '',
  })
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    console.log('Fetching admin courses...')
    dispatch(fetchAdminCourses({ ...filters, page: currentPage, limit: 10 }))
  }, [dispatch, filters, currentPage])

  // Debug state
  useEffect(() => {
    console.log('Admin courses state:', { adminCourses, loading, pagination })
  }, [adminCourses, loading, pagination])

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setCurrentPage(1)
  }

  const handleDelete = async (courseId) => {
    if (window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      try {
        await dispatch(deleteCourse(courseId)).unwrap()
      } catch (error) {
        console.error('Failed to delete course:', error)
      }
    }
  }

  const toggleVisibility = async (courseId) => {
    // This would require an additional API endpoint
    // For now, we'll just show a message
    alert('Toggle visibility feature requires additional backend implementation')
  }

  const domains = [
    { value: '', label: 'All Domains' },
    { value: 'dsa', label: 'Data Structures & Algorithms' },
    { value: 'dbms', label: 'Database Management Systems' },
    { value: 'os', label: 'Operating Systems' },
    { value: 'cn', label: 'Computer Networks' },
    { value: 'web', label: 'Web Development' },
  ]

  const difficulties = [
    { value: '', label: 'All Difficulties' },
    { value: 'easy', label: 'Easy' },
    { value: 'medium', label: 'Medium' },
    { value: 'hard', label: 'Hard' },
  ]

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800 border-green-300'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'hard': return 'bg-red-100 text-red-800 border-red-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const getDomainColor = (domain) => {
    switch (domain) {
      case 'dsa': return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'dbms': return 'bg-emerald-100 text-emerald-800 border-emerald-300'
      case 'os': return 'bg-orange-100 text-orange-800 border-orange-300'
      case 'cn': return 'bg-purple-100 text-purple-800 border-purple-300'
      case 'web': return 'bg-indigo-100 text-indigo-800 border-indigo-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-indigo-100 p-6 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-gradient-to-tr from-yellow-100/40 via-orange-100/40 to-red-100/40 animate-pulse"></div>
      <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-br from-pink-300/50 to-purple-300/50 rounded-full blur-3xl animate-bounce"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-br from-orange-300/50 to-yellow-300/50 rounded-full blur-3xl animate-pulse"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl shadow-lg shadow-purple-500/30">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Course Management
              </h1>
              <p className="text-gray-700 mt-1">Manage all courses</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/admin/courses/add')}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl hover:shadow-lg transition-all duration-300"
          >
            <Plus className="w-4 h-4" />
            <span>Add Course</span>
          </button>
        </div>

        {/* Filters */}
        <div className="bg-gradient-to-r from-purple-50/90 to-pink-50/90 backdrop-blur-md rounded-3xl shadow-xl p-6 border border-purple-200/50 mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Filter className="w-5 h-5 text-purple-600" />
            <h2 className="text-xl font-bold text-gray-800">Filters</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  placeholder="Search courses..."
                  className="w-full pl-10 pr-4 py-2 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 bg-white/90"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Domain</label>
              <select
                value={filters.domain}
                onChange={(e) => handleFilterChange('domain', e.target.value)}
                className="w-full px-4 py-2 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 bg-white/90"
              >
                {domains.map(domain => (
                  <option key={domain.value} value={domain.value}>
                    {domain.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Difficulty</label>
              <select
                value={filters.difficulty}
                onChange={(e) => handleFilterChange('difficulty', e.target.value)}
                className="w-full px-4 py-2 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 bg-white/90"
              >
                {difficulties.map(difficulty => (
                  <option key={difficulty.value} value={difficulty.value}>
                    {difficulty.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex items-end">
              <button
                onClick={() => setFilters({ domain: '', difficulty: '', search: '' })}
                className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all duration-200"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Courses List */}
        {loading ? (
          <div className="bg-gradient-to-r from-purple-50/90 to-pink-50/90 backdrop-blur-md rounded-3xl shadow-xl p-12 text-center border border-purple-200/50">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading courses...</p>
          </div>
        ) : adminCourses.length === 0 ? (
          <div className="bg-gradient-to-r from-purple-50/90 to-pink-50/90 backdrop-blur-md rounded-3xl shadow-xl p-12 text-center border border-purple-200/50">
            <BookOpen className="w-16 h-16 text-purple-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No Courses Found</h3>
            <p className="text-gray-600 mb-6">Get started by creating your first course</p>
            <button
              onClick={() => navigate('/admin/courses/add')}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 mx-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Add Course</span>
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {adminCourses.map((course) => (
              <div key={course._id} className="bg-gradient-to-r from-purple-50/90 to-pink-50/90 backdrop-blur-md rounded-3xl shadow-xl p-6 border border-purple-200/50 hover:shadow-2xl transition-all duration-300">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <h3 className="text-xl font-bold text-gray-900">{course.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getDomainColor(course.domain)}`}>
                        {course.domain.toUpperCase()}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getDifficultyColor(course.difficulty)}`}>
                        {course.difficulty.toUpperCase()}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${course.isVisible ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {course.isVisible ? 'Visible' : 'Hidden'}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-4 line-clamp-2">{course.description}</p>
                    
                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <BookOpen className="w-4 h-4" />
                        <span>{course.lessons.length} lessons</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className="font-semibold">XP:</span>
                        <span>{course.xpReward}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className="font-semibold">Enrolled:</span>
                        <span>{course.enrolledUsers?.length || 0}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className="font-semibold">Created by:</span>
                        <span>{course.createdBy?.name}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-6">
                    <button
                      onClick={() => navigate(`/admin/courses/${course._id}/edit`)}
                      className="p-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
                      title="Edit course"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    
                    <button
                      onClick={() => toggleVisibility(course._id)}
                      className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                      title={course.isVisible ? 'Hide course' : 'Show course'}
                    >
                      {course.isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    
                    <button
                      onClick={() => handleDelete(course._id)}
                      className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                      title="Delete course"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-center items-center space-x-4 mt-8">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-purple-100 text-purple-700 rounded-xl hover:bg-purple-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            <span className="text-gray-700">
              Page {currentPage} of {pagination.totalPages}
            </span>
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
              disabled={currentPage === pagination.totalPages}
              className="px-4 py-2 bg-purple-100 text-purple-700 rounded-xl hover:bg-purple-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
