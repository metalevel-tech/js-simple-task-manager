import React from 'react';
import './App.css';
import { NavComponent } from './Components/Navigation';
import { TaskComponent } from './Components/Task';
// import { getTaskList, TaskObject } from './Components/Fetch';


// Data base connection
const dataBase = {
    domain: 'stasks.metalevel.tech',
    port: '48004',
    uri: 'api/tasks',
    protocol: 'https',
    get fqdn() {
        // const url = `${this.protocol}://${this.domain}/${this.uri}:${this.port}`;
        const url = `/${this.uri}`;
        return url;
    }
}

// The array App.constructor.state.tasks is used to store the tasks,
// crated by this class. See: App.prototype.componentDidMount()
class Task {
    // The task data from the database.
    data = {
        id: 0,
        title: '',
        progress: 0,
        note: '',
        completed: false
    };
    // Stores specific data for the 'state' of the TaskComponent instances.
    controls = {
        save: false,     // the task is not saved to the data base
        toRemove: false, // mark the task for deletion
        remove: false    // remove from data base
    };

    constructor(data) {
        this.data = data;
    }
}

// The main class of the application.
class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            tasks: []
        };

        this.handleTaskDataChange = this.handleTaskDataChange.bind(this);
        this.handleTaskStateChange = this.handleTaskStateChange.bind(this);
    }

    handleTaskDataChange(data) {
        const tasks = [...this.state.tasks];
        const taskIndex = tasks.findIndex(task => task.data.id === data.id);

        tasks[taskIndex].data = data;

        console.log(data.id, taskIndex);

        this.setState({ tasks });
    }
    
    handleTaskStateChange(data, controls) {
        const tasks = [...this.state.tasks];
        const taskIndex = tasks.findIndex(task => task.data.id === data.id);

        tasks[taskIndex].controls = controls;

        console.log(data.id, taskIndex);

        this.setState({ tasks });
    }

    renderTask({data, controls}) {
        return (
            <TaskComponent
                key={`key-${data.id}`}
                task={data}
                controls={controls}
                onDataChange={this.handleTaskDataChange}
                onStateChange={this.handleTaskStateChange}
            />
        );
    }

    render() {
        return (
            <div className="App">
                <NavComponent key="nav"/>

                <div id="tasks">
                    {this.state.tasks.map(task => this.renderTask(task))}
                </div>
            </div>
        );
    }

    async componentDidMount() {
        let tasks = [...this.state.tasks];
        tasks = await this.getTaskListFromDataBase(tasks);
        this.setState({ tasks });
    }

    async getTaskListFromDataBase(tasks) {
        return await fetch(dataBase.fqdn)
            .then(response => {
                if (response.ok) return response.json();
                throw new Error(`Network response was not ok: ${response.status}`);
            })
            .then(data => {
                data.forEach(taskData => {
                    tasks.push(new Task(taskData));
                });

                return tasks;
            })
            .catch(error => { console.log(`Trouble: ${error}`); });
    }
}

export default App;
