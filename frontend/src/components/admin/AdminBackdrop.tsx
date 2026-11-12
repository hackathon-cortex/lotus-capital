import React from 'react';
import { LotusLogo } from '../common/LotusLogo';

export const AdminBackdrop: React.FC = () => {
  return (
    <div className="admin-backdrop" aria-hidden="true">
      {/* Glow 1: Top-left navy light */}
      <div className="admin-backdrop__glow-1" />

      {/* Glow 2: Bottom-right rich navy accent */}
      <div className="admin-backdrop__glow-2" />

      {/* Large Centered Lotus Watermark (60-70vh tall, unclipped, slow 40s drift) */}
      <div className="admin-backdrop__watermark-wrap">
        <div className="admin-backdrop__watermark-svg">
          <LotusLogo variant="light" height="100%" width="auto" />
        </div>
      </div>
    </div>
  );
};

