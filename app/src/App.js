/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import './App.css';
import { NavComponent } from './Components/Navigation';
import { TaskComponent } from './Components/Task';
import { Task } from './Helpers/TaskClass';
import {
    getTasksListDB, removeTaskDB, saveTaskDB, newTaskId
} from './Helpers/FetchFunctions';

// The main class of the application.
function App(props) {
    const [tasks, setTasks] = useState([]);
    const [stat, setStat] = useState({
        total: 0,
        completed: 0,
        new: 0,
        unsaved: 0,
        unlocked: false
    });

    const setStatistics = (data = tasks) => {
        setStat({
            total: data.length,
            completed: data.filter(task => task.data.completed).length,
            new: data.filter(task => task.controls.isNewTask).length,
            unsaved: data.filter(task => task.controls.toSave).length,
            unlocked: data.filter(task => !task.controls.isLocked).length > 0
        });
    }

    const handleTaskSave = async (data, controls) => {
        if (controls.toSave) {
            const taskIndex = tasks.findIndex(task => task.data.id === data.id);

            // Invalidate the marker for the task to be saved.
            controls.toRemove = false;
            const updatedTask = await saveTaskDB({ data, controls });
            tasks[taskIndex] = updatedTask;

            setTasks(tasks);
            setStatistics(tasks);
        }
    }

    const handleTaskRemove = async (data, controls) => {
        const taskIndex = tasks.findIndex(task => task.data.id === data.id);

        // array.splice() returns an array of the removed items
        const removedTask = tasks.splice(taskIndex, 1)[0];

        // Deal with the situation when the removed object is not saved to the DataBase.
        if (controls.isNewTask) {
            setTasks(tasks);
            setStatistics(tasks);
        } else {
            await removeTaskDB(removedTask).then(() => {
                setTasks(tasks);
                setStatistics(tasks);
            });
        }
    }

    const handleTaskChange = (data, controls) => {
        const taskIndex = tasks.findIndex(task => task.data.id === data.id);
        tasks[taskIndex] = { data, controls };

        setTasks(tasks);
        setStatistics(tasks);
    }

    const handleAddNewTask = (data) => {
        // When the 'data' is not provided it is a new task creation,
        // otherwise it is a clone of an existing task.
        // We must create a deep copy of the data, to avoid changing the original,
        // otherwise the next if statement will fail.
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

        setTasks(tasks);
        setStatistics(tasks);
    };

    const handleSaveAllTasks = (event) => {
        tasks.forEach(task => {
            handleTaskSave(task.data, task.controls);
        });
        setStatistics(tasks);
    }

    const handleLockUnlockAllTasks = (event) => {
        if (stat.unlocked) {
            tasks.forEach(task => { task.controls.isLocked = true; });
        } else {
            tasks.forEach(task => { task.controls.isLocked = false; });
        }

        setTasks(tasks);
        setStatistics(tasks);
    }

    const handleLoadTaskListDB = async (event) => {
        const data = await getTasksListDB([]);
        setTasks(data);
        setStatistics(data);
    }

    useEffect(() => {
        handleLoadTaskListDB();
    }, []);

    function renderTask(task) {
        return (
            <TaskComponent
                key={`task-${task.data.id}`}
                data={task.data}
                controls={task.controls}
                onTaskChange={handleTaskChange}
                onTaskClone={handleAddNewTask}
                onTaskRemove={handleTaskRemove}
                onTaskSave={handleTaskSave}
            />
        );
    }

    return (
        <div className="App">
            <NavComponent
                key="nav"
                onAddNewTask={handleAddNewTask}
                onReloadTaskList={handleLoadTaskListDB}
                onSaveAllTasks={handleSaveAllTasks}
                onLockUnlockAll={handleLockUnlockAllTasks}
                statistics={stat}
            />

            <div id="tasks">
                {tasks.map(task => renderTask(task))}
            </div>
        </div>
    );
}

export default App;
