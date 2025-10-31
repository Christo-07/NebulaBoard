import React from 'react';

export default function Unauthorized() {
  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <h2 style={{margin:"0 0 6px"}}>Access Denied</h2>
        <div style={{color: 'var(--danger)', marginBottom: '10px'}}>
          You are not authorized to access the admin portal.
        </div>
      </div>
    </div>
  );
}
