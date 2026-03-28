import React, { useState, useEffect, useCallback } from 'react';
import AppLayout from '../components/AppLayout';
import { agentsAPI } from '../utils/api';

/* ── helpers ─────────────────────────────── */
const statusClass = (s) => ({
  Active: 'badge-active', Inactive: 'badge-inactive', Suspended: 'badge-suspended',
}[s] || 'badge-closed');

const EMPTY_FORM = { name: '', company_name: '', email: '', phone: '', properties: '', inspections: '', status: 'Active' };

/* ── AgentModal ──────────────────────────── */
const AgentModal = ({ mode, initial, onClose, onSave, saving, error }) => {
  const [form, setForm] = useState(initial || EMPTY_FORM);
  const [errs, setErrs] = useState({});

  useEffect(() => { setForm(initial || EMPTY_FORM); }, [initial]);

  const handle = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setErrs(v => ({ ...v, [e.target.name]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required.';
    if (!form.email.trim()) e.email = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email.';
    return e;
  };

  const submit = (e) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) { setErrs(e2); return; }
    onSave(form);
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h3 className="modal-title">{mode === 'create' ? 'Add New Agent' : 'Edit Agent'}</h3>
          <button className="modal-close" onClick={onClose}><i className="fas fa-times" /></button>
        </div>

        {error && <div className="alert alert-error"><i className="fas fa-exclamation-circle" />{error}</div>}

        <form onSubmit={submit}>
          <div className="form-grid-2">
            <div className="form-group">
              <label>Agent Name *</label>
              <input className={`form-control ${errs.name ? 'error' : ''}`}
                name="name" placeholder="Full name" value={form.name} onChange={handle} />
              {errs.name && <div className="error-text">{errs.name}</div>}
            </div>
            <div className="form-group">
              <label>Company Name</label>
              <input className="form-control" name="company_name" placeholder="Company" value={form.company_name} onChange={handle} />
            </div>
            <div className="form-group">
              <label>Email *</label>
              <input className={`form-control ${errs.email ? 'error' : ''}`}
                type="email" name="email" placeholder="email@example.com" value={form.email} onChange={handle} />
              {errs.email && <div className="error-text">{errs.email}</div>}
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input className="form-control" name="phone" placeholder="+44 7xxx xxxxxx" value={form.phone} onChange={handle} />
            </div>
            <div className="form-group">
              <label>Properties</label>
              <input className="form-control" type="number" name="properties" placeholder="0" value={form.properties} onChange={handle} min="0" />
            </div>
            <div className="form-group">
              <label>Inspections</label>
              <input className="form-control" type="number" name="inspections" placeholder="0" value={form.inspections} onChange={handle} min="0" />
            </div>
          </div>
          <div className="form-group">
            <label>Status</label>
            <select className="form-control filter-select" style={{ width: '100%' }} name="status" value={form.status} onChange={handle}>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" style={{ width: 'auto' }} disabled={saving}>
              {saving ? <><span className="spinner" style={{ width: 15, height: 15, borderWidth: 2 }} /> Saving...</> : (mode === 'create' ? 'Add Agent' : 'Save Changes')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ── ConfirmDelete ───────────────────────── */
const ConfirmDelete = ({ agent, onClose, onConfirm, deleting }) => (
  <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
    <div className="modal" style={{ maxWidth: 400 }}>
      <div className="modal-header">
        <h3 className="modal-title">Delete Agent</h3>
        <button className="modal-close" onClick={onClose}><i className="fas fa-times" /></button>
      </div>
      <div className="confirm-icon"><i className="fas fa-trash-alt" /></div>
      <div className="confirm-text">
        <strong>Delete "{agent?.name}"?</strong>
        This action cannot be undone. All data associated with this agent will be permanently removed.
      </div>
      <div className="modal-footer">
        <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
        <button className="btn btn-danger" onClick={onConfirm} disabled={deleting}>
          {deleting ? 'Deleting...' : 'Delete Agent'}
        </button>
      </div>
    </div>
  </div>
);

/* ── Agents Page ─────────────────────────── */
const Agents = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });
  const LIMIT = 10;

  const [modal, setModal] = useState(null); // null | { mode: 'create'|'edit', agent?: obj }
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [modalError, setModalError] = useState('');
  const [toast, setToast] = useState('');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const fetchAgents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await agentsAPI.getAll({ search, status: statusFilter, page, limit: LIMIT });
      setAgents(res.data.data);
      setPagination(res.data.pagination);
    } catch (err) {
      console.error(err);
      // Fallback sample data
      const sample = [
        { id: 1, name: 'Michael', company_name: 'Bluenest reality', email: 'michael@bluenest.com', phone: '+44 7911 234567', properties: 18, inspections: 42, status: 'Active' },
        { id: 2, name: 'Olivia haris', company_name: 'Urbankey estates', email: 'olivia@urbankey.com', phone: '+44 8811 234567', properties: 3, inspections: 10, status: 'Active' },
        { id: 3, name: 'Daniel', company_name: 'Bluenest reality', email: 'daniel@primele.com', phone: '+44 7822 456789', properties: 18, inspections: 20, status: 'Inactive' },
        { id: 4, name: 'Wilson', company_name: 'City homes', email: 'wilson@cityhom.com', phone: '+44 7822 456879', properties: 10, inspections: 10, status: 'Active' },
        { id: 5, name: 'Sophie', company_name: 'City homes', email: 'sophie@cityhom.com', phone: '+44 7700 112233', properties: 12, inspections: 10, status: 'Suspended' },
        { id: 6, name: 'Turner bruno', company_name: 'Primelet agents', email: 'turner@horizon.com', phone: '+44 7555 999877', properties: 20, inspections: 20, status: 'Active' },
        { id: 7, name: 'Bucky', company_name: 'Buenrest reality', email: 'bucky@bluenest.com', phone: '+44 7911 234567', properties: 18, inspections: 42, status: 'Active' },
        { id: 8, name: 'William Butcher', company_name: 'Urbankey estates', email: 'william@urbankey.com', phone: '+44 8811 234567', properties: 3, inspections: 10, status: 'Inactive' },
        { id: 9, name: 'John', company_name: 'Buenrest reality', email: 'john@primele.com', phone: '+44 7822 456789', properties: 18, inspections: 20, status: 'Active' },
        { id: 10, name: 'Carter', company_name: 'Primelet agents', email: 'carter@cityhom.com', phone: '+44 7822 456879', properties: 10, inspections: 10, status: 'Suspended' },
      ];
      const filtered = sample.filter(a =>
        (!search || a.name.toLowerCase().includes(search.toLowerCase()) || a.company_name.toLowerCase().includes(search.toLowerCase())) &&
        (!statusFilter || a.status === statusFilter)
      );
      setAgents(filtered);
      setPagination({ total: filtered.length, totalPages: 1 });
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, page]);

  useEffect(() => { fetchAgents(); }, [fetchAgents]);

  /* debounce search */
  const [searchInput, setSearchInput] = useState('');
  useEffect(() => {
    const t = setTimeout(() => { setSearch(searchInput); setPage(1); }, 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  const openCreate = () => { setModal({ mode: 'create' }); setModalError(''); };
  const openEdit = (agent) => { setModal({ mode: 'edit', agent }); setModalError(''); };

  const handleSave = async (form) => {
    setSaving(true);
    setModalError('');
    try {
      if (modal.mode === 'create') {
        await agentsAPI.create(form);
        showToast('Agent added successfully!');
      } else {
        await agentsAPI.update(modal.agent.id, form);
        showToast('Agent updated successfully!');
      }
      setModal(null);
      fetchAgents();
    } catch (err) {
      setModalError(err.response?.data?.message || 'Something went wrong.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await agentsAPI.delete(deleteTarget.id);
      showToast('Agent deleted.');
      setDeleteTarget(null);
      fetchAgents();
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };

  const totalPages = pagination.totalPages || 1;

  return (
    <AppLayout searchPlaceholder="Search agents">
      {/* Toast */}
      {toast && (
        <div className="alert alert-success"
          style={{ position: 'fixed', top: 16, right: 16, zIndex: 9999, minWidth: 260, boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}>
          <i className="fas fa-check-circle" />{toast}
        </div>
      )}

      <div className="card">
        {/* Toolbar */}
        <div className="agents-toolbar">
          <div className="search-input-wrap">
            <i className="fas fa-search" />
            <input
              type="text"
              placeholder="Search agents"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>

          <select className="filter-select" value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}>
            <option value="">Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Suspended">Suspended</option>
          </select>

          <div style={{ marginLeft: 'auto' }}>
            <button className="btn-add" onClick={openCreate}>
              <i className="fas fa-plus" /> Add Agents
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Agent Name</th>
                <th>Company Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Properties</th>
                <th>Inspections</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8}>
                  <div className="loading-spinner"><div className="spinner" /><span>Loading agents...</span></div>
                </td></tr>
              ) : agents.length === 0 ? (
                <tr><td colSpan={8}>
                  <div className="empty-state">
                    <i className="fas fa-user-slash" />
                    No agents found
                  </div>
                </td></tr>
              ) : (
                agents.map((agent) => (
                  <tr key={agent.id}>
                    <td style={{ fontWeight: 500 }}>{agent.name}</td>
                    <td>{agent.company_name || '—'}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>
                      {agent.email.length > 18 ? agent.email.slice(0, 16) + '…' : agent.email}
                    </td>
                    <td style={{ color: 'var(--text-secondary)' }}>{agent.phone || '—'}</td>
                    <td>{agent.properties ?? 0}</td>
                    <td>{agent.inspections ?? 0}</td>
                    <td><span className={`badge ${statusClass(agent.status)}`}>{agent.status}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button className="btn-icon primary" title="View" onClick={() => openEdit(agent)}>
                          <i className="fas fa-eye" />
                        </button>
                        <button className="btn-icon primary" title="Edit" onClick={() => openEdit(agent)}>
                          <i className="fas fa-pen" />
                        </button>
                        <button className="btn-icon danger" title="Delete" onClick={() => setDeleteTarget(agent)}>
                          <i className="fas fa-trash" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="table-footer">
          <span className="table-info">
            {agents.length} of {pagination.total || agents.length} rows selected
          </span>
          <div className="pagination">
            <button className="page-btn" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>
              ‹ Previous
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(p => (
              <button key={p} className={`page-btn ${page === p ? 'active' : ''}`} onClick={() => setPage(p)}>{p}</button>
            ))}
            {totalPages > 5 && <span style={{ padding: '0 4px', color: 'var(--text-muted)' }}>… {totalPages}</span>}
            <button className="page-btn" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>
              Next ›
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      {modal && (
        <AgentModal
          mode={modal.mode}
          initial={modal.agent}
          onClose={() => setModal(null)}
          onSave={handleSave}
          saving={saving}
          error={modalError}
        />
      )}
      {deleteTarget && (
        <ConfirmDelete
          agent={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
          deleting={deleting}
        />
      )}
    </AppLayout>
  );
};

export default Agents;
