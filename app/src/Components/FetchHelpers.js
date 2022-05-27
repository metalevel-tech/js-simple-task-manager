import { Task } from "./TaskClass";

// Data base connection
const dataBase = {
    domain: "stasks.metalevel.tech",
    port: "48004",
    uri: "api/tasks",
    protocol: "https",
    get fqdn() {
        // const url = `${this.protocol}://${this.domain}/${this.uri}:${this.port}`;
        const url = `/${this.uri}`;
        return url;
    }
}

async function getTasksListFromDataBase(tasks) {
    const request = {
        url: `${dataBase.fqdn}`,
        init: { method: "GET" }
    };

    return fetch(request.url, request.init)
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
        .catch(error => { console.log(`Trouble at tasks list fetch: ${error}`); });
}

async function removeSingleTaskFromDataBase(task) {
    const request = {
        url: `${dataBase.fqdn}/${task.data.id}`,
        init: { method: "DELETE" }
    };

    return fetch(request.url, request.init)
        .then(response => {
            if (response.ok) return response.json();
            throw new Error(`${response.status} This task doesn't exist in the DataBase.`);
        })
        .catch(error => { console.log(`Trouble at task delete: ${error}`); });
}

async function saveSingleTaskToDataBase(task) {
    const request = {
        url: `${dataBase.fqdn}`,
        init: { headers: { "Content-Type": "application/json" } }
    };

    if (task.controls.isNewTask) {
        delete task.data.id; // Let the DataBase generate the Id.
        request.init.method = "POST";
        request.init.body = JSON.stringify(task.data);
    } else {
        request.url += `/${task.data.id}` // Add the Id to the URL.
        request.init.method = "PUT";
        request.init.body = JSON.stringify(task.data);
    }

    const updatedTask = { ...task };

    return fetch(request.url, request.init)
        .then(response => {
            if (response.ok) return response.json();
            throw new Error(`Network response was not ok: ${response.status}`);
        })
        .then(data => {
            updatedTask.data = data;
            updatedTask.controls.toSave = false;
            updatedTask.controls.isNewTask = false;

            return updatedTask;
        })
        .catch(error => { console.log(`Trouble at task save: ${error}`); });
}


export {
    getTasksListFromDataBase as getTasksListDB,
    removeSingleTaskFromDataBase as removeTaskDB,
    saveSingleTaskToDataBase as saveTaskDB
};