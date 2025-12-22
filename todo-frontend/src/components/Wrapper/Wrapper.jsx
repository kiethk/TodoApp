import classNames from "classnames/bind";

import styles from "./Wrapper.module.scss";
import ThemeButton from "../ThemeButton";

const cx = classNames.bind(styles);

function Wrapper({ children, className }) {
    return (
        <div className={cx("wrapper", className)}>
            <ThemeButton />
            {children}
        </div>
    );
}

export default Wrapper;
