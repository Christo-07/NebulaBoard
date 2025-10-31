import { useAuth } from '../context/AuthProvider';
import { useEffect, useState } from 'react';
import { get } from '../api/client';
import '../styles/AdminHome.css';

export default function AdminHome(){
  const { user } = useAuth() || {};
  const role = user?.roles?.[0]?.replace('ROLE_', '') || 'User';

  const [stats, setStats] = useState({
    projects: 0,
    openTasks: 0,
    users: 0
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch projects
        const projectsPayload = await get('/api/projects');
        const projects = Array.isArray(projectsPayload)
          ? projectsPayload
          : Array.isArray(projectsPayload?.content) ? projectsPayload.content
          : Array.isArray(projectsPayload?.data) ? projectsPayload.data
          : Array.isArray(projectsPayload?.items) ? projectsPayload.items
          : [];
        const projectsCount = projects.length;

        // Fetch users
        const usersPayload = await get('/api/users');
        const usersList = Array.isArray(usersPayload)
          ? usersPayload
          : Array.isArray(usersPayload?.content) ? usersPayload.content
          : Array.isArray(usersPayload?.data) ? usersPayload.data
          : Array.isArray(usersPayload?.items) ? usersPayload.items
          : [];
        const usersCount = usersList.length;

        // Calculate open tasks (this is approximate - sum of tasks in projects)
        let totalOpenTasks = 0;
        for (const project of projects) {
          try {
            const tasksPayload = await get(`/api/projects/${project.id}/tasks`);
            const tasks = Array.isArray(tasksPayload)
              ? tasksPayload
              : Array.isArray(tasksPayload?.content) ? tasksPayload.content
              : Array.isArray(tasksPayload?.data) ? tasksPayload.data
              : Array.isArray(tasksPayload?.items) ? tasksPayload.items
              : [];
            // Count tasks that are not DONE
            const openTasksInProject = tasks.filter(task =>
              task.status !== 'DONE' && task.status !== 'done'
            ).length;
            totalOpenTasks += openTasksInProject;
          } catch (e) {
            console.warn(`Failed to fetch tasks for project ${project.id}:`, e);
          }
        }

        setStats({
          projects: projectsCount,
          openTasks: totalOpenTasks,
          users: usersCount
        });
        setUsers(usersList);
      } catch (e) {
        console.error('Failed to fetch admin stats:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="stack gap">
      <header className="page-head">
        <h1 className="page-title">Dashboard</h1>
        <p className="muted">Signed in as {user?.username || 'Unknown'} ({role})</p>
      </header>

      <section className="cards-grid">
        <article className="stat-card">
          <div className="stat-k">Projects</div>
          <div className="stat-v">{loading ? '...' : stats.projects}</div>
        </article>
        <article className="stat-card">
          <div className="stat-k">Open Tasks</div>
          <div className="stat-v">{loading ? '...' : stats.openTasks}</div>
        </article>
        <article className="stat-card">
          <div className="stat-k">Users</div>
          <div className="stat-v">{loading ? '...' : stats.users}</div>
        </article>
      </section>

      <section className="panel">
        <div className="panel-head">
          <h2>Users</h2>
        </div>
        <div className="panel-body">
          {loading ? (
            <div className="badge">Loading...</div>
          ) : users.length === 0 ? (
            <div className="badge">No users</div>
          ) : (
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Username</th>
                    <th>Role</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u, index) => (
                    <tr key={u.id || u.username || index}>
                      <td>{u.id}</td>
                      <td>{u.username ?? u.name}</td>
                      <td>{Array.isArray(u.roles) ? u.roles.join(', ') : (u.role ?? '—')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
