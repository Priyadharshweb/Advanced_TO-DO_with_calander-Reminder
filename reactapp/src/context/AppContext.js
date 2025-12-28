import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';

const AppContext = createContext();

const initialState = {
  user: null,
  tasks: [],
  categories: [],
  loading: false,
  error: null,
  isAuthenticated: false,
  token: null
};

const appReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_USER':
      return { ...state, user: action.payload, isAuthenticated: !!action.payload };
    case 'SET_TASKS':
      return { ...state, tasks: action.payload };
    case 'ADD_TASK':
      return { ...state, tasks: [...state.tasks, action.payload] };
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id ? action.payload : task
        )
      };
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload)
      };
    case 'SET_CATEGORIES':
      return { ...state, categories: action.payload };
    case 'ADD_CATEGORY':
      return { ...state, categories: [...state.categories, action.payload] };
    case 'DELETE_CATEGORY':
      return {
        ...state,
        categories: state.categories.filter(cat => cat.id !== action.payload)
      };
    case 'SET_TOKEN':
      return { ...state, token: action.payload };
    case 'LOGOUT':
      return { ...initialState };
    default:
      return state;
  }
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    const token = localStorage.getItem('jwt');
    const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
    
    if (token && user) {
      dispatch({ type: 'SET_TOKEN', payload: token });
      dispatch({ type: 'SET_USER', payload: user });
    }
  }, []);

  const login = async (credentials) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await axios.post('http://localhost:8080/api/auth/login', credentials);
      const { token, user } = response.data;
      
      localStorage.setItem('jwt', token);
      localStorage.setItem('currentUser', JSON.stringify(user));
      
      dispatch({ type: 'SET_TOKEN', payload: token });
      dispatch({ type: 'SET_USER', payload: user });
      dispatch({ type: 'SET_LOADING', payload: false });
      
      return response.data;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message || 'Login failed' });
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('jwt');
    localStorage.removeItem('currentUser');
    dispatch({ type: 'LOGOUT' });
  };

  const fetchTasks = async () => {
    if (!state.token) return;
    
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await axios.get('http://localhost:8080/api/tasks', {
        headers: { Authorization: `Bearer ${state.token}` }
      });
      const userTasks = response.data.filter(task => task.user.id === state.user.id);
      dispatch({ type: 'SET_TASKS', payload: userTasks });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch tasks' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const addTask = async (taskData) => {
    try {
      const response = await axios.post('http://localhost:8080/api/tasks', taskData, {
        headers: { Authorization: `Bearer ${state.token}` }
      });
      dispatch({ type: 'ADD_TASK', payload: response.data });
      return response.data;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to add task' });
      throw error;
    }
  };

  const updateTask = async (taskId, taskData) => {
    try {
      const response = await axios.put(`http://localhost:8080/api/tasks/${taskId}`, taskData, {
        headers: { Authorization: `Bearer ${state.token}` }
      });
      dispatch({ type: 'UPDATE_TASK', payload: response.data });
      return response.data;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update task' });
      throw error;
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`http://localhost:8080/api/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${state.token}` }
      });
      dispatch({ type: 'DELETE_TASK', payload: taskId });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to delete task' });
      throw error;
    }
  };

  const fetchCategories = async () => {
    if (!state.token) return;
    
    try {
      const response = await axios.get('http://localhost:8080/api/categories', {
        headers: { Authorization: `Bearer ${state.token}` }
      });
      const userCategories = response.data.filter(cat => cat.user.id === state.user.id);
      dispatch({ type: 'SET_CATEGORIES', payload: userCategories });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch categories' });
    }
  };

  const addCategory = async (categoryData) => {
    try {
      const response = await axios.post('http://localhost:8080/api/categories', categoryData, {
        headers: { Authorization: `Bearer ${state.token}` }
      });
      dispatch({ type: 'ADD_CATEGORY', payload: response.data });
      return response.data;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to add category' });
      throw error;
    }
  };

  const deleteCategory = async (categoryId) => {
    try {
      await axios.delete(`http://localhost:8080/api/categories/${categoryId}`, {
        headers: { Authorization: `Bearer ${state.token}` }
      });
      dispatch({ type: 'DELETE_CATEGORY', payload: categoryId });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to delete category' });
      throw error;
    }
  };

  const value = {
    ...state,
    login,
    logout,
    fetchTasks,
    addTask,
    updateTask,
    deleteTask,
    fetchCategories,
    addCategory,
    deleteCategory,
    clearError: () => dispatch({ type: 'SET_ERROR', payload: null })
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};