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
        toSave: false,      // the task is not saved to the data base
        toRemove: false,    // mark the task for deletion
        isNewTask: true,    // the task is new
        isLocked: false     // the task is locked
    };

    constructor(data) {
        this.data = data;
    }
}

export { Task };