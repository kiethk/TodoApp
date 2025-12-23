import Tippy from "@tippyjs/react";
import classNames from "classnames/bind";
import { memo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan, faSquare, faSquareCheck } from "@fortawesome/free-regular-svg-icons";

import styles from "./TodoItem.module.scss";
import { faEllipsisVertical, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import useIsMobile from "../../hooks/useIsMobile";

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
    const isMobile = useIsMobile();
    console.log(isMobile);
    console.log(window.innerWidth);
    

    return (
        <div className={cx("todo-item", { completed: isCompleted }, { checked: isSelected })}>
            <label htmlFor={index} className={cx("todo-item-left")}>
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
            </label>
            {children ? (
                children
            ) : (
                <div>
                    {isMobile ? (
                        <div className={cx("todo-item-right")}>
                            <label className={cx("checkbox-completed", { completed: isCompleted })}>
                                {isCompleted ? (
                                    <FontAwesomeIcon icon={faSquareCheck} />
                                ) : (
                                    <FontAwesomeIcon icon={faSquare} />
                                )}
                                <input
                                    hidden
                                    type="checkbox"
                                    checked={isCompleted}
                                    onChange={() => onToggle(index, isCompleted)}
                                />
                            </label>

                            <Tippy
                                interactive
                                trigger="click"
                                placement="bottom-end"
                                offset={[20, 25]}
                                content={
                                    <div className={cx(`${cx("actions")} animate__animated animate__fadeInDown`)}>
                                        <button
                                            className={cx("action", "edit")}
                                            onClick={() => onEditClick(index, todo.title)}
                                        >
                                            <FontAwesomeIcon icon={faPenToSquare} />
                                        </button>
                                        <div className={cx("separate")}></div>
                                        <button className={cx("action", "danger")} onClick={() => onDelete(index)}>
                                            <FontAwesomeIcon icon={faTrashCan} />
                                        </button>
                                    </div>
                                }
                                className={cx("todo-item-menu")}
                            >
                                <FontAwesomeIcon icon={faEllipsisVertical} />
                            </Tippy>
                        </div>
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

                            <button className={cx("action", "edit")} onClick={() => onEditClick(index, todo.title)}>
                                <FontAwesomeIcon icon={faPenToSquare} />
                            </button>
                            <button className={cx("action", "danger")} onClick={() => onDelete(index)}>
                                <FontAwesomeIcon icon={faTrashCan} />
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default memo(TodoItem);
