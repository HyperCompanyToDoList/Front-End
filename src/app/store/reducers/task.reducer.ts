import { createReducer, on } from '@ngrx/store';

import { Task } from '../../models/task.model';
import { addTask, addTaskFailure, deleteTask, deleteTaskFailure, loadTasksFailure, loadTasksSuccess, updateTask, updateTaskFailure } from '../actions/action';

export interface TaskState {
  tasks: Task[];
}

export const initialState: TaskState = {
  tasks: []
};

export const taskReducer2 = createReducer(
  initialState,
  on(loadTasksSuccess, (state, { tasks }) => ({ ...state, tasks })),
  on(addTask, (state, { task }) => ({ ...state, tasks: [...state.tasks, task] })),
  on(deleteTask, (state, { taskId }) => ({
    ...state,
    tasks: state.tasks.filter(task => task.id !== taskId)
  }))
);


export const taskReducer = createReducer(
  initialState,
  on(loadTasksSuccess, (state, { tasks }) => ({ ...state, tasks })),
  on(addTask, (state, { task }) => ({ ...state, tasks: [...state.tasks, task] })),
  on(deleteTask, (state, { taskId }) => ({
    ...state,
    tasks: state.tasks.filter(task => task.id !== taskId)
  })),
  on(updateTask, (state, { task }) => ({
    ...state,
    tasks: state.tasks.map(t => t.id === task.id ? task : t)
  })),
  on(loadTasksFailure, addTaskFailure, deleteTaskFailure, updateTaskFailure, (state, { error }) => ({ ...state, error }))
);