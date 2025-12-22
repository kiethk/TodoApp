import { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faList, faMagnifyingGlass, faPlus, faToggleOff } from "@fortawesome/free-solid-svg-icons";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";

import classNames from "classnames/bind";
import styles from "./TodoList.module.scss";
import TodoItem from "../TodoItem/TodoItem";
import Wrapper from "../Wrapper/Wrapper";
import Search from "../Search/Search";
import BulkActions from "../BulkActions/BulkActions";

const cx = classNames.bind(styles);

function TodoList({ todos, onSetTodos, onDelete }) {
    const [newTodo, setNewTodo] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [editingText, setEditingText] = useState("");
    const [filter, setFilter] = useState("all");
    const [filterStatus, setFilterStatus] = useState("all");
    const [appliedSearchTerm, setAppliedSearchTerm] = useState("");
    const [selectedIds, setSelectedIds] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setNewTodo(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!newTodo.trim()) {
            alert("Please enter the name of your task.");
            return;
        }

        const res = await fetch("http://localhost:3000/todos", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ title: newTodo }),
        });

        const createdTodo = await res.json();

        onSetTodos([...todos, createdTodo]);

        setNewTodo("");
    };

    const handleToggleComplete = async (index, isCompleted) => {
        const newCompleteState = !isCompleted;

        const res = await fetch(`http://localhost:3000/todos/${index}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ completed: newCompleteState }),
        });

        const updatedTodo = await res.json();

        onSetTodos((prevTodos) => {
            return prevTodos.map((todo) => {
                if (todo._id === index) {
                    return updatedTodo;
                }
                return todo;
            });
        });
    };

    const handleEdit = async (id, text) => {
        if (!text.trim()) return;

        const res = await fetch(`http://localhost:3000/todos/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title: text }),
        });

        const updatedTodo = await res.json();
        onSetTodos((prev) => prev.map((t) => (t._id === id ? updatedTodo : t)));

        setEditingId(null);
        setEditingText("");
    };

    const handleEditClick = (index, title) => {
        setEditingId(index);
        setEditingText(title);
    };

    const handleFilterChange = (type) => {
        setFilter(type);
        setFilterStatus(type);
    };

    const handleSearch = (text) => {
        setAppliedSearchTerm(text);
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

    const handleMoveToTrashSelected = async () => {
        setIsLoading(true);
        try {
            const deletePromises = selectedIds.map((id) =>
                fetch(`http://localhost:3000/todos/${id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ isDeleted: true }),
                })
            );

            await Promise.all(deletePromises);

            onSetTodos((prev) =>
                prev.map((todo) => (selectedIds.includes(todo._id) ? { ...todo, isDeleted: true } : todo))
            );
            setSelectedIds([]);
        } catch (error) {
            console.error("Error when deleting selected items: ", error);
            alert("Cannot delete all of selected items!");
        } finally {
            setIsLoading(false);
        }
    };

    const handleToggleCompleteSelected = async () => {
        setIsLoading(true);
        try {
            const updatePromises = selectedIds.map(async (id) => {
                const selectedTodo = filteredTodos.find((todo) => todo._id === id);

                const res = await fetch(`http://localhost:3000/todos/${id}`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ completed: !selectedTodo.completed }),
                });

                if (!res.ok) {
                    throw new Error(`Error when updating item with id: ${id}`);
                }

                return res.json();
            });

            await Promise.all(updatePromises);

            onSetTodos((prev) =>
                prev.map((todo) => (selectedIds.includes(todo._id) ? { ...todo, completed: !todo.completed } : todo))
            );
        } catch (error) {
            console.error("Error when updating selected items: ", error);
            alert("Cannot Update all of selected items!");
        } finally {
            setIsLoading(false);
        }
    };

    const filteredTodos = todos.filter((todo) => {
        const isNotDeleted = !todo.isDeleted;

        const matchStatus =
            filter === "all" || (filter === "completed" && todo.completed) || (filter === "active" && !todo.completed);

        const matchSearch = todo.title.toLowerCase().includes(appliedSearchTerm.toLowerCase());

        return matchStatus && matchSearch && isNotDeleted;
    });

    return (
        <Wrapper className={cx("todo-list-wrapper")}>
            <h1 className={cx("heading")}>Todo App</h1>
            <Link className={cx("trash")} to="/trash">
                View Trash
                <FontAwesomeIcon className={cx("trash-icon")} icon={faTrashCan} />
            </Link>
            <div className={cx("separate")}></div>
            <form className={cx("form")} onSubmit={(e) => handleSubmit(e)}>
                <input
                    className={cx("form-input")}
                    type="text"
                    placeholder="Enter your tasks..."
                    value={newTodo}
                    onChange={(e) => handleChange(e)}
                />
                <button className={cx("form-submit")} type="submit">
                    <FontAwesomeIcon icon={faPlus} />
                </button>
            </form>
            <Search onSubmit={handleSearch} />
            <div className={cx("filter", filterStatus)}>
                <div className={cx("filter-tag", filterStatus)}></div>
                <button
                    className={cx("filter-item", { active: filterStatus === "active" })}
                    onClick={() => handleFilterChange("active")}
                >
                    Active
                </button>
                <button
                    className={cx("filter-item", { active: filterStatus === "all" })}
                    onClick={() => handleFilterChange("all")}
                >
                    All
                </button>
                <button
                    className={cx("filter-item", { active: filterStatus === "completed" })}
                    onClick={() => handleFilterChange("completed")}
                >
                    Completed
                </button>
            </div>
            <BulkActions selectedIds={selectedIds} handleSelectAll={handleSelectAll} filteredTodos={filteredTodos}>
                <button
                    className={cx("bulk-action", "danger")}
                    disabled={isLoading}
                    onClick={handleMoveToTrashSelected}
                >
                    <FontAwesomeIcon icon={faTrashCan} />
                </button>
                <button
                    className={cx("bulk-action", "primary")}
                    disabled={isLoading}
                    onClick={handleToggleCompleteSelected}
                >
                    <FontAwesomeIcon icon={faToggleOff} />
                </button>
            </BulkActions>
            <ul className={cx("todo-list")}>
                {filteredTodos.length === 0 ? (
                    <li>
                        {appliedSearchTerm ? (
                            <span>
                                <FontAwesomeIcon icon={faMagnifyingGlass} />
                                {"  "} No results for "{appliedSearchTerm}"
                            </span>
                        ) : (
                            <span>
                                <FontAwesomeIcon icon={faList} />
                                {filterStatus === "all"
                                    ? " Add your tasks!"
                                    : filterStatus === "active"
                                    ? " No tasks left. Enjoy your day!"
                                    : " Let's get things done!"}
                            </span>
                        )}
                    </li>
                ) : (
                    filteredTodos.map((todo) => {
                        const index = todo._id;
                        const isCompleted = todo.completed;
                        return (
                            <TodoItem
                                key={index}
                                index={index}
                                isCompleted={isCompleted}
                                todo={todo}
                                isSelected={selectedIds.includes(index)}
                                isEditing={editingId === index}
                                editingText={editingText}
                                onSelect={handleSelect}
                                onToggle={handleToggleComplete}
                                onEditClick={handleEditClick}
                                onDelete={onDelete}
                                onEditChange={setEditingText}
                                onEditBlur={handleEdit}
                                onEditKeyDown={(e) => {
                                    if (e.key === "Enter") e.target.blur();
                                    else if (e.key === "Escape") setEditingId(null);
                                }}
                            />
                        );
                    })
                )}
            </ul>
        </Wrapper>
    );
}

export default TodoList;
