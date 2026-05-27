import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { createCourse } from '../store/slices/courseSlice'
import { BookOpen, Plus, Trash2, Save, X } from 'lucide-react'

export default function AddCourse() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading } = useSelector((state) => state.courses)
  
  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    domain: 'dsa',
    difficulty: 'easy',
    isVisible: true,
    xpReward: 50,
    lessons: [
      {
        title: '',
        content: '',
        videoUrl: '',
        resources: [],
        order: 1,
      },
    ],
  })

  const domains = [
    { value: 'dsa', label: 'Data Structures & Algorithms' },
    { value: 'dbms', label: 'Database Management Systems' },
    { value: 'os', label: 'Operating Systems' },
    { value: 'cn', label: 'Computer Networks' },
    { value: 'web', label: 'Web Development' },
  ]

  const difficulties = [
    { value: 'easy', label: 'Easy' },
    { value: 'medium', label: 'Medium' },
    { value: 'hard', label: 'Hard' },
  ]

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setCourseData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleLessonChange = (lessonIndex, field, value) => {
    const updatedLessons = [...courseData.lessons]
    updatedLessons[lessonIndex] = {
      ...updatedLessons[lessonIndex],
      [field]: value,
    }
    setCourseData(prev => ({ ...prev, lessons: updatedLessons }))
  }

  const addLesson = () => {
    setCourseData(prev => ({
      ...prev,
      lessons: [
        ...prev.lessons,
        {
          title: '',
          content: '',
          videoUrl: '',
          resources: [],
          order: prev.lessons.length + 1,
        },
      ],
    }))
  }

  const removeLesson = (lessonIndex) => {
    if (courseData.lessons.length > 1) {
      const updatedLessons = courseData.lessons.filter((_, index) => index !== lessonIndex)
      // Reorder lessons
      const reorderedLessons = updatedLessons.map((lesson, index) => ({
        ...lesson,
        order: index + 1,
      }))
      setCourseData(prev => ({ ...prev, lessons: reorderedLessons }))
    }
  }

  const addResource = (lessonIndex) => {
    const updatedLessons = [...courseData.lessons]
    updatedLessons[lessonIndex] = {
      ...updatedLessons[lessonIndex],
      resources: [
        ...updatedLessons[lessonIndex].resources,
        { title: '', url: '', type: 'link' },
      ],
    }
    setCourseData(prev => ({ ...prev, lessons: updatedLessons }))
  }

  const removeResource = (lessonIndex, resourceIndex) => {
    const updatedLessons = [...courseData.lessons]
    updatedLessons[lessonIndex] = {
      ...updatedLessons[lessonIndex],
      resources: updatedLessons[lessonIndex].resources.filter((_, index) => index !== resourceIndex),
    }
    setCourseData(prev => ({ ...prev, lessons: updatedLessons }))
  }

  const handleResourceChange = (lessonIndex, resourceIndex, field, value) => {
    const updatedLessons = [...courseData.lessons]
    updatedLessons[lessonIndex].resources[resourceIndex] = {
      ...updatedLessons[lessonIndex].resources[resourceIndex],
      [field]: value,
    }
    setCourseData(prev => ({ ...prev, lessons: updatedLessons }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate lessons
    const validLessons = courseData.lessons.filter(lesson => lesson.title && lesson.content)
    if (validLessons.length === 0) {
      alert('Please add at least one lesson with title and content')
      return
    }

    try {
      await dispatch(createCourse(courseData)).unwrap()
      navigate('/admin/courses')
    } catch (error) {
      console.error('Failed to create course:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-indigo-100 p-6 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-gradient-to-tr from-yellow-100/40 via-orange-100/40 to-red-100/40 animate-pulse"></div>
      <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-br from-pink-300/50 to-purple-300/50 rounded-full blur-3xl animate-bounce"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-br from-orange-300/50 to-yellow-300/50 rounded-full blur-3xl animate-pulse"></div>
      
      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl shadow-lg shadow-purple-500/30">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Create New Course
              </h1>
              <p className="text-gray-700 mt-1">Add a new learning course</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/admin/courses')}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Course Details */}
          <div className="bg-gradient-to-r from-purple-50/90 to-pink-50/90 backdrop-blur-md rounded-3xl shadow-xl p-8 border border-purple-200/50">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Course Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Course Title *</label>
                <input
                  type="text"
                  name="title"
                  value={courseData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 bg-white/90"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">XP Reward</label>
                <input
                  type="number"
                  name="xpReward"
                  value={courseData.xpReward}
                  onChange={handleInputChange}
                  min="10"
                  max="500"
                  className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 bg-white/90"
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Description *</label>
              <textarea
                name="description"
                value={courseData.description}
                onChange={handleInputChange}
                rows="4"
                className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 bg-white/90"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Domain *</label>
                <select
                  name="domain"
                  value={courseData.domain}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 bg-white/90"
                  required
                >
                  {domains.map(domain => (
                    <option key={domain.value} value={domain.value}>
                      {domain.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Difficulty *</label>
                <select
                  name="difficulty"
                  value={courseData.difficulty}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 bg-white/90"
                  required
                >
                  {difficulties.map(difficulty => (
                    <option key={difficulty.value} value={difficulty.value}>
                      {difficulty.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-center space-x-3 mt-8">
                <input
                  type="checkbox"
                  name="isVisible"
                  id="isVisible"
                  checked={courseData.isVisible}
                  onChange={handleInputChange}
                  className="w-5 h-5 text-purple-600 border-purple-300 rounded focus:ring-purple-500"
                />
                <label htmlFor="isVisible" className="text-sm font-semibold text-gray-700">
                  Make course visible
                </label>
              </div>
            </div>
          </div>

          {/* Lessons */}
          <div className="bg-gradient-to-r from-purple-50/90 to-pink-50/90 backdrop-blur-md rounded-3xl shadow-xl p-8 border border-purple-200/50">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Lessons</h2>
              <button
                type="button"
                onClick={addLesson}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl hover:shadow-lg transition-all duration-300"
              >
                <Plus className="w-4 h-4" />
                <span>Add Lesson</span>
              </button>
            </div>

            <div className="space-y-6">
              {courseData.lessons.map((lesson, lessonIndex) => (
                <div key={lessonIndex} className="border-2 border-purple-200 rounded-2xl p-6 bg-white/50">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">Lesson {lesson.order}</h3>
                    {courseData.lessons.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeLesson(lessonIndex)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Lesson Title *</label>
                      <input
                        type="text"
                        value={lesson.title}
                        onChange={(e) => handleLessonChange(lessonIndex, 'title', e.target.value)}
                        className="w-full px-4 py-2 border-2 border-purple-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 bg-white/90"
                        placeholder="Enter lesson title"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Video URL (optional)</label>
                      <input
                        type="url"
                        value={lesson.videoUrl}
                        onChange={(e) => handleLessonChange(lessonIndex, 'videoUrl', e.target.value)}
                        className="w-full px-4 py-2 border-2 border-purple-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 bg-white/90"
                        placeholder="https://example.com/video"
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Content *</label>
                    <textarea
                      value={lesson.content}
                      onChange={(e) => handleLessonChange(lessonIndex, 'content', e.target.value)}
                      rows="6"
                      className="w-full px-4 py-2 border-2 border-purple-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 bg-white/90"
                      placeholder="Enter lesson content"
                    />
                  </div>

                  {/* Resources */}
                  <div className="mt-6">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="text-md font-semibold text-gray-700">Resources</h4>
                      <button
                        type="button"
                        onClick={() => addResource(lessonIndex)}
                        className="flex items-center space-x-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add Resource</span>
                      </button>
                    </div>

                    <div className="space-y-3">
                      {lesson.resources.map((resource, resourceIndex) => (
                        <div key={resourceIndex} className="flex gap-3">
                          <input
                            type="text"
                            value={resource.title}
                            onChange={(e) => handleResourceChange(lessonIndex, resourceIndex, 'title', e.target.value)}
                            className="flex-1 px-3 py-2 border-2 border-purple-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 bg-white/90"
                            placeholder="Resource title"
                          />
                          <input
                            type="url"
                            value={resource.url}
                            onChange={(e) => handleResourceChange(lessonIndex, resourceIndex, 'url', e.target.value)}
                            className="flex-1 px-3 py-2 border-2 border-purple-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 bg-white/90"
                            placeholder="Resource URL"
                          />
                          <select
                            value={resource.type}
                            onChange={(e) => handleResourceChange(lessonIndex, resourceIndex, 'type', e.target.value)}
                            className="px-3 py-2 border-2 border-purple-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 bg-white/90"
                          >
                            <option value="link">Link</option>
                            <option value="document">Document</option>
                            <option value="video">Video</option>
                          </select>
                          <button
                            type="button"
                            onClick={() => removeResource(lessonIndex, resourceIndex)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/admin/courses')}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? 'Creating...' : 'Create Course'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
