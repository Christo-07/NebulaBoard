import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { get } from '../api/client';
import { useAuth } from '../context/AuthProvider';

export default function Projects(){
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [err, setErr] = useState('');

  useEffect(() => {
    let alive = true;
    (async () => {
      setErr('');
      try {
        const payload = await get('/api/projects');
        const list = Array.isArray(payload)
          ? payload
          : Array.isArray(payload?.content) ? payload.content
          : Array.isArray(payload?.data)    ? payload.data
          : Array.isArray(payload?.items)   ? payload.items
          : [];
        if (alive) setItems(list);
      } catch (e) {
        if (alive) setErr(e.message || 'Failed to load projects');
      }
    })();
    return () => { alive = false; };
  }, [user]);

  return (
    <div className="stack gap">
      <header className="page-head">
        <h1 className="page-title">Boards</h1>
      </header>

      {err && <div className="badge badge--danger">{err}</div>}

      {items.length === 0 ? (
        <div className="badge">No projects</div>
      ) : (
        <div className="cards-grid">
          {items.map(p => (
            <Link to={`/app/projects/${p.id}`} key={p.id} className="card-link">
              <article className="card">
                <div className="card__title">{p.title ?? p.name ?? `Project #${p.id}`}</div>
                {p.description && <div className="kv">{p.description}</div>}
              </article>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
