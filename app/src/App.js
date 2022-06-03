/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, createContext } from 'react';
import './App.css';
import { NavComponent } from './Components/Navigation';
import { TaskComponent } from './Components/Task';
import { Task } from './Helpers/TaskClass';
import {
    getTasksListDB, removeTaskDB, saveTaskDB, newTaskId
} from './Helpers/FetchFunctions';

const NavContext = createContext();
const TaskContext = createContext();

// The main class of the application.
function App(props) {
    const [tasks, setTasks] = useState([]);
    const [statistic, setStatistic] = useState({
        total: 0,
        completed: 0,
        new: 0,
        unsaved: 0,
        unlocked: false
    });

    const setState = (data = tasks) => {
        setTasks(data);

        setStatistic({
            total: data.length,
            completed: data.filter(task => task.data.completed).length,
            new: data.filter(task => task.state.isNewTask).length,
            unsaved: data.filter(task => task.state.toSave).length,
            unlocked: data.filter(task => !task.state.isLocked).length > 0
        });
    }

    const handleTaskSave = async ({ data, state }) => {
        if (state.toSave) {
            const taskIndex = tasks.findIndex(task => task.data.id === data.id);
            const updatedTask = await saveTaskDB({ data, state });
            tasks[taskIndex] = updatedTask;

            setState(tasks);
        }
    }

    const handleSaveAllTasks = async (event) => {
        for (const task of tasks) await handleTaskSave(task);
    }

    const handleTaskRemove = async ({ data, state }) => {
        const taskIndex = tasks.findIndex(task => task.data.id === data.id);

        // array.splice() returns an array of the removed items, we need the first.
        const removedTask = tasks.splice(taskIndex, 1)[0];

        // Deal with the situation when the removed object is not saved to the DataBase.
        if (state.isNewTask) setState(tasks);
        else await removeTaskDB(removedTask).then(() => { setState(tasks); });
    }

    const handleTaskChange = ({ data, state }) => {
        const taskIndex = tasks.findIndex(task => task.data.id === data.id);
        tasks[taskIndex] = { data, state };

        setState(tasks);
    }

    const handleAddNewTask = (data) => {
        // When the 'data' is not provided it is a new task,
        // otherwise it is a clone of an existing task.
        // We must create a deep copy of the 'data', to avoid
        // changing the original, because it is used further.
        const newTaskData = data ? { ...data } : {
            id: 0,
            title: '',
            progress: 0,
            note: '',
            completed: false
        };
        newTaskData.id = newTaskId(tasks);

        const newTask = new Task(newTaskData);

        // If it is a new task, add it to the beginning,
        // otherwise find the task to be cloned and insert after it.
        if (data && data.id) {
            const taskIndex = tasks.findIndex(task => task.data.id === data.id);
            newTask.data.title += ' (copy)';
            tasks.splice(taskIndex + 1, 0, newTask);
        } else {
            tasks.unshift(newTask);
        }

        setState(tasks);
    };

    const handleLockUnlockAllTasks = (event) => {
        if (statistic.unlocked) tasks.forEach(task => { task.state.isLocked = true; });
        else tasks.forEach(task => { task.state.isLocked = false; });

        setState(tasks);
    }

    const handleLoadTaskListDB = async (event) => {
        const data = await getTasksListDB();
        setState(data);
    }

    useEffect(() => {
        handleLoadTaskListDB();
    }, []);

    return (
        <React.Fragment>
            <NavContext.Provider key="nav-context" value={{
                statistic,
                handleAddNewTask,
                handleSaveAllTasks,
                handleLockUnlockAllTasks,
                handleLoadTaskListDB
            }}>
                <NavComponent key="nav" />
            </NavContext.Provider>

            {tasks.map(task =>
                <TaskContext.Provider value={{
                    task,
                    handleAddNewTask,
                    handleTaskSave,
                    handleTaskChange,
                    handleTaskRemove
                }} key={`task-${task.data.id}-context`}>
                    <TaskComponent key={`task-${task.data.id}`} />
                </TaskContext.Provider>
            )}
        </React.Fragment>
    );
}

export { App as default, NavContext, TaskContext };
