import { useState } from "react";
import classNames from "classnames/bind";

import styles from "./Search.module.scss";

const cx = classNames.bind(styles);

function Search({ onSubmit }) {
    const [searchTerm, setSearchTerm] = useState("");

    const handleClearSearch = () => {
        setSearchTerm("");
        onSubmit("");
    };

    return (
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
            <button onClick={() => onSubmit(searchTerm)}>Search</button>
        </div>
    );
}

export default Search;
