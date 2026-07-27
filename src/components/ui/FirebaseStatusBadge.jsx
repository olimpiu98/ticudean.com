import React, { useState } from 'react';
import { useFirebaseStatus } from '../../hooks/useFirebaseStatus';

export default function FirebaseStatusBadge({ className = '' }) {
  const { status, isOnline, isRestricted, errorDetails } = useFirebaseStatus();
  const [showTooltip, setShowTooltip] = useState(false);

  const getStatusConfig = () => {
    if (isOnline) {
      return {
        label: 'Firebase Cloud',
        badge: 'LIVE CLOUD',
        pingBg: 'bg-emerald-400',
        dotBg: 'bg-emerald-500',
        badgeStyle: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        dbText: 'Firestore Cloud',
        syncText: 'Active'
      };
    }
    if (isRestricted) {
      return {
        label: 'Rules Restricted',
        badge: 'READ BLOCKED',
        pingBg: 'bg-amber-400',
        dotBg: 'bg-amber-500',
        badgeStyle: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
        dbText: 'Access Denied',
        syncText: 'Blocked'
      };
    }
    return {
      label: 'Demo Mode',
      badge: 'OFFLINE MOCK',
      pingBg: 'bg-amber-400',
      dotBg: 'bg-amber-500',
      badgeStyle: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      dbText: 'Local JSON',
      syncText: 'N/A'
    };
  };

  const config = getStatusConfig();

  return (
    <div className={`relative inline-block ${className}`}>
      <button
        onClick={() => setShowTooltip(!showTooltip)}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="flex items-center gap-2 px-3 py-1 bg-surface/80 hover:bg-surface border border-border/80 rounded-full text-[10px] font-mono tracking-wide text-muted hover:text-text transition-all duration-200 shadow-sm"
        aria-label="Firebase status indicator"
      >
        <span className="relative flex h-2 w-2">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${config.pingBg}`}></span>
          <span className={`relative inline-flex rounded-full h-2 w-2 ${config.dotBg}`}></span>
        </span>
        <span className="font-medium">
          {config.label}
        </span>
      </button>

      {/* Popover / Tooltip detail */}
      {showTooltip && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-50 w-60 p-3 bg-surface/95 backdrop-blur-xl border border-border rounded-xl shadow-xl text-xs text-text animate-fadeIn">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-border/60">
            <span className="font-bold font-mono uppercase text-[10px] text-muted">Backend Service</span>
            <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${config.badgeStyle}`}>
              {config.badge}
            </span>
          </div>

          <div className="space-y-1.5 text-[11px] text-muted">
            <div className="flex items-center justify-between">
              <span>Database:</span>
              <span className="font-mono text-text font-semibold">{config.dbText}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Auth System:</span>
              <span className="font-mono text-text font-semibold">{isOnline ? 'Google OAuth' : 'Disabled'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Realtime Sync:</span>
              <span className="font-mono text-text font-semibold">{config.syncText}</span>
            </div>
            {isRestricted && (
              <div className="pt-1 mt-1 border-t border-border/50 text-[10px] text-amber-400 font-mono">
                ⚠ {errorDetails || 'Firestore Security Rules are blocking read operations.'}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
