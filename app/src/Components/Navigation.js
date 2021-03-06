import { useContext } from "react";
import { NavContext } from "../App";

function NavComponent(props) {
    const {
        statistic,
        handleAddNewTask,
        handleSaveAllTasks,
        handleLockUnlockAllTasks,
        handleLoadTaskListDB
    } = useContext(NavContext);

    return (
        <div className="tasks-nav">
            <div className="tasks-nav-label task-element w3-theme-d1">
                <p>Simple task manager</p>
            </div>

            <div className="tasks-nav-save-all task-btn w3-theme-d2 w3-hover-theme"
                role="button"
                title="Save all tasks to the database."
                onClick={handleSaveAllTasks}
            >{/* Reload all */}</div>

            <div className="tasks-nav-reload task-btn w3-theme-d2 w3-hover-theme"
                role="button"
                title="Reload data. Unsaved changes will be lost."
                onClick={handleLoadTaskListDB}
            // ref={refReloadButton}
            >{/* Reload all */}</div>

            <div className="tasks-nav-add-new task-btn w3-theme-d2 w3-hover-theme"
                role="button"
                title="Add new task."
                onClick={(event) => handleAddNewTask(null)} // Otherwise {handleAddNewTask} will pass 'event' as an argument
            >{/* Add task */}</div>

            <div className={"tasks-nav-lock-all task-btn w3-theme-d2 w3-hover-theme" +
                (statistic.unlocked ? " tasks-nav-lock-all-unlocked" : " tasks-nav-lock-all-locked")}
                role="button"
                title="Lock or unlock all tasks."
                onClick={handleLockUnlockAllTasks}
            // onClick={} 
            >{/* Lock All Tasks */}</div>

            {/* Second row */}

            <div className="task-nav-placeholder nav-label w3-theme-l1"
            >{/* Blank space */}</div>

            <div className="task-nav-total-tasks nav-label w3-theme-d1">
                <div className="task-nav-paragraph-container">
                    <p>Tasks</p>
                    <p><b>{statistic.total}</b></p>
                </div>
            </div>

            <div className="task-nav-completed-tasks nav-label w3-theme-d1">
                <div className="task-nav-paragraph-container">
                    <p>Completed</p>
                    <p><b>{statistic.completed}</b></p>
                </div>
            </div>

            <div className="task-nav-new-tasks nav-label w3-theme-d1">
                <div className="task-nav-paragraph-container">
                    <p>New</p>
                    <p><b>{statistic.new}</b></p>
                </div>
            </div>

            <div className="task-nav-unsaved-tasks nav-label w3-theme-d1">
                <div className="task-nav-paragraph-container">
                    <p>Unsaved</p>
                    <p><b>{statistic.unsaved}</b></p>
                </div>
            </div>
        </div>
    );
}

export { NavComponent };