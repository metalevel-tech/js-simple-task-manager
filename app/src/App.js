import React from 'react';
import './App.css';
import { NavComponent } from './Components/Navigation';
import { TaskComponent } from './Components/Task';
import { getTasksListDB } from './Components/FetchHelpers';
import { Task } from './Components/TaskClass';

// The main class of the application.
class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            tasks: []
        };
    }

    handleTaskDataChange = (data) => {
        const tasks = [...this.state.tasks];
        const taskIndex = tasks.findIndex(task => task.data.id === data.id);

        tasks[taskIndex].data = data;

        console.log(data.id, taskIndex);
        this.setState({ tasks });
    }

    handleTaskStateChange = (data, controls) => {
        const tasks = [...this.state.tasks];
        const taskIndex = tasks.findIndex(task => task.data.id === data.id);

        tasks[taskIndex].controls = controls;

        console.log(data.id, taskIndex);
        this.setState({ tasks });
    }

    handleAddNewTask = (data) => {
        // When the 'data' is not provided it is a new task creation.
        // Otherwise it is a clone of an existing task.
        const newTaskData = {...data} || {
            id: 0,
            title: '',
            progress: 0,
            note: '',
            completed: false
        };
        newTaskData.id = this.generateNewTaskId();

        const newTask = new Task(newTaskData);

        const tasks = [...this.state.tasks];

        // If it is a new task, add it to the beginning.
        // Otherwise, find the task to be cloned and insert after.
        if (data && data.id) {
            const taskIndex = tasks.findIndex(task => task.data.id === data.id);
            newTask.data.title += ' (copy)';
            tasks.splice(taskIndex + 1, 0, newTask);
        } else {
            tasks.unshift(newTask);
        }

        this.setState({ tasks });
    };

    generateNewTaskId() {
        const lastId = this.state.tasks.reduce(
            (acc, task) => (task.data.id > acc) ? acc = task.data.id : acc, 0
        );

        return lastId + 1;
    }

    renderTask({ data, controls }) {
        return (
            <TaskComponent
                key={`task-${data.id}`}
                task={data}
                controls={controls}
                onDataChange={this.handleTaskDataChange}
                onStateChange={this.handleTaskStateChange}
                onCloneTask={this.handleAddNewTask}
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
