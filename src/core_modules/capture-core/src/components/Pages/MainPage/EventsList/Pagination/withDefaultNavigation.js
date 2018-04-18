// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui-next/styles';

import IconButton from 'material-ui-next/IconButton';
import FirstPageIcon from 'material-ui-icons/FirstPage';
import KeyboardArrowLeft from 'material-ui-icons/KeyboardArrowLeft';
import KeyboardArrowRight from 'material-ui-icons/KeyboardArrowRight';
import LastPageIcon from 'material-ui-icons/LastPage';

import { changePage } from './actions/pagination.actions';

const styles = (theme: Theme) => ({
    root: {
        flexShrink: 0,
        color: theme.palette.text.secondary,
        marginLeft: theme.spacing.unit * 2.5,
    },
});

type Props = {
    rowsPerPage: number,
    currentPage: number,
    rowsCount: number,
    onChangePage: (pageNumber: number) => void,
    classes: {
        root: string,
    },
    theme: Theme,
};

const getNavigation = (InnerComponent: React.ComponentType<any>) =>
    class PaginationNavigation extends React.Component<Props> {
        handleFirstPageButtonClick = () => {
            this.props.onChangePage(1);
        };

        handleBackButtonClick = () => {
            this.props.onChangePage(this.props.currentPage - 1);
        };

        handleNextButtonClick = () => {
            this.props.onChangePage(this.props.currentPage + 1);
        };

        handleLastPageButtonClick = () => {
            this.props.onChangePage(
                Math.max(1, Math.ceil(this.props.rowsCount / this.props.rowsPerPage)));
        };

        renderNavigationElement() {
            const { rowsPerPage, currentPage, rowsCount, classes, theme } = this.props;

            return (
                <div
                    className={classes.root}
                >
                    <IconButton
                        onClick={this.handleFirstPageButtonClick}
                        disabled={currentPage <= 1}
                        aria-label="First Page"
                    >
                        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
                    </IconButton>
                    <IconButton
                        onClick={this.handleBackButtonClick}
                        disabled={currentPage <= 1}
                        aria-label="Previous Page"
                    >
                        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
                    </IconButton>
                    <IconButton
                        onClick={this.handleNextButtonClick}
                        disabled={currentPage >= Math.ceil(rowsCount / rowsPerPage)}
                        aria-label="Next Page"
                    >
                        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
                    </IconButton>
                    <IconButton
                        onClick={this.handleLastPageButtonClick}
                        disabled={currentPage >= Math.ceil(rowsCount / rowsPerPage)}
                        aria-label="Last Page"
                    >
                        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
                    </IconButton>
                </div>
            );
        }

        render() {
            const { classes, theme, ...passOnProps } = this.props;
            return (
                <InnerComponent
                    navigationElements={this.renderNavigationElement()}
                    {...passOnProps}
                />
            );
        }
    };

const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
    onChangePage: (page: number) => {
        dispatch(changePage(page));
    },
});

export default () =>
    (InnerComponent: React.ComponentType<any>) =>
        // $FlowSuppress
        connect(null, mapDispatchToProps)(withStyles(styles, { withTheme: true })(getNavigation(InnerComponent)));
