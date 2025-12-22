import { useState } from "react";
import { Link } from "react-router-dom";
import classNames from "classnames/bind";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faClockRotateLeft,
    faListCheck,
    faTrashCan,
    faMagnifyingGlass,
    faList,
} from "@fortawesome/free-solid-svg-icons";

import Wrapper from "../Wrapper/Wrapper";
import styles from "./TodoTrash.module.scss";
import Search from "../Search/Search";
import BulkActions from "../BulkActions/BulkActions";
import TodoItem from "../TodoItem/TodoItem";

const cx = classNames.bind(styles);

function TodoTrash({ todos, onSetTodos, onRestore, onPermanentDelete }) {
    const [appliedSearchTerm, setAppliedSearchTerm] = useState("");
    const [selectedIds, setSelectedIds] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    const handleSearch = (text) => {
        setAppliedSearchTerm(text);
    };

    const handleDeletePermanentSelected = async () => {
        if (!window.confirm("Do you want to delete all of them?")) return;
        setIsLoading(true);
        try {
            const deletePromises = selectedIds.map((id) =>
                fetch(`http://localhost:3000/todos/${id}`, {
                    method: "DELETE",
                })
            );

            await Promise.all(deletePromises);

            onSetTodos((prev) => prev.filter((todo) => !selectedIds.includes(todo._id)));
            setSelectedIds([]);
        } catch (error) {
            console.error("Error when deleting selected items: ", error);
            alert("Cannot delete all of selected items!");
        } finally {
            setIsLoading(false);
        }
    };

    const handleRestoreSelected = async () => {
        setIsLoading(true);
        try {
            const restorePromises = selectedIds.map((id) =>
                fetch(`http://localhost:3000/todos/${id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ isDeleted: false }),
                })
            );

            await Promise.all(restorePromises);

            onSetTodos((prev) =>
                prev.map((todo) => (selectedIds.includes(todo._id) ? { ...todo, isDeleted: false } : todo))
            );
            setSelectedIds([]);
        } catch (error) {
            console.error("Error when restoring selected items: ", error);
            alert("Cannot restore all of selected items!");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSelect = (e, index) => {
        const isChecked = e.target.checked;

        if (isChecked) {
            setSelectedIds((prev) => [...prev, index]);
        } else {
            setSelectedIds((prev) => prev.filter((id) => id !== index));
        }
    };

    const handleSelectAll = (e) => {
        const isChecked = e.target.checked;
        if (isChecked) {
            setSelectedIds(filteredTodos.map((todo) => todo._id));
        } else {
            setSelectedIds([]);
        }
    };

    const handleConfirmDelete = async (id) => {
        await onPermanentDelete(id);

        setDeletingId(null);
    };

    const filteredTodos = todos.filter((todo) => todo.title.toLowerCase().includes(appliedSearchTerm.toLowerCase()));

    return (
        <Wrapper className={cx("todo-trash-wrapper")}>
            <h1 className={cx("heading")}>Todo Trash</h1>
            <Link className={cx("todo-list")} to="/">
                Your tasks
                <FontAwesomeIcon className={cx("list-icon")} icon={faListCheck} />
            </Link>
            <Search onSubmit={handleSearch} />
            <BulkActions selectedIds={selectedIds} handleSelectAll={handleSelectAll} filteredTodos={filteredTodos}>
                <button className={cx("bulk-action", "success")} disabled={isLoading} onClick={handleRestoreSelected}>
                    <FontAwesomeIcon icon={faClockRotateLeft} />
                </button>
                <button
                    className={cx("bulk-action", "danger")}
                    disabled={isLoading}
                    onClick={handleDeletePermanentSelected}
                >
                    <FontAwesomeIcon icon={faTrashCan} />
                </button>
            </BulkActions>
            <div className={cx("todo-trash")}>
                {filteredTodos.length === 0 ? (
                    <div>
                        {appliedSearchTerm ? (
                            <span>
                                <FontAwesomeIcon icon={faMagnifyingGlass} />
                                {"  "} No results for "{appliedSearchTerm}"
                            </span>
                        ) : (
                            <span>
                                <FontAwesomeIcon icon={faList} />
                                {"  "} No deleted tasks!
                            </span>
                        )}
                    </div>
                ) : (
                    filteredTodos.map((todo) => (
                        <div key={todo._id} className={cx("item-wrapper")}>
                            <TodoItem
                                index={todo._id}
                                todo={todo}
                                isSelected={selectedIds.includes(todo._id)}
                                onSelect={handleSelect}
                            >
                                <button className={cx("action", "success")} onClick={() => onRestore(todo._id)}>
                                    <FontAwesomeIcon icon={faClockRotateLeft} />
                                </button>
                                <button className={cx("action", "danger")} onClick={() => setDeletingId(todo._id)}>
                                    <FontAwesomeIcon icon={faTrashCan} />
                                </button>
                            </TodoItem>

                            {deletingId === todo._id && (
                                <div className={cx("confirm-overlay")}>
                                    <button
                                        className={cx("confirm-button", "cancel")}
                                        onClick={() => setDeletingId(null)}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className={cx("confirm-button", "delete")}
                                        onClick={() => handleConfirmDelete(todo._id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
            {/* 
                )) */}
        </Wrapper>
    );
}

export default TodoTrash;
