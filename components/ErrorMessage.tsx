interface ErrorMessageProps {
  message: string
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="max-w-md w-full bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <div className="text-red-600 text-4xl mb-4">❌</div>
        <h2 className="text-lg font-semibold text-red-800 mb-2">Error</h2>
        <p className="text-red-700">{message}</p>
      </div>
    </div>
  )
}
