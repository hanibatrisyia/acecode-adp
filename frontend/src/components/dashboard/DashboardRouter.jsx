import React from 'react';
import { AdminDashboard } from './AdminDashboard';
import { ExecutiveDashboard } from './ExecutiveDashboard';
import { ExperiencedDashboard } from './ExperiencedDashboard';
import { NormalDashboard } from './NormalDashboard';

export const DashboardRouter = ({ user }) => {
  console.log('DashboardRouter rendering for role:', user?.role);
  
  switch (user?.role) {
    case 'admin':
      return <AdminDashboard user={user} />;
    case 'executive':
      return <ExecutiveDashboard user={user} />;
    case 'experienced':
      return <ExperiencedDashboard user={user} />;
    case 'normal':
      return <NormalDashboard user={user} />;
    default:
      return <AdminDashboard user={user} />;
  }
};