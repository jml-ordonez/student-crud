export default function NotificationBanner({ notification, onDismiss }) {
  if (!notification) return null

  const isSuccess = notification.type === 'success'

  return (
    <div
      className={`rounded-xl p-4 mb-6 flex items-start justify-between border transition-all ${
        isSuccess
          ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
          : 'bg-rose-50 border-rose-200 text-rose-800'
      }`}
      role="alert"
    >
      <div className="flex items-center gap-3">
        {isSuccess ? (
          <svg className="w-5 h-5 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ) : (
          <svg className="w-5 h-5 text-rose-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )}
        <p className="text-sm font-medium">{notification.message}</p>
      </div>
      <button
        type="button"
        onClick={onDismiss}
        className={`ml-4 text-xs font-semibold rounded p-1 hover:opacity-75 focus:outline-hidden ${
          isSuccess ? 'text-emerald-700' : 'text-rose-700'
        }`}
        aria-label="Dismiss"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}
