import React from 'react';
import './App.css';
import { NavComponent } from './Components/Navigation';
import { TaskComponent } from './Components/Task';
import { Task } from './Helpers/TaskClass';
import {
    getTasksListDB, removeTaskDB, saveTaskDB, newTaskId
} from './Helpers/FetchFunctions';

// The main class of the application.
class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            tasks: [],
            statistics: {
                total: 0,
                completed: 0,
                new: 0,
                unsaved: 0,
                unlocked: false
            },
        };
    }

    buildStatistics() {
        const statistics = {...this.state.statistics};
        
        statistics.total = this.state.tasks.length;
        statistics.completed = this.state.tasks.filter(task => task.data.completed).length;
        statistics.new = this.state.tasks.filter(task => task.controls.isNewTask).length;
        statistics.unsaved = this.state.tasks.filter(task => task.controls.toSave).length;
        statistics.unlocked = this.state.tasks.filter(task => !task.controls.isLocked).length > 0;

        this.setState({ statistics });
    }

    handleTaskChange = (data, controls) => {
        const tasks = [...this.state.tasks];
        const taskIndex = tasks.findIndex(task => task.data.id === data.id);
        tasks[taskIndex] = { data, controls };

        // const statistics = this.buildStatistics();

        this.setState({ tasks }, this.buildStatistics);
    }

    handleTaskSave = async (data, controls) => {
        if (controls.toSave) {
            const tasks = [...this.state.tasks];
            const taskIndex = tasks.findIndex(task => task.data.id === data.id);

            // Invalidate the marker for the task to be saved.
            controls.toRemove = false;

            const updatedTask = await saveTaskDB({ data, controls });

            tasks[taskIndex] = updatedTask;

            // const statistics = this.buildStatistics();
        
            this.setState({ tasks }, this.buildStatistics);
        }
    }

    handleTaskRemove = async (data, controls) => {
        const tasks = [...this.state.tasks];
        const taskIndex = tasks.findIndex(task => task.data.id === data.id);

        // array.splice() returns an array of the removed items
        const removedTask = tasks.splice(taskIndex, 1)[0];

        // const statistics = this.buildStatistics();
        
        // Deal with the situation when the removed object is not saved to the DataBase.
        if (controls.isNewTask) {
            this.setState({ tasks }, this.buildStatistics);
        } else {
            await removeTaskDB(removedTask).then(() => {
                this.setState({ tasks }, this.buildStatistics);
            });
        }
    }

    handleAddNewTask = (data) => {
        const tasks = [...this.state.tasks];

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

        // const statistics = this.buildStatistics();
        
        this.setState({ tasks }, this.buildStatistics);
    };

    handleLoadTaskListDB = async (event) => {
        let tasks = [];
        tasks = await getTasksListDB(tasks);
        
        // const statistics = this.buildStatistics();
        
        this.setState({ tasks }, this.buildStatistics);
    }

    handleSaveAllTasks = (event) => {
        const tasks = [...this.state.tasks];

        tasks.forEach(task => {
            this.handleTaskSave(task.data, task.controls);
        });
    }
    
    handleLockUnlockAllTasks = (event) => {
        const tasks = [...this.state.tasks];

        if (this.state.statistics.unlocked) {
            tasks.forEach(task => { task.controls.isLocked = true; });
        } else {
            tasks.forEach(task => { task.controls.isLocked = false; });
        }

        this.setState({ tasks }, this.buildStatistics);
    }

    renderTask(task) {
        return (
            <TaskComponent
                key={`task-${task.data.id}`}
                data={task.data}
                controls={task.controls}
                onTaskChange={this.handleTaskChange}
                onTaskClone={this.handleAddNewTask}
                onTaskRemove={this.handleTaskRemove}
                onTaskSave={this.handleTaskSave}
            />
        );
    }
    
    render() {
        return (
            <div className="App">
                <NavComponent
                    key="nav"
                    onAddNewTask={this.handleAddNewTask}
                    onReloadTaskList={this.handleLoadTaskListDB}
                    onSaveAllTasks={this.handleSaveAllTasks}
                    onLockUnlockAll={this.handleLockUnlockAllTasks}
                    statistics={this.state.statistics}
                />

                <div id="tasks">
                    {this.state.tasks.map(task => this.renderTask(task))}
                </div>
            </div>
        );
    }

    async componentDidMount() {
        this.handleLoadTaskListDB();
        // let tasks = [...this.state.tasks];
        // tasks = await getTasksListDB(tasks);
        // this.setState({ tasks });
    }
}

export default App;
