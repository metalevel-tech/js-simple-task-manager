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

async function getTaskListFromDataBase(tasks) {
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

export { 
    getTaskListFromDataBase as getTaskList,
    Task as TaskObject
};