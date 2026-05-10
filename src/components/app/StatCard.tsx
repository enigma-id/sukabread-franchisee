import React from 'react';

export interface StatCardProps {
  /** Uppercase label text (e.g. "KARTU KREDIT") */
  label: string;
  /** Large value text (e.g. "Rp0") */
  value: string;
  /** Icon element to display */
  icon: React.ReactNode;
  /** Additional CSS class */
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, icon, className = '' }) => {
  return (
    <div className={`card-stat ${className}`}>
      <div className="stat-content">
        <span className="stat-label">{label}</span>
        <span className="stat-value">{value}</span>
      </div>
      <div className="stat-icon-wrapper">
        <div className="stat-icon">{icon}</div>
      </div>
      <div className="stat-bg-deco" aria-hidden="true" />
    </div>
  );
};
