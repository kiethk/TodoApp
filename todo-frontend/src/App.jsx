import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import "animate.css";

import GlobalStyles from "./components/GlobalStyles";
import TodoList from "./components/TodoList";
import TodoTrash from "./components/TodoTrash";


function App() {
    const [todos, setTodos] = useState([]);
    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const fetchTodos = async () => {
            fetch(`${API_URL}/todos`)
                .then((res) => res.json())
                .then((res) => setTodos(res));
        };

        fetchTodos();
    }, []);

    const handleMoveToTrash = async (id) => {
        const res = await fetch(`${API_URL}/todos/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ isDeleted: true }),
        });

        if (res.ok) {
            setTodos((prev) => prev.map((todo) => (todo._id !== id ? todo : { ...todo, isDeleted: true })));
        }
    };

    const handleRestore = async (id) => {
        const res = await fetch(`${API_URL}/todos/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ isDeleted: false }),
        });

        if (res.ok) {
            setTodos((prev) => prev.map((todo) => (todo._id !== id ? todo : { ...todo, isDeleted: false })));
        }
    };

    const handlePermanentDelete = async (id) => {
        const res = await fetch(`${API_URL}/todos/${id}`, {
            method: "DELETE",
        });

        if (res.ok) {
            setTodos((prev) => prev.filter((todo) => todo._id !== id));
        } else {
            alert("Có lỗi xảy ra khi xóa công việc!");
        }
    };

    const activeTodos = todos.filter((t) => !t.isDeleted);
    const trashTodos = todos.filter((t) => t.isDeleted);

    return (
        <GlobalStyles>
            <Routes>
                <Route
                    path="/"
                    element={<TodoList todos={activeTodos} onSetTodos={setTodos} onDelete={handleMoveToTrash} />}
                />
                <Route
                    path="/trash"
                    element={
                        <TodoTrash
                            todos={trashTodos}
                            onSetTodos={setTodos}
                            onRestore={handleRestore}
                            onPermanentDelete={handlePermanentDelete}
                        />
                    }
                />
            </Routes>
        </GlobalStyles>
    );
}

export default App;
