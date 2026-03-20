import { formatDateTime } from '../utils/helpers'

const SlotCard = ({ slot, onSelect, selected }) => {
  return (
    <div
      className={`slot-card ${selected ? 'selected' : ''}`}
      onClick={() => onSelect && onSelect(slot)}
      style={{
        cursor: onSelect ? 'pointer' : 'default',
        border: selected ? '2px solid #667eea' : '1px solid #e9ecef',
        borderRadius: '10px',
        padding: '16px',
        marginBottom: '12px',
        backgroundColor: selected ? '#f0f2ff' : 'white',
        transition: 'all 0.2s ease'
      }}
    >
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <h6 className="mb-1">🕐 {formatDateTime(slot.startTime)}</h6>
          <small className="text-muted">to {formatDateTime(slot.endTime)}</small>

          {/* ✅ Job name */}
          {slot.job && (
            <div className="mt-1">
              <span className="badge bg-primary">
                💼 {slot.job.title}
              </span>
            </div>
          )}

          {/* ✅ Interviewer name */}
          {slot.interviewer && (
            <div className="mt-1">
              <small className="text-muted">
                👤 Interviewer: {slot.interviewer.name}
              </small>
            </div>
          )}

          {/* ✅ Interview Mode */}
          {slot.interviewMode && (
            <div className="mt-1">
              {slot.interviewMode === 'ONLINE' ? (
                <span className="badge bg-info">🖥️ Online</span>
              ) : (
                <span className="badge bg-warning text-dark">🏢 Offline</span>
              )}
            </div>
          )}

          {/* ✅ Show meeting link or venue */}
          {slot.modeDetails && (
            <div className="mt-1">
              {slot.interviewMode === 'ONLINE' ? (
                <a href={slot.modeDetails}
                  target="_blank"
                  rel="noreferrer"
                  className="small text-primary"
                  onClick={e => e.stopPropagation()}>
                  🔗 Join Meeting
                </a>
              ) : (
                <small className="text-muted">📍 {slot.modeDetails}</small>
              )}
            </div>
          )}
        </div>

        <span className={`badge bg-${slot.status === 'AVAILABLE' ? 'success' : 'warning'}`}>
          {slot.status}
        </span>
      </div>
    </div>
  )
}

export default SlotCard