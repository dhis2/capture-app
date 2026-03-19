import { useCallback, useMemo, useState } from 'react';

type Props = {
    recordIds?: Array<string>;
};

export const useSelectedRowsController = ({ recordIds }: Props) => {
    const [selectedRows, setSelectedRows] = useState<Record<string, boolean>>({});

    const allRowsAreSelected: boolean = useMemo(
        () => Boolean(recordIds && recordIds.length > 0 && recordIds.every(rowId => selectedRows[rowId])),
        [recordIds, selectedRows]);

    const toggleRowSelected = useCallback((rowId: string) => {
        setSelectedRows((prevSelectedRows) => {
            const newSelectedRows = { ...prevSelectedRows };
            if (newSelectedRows[rowId]) {
                delete newSelectedRows[rowId];
            } else {
                newSelectedRows[rowId] = true;
            }
            return newSelectedRows;
        });
    }, []);

    const selectAllRows = useCallback((rows: Array<string>) => {
        if (allRowsAreSelected) {
            setSelectedRows({});
            return;
        }

        setSelectedRows(rows.reduce((acc, rowId) => {
            acc[rowId] = true;
            return acc;
        }, {} as Record<string, boolean>));
    }, [allRowsAreSelected]);

    const clearSelection = useCallback(() => {
        setSelectedRows({});
    }, []);

    const selectionInProgress = useMemo(
        () => Object.keys(selectedRows).length > 0,
        [selectedRows]);

    const removeRowsFromSelection = useCallback((rows: Array<string>) => {
        setSelectedRows((prevSelectedRows) => {
            const newSelectedRows = { ...prevSelectedRows };
            rows.forEach((rowId) => {
                delete newSelectedRows[rowId];
            });
            return newSelectedRows;
        });
    }, []);

    return {
        selectedRows,
        toggleRowSelected,
        allRowsAreSelected,
        selectAllRows,
        selectionInProgress,
        clearSelection,
        removeRowsFromSelection,
    };
};
