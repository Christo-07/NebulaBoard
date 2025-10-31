import Header from '../layout/Header';
import { useCallback, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import dayjs from 'dayjs';

import Unauthorized from '../components/Unauthorized';
import { useAuth, isAdmin } from '../context/AuthProvider';
import { api } from '../api';
import '../styles/Board.css';


// Works for both Axios ({data}) and fetch-wrapper (raw json)
const unwrap = (r) => (r && typeof r === 'object' && 'data' in r ? r.data : r);

// very small toast util (uses the .toast-host container in index.html or a component)
const pushToast = (msg, type = 'err') => {
  let host = document.querySelector('.toast-host');
  if (!host) {
    host = document.createElement('div');
    host.className = 'toast-host';
    document.body.appendChild(host);
  }
  const el = document.createElement('div');
  el.className = `toast ${type === 'ok' ? 'ok' : 'err'}`;
  el.textContent = msg;
  host.appendChild(el);
  setTimeout(() => { el.remove(); }, 2500);
};

export default function Board() {
  const { id } = useParams();
  const { user } = useAuth();

  const [alerts, setAlerts] = useState({ overdueCount: 0, dueSoonCount: 0 });
  const [cols, setCols] = useState({ todo: [], inProgress: [], done: [] });
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'MEDIUM',
    assigneeName: '',
    dueDate: '',
  });
  const [editing, setEditing] = useState(null);

  const prioRank = { HIGH: 0, MEDIUM: 1, LOW: 2 };
  const sortList = (list) =>
    [...list].sort((a, b) => {
      const ad = a.dueDate ? new Date(a.dueDate).getTime() : Number.POSITIVE_INFINITY;
      const bd = b.dueDate ? new Date(b.dueDate).getTime() : Number.POSITIVE_INFINITY;
      if (ad !== bd) return ad - bd;
      const ap = prioRank[a.priority] ?? 99;
      const bp = prioRank[b.priority] ?? 99;
      if (ap !== bp) return ap - bp;
      return (a.id || 0) - (b.id || 0);
    });

  const loadTasks = () => {
    if (!id) return Promise.resolve();
    return api
      .get(`/api/projects/${id}/tasks`)
      .then((r) => {
        const tasks = unwrap(r) || {};
        let todo = sortList(tasks.todo || []);
        let inProgress = sortList(tasks.inProgress || []);
        let done = sortList(tasks.done || []);

        // Fallback demo if the project has no tasks
        if (todo.length === 0 && inProgress.length === 0 && done.length === 0) {
          todo = sortList([
            {
              id: 1,
              title: 'Welcome to NebulaBoard',
              description: 'This is a demo task',
              priority: 'HIGH',
              assigneeName: 'Demo User',
              dueDate: '2023-12-31',
              status: 'TODO',
            },
            {
              id: 2,
              title: 'Create your first project',
              description: 'Start by creating a new project',
              priority: 'MEDIUM',
              assigneeName: 'You',
              dueDate: '2023-12-25',
              status: 'TODO',
            },
          ]);
          inProgress = sortList([
            {
              id: 3,
              title: 'Explore the board',
              description: 'Get familiar with the board layout',
              priority: 'LOW',
              assigneeName: 'Demo User',
              dueDate: '2023-12-20',
              status: 'IN_PROGRESS',
            },
          ]);
          done = sortList([
            {
              id: 4,
              title: 'Login to the app',
              description: 'Successfully logged in',
              priority: 'HIGH',
              assigneeName: 'You',
              dueDate: '2023-12-01',
              status: 'DONE',
            },
          ]);
        }

        setCols({ todo, inProgress, done });
      })
      .catch((e) => {
        console.error('Error loading tasks:', e);
        pushToast(`Error loading tasks: ${e.message || e}`);
      });
  };

  const loadAlerts = () => {
    if (!id) return Promise.resolve();
    return api
      .get(`/api/projects/${id}/alerts/summary`)
      .then((r) => {
        const data = unwrap(r) || {};
        setAlerts({
          overdueCount: Number(data.overdueCount || 0),
          dueSoonCount: Number(data.dueSoonCount || 0),
        });
      })
      .catch((e) => {
        console.error('Error loading alerts:', e);
        pushToast(`Error loading alerts: ${e.message || e}`);
      });
  };

  const refresh = useCallback(() =>
    Promise.all([loadTasks(), loadAlerts()]).catch((e) => pushToast(e.message || 'Failed to load')), [id]);

  useEffect(() => {
    if (id) refresh();
  }, [id]);



  const createTask = (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;
    api
      .post(`/api/projects/${id}/tasks`, newTask)
      .then(() => {
        setNewTask({
          title: '',
          description: '',
          priority: 'MEDIUM',
          assigneeName: '',
          dueDate: '',
        });
        refresh();
      })
      .catch((e) => pushToast(e.message || 'Create failed'));
  };

  const move = (taskId, status) =>
    api
      .patch(`/api/tasks/${taskId}/move`, { status, position: 1000 })
      .then(() => refresh())
      .catch((e) => pushToast(`Move failed: ${e.message}`));

  const del = (taskId) => {
    if (!confirm('Delete this task?')) return;
    api
      .delete(`/api/tasks/${taskId}`)
      .then(() => {
        pushToast('Deleted', 'ok');
        refresh();
      })
      .catch((e) => pushToast(`Delete failed: ${e.message}`));
  };

  const openEdit = (t) =>
    setEditing({
      id: t.id,
      title: t.title || '',
      description: t.description || '',
      assigneeName: t.assigneeName || '',
      priority: t.priority || 'MEDIUM',
      dueDate: t.dueDate || '',
    });

  const saveEdit = (e) => {
    e.preventDefault();
    const { id: taskId, ...body } = editing;
    api
      .put(`/api/tasks/${taskId}`, body)
      .then(() => {
        setEditing(null);
        refresh();
      })
      .catch((e) => pushToast(`Save failed: ${e.message}`));
  };

  const dueInfo = (dueDate) => {
    if (!dueDate) return null;
    const now = dayjs();
    const due = dayjs(dueDate);
    const diff = due.diff(now, 'day');
    if (diff < 0) return { text: 'Overdue', cls: 'danger' };
    if (diff <= 3) return { text: 'Due soon', cls: 'warn' };
    return { text: 'On track', cls: 'ok' };
    // Note: dayjs is date-only here; adjust with time-of-day if needed.
  };

  if (!id) {
    return (
      <>
        
        <div className="nb-container">
          <div className="card card-body">
            No project selected. <Link to="/app">Go to Projects</Link>.
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />

      <div className="nb-container">
        <div className="section-title">Board</div>

        {/* small board meta */}
        <div style={{ display: 'flex', gap: '10px', margin: '8px 0 16px' }}>
          <span className="badge danger">Overdue: {alerts.overdueCount}</span>
          <span className="badge warn">Due soon: {alerts.dueSoonCount}</span>

          {/* Use proxy-based URL so browser downloads work */}
          <a
            href={`/api/projects/${id}/tasks/export`}
            target="_blank"
            rel="noreferrer"
            className="btn btn-ghost"
            style={{ marginLeft: 'auto' }}
          >
            Export CSV
          </a>
        </div>

        {/* task creator */}
        <form onSubmit={createTask} className="card card-body" style={{ marginBottom: 16 }}>
          <div style={{ display: 'grid', gap: 12, gridTemplateColumns: '1.2fr 1fr .8fr .8fr .6fr' }}>
            <input
              className="input"
              placeholder="Task title"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            />
            <input
              className="input"
              placeholder="Description"
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            />
            <select
              className="select"
              value={newTask.priority}
              onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
            >
              <option>LOW</option>
              <option>MEDIUM</option>
              <option>HIGH</option>
            </select>
            <input
              className="input"
              placeholder="Assignee"
              value={newTask.assigneeName}
              onChange={(e) => setNewTask({ ...newTask, assigneeName: e.target.value })}
            />
            <input
              className="input"
              type="date"
              value={newTask.dueDate}
              onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
            />
          </div>
          <div style={{ marginTop: 12 }}>
            <button className="btn btn-primary" type="submit">
              Add Task
            </button>
            <button className="btn btn-ghost" type="button" onClick={refresh} style={{ marginLeft: 8 }}>
              Refresh
            </button>
          </div>
        </form>

        {/* columns */}
        <div className="board">
          <Column title="To-Do" items={cols.todo} move={move} del={del} openEdit={openEdit} dueInfo={dueInfo} />
          <Column title="In Progress" items={cols.inProgress} move={move} del={del} openEdit={openEdit} dueInfo={dueInfo} />
          <Column title="Done" items={cols.done} move={move} del={del} openEdit={openEdit} dueInfo={dueInfo} />
        </div>
      </div>

      {/* edit modal (simple) */}
      {editing && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.45)', display: 'grid', placeItems: 'center', zIndex: 50 }}
          onClick={() => setEditing(null)}
        >
          <div className="card" style={{ width: 520 }} onClick={(e) => e.stopPropagation()}>
            <div className="card-body">
              <div className="section-title" style={{ fontSize: 20, marginTop: 0 }}>
                Edit Task
              </div>
              <form onSubmit={saveEdit} style={{ display: 'grid', gap: 12 }}>
                <input
                  className="input"
                  value={editing.title}
                  onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                  required
                />
                <input
                  className="input"
                  value={editing.description}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                />
                <div style={{ display: 'grid', gap: 12, gridTemplateColumns: '1fr .7fr .7fr' }}>
                  <input
                    className="input"
                    placeholder="Assignee"
                    value={editing.assigneeName}
                    onChange={(e) => setEditing({ ...editing, assigneeName: e.target.value })}
                  />
                  <select
                    className="select"
                    value={editing.priority}
                    onChange={(e) => setEditing({ ...editing, priority: e.target.value })}
                  >
                    <option>LOW</option>
                    <option>MEDIUM</option>
                    <option>HIGH</option>
                  </select>
                  <input
                    className="input"
                    type="date"
                    value={editing.dueDate || ''}
                    onChange={(e) => setEditing({ ...editing, dueDate: e.target.value })}
                  />
                </div>
                <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 6 }}>
                  <button type="button" className="btn btn-ghost" onClick={() => setEditing(null)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Column({ title, items, move, del, openEdit, dueInfo }) {
  return (
    <div className="column">
      <div className="column__head">
        <div className="column__title">{title}</div>
        <div className="pill">{items.length}</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {items.length === 0 && <div className="badge">No tasks</div>}
        {items.map((t) => (
          <TaskCard key={t.id} t={t} move={move} del={del} openEdit={openEdit} dueInfo={dueInfo} />
        ))}
      </div>
    </div>
  );
}

function TaskCard({ t, move, del, openEdit, dueInfo }) {
  const due = dueInfo(t.dueDate);
  return (
    <div className="card">
      <div className="card__title">
        <div>{t.title}</div>
        {due && t.status !== 'DONE' && <span className={`badge badge--${due.cls}`}>{due.text}</span>}
      </div>
      {t.description && <div style={{ color: 'var(--text-2)' }}>{t.description}</div>}
      <div className="card__meta">
        {t.assigneeName && <span className="badge">{t.assigneeName}</span>}
        <span className={`badge badge--${t.priority === 'HIGH' ? 'danger' : t.priority === 'MEDIUM' ? 'warn' : 'ok'}`}>
          {t.priority}
        </span>
        {t.dueDate && <span className="badge">Due: {t.dueDate}</span>}
      </div>
      <div className="card__footer">
        {t.status !== 'TODO' && (
          <button className="btn btn--ghost" onClick={() => move(t.id, 'TODO')}>
            To-Do
          </button>
        )}
        {t.status !== 'IN_PROGRESS' && (
          <button className="btn btn--ghost" onClick={() => move(t.id, 'IN_PROGRESS')}>
            In-Progress
          </button>
        )}
        {t.status !== 'DONE' && (
          <button className="btn btn--ghost" onClick={() => move(t.id, 'DONE')}>
            Done
          </button>
        )}
        <button className="btn btn--ghost" onClick={() => openEdit(t)}>
          Edit
        </button>
        <button className="btn btn--danger" onClick={() => del(t.id)}>
          Delete
        </button>
      </div>
    </div>
  );
}
