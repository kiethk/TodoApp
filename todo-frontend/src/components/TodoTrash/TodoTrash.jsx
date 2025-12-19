import { useState } from "react";
import { Link } from "react-router-dom";
import classNames from "classnames/bind";

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

    const filteredTodos = todos.filter((todo) => todo.title.toLowerCase().includes(appliedSearchTerm.toLowerCase()));

    return (
        <Wrapper>
            <h1>Todo Trash</h1>
            <Link to="/">
                <button>Your tasks</button>
            </Link>
            <Search onSubmit={handleSearch} />
            <BulkActions selectedIds={selectedIds} handleSelectAll={handleSelectAll} filteredTodos={filteredTodos}>
                <button disabled={isLoading} onClick={handleDeletePermanentSelected}>
                    Delete
                </button>
                <button disabled={isLoading} onClick={handleRestoreSelected}>
                    Restore
                </button>
            </BulkActions>
            <ul className={cx("todo-trash")}>
                {filteredTodos.map((todo) => (
                    <TodoItem
                        key={todo._id}
                        index={todo._id}
                        todo={todo}
                        isSelected={selectedIds.includes(todo._id)}
                        onSelect={handleSelect}
                    >
                        <button onClick={() => onRestore(todo._id)}>Restore</button>
                        <button onClick={() => onPermanentDelete(todo._id)}>Delete</button>
                    </TodoItem>
                ))}
            </ul>
        </Wrapper>
    );
}

export default TodoTrash;
