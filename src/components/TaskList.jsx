import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase/supabaseClient';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [loading, setLoading] = useState(true);

  // Verificar que el usuario esté autenticado
  useEffect(() => {
    const session = supabase.auth.getSession();
    // Usamos una función asíncrona para obtener la sesión actual
    session.then(({ data: { session } }) => {
      if (!session) {
        // Si no hay sesión activa, redirigir a la página de login
        navigate('/login');
      } else {
        // Si hay sesión, cargar las tareas
        fetchTasks();
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Función para obtener las tareas de Supabase
  const fetchTasks = async () => {
    setLoading(true);
    // Suponiendo que deseas filtrar las tareas por el usuario actual
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const userId = session?.user?.id;

    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error al obtener las tareas:', error.message);
    } else {
      setTasks(data);
    }
    setLoading(false);
  };

  // Función para crear una nueva tarea
  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    // Obtener el id del usuario actual para asociarlo a la tarea
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const userId = session?.user?.id;

    const { data, error } = await supabase
      .from('tasks')
      .insert([
        { title: newTask.trim(), user_id: userId }
      ])
      .select();

    if (error) {
      console.error('Error al crear la tarea:', error.message);
    } else {
      setNewTask('');
      // Actualizamos la lista de tareas
      fetchTasks();
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Mis Tareas</h1>

      <form onSubmit={handleCreateTask} style={styles.form}>
        <input
          type="text"
          placeholder="Escribe una nueva tarea"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Crear Tarea</button>
      </form>

      {loading ? (
        <p>Cargando tareas...</p>
      ) : tasks.length === 0 ? (
        <p>No tienes tareas, ¡comienza a crear!</p>
      ) : (
        <ul style={styles.list}>
          {tasks.map((task) => (
            <li key={task.id} style={styles.listItem}>
              {task.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// Algunos estilos básicos en línea para el ejemplo
const styles = {
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px'
  },
  title: {
    textAlign: 'center',
    color: '#D4A373'
  },
  form: {
    display: 'flex',
    marginBottom: '20px'
  },
  input: {
    flex: 1,
    padding: '10px',
    fontSize: '16px',
    border: '1px solid #CCD5AE',
    borderRadius: '4px 0 0 4px'
  },
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#D4A373',
    color: 'white',
    border: 'none',
    borderRadius: '0 4px 4px 0',
    cursor: 'pointer'
  },
  list: {
    listStyle: 'none',
    paddingLeft: 0
  },
  listItem: {
    padding: '10px',
    borderBottom: '1px solid #E9EDC9'
  }
};

export default Dashboard;
