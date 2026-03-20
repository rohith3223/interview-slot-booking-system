/* eslint-disable */
import { formatDateTime, getStatusBadge } from '../utils/helpers'

const InterviewTable = ({ interviews, onComplete, onFeedback, onCancel, userRole }) => {
  if (!interviews || interviews.length === 0) {
    return <div className="text-center text-muted py-4">No interviews found.</div>
  }

  return (
    <div className="table-responsive">
      <table className="table table-hover">
        <thead>
          <tr>
            <th>#</th>
            <th>Candidate</th>
            <th>Job</th>
            <th>Mode</th>
            <th>Status</th>
            <th>Booked At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {interviews.map((interview, index) => (
            <tr key={interview.id}>
              <td>{index + 1}</td>

              {/* Candidate Name */}
              <td>{interview.candidate?.name || 'N/A'}</td>

              {/* Job Title */}
              <td>
                {interview.job?.title
                  ? <span className="badge bg-primary">{interview.job.title}</span>
                  : 'N/A'}
              </td>

              {/* Interview Mode */}
              <td>
                {interview.interviewMode === 'ONLINE' ? (
                  <div>
                    <span className="badge bg-info">🖥️ Online</span>
                    {interview.modeDetails && (
                      <div className="mt-1">
                        <a href={interview.modeDetails}
                          target="_blank"
                          rel="noreferrer"
                          className="small text-primary">
                          🔗 Join Meeting
                        </a>
                      </div>
                    )}
                  </div>
                ) : interview.interviewMode === 'OFFLINE' ? (
                  <div>
                    <span className="badge bg-warning text-dark">🏢 Offline</span>
                    {interview.modeDetails && (
                      <div className="mt-1">
                        <small className="text-muted">📍 {interview.modeDetails}</small>
                      </div>
                    )}
                  </div>
                ) : (
                  <span className="text-muted">N/A</span>
                )}
              </td>

              {/* Status */}
              <td>
                <span className={`badge bg-${getStatusBadge(interview.status)}`}>
                  {interview.status}
                </span>
              </td>

              {/* Booked At */}
              <td>{formatDateTime(interview.bookedAt)}</td>

              {/* Actions */}
              <td>
                <div className="d-flex gap-1 flex-wrap">
                  {/* ✅ Complete button — Admin/HR/Interviewer */}
                  {interview.status === 'SCHEDULED' &&
                    (userRole === 'ADMIN' || userRole === 'HR' || userRole === 'INTERVIEWER') && (
                    <button className="btn btn-sm btn-success"
                      onClick={() => onComplete && onComplete(interview.id)}>
                      ✅ Complete
                    </button>
                  )}

                  {/* ✅ Cancel button — Candidate only */}
                  {interview.status === 'SCHEDULED' && userRole === 'CANDIDATE' && (
                    <button className="btn btn-sm btn-danger"
                      onClick={() => onCancel && onCancel(interview.id)}>
                      ❌ Cancel
                    </button>
                  )}

                  {/* ✅ Cancel button — Admin/HR can also cancel */}
                  {interview.status === 'SCHEDULED' &&
                    (userRole === 'ADMIN' || userRole === 'HR') && (
                    <button className="btn btn-sm btn-outline-danger"
                      onClick={() => onCancel && onCancel(interview.id)}>
                      ❌ Cancel
                    </button>
                  )}

                  {/* ✅ Feedback button — Interviewer */}
                  {interview.status === 'COMPLETED' &&
                    userRole === 'INTERVIEWER' && !interview.feedback && (
                    <button className="btn btn-sm btn-primary"
                      onClick={() => onFeedback && onFeedback(interview.id)}>
                      📝 Feedback
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default InterviewTable
