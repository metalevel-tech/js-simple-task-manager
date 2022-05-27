import { Task } from './TaskClass';

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

async function getTasksListFromDataBase(tasks) {
    return fetch(dataBase.fqdn)
        .then(response => {
            if (response.ok) return response.json();
            throw new Error(`Network response was not ok: ${response.status}`);
        })
        .then(data => {
            data.forEach(taskData => {
                const task = new Task(taskData);
                
                task.controls.isNewTask = false;
                task.controls.isLocked = true;
                
                tasks.push(task);
            });

            return tasks;
        })
        .catch(error => { console.log(`Trouble: ${error}`); });
}

export {
    getTasksListFromDataBase as getTasksListDB
};