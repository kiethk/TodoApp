import { useState } from "react";
import { Link } from "react-router-dom";
import classNames from "classnames/bind";

import Wrapper from "../Wrapper/Wrapper";
import styles from "./TodoTrash.module.scss";
import Search from "../Search/Search";

const cx = classNames.bind(styles);

function TodoTrash({ todos, onRestore, onPermanentDelete }) {
    const [appliedSearchTerm, setAppliedSearchTerm] = useState("");

    const handleSearch = (text) => {
        setAppliedSearchTerm(text);
    };

    const filteredTodos = todos.filter((todo) => todo.title.toLowerCase().includes(appliedSearchTerm.toLowerCase()));

    return (
        <Wrapper>
            <h1>Todo Trash</h1>
            <Link to="/">
                <button>Your tasks</button>
            </Link>
            <Search onSubmit={handleSearch} />
            <ul className={cx("todo-trash")}>
                {filteredTodos.map((todo) => (
                    <li key={todo._id}>
                        {todo.title}
                        <button onClick={() => onRestore(todo._id)}>Restore</button>
                        <button onClick={() => onPermanentDelete(todo._id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </Wrapper>
    );
}

export default TodoTrash;
