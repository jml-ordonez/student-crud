import { useState, useMemo } from 'react'

export default function StudentList({
  students,
  isLoading,
  onEdit,
  onDelete,
  onRefresh,
  currentEditingId,
}) {
  const [searchTerm, setSearchTerm] = useState('')
  const [pendingDeleteId, setPendingDeleteId] = useState(null)
  const [isDeletingId, setIsDeletingId] = useState(null)

  const filteredStudents = useMemo(() => {
    if (!searchTerm.trim()) return students

    const term = searchTerm.toLowerCase().trim()
    return students.filter((s) => {
      const fullName = `${s.firstname || ''} ${s.lastname || ''}`.toLowerCase()
      const course = (s.course || '').toLowerCase()
      const section = (s.section || '').toLowerCase()
      const id = String(s.id || '')

      return (
        fullName.includes(term) ||
        course.includes(term) ||
        section.includes(term) ||
        id.includes(term)
      )
    })
  }, [students, searchTerm])

  const handleConfirmDelete = async (id) => {
    setIsDeletingId(id)
    try {
      await onDelete(id)
    } finally {
      setIsDeletingId(null)
      setPendingDeleteId(null)
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Header & Search */}
      <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Enrolled Students</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Showing {filteredStudents.length} of {students.length} students
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Search Box */}
          <div className="relative flex-1 sm:w-64">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, course, section..."
              className="w-full pl-9 pr-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Refresh Button */}
          <button
            type="button"
            onClick={onRefresh}
            title="Refresh student list"
            disabled={isLoading}
            className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl border border-slate-200 transition-colors cursor-pointer disabled:opacity-50"
          >
            <svg
              className={`w-5 h-5 ${isLoading ? 'animate-spin text-indigo-600' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <th className="py-3 px-4">ID</th>
              <th className="py-3 px-4">Student Name</th>
              <th className="py-3 px-4">Course</th>
              <th className="py-3 px-4">Section</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {isLoading && students.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <svg className="w-8 h-8 animate-spin text-indigo-600" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                    </svg>
                    <span className="text-xs font-medium text-slate-500">Loading student records...</span>
                  </div>
                </td>
              </tr>
            ) : filteredStudents.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-12 text-center">
                  <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                    </div>
                    <p className="text-sm font-semibold text-slate-700">No students found</p>
                    <p className="text-xs text-slate-400 mt-1">
                      {searchTerm
                        ? `No results match "${searchTerm}". Try a different search term.`
                        : 'No student records yet. Use the form above to add your first student!'}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredStudents.map((student) => {
                const isSelected = currentEditingId === student.id
                const isConfirming = pendingDeleteId === student.id
                const isDeleting = isDeletingId === student.id

                return (
                  <tr
                    key={student.id}
                    className={`transition-colors hover:bg-slate-50/70 ${
                      isSelected ? 'bg-indigo-50/40 border-l-4 border-l-indigo-600' : ''
                    } ${isConfirming ? 'bg-rose-50/40' : ''}`}
                  >
                    {/* ID */}
                    <td className="py-3.5 px-4 font-mono text-xs font-semibold text-slate-500">
                      #{student.id}
                    </td>

                    {/* Full Name */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">
                        {student.firstname} {student.lastname}
                      </div>
                      <div className="text-xs text-slate-400 sm:hidden">
                        {student.course} &bull; Sec: {student.section}
                      </div>
                    </td>

                    {/* Course */}
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                        {student.course}
                      </span>
                    </td>

                    {/* Section */}
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                        {student.section}
                      </span>
                    </td>

                    {/* Actions (NO MODAL: Inline Delete Confirmation) */}
                    <td className="py-3.5 px-4 text-right">
                      {isConfirming ? (
                        <div className="inline-flex items-center gap-1.5 animate-fadeIn">
                          <span className="text-xs font-medium text-rose-700 mr-1 hidden sm:inline">
                            Confirm delete?
                          </span>
                          <button
                            type="button"
                            onClick={() => handleConfirmDelete(student.id)}
                            disabled={isDeleting}
                            className="px-2.5 py-1 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-xs transition-colors disabled:opacity-50 cursor-pointer"
                          >
                            {isDeleting ? 'Deleting...' : 'Yes, Delete'}
                          </button>
                          <button
                            type="button"
                            onClick={() => setPendingDeleteId(null)}
                            disabled={isDeleting}
                            className="px-2.5 py-1 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="inline-flex items-center justify-end gap-1.5">
                          {/* Edit Button */}
                          <button
                            type="button"
                            onClick={() => onEdit(student)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg border border-indigo-200 transition-colors cursor-pointer"
                            title="Edit student"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                            <span>Edit</span>
                          </button>

                          {/* Delete Button (triggers inline confirmation) */}
                          <button
                            type="button"
                            onClick={() => setPendingDeleteId(student.id)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg border border-rose-200 transition-colors cursor-pointer"
                            title="Delete student"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            <span>Delete</span>
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
