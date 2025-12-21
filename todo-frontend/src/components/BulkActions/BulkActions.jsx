import classNames from "classnames/bind";

import styles from "./BulkActions.module.scss";

const cx = classNames.bind(styles);

function BulkActions({ children, selectedIds, handleSelectAll, filteredTodos }) {
    const isAllSelected = filteredTodos.length > 0 && selectedIds.length === filteredTodos.length;

    return (
        <div className={cx("bulk-actions-box")}>
            <label className={cx("select-label", { active: isAllSelected })}>
                <input
                    hidden
                    className={cx("checkbox")}
                    type="checkbox"
                    checked={selectedIds.length === filteredTodos.length && selectedIds.length > 0}
                    onChange={(e) => handleSelectAll(e)}
                />
                Select All
            </label>
            <span className={cx("select-number", { active: selectedIds.length > 0 })}>
                Selected: {selectedIds.length}
            </span>
            <span className={cx("bulk-actions", { active: selectedIds.length > 0 })}>{children}</span>
        </div>
    );
}

export default BulkActions;
