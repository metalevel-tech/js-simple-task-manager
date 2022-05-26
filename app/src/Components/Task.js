function TaskComponent({ task, controls, onDataChange, onStateChange }) {
    const { id, title, progress, note, completed } = task;
    const { save, remove, toRemove } = controls;

    const handleDataChange = (event, property) => {
        task[property] = event.target.value;

        if (task.progress < 100) task.completed = false;

        onDataChange(task);
    };

    const handleSave = (event) => {
        if (task.progress >= 100) task.completed = true;
        else task.completed = false;

        onDataChange(task);
    };
    
    const handleToRemove = (event) => {
        if (toRemove) controls.toRemove = false;
        else controls.toRemove = true;

        onStateChange(task, controls);
    };

    const handleTaskDataFromDataBaseToClipboard = (event) => {

    };


    return (
        <div className={"task-container" + (completed ? " completed-task" : "")} data-id={id}>

            {/* Inputs */}

            <div className="task-header task-element w3-theme">
                <label className="label-task-title" htmlFor={"task-title-" + id}>Task</label>
                <input className="input-task-title" id={"task-title-" + id}
                    type="text" name="title" placeholder="Enter task title"
                    value={title}
                    onChange={(e) => handleDataChange(e, 'title')}
                />
            </div>

            <div className="task-left task-element w3-theme">
                <label className="label-progress-number" htmlFor={"task-percentage-" + id}>Progress</label>
                <input className="input-progress-number" id={"task-percentage-" + id}
                    type="number" name="number" min="1" max="100" placeholder="0"
                    value={progress}
                    onChange={(e) => handleDataChange(e, 'progress')}
                />
            </div>

            <div className="task-right task-element w3-theme-l4">
                <label className="label-progress-slider" htmlFor={"task-progress-" + id}></label>
                <input className="input-progress-slider" id={"task-percentage-" + id}
                    type="range" name="slider" min="1" max="100" placeholder="0"
                    value={progress}
                    onChange={(e) => handleDataChange(e, 'progress')}
                />
            </div>

            <div className="task-notes task-element w3-theme">
                <label className="label-task-note" htmlFor={"task-note-" + id}>Note</label>
                <input className="input-task-note" id="task-note-0"
                    type="text" name="note" placeholder="Enter a note"
                    value={note}
                    onChange={(e) => handleDataChange(e, 'note')}
                />
            </div>


            {/* Buttons */}

            <div className={"task-btn w3-hover-theme" + (completed ? " task-completed w3-theme-d5" : " task-save w3-theme-d2")}
                role="button"
                onClick={handleSave}
            >{completed ? "" : "Save"}</div>

            <div className="task-copy-json task-btn w3-theme w3-hover-theme"
                role="button"
                onClick={handleTaskDataFromDataBaseToClipboard}
            >{/*Copy JSON*/}</div>

            <div className="task-clone task-btn w3-theme-d2 w3-hover-theme" role="button">Clone</div>
            {/*<div className="task-remove-confirm task-btn w3-theme-d2 w3-hover-theme" role="button">Confirm</div> */}

            <div className="task-remove task-btn w3-theme-l1 w3-hover-theme"
                role="button"
                onClick={handleToRemove}
            >{toRemove ? "Cancel" : "Remove"}</div>
            {/*<div className="task-remove-cancel task-btn w3-theme-d2 w3-hover-theme" role="button">Cancel</div> */}
        </div>
    );
}

export { TaskComponent };