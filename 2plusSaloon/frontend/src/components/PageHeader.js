export default function PageHeader({ title, subtitle, onAdd, addLabel='Add New', extra }) {
  return (
    <div className="page-header">
      <div><h4>{title}</h4>{subtitle&&<p>{subtitle}</p>}</div>
      <div className="d-flex gap-2">
        {extra}
        {onAdd&&<button className="btn btn-primary" onClick={onAdd}><i className="bi bi-plus-lg me-2"/>{addLabel}</button>}
      </div>
    </div>
  );
}
