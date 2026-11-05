import { useState, useEffect, useCallback, useMemo } from 'react'
import Navbar from './components/Navbar'
import StudentForm from './components/StudentForm'
import StudentList from './components/StudentList'
import NotificationBanner from './components/NotificationBanner'
import { studentService } from './services/studentService'

export default function App() {
  const [students, setStudents] = useState([])
  const [currentStudent, setCurrentStudent] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [notification, setNotification] = useState(null)

  const showNotification = useCallback((message, type = 'success') => {
    setNotification({ message, type })
  }, [])

  const dismissNotification = useCallback(() => {
    setNotification(null)
  }, [])

  // Fetch all students
  const loadStudents = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await studentService.getAll()
      // Ensure array format (Iterable)
      setStudents(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Failed to load students:', err)
      showNotification(
        `Failed to connect to API: ${err.message}. Ensure your Spring Boot backend is running on port 8080.`,
        'error'
      )
    } finally {
      setIsLoading(false)
    }
  }, [showNotification])

  useEffect(() => {
    loadStudents()
  }, [loadStudents])

  // Handle Create or Update
  const handleSubmitForm = async (formData) => {
    setIsSubmitting(true)
    try {
      if (currentStudent) {
        // Update
        const updated = await studentService.update(currentStudent.id, formData)
        showNotification(`Student #${currentStudent.id} (${updated.firstname} ${updated.lastname}) updated successfully!`)
        setCurrentStudent(null)
      } else {
        // Create
        const created = await studentService.create(formData)
        showNotification(`Student (${created.firstname} ${created.lastname}) created successfully with ID #${created.id}!`)
      }
      await loadStudents()
    } catch (err) {
      console.error('Error saving student:', err)
      showNotification(`Failed to save student: ${err.message}`, 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle Edit selection
  const handleEdit = (student) => {
    setCurrentStudent(student)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Handle Cancel edit
  const handleCancelEdit = () => {
    setCurrentStudent(null)
  }

  // Handle Delete (No modal - inline confirmed in StudentList)
  const handleDelete = async (id) => {
    try {
      await studentService.delete(id)
      showNotification(`Student #${id} was deleted successfully.`)
      // If the currently edited student was deleted, reset edit form
      if (currentStudent && currentStudent.id === id) {
        setCurrentStudent(null)
      }
      await loadStudents()
    } catch (err) {
      console.error('Failed to delete student:', err)
      showNotification(`Failed to delete student #${id}: ${err.message}`, 'error')
    }
  }

  // Stats calculation
  const stats = useMemo(() => {
    const courses = new Set(students.map((s) => s.course).filter(Boolean))
    const sections = new Set(students.map((s) => s.section).filter(Boolean))
    return {
      total: students.length,
      totalCourses: courses.size,
      totalSections: sections.size,
    }
  }, [students])

  return (
    <div className="min-h-screen bg-slate-100/60 pb-16">
      <Navbar totalCount={students.length} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Notification Banner */}
        <NotificationBanner
          notification={notification}
          onDismiss={dismissNotification}
        />

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Enrolled</p>
              <p className="text-2xl font-extrabold text-slate-900">{stats.total}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Courses</p>
              <p className="text-2xl font-extrabold text-slate-900">{stats.totalCourses}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Sections</p>
              <p className="text-2xl font-extrabold text-slate-900">{stats.totalSections}</p>
            </div>
          </div>
        </div>

        {/* Form and List Layout */}
        <div className="space-y-8">
          {/* Student Form */}
          <StudentForm
            currentStudent={currentStudent}
            onSubmit={handleSubmitForm}
            onCancel={handleCancelEdit}
            isSubmitting={isSubmitting}
          />

          {/* Student List */}
          <StudentList
            students={students}
            isLoading={isLoading}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onRefresh={loadStudents}
            currentEditingId={currentStudent?.id}
          />
        </div>
      </main>
    </div>
  )
}
