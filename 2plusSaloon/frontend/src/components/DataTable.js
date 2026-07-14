export default function DataTable({ columns, data, loading, onEdit, onDelete }) {
  if (loading) return <div className="text-center py-5"><div className="spinner-border text-primary"/></div>;
  if (!data?.length) return <div className="text-center py-5 text-muted"><i className="bi bi-inbox fs-2 d-block mb-2"/><p>No records found</p></div>;
  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle">
        <thead>
          <tr>{columns.map(c=><th key={c.key} style={c.style}>{c.label}</th>)}<th style={{width:120}}>Actions</th></tr>
        </thead>
        <tbody>
          {data.map((row,i)=>(
            <tr key={row.id||i}>
              {columns.map(c=><td key={c.key}>{c.render?c.render(row[c.key],row):row[c.key]}</td>)}
              <td>
                <div className="d-flex gap-1">
                  {onEdit&&<button className="btn btn-sm btn-outline-primary" onClick={()=>onEdit(row)}><i className="bi bi-pencil"/></button>}
                  {onDelete&&<button className="btn btn-sm btn-outline-danger" onClick={()=>onDelete(row.id)}><i className="bi bi-trash"/></button>}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
