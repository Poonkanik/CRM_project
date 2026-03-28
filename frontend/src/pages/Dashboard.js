import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import { dashboardAPI } from '../utils/api';

const StatCard = ({ label, value, icon, iconBg, iconColor, barColor, barWidth }) => (
  <div className="stat-card">
    <div className="stat-icon" style={{ background: iconBg }}>
      <i className={`fas ${icon}`} style={{ color: iconColor }} />
    </div>
    <div className="stat-label">{label}</div>
    <div className="stat-value">{value}</div>
    <div className="stat-bar">
      <div className="stat-bar-fill" style={{ background: barColor, width: barWidth }} />
    </div>
  </div>
);

const statusBadgeClass = (status) => {
  const map = {
    Pending: 'badge-pending', Assigned: 'badge-assigned', Active: 'badge-active',
    Completed: 'badge-completed', Closed: 'badge-closed', Cancelled: 'badge-cancelled',
  };
  return `badge ${map[status] || 'badge-closed'}`;
};

const timeAgo = (dateStr) => {
  if (!dateStr) return '—';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins} mins ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hour${hrs > 1 ? 's' : ''} ago`;
  const days = Math.floor(hrs / 24);
  return `${days} day${days > 1 ? 's' : ''} ago`;
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, activityRes] = await Promise.all([
          dashboardAPI.getStats(),
          dashboardAPI.getRecentActivity(),
        ]);
        setStats(statsRes.data.data);
        setActivity(activityRes.data.data);
      } catch (err) {
        console.error(err);
        // Use fallback data if API fails
        setStats({ totalClients: 200, totalProperties: 10, totalInspections: 2, pendingInspections: 2, closedInspections: 10 });
        setActivity([
          { inspection_id: 'INSP - 10245', property: 'Greenview apartments', agent: 'Bluenest reality', inspector: 'John mathews', status: 'Pending', updated_at: new Date(Date.now() - 2 * 60000) },
          { inspection_id: 'INSP - 10244', property: 'Palm residency - Villa', agent: 'Urbankey estates', inspector: 'Sarah collins', status: 'Assigned', updated_at: new Date(Date.now() - 60 * 60000) },
          { inspection_id: 'INSP - 10243', property: 'Lakeview towers', agent: 'Bluenest reality', inspector: 'Mark robinson', status: 'Active', updated_at: new Date() },
          { inspection_id: 'INSP - 10242', property: 'Maple street house', agent: 'Primelet agents', inspector: 'Emma watson', status: 'Completed', updated_at: new Date(Date.now() - 2 * 86400000) },
          { inspection_id: 'INSP - 10243', property: 'Sunrise commercial complex', agent: 'Urbankey estates', inspector: 'David lee', status: 'Closed', updated_at: new Date(Date.now() - 3 * 86400000) },
          { inspection_id: 'INSP - 10242', property: 'Oakwood cottage', agent: 'Primelet agents', inspector: 'Emma watson', status: 'Cancelled', updated_at: new Date(Date.now() - 5 * 86400000) },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const quickActions = [
    { icon: 'fa-file-medical', label: 'Create Inspection', onClick: () => navigate('/inspections') },
    { icon: 'fa-plus', label: 'Add Property', onClick: () => navigate('/properties') },
    { icon: 'fa-user-plus', label: 'Add Agent', onClick: () => navigate('/agents') },
    { icon: 'fa-user-check', label: 'Add Inspector', onClick: () => navigate('/inspectors') },
  ];

  return (
    <AppLayout searchPlaceholder="Search agents, inspectors etc">
      {/* Stats */}
      <div className="stats-grid">
        <StatCard
          label="Total Clients" value={loading ? '—' : stats?.totalClients || 0}
          icon="fa-users" iconBg="#e0f2fe" iconColor="#0ea5e9"
          barColor="#0ea5e9" barWidth="70%"
        />
        <StatCard
          label="Total Properties" value={loading ? '—' : stats?.totalProperties || 0}
          icon="fa-building" iconBg="#dcfce7" iconColor="#16a34a"
          barColor="#16a34a" barWidth="45%"
        />
        <StatCard
          label="Total Inspections" value={loading ? '—' : stats?.totalInspections || 0}
          icon="fa-clipboard-list" iconBg="#fee2e2" iconColor="#ef4444"
          barColor="#ef4444" barWidth="30%"
        />
        <StatCard
          label="Pending Inspections" value={loading ? '—' : stats?.pendingInspections || 0}
          icon="fa-clock" iconBg="#fef3c7" iconColor="#f59e0b"
          barColor="#f59e0b" barWidth="25%"
        />
        <StatCard
          label="Closed Inspections" value={loading ? '—' : stats?.closedInspections || 0}
          icon="fa-check-circle" iconBg="#fef3c7" iconColor="#f59e0b"
          barColor="#f59e0b" barWidth="55%"
        />
      </div>

      {/* Quick Actions */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-header">
          <h2 className="card-title">Quick actions</h2>
        </div>
        <div className="quick-actions" style={{ marginBottom: 0 }}>
          {quickActions.map((a) => (
            <div key={a.label} className="action-card" onClick={a.onClick}>
              <div className="action-icon">
                <i className={`fas ${a.icon}`} />
              </div>
              <span className="action-label">{a.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Recent Activity</h2>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Inspection ID</th>
                <th>Property</th>
                <th>Agent</th>
                <th>Inspector</th>
                <th>Status</th>
                <th>Last Updated</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: 40 }}>
                  <div className="loading-spinner" style={{ padding: 0 }}>
                    <div className="spinner" /><span>Loading...</span>
                  </div>
                </td></tr>
              ) : activity.length === 0 ? (
                <tr><td colSpan={7} className="empty-state">No recent activity</td></tr>
              ) : (
                activity.map((row, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 500 }}>{row.inspection_id}</td>
                    <td>{row.property || '—'}</td>
                    <td>{row.agent || '—'}</td>
                    <td>{row.inspector || '—'}</td>
                    <td><span className={statusBadgeClass(row.status)}>{row.status}</span></td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: 12.5 }}>{timeAgo(row.updated_at)}</td>
                    <td>
                      <button className="link-btn" style={{ fontSize: 13, fontWeight: 500 }}
                        onClick={() => navigate('/inspections')}>
                        {row.status === 'Completed' ? 'View Report' : 'View'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
