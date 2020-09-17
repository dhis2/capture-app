// @flow
/**
 * @namespace Pagination
 */
import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';

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

        renderNavigationElement() {
            const { rowsPerPage, currentPage, classes, theme } = this.props;

            return (
                <div
                    className={classes.root}
                >
                    <IconButton
                        data-test={'dhis2-capture-search-pagination-first-page'}
                        onClick={this.handleFirstPageButtonClick}
                        disabled={currentPage <= 1}
                        aria-label="First Page"
                    >
                        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
                    </IconButton>
                    <IconButton
                        data-test={'dhis2-capture-search-pagination-previous-page'}
                        onClick={this.handleBackButtonClick}
                        disabled={currentPage <= 1}
                        aria-label="Previous Page"
                    >
                        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
                    </IconButton>
                    <IconButton
                        data-test={'dhis2-capture-search-pagination-next-page'}
                        onClick={this.handleNextButtonClick}
                        aria-label="Next Page"
                    >
                        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
                    </IconButton>
                </div>
            );
        }

        render() {
            const { classes, theme, ...passOnProps } = this.props;
            return (
                // $FlowFixMe[cannot-spread-inexact] automated comment
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
