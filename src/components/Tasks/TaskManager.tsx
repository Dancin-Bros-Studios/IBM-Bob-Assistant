import React, { useState } from 'react';
import { useBobStore } from '@store/useBobStore';
import { soundService } from '@services/sound/soundService';
import { CheckSquare, Square, Trash2, Plus } from 'lucide-react';
import { format } from 'date-fns';

export const TaskManager: React.FC = () => {
  const { tasks, addTask, toggleTask, deleteTask } = useBobStore();
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'low' | 'medium' | 'high'>('medium');

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return;

    addTask({
      title: newTaskTitle,
      completed: false,
      priority: newTaskPriority,
    });

    soundService.playSuccess();
    setNewTaskTitle('');
    setNewTaskPriority('medium');
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    // Sort by completion status first, then by priority
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  const getPriorityColor = (priority: 'low' | 'medium' | 'high') => {
    const colors = {
      high: '#ff6b6b',
      medium: '#ffa500',
      low: '#4ecdc4',
    };
    return colors[priority];
  };

  return (
    <div className="flex flex-col gap-2" style={{ height: '100%' }}>
      {/* Add Task Form */}
      <div className="panel-raised p-2">
        <div className="flex gap-1 mb-1">
          <input
            className="input"
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
            placeholder="New task..."
            style={{ flex: 1 }}
          />
          <button
            className="button"
            onClick={handleAddTask}
            disabled={!newTaskTitle.trim()}
            style={{ width: '60px' }}
          >
            <Plus size={14} />
          </button>
        </div>
        <div className="flex gap-1">
          <label style={{ fontSize: '11px' }}>Priority:</label>
          <select
            className="input"
            value={newTaskPriority}
            onChange={(e) => setNewTaskPriority(e.target.value as 'low' | 'medium' | 'high')}
            style={{ fontSize: '11px' }}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>

      {/* Task List */}
      <div 
        className="panel"
        style={{ 
          flex: 1, 
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
        }}
      >
        {sortedTasks.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            color: '#666', 
            padding: '20px',
            fontSize: '11px',
          }}>
            No tasks yet. Add one above! 📝
          </div>
        ) : (
          sortedTasks.map((task) => (
            <div
              key={task.id}
              style={{
                padding: '8px',
                background: task.completed ? '#e0e0e0' : '#fff',
                border: '1px solid #808080',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                opacity: task.completed ? 0.6 : 1,
              }}
            >
              {/* Checkbox */}
              <button
                className="button-small"
                onClick={() => {
                  toggleTask(task.id);
                  soundService.playTaskComplete();
                }}
                style={{ 
                  padding: 0,
                  minWidth: '16px',
                  width: '16px',
                  height: '16px',
                }}
              >
                {task.completed ? <CheckSquare size={12} /> : <Square size={12} />}
              </button>

              {/* Priority Indicator */}
              <div
                style={{
                  width: '4px',
                  height: '20px',
                  background: getPriorityColor(task.priority),
                  borderRadius: '2px',
                }}
              />

              {/* Task Content */}
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: '11px',
                    textDecoration: task.completed ? 'line-through' : 'none',
                    wordWrap: 'break-word',
                  }}
                >
                  {task.title}
                </div>
                {task.description && (
                  <div
                    style={{
                      fontSize: '9px',
                      color: '#666',
                      marginTop: '2px',
                    }}
                  >
                    {task.description}
                  </div>
                )}
                <div
                  style={{
                    fontSize: '9px',
                    color: '#999',
                    marginTop: '2px',
                  }}
                >
                  {format(new Date(task.createdAt), 'MMM d, yyyy')}
                </div>
              </div>

              {/* Delete Button */}
              <button
                className="button-small"
                onClick={() => {
                  deleteTask(task.id);
                  soundService.playClick();
                }}
                style={{ 
                  padding: 0,
                  minWidth: '16px',
                  width: '16px',
                  height: '16px',
                }}
              >
                <Trash2 size={10} />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Stats */}
      <div className="status-bar">
        <div className="status-bar-field">
          Total: {tasks.length}
        </div>
        <div className="status-bar-field">
          Completed: {tasks.filter(t => t.completed).length}
        </div>
        <div className="status-bar-field">
          Pending: {tasks.filter(t => !t.completed).length}
        </div>
      </div>
    </div>
  );
};

// Made with Bob
