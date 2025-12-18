import { useState, useEffect } from "react";

import classNames from "classnames/bind";
import styles from "./TodoList.module.scss";

const cx = classNames.bind(styles);

function TodoList() {
    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [editingText, setEditingText] = useState("");
    const [filter, setFilter] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [appliedSearchTerm, setAppliedSearchTerm] = useState("");

    useEffect(() => {
        const fetchTodos = async () => {
            fetch("http://localhost:3000/todos")
                .then((res) => res.json())
                .then((res) => setTodos(res));
        };

        fetchTodos();
    }, []);

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

        setTodos([...todos, createdTodo]);

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

        setTodos((prevTodos) => {
            return prevTodos.map((todo) => {
                if (todo._id === index) {
                    return updatedTodo;
                }
                return todo;
            });
        });
    };

    const handleDelete = async (index) => {
        const res = await fetch(`http://localhost:3000/todos/${index}`, {
            method: "DELETE",
        });

        if (res.ok) {
            const newTodos = todos.filter((todo) => todo._id !== index);
            setTodos(newTodos);
        } else {
            alert("Có lỗi xảy ra khi xóa công việc!");
        }
    };

    const handleEdit = async (index) => {
        if (!editingText.trim()) {
            alert("Please enter the name of your task.");
            return;
        }

        const res = await fetch(`http://localhost:3000/todos/${index}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ title: editingText }),
        });

        const updatedTodo = await res.json();

        setTodos((prevTodos) => {
            return prevTodos.map((todo) => {
                if (todo._id === editingId) {
                    return updatedTodo;
                }
                return todo;
            });
        });

        setEditingId(null);
        setEditingText("");
    };

    const handleEditClick = (index, title) => {
        setEditingId(index);
        setEditingText(title);
    };

    const handleFilterChange = (type) => {
        setFilter(type);
    };

    const handleSearch = () => {
        setAppliedSearchTerm(searchTerm);
    };

    const handleClearSearch = () => {
        setSearchTerm("");
        setAppliedSearchTerm("");
    };

    const filteredTodos = todos.filter((todo) => {
        const matchStatus =
            filter === "all" || (filter === "completed" && todo.completed) || (filter === "active" && !todo.completed);

        const matchSearch = todo.title.toLowerCase().includes(appliedSearchTerm.toLowerCase());

        return matchStatus && matchSearch;
    });

    return (
        <div className={cx("wrapper")}>
            <h1>Todo App</h1>
            <form onSubmit={(e) => handleSubmit(e)}>
                <input
                    type="text"
                    placeholder="Enter your tasks..."
                    value={newTodo}
                    onChange={(e) => handleChange(e)}
                />
                <button type="submit">Add</button>
            </form>
            <div className={cx("search-box")}>
                <input
                    type="text"
                    placeholder="Search tasks..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                    <button className={cx("clear-btn")} onClick={handleClearSearch}>
                        &times;
                    </button>
                )}
                <button onClick={handleSearch}>Search</button>
            </div>
            <div>
                <button onClick={() => handleFilterChange("all")}>All</button>
                <button onClick={() => handleFilterChange("active")}>Active</button>
                <button onClick={() => handleFilterChange("completed")}>Completed</button>
            </div>
            <ul>
                {filteredTodos.length === 0 ? (
                    <li className={cx("no-result")}>
                        {appliedSearchTerm ? `🔍 No results for "${appliedSearchTerm}"` : "📝 Add your task!"}
                    </li>
                ) : (
                    filteredTodos.map((todo) => {
                        const index = todo._id;
                        const isCompleted = todo.completed;
                        return (
                            <li key={index}>
                                <input
                                    type="checkbox"
                                    checked={isCompleted}
                                    onChange={() => handleToggleComplete(index, isCompleted)}
                                />
                                {editingId === index ? (
                                    <input
                                        className={cx("edit-input")}
                                        type="text"
                                        value={editingText}
                                        onChange={(e) => setEditingText(e.target.value)}
                                        onBlur={() => handleEdit(index)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                e.target.blur();
                                            } else if (e.key === "Escape") {
                                                setEditingId(null);
                                            }
                                        }}
                                        autoFocus
                                    />
                                ) : (
                                    <span className={cx({ completed: isCompleted })}>{todo.title}</span>
                                )}
                                <button onClick={() => handleEditClick(index, todo.title)}>Edit</button>
                                <button onClick={() => handleDelete(index)}>&times;</button>
                            </li>
                        );
                    })
                )}
            </ul>
        </div>
    );
}

export default TodoList;
