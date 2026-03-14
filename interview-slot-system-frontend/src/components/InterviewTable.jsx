import { formatDateTime, getStatusBadge } from '../utils/helpers'

const InterviewTable = ({ interviews, onComplete, onFeedback, userRole }) => {
  if (!interviews || interviews.length === 0) {
    return <div className="text-center text-muted py-4">No interviews found.</div>
  }
  return (
    <div className="table-responsive">
      <table className="table table-hover">
        <thead>
          <tr>
            <th>#</th>
            <th>Status</th>
            <th>Booked At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {interviews.map((interview, index) => (
            <tr key={interview.id}>
              <td>{index + 1}</td>
              <td>
                <span className={`badge bg-${getStatusBadge(interview.status)}`}>
                  {interview.status}
                </span>
              </td>
              <td>{formatDateTime(interview.bookedAt)}</td>
              <td>
                {interview.status === 'SCHEDULED' &&
                  (userRole === 'ADMIN' || userRole === 'HR' || userRole === 'INTERVIEWER') && (
                  <button className="btn btn-sm btn-success me-2"
                    onClick={() => onComplete && onComplete(interview.id)}>
                    Complete
                  </button>
                )}
                {interview.status === 'COMPLETED' && userRole === 'INTERVIEWER' && !interview.feedback && (
                  <button className="btn btn-sm btn-primary"
                    onClick={() => onFeedback && onFeedback(interview.id)}>
                    Feedback
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default InterviewTable