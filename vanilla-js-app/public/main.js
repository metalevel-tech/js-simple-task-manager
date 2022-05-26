// Select the necessary DOM nodes 
const nodes = {
    taskTemplate: document.querySelector('#task-template'),
    taskListContainer: document.querySelector('#tasks'),
    newTaskButton: document.querySelector('#navigator .task-nav-add-new'),
    reloadButton: document.querySelector('#navigator .task-nav-reload')
}

// Data base connection
const dataBase = {
    url: '127.0.0.1',
    port: '48011',
    uri: 'api/tasks',
    protocol: 'https',
    get fqdn() {
        // const url = `${this.protocol}://${this.url}/${this.uri}`;
        const url = `/${this.uri}`;
        return url;
    }
    // We could have fetch() method here,
    // that accepts {init} object
    // and returns the response's {data}.
}

class Task {
    /**
     * Instances model
     */
    data = {
        id: 0,
        title: '',
        progress: 0,
        note: '',
        completed: false
    };
    domEl = {};
    controls = {};

    constructor(data) {
        this.data = data;
        this.domEl = nodes.taskTemplate.cloneNode(true);
        this.generateControls();
    }

    /**
     * Prototype model
     */
    async generateControls() {
        this.controls = {
            // Title section
            taskTitle: this.domEl.querySelector('input.input-task-title'),
            titleLabel: this.domEl.querySelector('label.label-task-title'),

            // Number section
            progressNumber: this.domEl.querySelector('input.input-progress-number'),
            numberLabel: this.domEl.querySelector('label.label-progress-number'),

            // Slider section
            progressSlider: this.domEl.querySelector('input.input-progress-slider'),
            sliderLabel: this.domEl.querySelector('label.label-progress-slider'),

            // Note section
            taskNote: this.domEl.querySelector('input.input-task-note'),
            noteLabel: this.domEl.querySelector('label.label-task-note'),

            // Buttons section
            btnCopy: this.domEl.querySelector('.task-btn.task-copy-json'),
            btnSave: this.domEl.querySelector('.task-btn.task-save'),
            btnCompleted: this.domEl.querySelector('.task-btn.task-completed'),
            btnClone: this.domEl.querySelector('.task-btn.task-clone'),
            btnRemove: this.domEl.querySelector('.task-btn.task-remove'),
            btnRmConfirm: this.domEl.querySelector('.task-btn.task-remove-confirm'),
            btnRmCancel: this.domEl.querySelector('.task-btn.task-remove-cancel'),
        };

        // Setup the event handlers
        const taskElementsEventHandler = (e) => {
            const { progressNumber, progressSlider } = this.controls;

            if (e.target === progressNumber) progressSlider.value = progressNumber.value;
            if (e.target === progressSlider) progressNumber.value = progressSlider.value;

            this.domEl.classList.add('task-changed-not-saved');
        }

        const buttonsHandler = (e) => {
            const {
                btnCopy, btnSave, btnCompleted, btnClone,
                btnRemove, btnRmConfirm, btnRmCancel
            } = this.controls;

            switch (e.target) {
                case btnCopy:
                    this.getTaskDataFromDataBaseToClipboard(e);
                    break;
                case btnSave:
                    this.saveTaskToDataBase(e);
                    break;
                case btnCompleted:
                    this.saveTaskToDataBase(e);
                    break;
                case btnClone:
                    this.cloneCurrentTask(e)
                    break;
                case btnRemove:
                    this.domEl.classList.add('task-to-remove');
                    break;
                case btnRmConfirm:
                    this.deleteTaskFromDataBaseAndRemoveFromDom(e);
                    break;
                case btnRmCancel:
                    this.domEl.classList.remove('task-to-remove');
                    break;
            }
        }

        // Add event listeners. If they wasn't defined as arrow functions
        // we need to bind the context - functionName.bind(this),
        // no mater they was methods or functions defined here or at global scope.
        // Otherwise `this` (inside the handlers) will be the same as `event.target`.
        this.domEl.onclick = buttonsHandler;
        this.domEl.oninput = taskElementsEventHandler;
    }

    addTaskToDom(trigger) {
        const { taskListContainer: tasks } = nodes;

        this.updateTaskDom();

        // Add task to the DOM list
        if (trigger !== 'new') {
            tasks.append(this.domEl);
        } else {
            this.domEl.classList.add('new-task-not-saved');
            tasks.prepend(this.domEl);
        }
    }

    updateTaskDom() {
        const { id, title, progress, note, completed } = this.data;
        const {
            taskTitle, titleLabel,
            progressNumber, numberLabel,
            progressSlider, sliderLabel,
            taskNote, noteLabel
        } = this.controls;

        // The task container
        this.domEl.id = `task-${id}`;
        this.domEl.dataset.id = id;

        // Title section
        taskTitle.value = title;
        taskTitle.id = `task-title-${id}`;
        titleLabel.htmlFor = `task-title-${id}`;

        // Slider section
        progressNumber.id = `task-percentage-${id}`;
        progressNumber.value = progress;
        numberLabel.htmlFor = `task-percentage-${id}`;

        // Number section
        progressSlider.id = `task-progress-${id}`;
        progressSlider.value = progress;
        sliderLabel.htmlFor = `task-progress-${id}`;

        // Note section
        taskNote.id = `task-note-${id}`;
        taskNote.value = note;
        noteLabel.htmlFor = `task-note-${id}`;

        // Completed section
        if (completed) {
            this.domEl.classList.add('completed-task');
        } else {
            this.domEl.classList.remove('completed-task');
        }
    }

    saveTaskToDataBase() {
        this.updateTaskDataByDomValues();
    
        if (this.domEl.classList.contains('new-task-not-saved')) {
            this.postNewTaskToDataBase();
        } else {
            this.putTaskDataToDataBase();
        }
    }

    updateTaskDataByDomValues() {       // This method is invoked by `saveTaskToDataBase()`
        const { taskTitle, progressNumber, progressSlider, taskNote } = this.controls;

        const percentComplete = Number(progressNumber.value);

        if (percentComplete >= 100) {
            this.data.completed = true;
        } else {
            this.data.completed = false;
        }

        this.data.title = taskTitle.value;
        this.data.progress = percentComplete;
        this.data.note = taskNote.value;
        this.data.note = this.domEl.querySelector('input.input-task-note').value;
    }

    putTaskDataToDataBase() {       // This method is invoked by `saveTaskToDataBase()`
        fetch(`${dataBase.fqdn}/${this.data.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(this.data)
        })
            .then(response => {
                if (response.ok) return response.json();
                throw new Error(`Network response was not ok: ${response.status}`);
            })
            .then(data => {
                this.data = data;
                this.updateTaskDom();
                this.domEl.classList.remove('task-changed-not-saved');
            })
            .catch(error => { console.log(error); });
    }

    postNewTaskToDataBase() {   // This method is invoked by `saveTaskToDataBase()`
        delete this.data.id;    // Let the DataBase generate the Id, to avoid collisions

        fetch(`${dataBase.fqdn}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.data)
        })
            .then(response => {
                if (response.ok) return response.json();
                throw new Error('Network response was not ok');
            })
            .then(data => {
                this.data = data;
                this.updateTaskDom();
                this.domEl.classList.remove('new-task-not-saved');
                this.domEl.classList.remove('task-changed-not-saved');
            })
            .catch(error => { console.log(error); });
    }

    getTaskDataFromDataBaseToClipboard() {
        // Reject the operation when the task is not saved
        if (
            this.domEl.classList.contains('task-changed-not-saved') ||
            this.domEl.classList.contains('new-task-not-saved')
        ) {
            this.controls.btnCopy.classList.add('task-copy-rejected');
            setTimeout(() => {
                this.controls.btnCopy.classList.remove('task-copy-rejected');
            }, 1500);
            return;
        }

        fetch(`${dataBase.fqdn}/${this.data.id}`, { method: 'GET' })
            .then(response => {
                if (response.ok) return response.json();
                throw new Error('Network response was not ok');
            })
            .then(data => {
                this.data = data;
                this.updateTaskDom();

                const dataToCopy = JSON.stringify(data, null, 4);

                navigator.clipboard.writeText(dataToCopy)
                    .then(() => {
                        this.domEl.classList.remove('task-changed-not-saved');

                        this.controls.btnCopy.classList.add('task-copied');
                        setTimeout(() => {
                            this.controls.btnCopy.classList.remove('task-copied');
                        }, 1500);
                    }, function () {
                        throw new Error('Unable to copy');
                    })
                    .catch(error => { console.log(error); });
            })
            .catch(error => { console.log(error); });
    }

    deleteTaskFromDataBaseAndRemoveFromDom() {
        const removeFromDom = () => {
            // Remove from DOM
            this.domEl.remove();
            // Remove from the task array
            const index = this.constructor.taskListArray.findIndex(task => task.data.id === this.data.id);
            this.constructor.taskListArray.splice(index, 1);
        }

        fetch(`${dataBase.fqdn}/${this.data.id}`, { method: 'DELETE' })
            .then(response => {
                if (response.ok) return response.json();
                throw new Error(`${response.status} This task doesn't exist in the DataBase.`);
            })
            .then(data => {
                removeFromDom();    // console.log(data); // {}
            })
            .catch(error => {
                removeFromDom();    // Remove the task only from the DOM
                console.log(error);
            });
    }

    cloneCurrentTask() {
        this.constructor.addNewTask(this.data);
    }

    /**
     * Constructor model
     */
    static taskListArray = [];

    static async getTaskListFromDataBase() {
        return fetch(`${dataBase.fqdn}`)
            .then(response => {
                if (response.ok) return response.json();
                throw new Error(`Network response was not ok: ${response.status}`);
            })
            .then(data => {
                data.forEach(taskData => {
                    this.taskListArray.push(new Task(taskData));
                });
                return new Promise(resolve => resolve(`${this.taskListArray.length} tasks loaded.`));
            })
            .catch(error => { console.log(`Trouble: ${error}`); });
    }

    static addTaskListToDom() {
        return new Promise(resolve => {
            this.taskListArray.forEach(task => task.addTaskToDom('append'));
            resolve(`${this.taskListArray.length} tasks added to DOM.`);
        });
    }

    static generateTaskId() {
        const lastId = this.taskListArray.reduce(
            (acc, task) => (task.data.id > acc) ? acc = task.data.id : acc, 0
        );
        return lastId + 1;
    }

    static addNewTask(data) {
        // If no data is passed, generate object with empty task data,
        // otherwise perform clone action, based on the passed task data,
        // mut change the `id`, because the remove action will
        // delete the original task from the DataBase!
        if (!data) {
            data = {
                id: this.generateTaskId(),
                title: '',
                progress: 0,
                note: '',
                completed: false
            };
        } else {
            data.id = this.generateTaskId();
        }

        const task = new this(data); // === Task(data);
        task.addTaskToDom('new');
        this.taskListArray.push(task);
    }
}

const effectFadeIn = {
    animation: [
        { opacity: 0, filter: 'grayscale(1) hue-rotate(45deg)' },
        { opacity: 1, filter: 'grayscale(0) hue-rotate(0)' }
    ],
    params: {
        delay: 200,
        duration: 500,
        iterations: 1,
        easing: 'ease-in'
    }
};

// Initialization
(async function init() {
    await Task.getTaskListFromDataBase();
    await Task.addTaskListToDom();

    nodes.newTaskButton.addEventListener('click', () => { Task.addNewTask(); });

    nodes.reloadButton.addEventListener('click', async () => {
        nodes.taskListContainer.innerHTML = '';
        nodes.taskListContainer.style.opacity = 0;
        Task.taskListArray = [];

        await Task.getTaskListFromDataBase();
        await Task.addTaskListToDom();

        nodes.taskListContainer.animate(effectFadeIn.animation, effectFadeIn.params)
            .finished.then(() => { nodes.taskListContainer.style.opacity = 1; });
    });
})();