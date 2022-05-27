import React from 'react';
import './App.css';
import { NavComponent } from './Components/Navigation';
import { TaskComponent } from './Components/Task';
import { Task } from './Components/TaskClass';
import {
    getTasksListDB, removeTaskDB, saveTaskDB, newTaskId
} from './Components/Helpers';

// The main class of the application.
class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            tasks: []
        };
    }

    handleTaskChange = (data, controls) => {
        const tasks = [...this.state.tasks];
        const taskIndex = tasks.findIndex(task => task.data.id === data.id);
        tasks[taskIndex] = { data, controls };
        this.setState({ tasks });
    }

    handleTaskSave = async (data, controls) => {
        if (controls.toSave) {
            const tasks = [...this.state.tasks];
            const taskIndex = tasks.findIndex(task => task.data.id === data.id);

            const updatedTask = await saveTaskDB({ data, controls });
            tasks[taskIndex] = updatedTask;

            this.setState({ tasks });

        }
    }

    handleTaskRemove = async ({ data, controls }) => {
        const tasks = [...this.state.tasks];
        const taskIndex = tasks.findIndex(task => task.data.id === data.id);

        // array.splice() returns an array of the removed items
        const removedTask = tasks.splice(taskIndex, 1)[0];

        await removeTaskDB(removedTask).then(() => {
            this.setState({ tasks })
        });
    }

    handleAddNewTask = (data) => {
        const tasks = [...this.state.tasks];

        // When the 'data' is not provided it is a new task creation,
        // otherwise it is a clone of an existing task.
        // We must create deep copy of the data, to avoid changing the original,
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

        this.setState({ tasks });
    };

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
                />

                <div id="tasks">
                    {this.state.tasks.map(task => this.renderTask(task))}
                </div>
            </div>
        );
    }

    async componentDidMount() {
        let tasks = [...this.state.tasks];
        tasks = await getTasksListDB(tasks);
        this.setState({ tasks });
    }
}

export default App;
