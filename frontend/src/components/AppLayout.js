import React from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const AppLayout = ({ children, searchPlaceholder }) => (
  <div className="app-layout">
    <Sidebar />
    <div className="main-content">
      <Topbar searchPlaceholder={searchPlaceholder} />
      <main className="page-content">{children}</main>
    </div>
  </div>
);

export default AppLayout;
