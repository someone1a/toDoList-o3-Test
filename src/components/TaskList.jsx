import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase/supabaseClient';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [isShopping, setIsShopping] = useState(false);

  // Limpia la URL de parámetros de autenticación (por ejemplo, access_token)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('access_token')) {
      // Reemplaza la URL actual sin los parámetros
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  // Función para cargar tareas
  const fetchTasks = async () => {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      console.error('Error al cargar tareas:', error);
    } else {
      setTasks(data);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Función para crear una nueva tarea
  const handleCreateTask = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase
      .from('tasks')
      .insert([{ description: newTask, is_shopping: isShopping }])
      .single();
    if (error) {
      console.error('Error al crear tarea:', error);
    } else {
      // Si la tarea es de compras, se crea automáticamente la lista de compras
      if (isShopping) {
        await supabase
          .from('shopping_lists')
          .insert([{ task_id: data.id, title: `Lista para: ${newTask}` }]);
      }
      setNewTask('');
      setIsShopping(false);
      fetchTasks();
    }
  };

  return (
    <div className="task-list-container">
      <h2>Mis Tareas</h2>
      <form onSubmit={handleCreateTask}>
        <input
          type="text"
          placeholder="Descripción de la tarea..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          required
        />
        <label>
          <input
            type="checkbox"
            checked={isShopping}
            onChange={(e) => setIsShopping(e.target.checked)}
          />
          ¿Es una tarea de compras?
        </label>
        <button type="submit">Agregar Tarea</button>
      </form>
      <ul className="task-list">
        {tasks.map((task) => (
          <li key={task.id} className="task-item">
            {task.description}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;
