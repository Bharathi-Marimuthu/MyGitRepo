export default function StatusBadge({ value }) {
  if(!value) return null;
  const cls = {
    'ACTIVE':'active','INACTIVE':'inactive','PAID':'paid','PENDING':'pending',
    'COMPLETED':'completed','CANCELLED':'cancelled','BOOKED':'booked',
    'IN_PROGRESS':'in-progress','GOLD':'gold','SILVER':'silver','PLATINUM':'platinum','NONE':'none'
  }[value.toUpperCase()]||'none';
  return <span className={"status-badge badge-"+cls}>{value.replace('_',' ')}</span>;
}
