import { formatDateTime } from '../utils/helpers'

const SlotCard = ({ slot, onSelect, selected }) => {
  return (
    <div className={`slot-card ${selected ? 'selected' : ''}`} onClick={() => onSelect && onSelect(slot)}>
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <h6 className="mb-1">🕐 {formatDateTime(slot.startTime)}</h6>
          <small className="text-muted">to {formatDateTime(slot.endTime)}</small>
        </div>
        <span className={`badge bg-${slot.status === 'AVAILABLE' ? 'success' : 'warning'}`}>
          {slot.status}
        </span>
      </div>
    </div>
  )
}

export default SlotCard