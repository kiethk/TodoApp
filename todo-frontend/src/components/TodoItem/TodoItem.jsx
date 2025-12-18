import classNames from "classnames/bind";
import { memo } from "react";

import styles from "./TodoItem.module.scss";

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
}) {
    console.log("render");

    return (
        <li className={cx("todo-item", { completed: isCompleted })}>
            <input type="checkbox" checked={isSelected} onChange={(e) => onSelect(e, index)} />
            {isEditing ? (
                <input
                    className={cx("edit-input")}
                    type="text"
                    value={editingText}
                    onChange={(e) => onEditChange(e.target.value)}
                    onBlur={() => onEditBlur(index)}
                    onKeyDown={(e) => onEditKeyDown(e, index)}
                    autoFocus
                />
            ) : (
                <span className={cx({ completed: isCompleted })}>{todo.title}</span>
            )}
            <div>
                <input type="checkbox" checked={isCompleted} onChange={() => onToggle(index, isCompleted)} />
                <button onClick={() => onEditClick(index, todo.title)}>Edit</button>
                <button onClick={() => onDelete(index)}>&times;</button>
            </div>
        </li>
    );
}

export default memo(TodoItem);
