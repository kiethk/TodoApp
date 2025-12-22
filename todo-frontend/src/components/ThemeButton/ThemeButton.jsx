import classNames from "classnames/bind";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";

import styles from "./ThemeButton.module.scss";

const cx = classNames.bind(styles);

function ThemeButton() {
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem("theme") || "light";
    });

    const isDark = theme === "dark";

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
    };

    return (
        <button className={cx("theme-toggle", { dark: isDark })} onClick={toggleTheme}>
            <span className={cx("toggle", { dark: isDark })}>
                {isDark ? (
                    <FontAwesomeIcon className={cx("moon")} icon={faMoon} title="Switch to Dark Mode" />
                ) : (
                    <FontAwesomeIcon className={cx("sun")} icon={faSun} title="Switch to Light Mode" />
                )}
            </span>
        </button>
    );
}

export default ThemeButton;
