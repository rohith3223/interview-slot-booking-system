
const EmptyState = ({ icon = '📭', title = 'No data found', message = 'Nothing to show here yet.' }) => {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center py-5">
      <div style={{ fontSize: '4rem' }}>{icon}</div>
      <h5 className="mt-3 text-dark">{title}</h5>
      <p className="text-muted">{message}</p>
    </div>
  )
}

export default EmptyState