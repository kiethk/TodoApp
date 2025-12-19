import { useState } from "react";
import classNames from "classnames/bind";

import styles from "./BulkActions.module.scss";

const cx = classNames.bind(styles);

function BulkActions({ children, selectedIds, handleSelectAll, filteredTodos }) {
    return (
        <div className={cx("bulk-actions-box")}>
            <input
                type="checkbox"
                checked={selectedIds.length === filteredTodos.length && selectedIds.length > 0}
                onChange={(e) => handleSelectAll(e)}
            />
            {selectedIds.length > 0 && children}
        </div>
    );
}

export default BulkActions;
