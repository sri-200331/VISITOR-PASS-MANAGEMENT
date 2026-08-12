const labels = {
  "checked-in": "Checked In",
  "checked-out": "Checked Out"
};
export default function StatusBadge({ status }) {
  return(
   <span className={`status status-${status}`}>
    {labels[status] || status}
   </span>
  )
}
