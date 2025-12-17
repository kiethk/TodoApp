import { useState, useEffect } from "react";

function TodoList() {
    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState("");

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

    return (
        <div>
            <h1>Todo App</h1>
            <form onSubmit={(e) => handleSubmit(e)}>
                <input type="text" value={newTodo} onChange={(e) => handleChange(e)} />
                <button type="submit">Add</button>
            </form>
            <ul>
                {todos.map((todo) => {
                    const index = todo._id;
                    const isCompleted = todo.completed;
                    return (
                        <li key={index}>
                            <input
                                type="checkbox"
                                checked={isCompleted}
                                onChange={() => handleToggleComplete(index, isCompleted)}
                            />
                            {todo.title}
                            <button onClick={() => handleDelete(index)}>&times;</button>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

export default TodoList;
