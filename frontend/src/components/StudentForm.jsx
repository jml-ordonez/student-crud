import { useState, useEffect } from 'react'

export default function StudentForm({ currentStudent, onSubmit, onCancel, isSubmitting }) {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    course: '',
    section: '',
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (currentStudent) {
      setFormData({
        firstname: currentStudent.firstname || '',
        lastname: currentStudent.lastname || '',
        course: currentStudent.course || '',
        section: currentStudent.section || '',
      })
      setErrors({})
    } else {
      setFormData({
        firstname: '',
        lastname: '',
        course: '',
        section: '',
      })
      setErrors({})
    }
  }, [currentStudent])

  const validate = () => {
    const newErrors = {}
    if (!formData.firstname.trim()) newErrors.firstname = 'First name is required'
    if (!formData.lastname.trim()) newErrors.lastname = 'Last name is required'
    if (!formData.course.trim()) newErrors.course = 'Course is required'
    if (!formData.section.trim()) newErrors.section = 'Section is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    onSubmit(formData)
  }

  const isEditing = Boolean(currentStudent)

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
      <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100">
        <div>
          <h2 className="text-lg font-bold text-slate-800">
            {isEditing ? `Edit Student (ID: ${currentStudent.id})` : 'Register New Student'}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {isEditing ? 'Update student details below' : 'Fill in the information to add a student'}
          </p>
        </div>
        {isEditing && (
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-50 text-amber-700 border border-amber-200">
            Edit Mode
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* First Name */}
          <div>
            <label htmlFor="firstname" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              First Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              id="firstname"
              name="firstname"
              value={formData.firstname}
              onChange={handleChange}
              placeholder="e.g. John"
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-800 placeholder-slate-400 transition-colors focus:outline-hidden focus:ring-2 ${
                errors.firstname
                  ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200 bg-rose-50/20'
                  : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-100 bg-white'
              }`}
            />
            {errors.firstname && (
              <p className="mt-1 text-xs text-rose-600 font-medium">{errors.firstname}</p>
            )}
          </div>

          {/* Last Name */}
          <div>
            <label htmlFor="lastname" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Last Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              id="lastname"
              name="lastname"
              value={formData.lastname}
              onChange={handleChange}
              placeholder="e.g. Doe"
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-800 placeholder-slate-400 transition-colors focus:outline-hidden focus:ring-2 ${
                errors.lastname
                  ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200 bg-rose-50/20'
                  : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-100 bg-white'
              }`}
            />
            {errors.lastname && (
              <p className="mt-1 text-xs text-rose-600 font-medium">{errors.lastname}</p>
            )}
          </div>

          {/* Course */}
          <div>
            <label htmlFor="course" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Course <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              id="course"
              name="course"
              value={formData.course}
              onChange={handleChange}
              placeholder="e.g. BS Computer Science"
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-800 placeholder-slate-400 transition-colors focus:outline-hidden focus:ring-2 ${
                errors.course
                  ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200 bg-rose-50/20'
                  : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-100 bg-white'
              }`}
            />
            {errors.course && (
              <p className="mt-1 text-xs text-rose-600 font-medium">{errors.course}</p>
            )}
          </div>

          {/* Section */}
          <div>
            <label htmlFor="section" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Section <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              id="section"
              name="section"
              value={formData.section}
              onChange={handleChange}
              placeholder="e.g. 3-A"
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-800 placeholder-slate-400 transition-colors focus:outline-hidden focus:ring-2 ${
                errors.section
                  ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200 bg-rose-50/20'
                  : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-100 bg-white'
              }`}
            />
            {errors.section && (
              <p className="mt-1 text-xs text-rose-600 font-medium">{errors.section}</p>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          {isEditing && (
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors disabled:opacity-50 cursor-pointer"
            >
              Cancel
            </button>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl shadow-xs shadow-indigo-300 transition-colors disabled:opacity-60 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <svg className="w-4 h-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
                <span>Processing...</span>
              </>
            ) : isEditing ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Update Student</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                <span>Add Student</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
