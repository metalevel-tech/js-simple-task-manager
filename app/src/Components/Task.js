import { useRef, useEffect, useContext } from 'react';
import { TaskContext } from "../App";

import { getTaskDB } from '../Helpers/FetchFunctions';

// function TaskComponent({ data, controls, onTaskChange, onTaskClone, onTaskRemove, onTaskSave }) {
function TaskComponent(/*props*/{ data, state }) {
    const {
        // task,
        handleTaskChange,
        handleTaskRemove,
        handleTaskSave,
        handleAddNewTask
    } = useContext(TaskContext);

    // const { data, state } = task;
    const { id, title, progress, note, completed } = data;
    const { toSave, toRemove, isNewTask, isLocked, copyWarning, copySuccess } = state;

    const refTitleField = useRef(null);

    useEffect(() => {
        if (isNewTask) {
            refTitleField.current.focus();
        }
    }, [isNewTask]);


    const handleDataChange = (event, property) => {
        data[property] = event.target.value;

        if (state.progress < 100) data.completed = false;
        state.toSave = true;

        handleTaskChange({ data, state });
    };

    const handleSave = (event) => {
        if (toSave) {
            if (state.progress >= 100) data.completed = true;
            else data.completed = false;

            handleTaskSave({ data, state });
        }
    };

    const handleClone = (event) => {
        state.isLocked = true;
        handleTaskChange({ data, state });
        handleAddNewTask(data); // On Task Clone
    };

    const handleToRemove = (event) => {
        if (toRemove) state.toRemove = false;
        else state.toRemove = true;
        handleTaskChange({ data, state });
    };

    const handleRemove = (event) => {
        handleTaskRemove({ data, state });
    };

    const handleTaskDataFromDataBaseToClipboard = async (event) => {
        // Reject the operation when the task is not saved
        if (toSave || isNewTask) {
            state.copyWarning = true;
            handleTaskChange({ data, state });

            setTimeout(() => {
                state.copyWarning = false;
                handleTaskChange({ data, state });
            }, 1500);
            return;
        }

        let freshTaskData = await getTaskDB({ data, state });
        freshTaskData = JSON.stringify(freshTaskData, null, 4);

        navigator.clipboard.writeText(freshTaskData)
            .then(() => {
                state.copySuccess = true;
                handleTaskChange({ data, state });

                setTimeout(() => {
                    state.copySuccess = false;
                    handleTaskChange({ data, state });
                }, 1500);
            });
    };

    const handleTaskLock = (event) => {
        state.isLocked = !isLocked;
        handleTaskChange({ data, state });
    };

    return (
        <div data-id={id}
            className={"task-container" +
                (completed ? " completed-task" : "") +
                (toRemove ? " task-to-remove" : "") +
                (isNewTask ? " new-task-not-saved" : "") +
                (toSave ? " task-changed-not-saved" : "") +
                (isLocked ? " locked-task" : "")
            }
        >

            {/* Inputs */}

            <div className="task-title task-element w3-theme">
                <label className="label-task-title" htmlFor={"task-title-" + id}>Task</label>
                <input className="input-task-title" id={"task-title-" + id}
                    type="text" name="title" placeholder="Enter task title"
                    value={title}
                    onChange={(e) => handleDataChange(e, "title")}
                    readOnly={isLocked}
                    ref={refTitleField}
                />
            </div>

            <div className="task-percent task-element w3-theme">
                <label className="label-progress-number" htmlFor={"task-percentage-" + id}>Progress</label>
                <input className="input-progress-number" id={"task-percentage-" + id}
                    type="number" name="number" min="1" max="100" placeholder="0"
                    value={progress}
                    onChange={(e) => handleDataChange(e, "progress")}
                />
            </div>

            <div className="task-slider task-element w3-theme-l4">
                <label className="label-progress-slider" htmlFor={"task-progress-" + id}></label>
                <input className="input-progress-slider" id={"task-percentage-" + id}
                    type="range" name="slider" min="1" max="100" placeholder="0"
                    value={progress}
                    onChange={(e) => handleDataChange(e, "progress")}
                />
            </div>

            <div className="task-note task-element w3-theme">
                <label className="label-task-note" htmlFor={"task-note-" + id}>Note</label>
                <input className="input-task-note" id="task-note-0"
                    type="text" name="note" placeholder="Enter a note"
                    value={note}
                    onChange={(e) => handleDataChange(e, "note")}
                />
            </div>

            {/* Elements when it is Locked/Collapsed */
                isLocked ?
                    <div className="task-title-percent-locked task-btn w3-hover-theme w3-theme-d2">{progress}<sup>%</sup></div>
                    : null
            }

            {/* Buttons */}

            <div className={"task-btn w3-hover-theme" + (completed ? " task-completed w3-theme-d5" : " task-save w3-theme-d2")}
                role="button"
                onClick={handleSave}
            >{completed ? "" : "Save"}</div>

            <div className={"task-lock task-btn w3-theme w3-hover-theme" + (isLocked ? " task-locked" : " task-unlocked")}
                role="button"
                onClick={handleTaskLock}
            >{/* Lock/Unlock or Minimize/Maximize */}</div>

            <div className={"task-copy-json task-btn w3-theme w3-hover-theme" +
                (copyWarning ? " task-copy-rejected" : "") +
                (copySuccess ? " task-copied" : "")
            }
                role="button"
                onClick={handleTaskDataFromDataBaseToClipboard}
            >{/* Copy JSON */}</div>

            <div className={"task-btn w3-hover-theme w3-theme-d2" + (toRemove ? " task-remove-confirm" : " task-clone")}
                role="button"
                onClick={toRemove ? handleRemove : handleClone}
            >{toRemove ? "Confirm" : "Clone"}</div>

            <div className={"task-btn w3-hover-theme" + (toRemove ? " task-remove-cancel w3-theme-d2" : " task-remove w3-theme-l1")}
                role="button"
                onClick={handleToRemove}
            >{toRemove ? "Cancel" : "Remove"}</div>
        </div>
    );
}

export { TaskComponent };