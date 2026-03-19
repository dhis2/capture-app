export type Props = {
    rowCountPage: number;
    rowsPerPage: number;
    onChangePage: (pageNumber: number) => void;
    onChangeRowsPerPage: (rowsPerPage: number) => void;
};
