function NavComponent(props) {
    return (
        <div className="tasks-nav">
            <div className="tasks-nav-label task-element w3-theme-d1">
                <p>Simple task manager</p>
            </div>

            <div className="tasks-nav-reload task-btn w3-theme-d2 w3-hover-theme"
                role="button" 
                title="Reload data. Unsaved changes will be lost."
            >{/* Reload all */}</div>

            <div className="tasks-nav-add-new task-btn w3-theme-d2 w3-hover-theme"
                role="button"
                onClick={(event) => props.onAddNewTask(null)} // Otherwise {props.onAddNewTask} will pass 'event' as an argument
            >Add task</div>
        </div>
    );
}

export { NavComponent };