// @flow
/**
 * @namespace Pagination
 */
import * as React from 'react';
import { withStyles } from '@material-ui/core';

import IconButton from '@material-ui/core/IconButton';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';

const styles = (theme: Theme) => ({
    root: {
        flexShrink: 0,
        color: theme.palette.text.secondary,
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

/**
 * Add navigation elements to the inner component
 * @returns React Component
 * @alias withDefaultNavigation
 * @memberof Pagination
 * @example withDefaultNavigation()([InnerComponent])
*/
export default () =>
    (InnerComponent: React.ComponentType<any>) =>
        withStyles(styles, { withTheme: true })(getNavigation(InnerComponent));
