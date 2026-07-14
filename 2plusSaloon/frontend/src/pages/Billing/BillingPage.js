import { useState, useEffect } from 'react';
import api from '../../api/axios';
import PageHeader from '../../components/PageHeader';
import StatusBadge from '../../components/StatusBadge';
import toast from 'react-hot-toast';

const PAYMENT_ICONS = { CASH:'bi-cash-coin', UPI:'bi-phone', CREDIT_CARD:'bi-credit-card', DEBIT_CARD:'bi-credit-card-2-front' };

export default function BillingPage() {
  const [tab, setTab] = useState('create'); // create | list
  const [services, setServices] = useState([]);
  const [products, setProducts] = useState([]);
  const [invoices, setInvoices]   = useState([]);
  const [loading, setLoading]     = useState(false);
  const [invoicesLoading, setInvoicesLoading] = useState(false);

  // Form state
  const [customer, setCustomer]   = useState(null);
  const [custId, setCustId]       = useState('');
  const [custSearch, setCustSearch] = useState('');
  const [items, setItems]         = useState([]);
  const [discount, setDiscount]   = useState(0);
  const [payment, setPayment]     = useState('CASH');
  const [notes, setNotes]         = useState('');
  const [loyaltyRedeem, setLoyaltyRedeem] = useState(0);

  // Preview invoice
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    api.get('/services', { params:{ page:0, size:100 } }).then(r => setServices(r.data.data?.content||[])).catch(()=>{});
    api.get('/products', { params:{ page:0, size:100 } }).then(r => setProducts(r.data.data?.content||[])).catch(()=>{});
    loadInvoices();
  }, []);

  const loadInvoices = async () => {
    setInvoicesLoading(true);
    try { const r = await api.get('/invoices',{params:{page:0,size:20}}); setInvoices(r.data.data?.content||[]); }
    catch { setInvoices([]); } finally { setInvoicesLoading(false); }
  };

  const searchCustomer = async () => {
    if (!custId) return;
    try { const r = await api.get(`/customers/${custId}`); setCustomer(r.data.data); toast.success('Customer loaded!'); }
    catch { toast.error('Customer not found'); setCustomer(null); }
  };

  const addService = id => {
    const svc = services.find(s=>s.id===Number(id));
    if (!svc) return;
    const existing = items.find(i=>i.itemId===svc.id&&i.itemType==='SERVICE');
    if (existing) { setItems(items.map(i=>i.itemId===svc.id&&i.itemType==='SERVICE'?{...i,qty:i.qty+1}:i)); return; }
    setItems([...items, { itemType:'SERVICE', itemId:svc.id, itemName:svc.serviceName, unitPrice:Number(svc.price), gstPct:Number(svc.gstPercentage), qty:1 }]);
  };

  const addProduct = id => {
    const pr = products.find(p=>p.id===Number(id));
    if (!pr) return;
    const existing = items.find(i=>i.itemId===pr.id&&i.itemType==='PRODUCT');
    if (existing) { setItems(items.map(i=>i.itemId===pr.id&&i.itemType==='PRODUCT'?{...i,qty:i.qty+1}:i)); return; }
    setItems([...items, { itemType:'PRODUCT', itemId:pr.id, itemName:pr.productName, unitPrice:Number(pr.sellingPrice), gstPct:18, qty:1 }]);
  };

  const removeItem = idx => setItems(items.filter((_,i)=>i!==idx));
  const updateQty  = (idx, qty) => { if (qty<1) return; setItems(items.map((it,i)=>i===idx?{...it,qty}:it)); };

  const subtotal   = items.reduce((s,i)=>s+i.qty*i.unitPrice, 0);
  const discountAmt = subtotal*(discount/100);
  const gstAmount  = items.reduce((s,i)=>s+(i.qty*i.unitPrice*(i.gstPct/100)), 0);
  const total      = subtotal - discountAmt + gstAmount - loyaltyRedeem;

  const handleSubmit = async () => {
    if (!customer) { toast.error('Please select a customer'); return; }
    if (!items.length) { toast.error('Please add at least one item'); return; }
    setLoading(true);
    try {
      const r = await api.post('/invoices', {
        customerId: customer.id, branchId: 1,
        items: items.map(i=>({ itemType:i.itemType, itemId:i.itemId, itemName:i.itemName, qty:i.qty, unitPrice:i.unitPrice, gstPct:i.gstPct, lineTotal:i.qty*i.unitPrice })),
        discountPct: discount, paymentMethod: payment,
        loyaltyRedeemed: loyaltyRedeem, notes,
      });
      setPreview(r.data.data);
      toast.success('Invoice created!');
      loadInvoices();
      // Reset
      setItems([]); setCustomer(null); setCustId(''); setDiscount(0); setNotes(''); setLoyaltyRedeem(0);
    } catch(err) { toast.error(err.response?.data?.message||'Error creating invoice'); }
    finally { setLoading(false); }
  };

  const formatINR = v => '₹'+Number(v||0).toLocaleString('en-IN',{minimumFractionDigits:2,maximumFractionDigits:2});

  return (
    <div>
      <PageHeader title="Billing & Invoices" subtitle="Create invoices and manage payments"
        extra={
          <div className="btn-group">
            <button className={"btn btn-sm "+(tab==='create'?'btn-primary':'btn-outline-primary')} onClick={()=>setTab('create')}><i className="bi bi-plus-lg me-1"/>New Invoice</button>
            <button className={"btn btn-sm "+(tab==='list'?'btn-primary':'btn-outline-primary')} onClick={()=>{ setTab('list'); loadInvoices(); }}><i className="bi bi-list-ul me-1"/>All Invoices</button>
          </div>
        }
      />

      {tab==='create' ? (
        <div className="row g-3">
          {/* Left – Items */}
          <div className="col-lg-7">
            {/* Customer */}
            <div className="card p-3 mb-3">
              <h6 className="fw-600 mb-3"><i className="bi bi-person-fill me-2 text-primary"/>Customer</h6>
              <div className="input-group">
                <input className="form-control" placeholder="Enter Customer ID" value={custId} onChange={e=>setCustId(e.target.value)} onKeyDown={e=>e.key==='Enter'&&searchCustomer()}/>
                <button className="btn btn-primary" onClick={searchCustomer}><i className="bi bi-search"/></button>
              </div>
              {customer && (
                <div className="d-flex align-items-center gap-3 mt-3 p-3 rounded-3" style={{background:'var(--primary-light)'}}>
                  <div className="avatar" style={{background:'var(--primary)',width:44,height:44,fontSize:'1.1rem'}}>{customer.fullName?.[0]}</div>
                  <div className="flex-grow-1">
                    <div className="fw-600">{customer.fullName}</div>
                    <div className="text-muted small">{customer.mobile} · {customer.email}</div>
                    <div className="mt-1">
                      <StatusBadge value={customer.membershipType}/>
                      <span className="ms-2 small text-warning fw-600"><i className="bi bi-star-fill me-1"/>{customer.loyaltyPoints||0} pts</span>
                    </div>
                  </div>
                  <button className="btn btn-sm btn-outline-danger" onClick={()=>setCustomer(null)}><i className="bi bi-x"/></button>
                </div>
              )}
            </div>

            {/* Services */}
            <div className="card p-3 mb-3">
              <h6 className="fw-600 mb-3"><i className="bi bi-scissors me-2 text-primary"/>Add Services</h6>
              <div className="row g-2">
                {services.map(s=>(
                  <div key={s.id} className="col-md-6">
                    <div className="d-flex align-items-center justify-content-between p-2 rounded-2 border cursor-pointer" onClick={()=>addService(s.id)} style={{cursor:'pointer',transition:'all .15s'}}
                      onMouseEnter={e=>e.currentTarget.style.borderColor='var(--primary)'}
                      onMouseLeave={e=>e.currentTarget.style.borderColor='#dee2e6'}>
                      <div>
                        <div className="small fw-500">{s.serviceName}</div>
                        <div style={{fontSize:'.7rem',color:'#6b7280'}}>{s.durationMins} min · GST {s.gstPercentage}%</div>
                      </div>
                      <div className="fw-700 text-primary">{formatINR(s.price)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Products */}
            <div className="card p-3">
              <h6 className="fw-600 mb-3"><i className="bi bi-bag-fill me-2 text-primary"/>Add Products</h6>
              <div className="row g-2">
                {products.map(p=>(
                  <div key={p.id} className="col-md-6">
                    <div className="d-flex align-items-center justify-content-between p-2 rounded-2 border" onClick={()=>addProduct(p.id)} style={{cursor:'pointer',transition:'all .15s'}}
                      onMouseEnter={e=>e.currentTarget.style.borderColor='var(--primary)'}
                      onMouseLeave={e=>e.currentTarget.style.borderColor='#dee2e6'}>
                      <div>
                        <div className="small fw-500">{p.productName}</div>
                        <div style={{fontSize:'.7rem',color:'#6b7280'}}>{p.brand} · Stock: {p.quantity}</div>
                      </div>
                      <div className="fw-700 text-primary">{formatINR(p.sellingPrice)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right – Summary */}
          <div className="col-lg-5">
            <div className="card p-4" style={{position:'sticky',top:80}}>
              <h6 className="fw-600 mb-3"><i className="bi bi-receipt me-2 text-primary"/>Invoice Summary</h6>

              {/* Items list */}
              {!items.length ? (
                <div className="text-center py-4 text-muted">
                  <i className="bi bi-cart-x fs-2 d-block mb-2"/>
                  <small>No items added yet</small>
                </div>
              ) : (
                <div className="mb-3">
                  {items.map((item,i)=>(
                    <div key={i} className="d-flex align-items-center gap-2 py-2 border-bottom">
                      <div className="flex-grow-1 overflow-hidden">
                        <div className="small fw-500 text-truncate">{item.itemName}</div>
                        <div style={{fontSize:'.7rem',color:'#6b7280'}}>{item.itemType} · {formatINR(item.unitPrice)} each</div>
                      </div>
                      <div className="input-group" style={{width:100}}>
                        <button className="btn btn-sm btn-outline-secondary" onClick={()=>updateQty(i,item.qty-1)}>-</button>
                        <input className="form-control form-control-sm text-center" value={item.qty} onChange={e=>updateQty(i,Number(e.target.value))} style={{width:36}}/>
                        <button className="btn btn-sm btn-outline-secondary" onClick={()=>updateQty(i,item.qty+1)}>+</button>
                      </div>
                      <div className="fw-600 small text-nowrap">{formatINR(item.qty*item.unitPrice)}</div>
                      <button className="btn btn-sm text-danger p-0" onClick={()=>removeItem(i)}><i className="bi bi-x-lg"/></button>
                    </div>
                  ))}
                </div>
              )}

              {/* Discount */}
              <div className="mb-3">
                <label className="form-label small fw-500">Discount %</label>
                <div className="input-group">
                  <input type="range" className="form-range" min={0} max={50} value={discount} onChange={e=>setDiscount(Number(e.target.value))} style={{flex:1}}/>
                  <span className="input-group-text fw-700 text-primary" style={{width:52}}>{discount}%</span>
                </div>
              </div>

              {/* Loyalty Redeem */}
              {customer?.loyaltyPoints > 0 && (
                <div className="mb-3 p-2 rounded-2" style={{background:'#FEF3C7'}}>
                  <div className="small fw-600 mb-1"><i className="bi bi-star-fill me-1 text-warning"/>Redeem Loyalty Points ({customer.loyaltyPoints} available)</div>
                  <input type="number" className="form-control form-control-sm" max={customer.loyaltyPoints} value={loyaltyRedeem} onChange={e=>setLoyaltyRedeem(Math.min(Number(e.target.value),customer.loyaltyPoints))} placeholder="Points to redeem"/>
                </div>
              )}

              {/* Totals */}
              <div className="border-top pt-3">
                {[ ['Subtotal', formatINR(subtotal)], [`Discount (${discount}%)`, '– '+formatINR(discountAmt)], ['GST', formatINR(gstAmount)], loyaltyRedeem?['Loyalty Redeemed','– '+formatINR(loyaltyRedeem)]:null ].filter(Boolean).map(([l,v])=>(
                  <div key={l} className="d-flex justify-content-between mb-1 small"><span className="text-muted">{l}</span><span>{v}</span></div>
                ))}
                <div className="d-flex justify-content-between fw-700 fs-5 mt-2 pt-2 border-top">
                  <span>TOTAL</span><span className="text-primary">{formatINR(total)}</span>
                </div>
              </div>

              {/* Payment Method */}
              <div className="my-3">
                <label className="form-label small fw-500">Payment Method</label>
                <div className="row g-2">
                  {['CASH','UPI','CREDIT_CARD','DEBIT_CARD'].map(m=>(
                    <div key={m} className="col-6">
                      <div className={"p-2 rounded-2 border text-center cursor-pointer small fw-500 "+(payment===m?'border-primary bg-primary text-white':'bg-light')} onClick={()=>setPayment(m)} style={{cursor:'pointer',transition:'all .15s'}}>
                        <i className={"bi "+PAYMENT_ICONS[m]+" d-block mb-1"}/>{m.replace('_',' ')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-500">Notes</label>
                <textarea className="form-control form-control-sm" rows={2} value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Any additional notes..."/>
              </div>

              <button className="btn btn-primary w-100 py-2 fw-600" onClick={handleSubmit} disabled={loading||!items.length||!customer}>
                {loading?<span className="spinner-border spinner-border-sm me-2"/>:<i className="bi bi-receipt me-2"/>}
                {loading?'Processing...':'Generate Invoice'}
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Invoice List */
        <div className="card table-card">
          {invoicesLoading ? <div className="text-center py-5"><div className="spinner-border text-primary"/></div> :
          !invoices.length ? <div className="text-center py-5 text-muted"><i className="bi bi-receipt fs-2 d-block mb-2"/><p>No invoices yet</p></div> : (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead><tr><th>Invoice #</th><th>Date</th><th>Customer</th><th>Items</th><th>Payment</th><th>Total</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>
                  {invoices.map(inv=>(
                    <tr key={inv.id}>
                      <td><span className="fw-700 text-primary small">{inv.invoiceNumber}</span></td>
                      <td className="small">{inv.invoiceDate}</td>
                      <td><div className="fw-500 small">{inv.customer?.fullName}</div><div className="text-muted" style={{fontSize:'.7rem'}}>{inv.customer?.mobile}</div></td>
                      <td><span className="badge bg-light text-dark">{inv.details?.length||0} items</span></td>
                      <td><span className="small"><i className={"bi "+(PAYMENT_ICONS[inv.paymentMethod]||'bi-cash')+" me-1"}/>{inv.paymentMethod?.replace('_',' ')}</span></td>
                      <td><span className="fw-700 text-primary">{formatINR(inv.totalAmount)}</span></td>
                      <td><StatusBadge value={inv.paymentStatus}/></td>
                      <td>
                        <div className="d-flex gap-1">
                          <button className="btn btn-sm btn-outline-primary" title="Print"><i className="bi bi-printer"/></button>
                          <button className="btn btn-sm btn-outline-secondary" title="Download PDF"><i className="bi bi-file-pdf"/></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Invoice Preview Modal */}
      {preview && (
        <div className="modal d-block" style={{background:'rgba(0,0,0,.6)'}}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-600 text-success"><i className="bi bi-check-circle-fill me-2"/>Invoice Generated!</h5>
                <button className="btn-close" onClick={()=>setPreview(null)}/>
              </div>
              <div className="modal-body p-4">
                <div className="invoice-preview">
                  <div className="invoice-header row">
                    <div className="col-7">
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <div style={{width:42,height:42,background:'var(--primary)',borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center'}}><i className="bi bi-scissors text-white fs-5"/></div>
                        <div><div className="fw-700 fs-5">Elegance Salon</div><div className="text-muted small">Premium Beauty & Wellness</div></div>
                      </div>
                      <div className="small text-muted">Branch: {preview.branch?.branchName}</div>
                      <div className="small text-muted">GST: {preview.branch?.gstNumber}</div>
                    </div>
                    <div className="col-5 text-end">
                      <div className="fw-700 fs-4 text-primary">{preview.invoiceNumber}</div>
                      <div className="small text-muted">Date: {preview.invoiceDate}</div>
                      <div className="mt-2"><StatusBadge value={preview.paymentStatus}/></div>
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-6">
                      <div className="fw-600 small mb-1">Bill To:</div>
                      <div className="fw-500">{preview.customer?.fullName}</div>
                      <div className="small text-muted">{preview.customer?.mobile}</div>
                      <div className="small text-muted">{preview.customer?.email}</div>
                    </div>
                    <div className="col-6 text-end">
                      <div className="fw-600 small mb-1">Payment:</div>
                      <div className="small">{preview.paymentMethod?.replace('_',' ')}</div>
                    </div>
                  </div>

                  <table className="table table-sm table-bordered mb-3">
                    <thead className="table-light"><tr><th>#</th><th>Item</th><th>Type</th><th className="text-end">Qty</th><th className="text-end">Price</th><th className="text-end">Total</th></tr></thead>
                    <tbody>
                      {(preview.details||[]).map((d,i)=>(
                        <tr key={i}><td>{i+1}</td><td>{d.itemName}</td><td><span className="badge bg-light text-dark">{d.itemType}</span></td><td className="text-end">{d.qty}</td><td className="text-end">{formatINR(d.unitPrice)}</td><td className="text-end fw-500">{formatINR(d.lineTotal)}</td></tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="row justify-content-end">
                    <div className="col-5">
                      <table className="table table-sm table-borderless">
                        <tbody>
                          <tr><td className="text-muted small">Subtotal</td><td className="text-end">{formatINR(preview.subtotal)}</td></tr>
                          <tr><td className="text-muted small">Discount ({preview.discountPct}%)</td><td className="text-end text-danger">- {formatINR(preview.discountAmount)}</td></tr>
                          <tr><td className="text-muted small">GST</td><td className="text-end">{formatINR(preview.gstAmount)}</td></tr>
                          <tr className="border-top"><td className="fw-700">TOTAL</td><td className="text-end fw-700 text-primary fs-5">{formatINR(preview.totalAmount)}</td></tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="text-center text-muted small border-top pt-3">Thank you for visiting Elegance Salon! 💆‍♀️</div>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-outline-secondary" onClick={()=>window.print()}><i className="bi bi-printer me-2"/>Print</button>
                <button className="btn btn-outline-primary"><i className="bi bi-file-pdf me-2"/>Download PDF</button>
                <button className="btn btn-success" onClick={()=>setPreview(null)}><i className="bi bi-check-lg me-2"/>Done</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
