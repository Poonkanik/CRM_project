import React from 'react';
import AppLayout from '../components/AppLayout';

const PlaceholderPage = ({ title, icon }) => (
  <AppLayout>
    <div className="card">
      <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--text-muted)' }}>
        <i className={`fas ${icon}`} style={{ fontSize: 48, marginBottom: 16, display: 'block', opacity: 0.3 }} />
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8, color: 'var(--text-primary)' }}>{title}</h2>
        <p style={{ fontSize: 14 }}>This page is under construction.</p>
      </div>
    </div>
  </AppLayout>
);

export const Inspectors = () => <PlaceholderPage title="Inspectors" icon="fa-search" />;
export const Properties = () => <PlaceholderPage title="Properties" icon="fa-building" />;
export const Inspections = () => <PlaceholderPage title="Inspections" icon="fa-clipboard-check" />;
export const Reports = () => <PlaceholderPage title="Reports" icon="fa-chart-bar" />;
export const AuditLogs = () => <PlaceholderPage title="Audit Logs" icon="fa-history" />;
export const Settings = () => <PlaceholderPage title="Settings" icon="fa-cog" />;
