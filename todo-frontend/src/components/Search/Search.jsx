import { useState } from "react";
import classNames from "classnames/bind";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faSquareXmark } from "@fortawesome/free-solid-svg-icons";

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
                className={cx("search-input")}
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        onSubmit(searchTerm);
                    }
                }}
            />
            {searchTerm && (
                <button className={cx("clear-btn")} onClick={handleClearSearch}>
                    <FontAwesomeIcon icon={faSquareXmark} />
                </button>
            )}
            <button className={cx("search-button")} onClick={() => onSubmit(searchTerm)}>
                <FontAwesomeIcon icon={faMagnifyingGlass} />
            </button>
        </div>
    );
}

export default Search;
