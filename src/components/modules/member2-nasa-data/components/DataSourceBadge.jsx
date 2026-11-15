import React from 'react';
import { Database, ShieldCheck, AlertCircle, Calendar, ExternalLink } from 'lucide-react';

/**
 * DataSourceBadge - Reusable Provenance Badge
 * Displays the authentic NASA mission, instrument, and observation date/Sol.
 * Clearly differentiates between Verified NASA Archive Data and Demonstration/Sample Data.
 */
export default function DataSourceBadge({
  source = 'NASA Planetary Data System',
  instrument = 'Science Payload Instrument',
  date = 'Current Mars Year',
  isSample = false,
  pdsId = null,
  onClick = null
}) {
  return (
    <div 
      className={`data-provenance-tag ${isSample ? 'sample' : 'verified'}`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      title={pdsId ? `PDS Identifier: ${pdsId}` : 'Verified NASA Planetary Data System Record'}
    >
      {isSample ? (
        <AlertCircle size={12} className="text-amber-400" />
      ) : (
        <ShieldCheck size={12} className="text-emerald-400" />
      )}
      <span>{isSample ? '[DEMO / SAMPLE DATA]' : '[VERIFIED NASA ARCHIVE]'}</span>
      <span style={{ opacity: 0.5 }}>|</span>
      <span>{source}</span>
      {instrument && (
        <>
          <span style={{ opacity: 0.5 }}>•</span>
          <span style={{ color: '#f1f5f9' }}>{instrument}</span>
        </>
      )}
      {date && (
        <>
          <span style={{ opacity: 0.5 }}>•</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
            <Calendar size={10} /> {date}
          </span>
        </>
      )}
      {onClick && <ExternalLink size={10} style={{ marginLeft: '4px' }} />}
    </div>
  );
}
