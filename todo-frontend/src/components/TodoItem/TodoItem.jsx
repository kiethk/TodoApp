import classNames from "classnames/bind";
import { memo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";

import styles from "./TodoItem.module.scss";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";

const cx = classNames.bind(styles);

function TodoItem({
    index,
    isCompleted,
    todo,
    isSelected,
    isEditing,
    editingText,
    onSelect,
    onToggle,
    onEditClick,
    onDelete,
    onEditChange,
    onEditBlur,
    onEditKeyDown,
    children,
}) {
    return (
        <label htmlFor={index} className={cx("todo-item", { completed: isCompleted }, { checked: isSelected })}>
            <div className={cx("todo-item-left")}>
                <label className={cx("todo-check", { checked: isSelected })}>
                    <input
                        hidden
                        id={index}
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => onSelect(e, index)}
                    />
                </label>
                {isEditing ? (
                    <input
                        className={cx("edit-input")}
                        type="text"
                        value={editingText}
                        onChange={(e) => onEditChange(e.target.value)}
                        onBlur={() => onEditBlur(index, editingText)}
                        onKeyDown={(e) => onEditKeyDown(e)}
                        autoFocus
                    />
                ) : (
                    <span className={cx("title", { completed: isCompleted })}>{todo.title}</span>
                )}
            </div>
            {children ? (
                children
            ) : (
                <div className={cx("todo-item-right")}>
                    <label className={cx("checkbox-completed", { completed: isCompleted })}>
                        {isCompleted ? "Completed" : "Complete"}
                        <input
                            hidden
                            type="checkbox"
                            checked={isCompleted}
                            onChange={() => onToggle(index, isCompleted)}
                        />
                    </label>
                    <button className={cx("action", 'edit')} onClick={() => onEditClick(index, todo.title)}>
                        <FontAwesomeIcon icon={faPenToSquare} />
                    </button>
                    <button className={cx("action", 'danger')} onClick={() => onDelete(index)}>
                        <FontAwesomeIcon icon={faTrashCan} />
                    </button>
                </div>
            )}
        </label>
    );
}

export default memo(TodoItem);
