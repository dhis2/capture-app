// @flow
/**
 * @namespace Pagination
 */
import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { IconButton } from 'capture-ui';
import { IconChevronLeft24, IconChevronRight24 } from '@dhis2/ui';

const styles = (theme: Theme) => ({
    root: {
        flexShrink: 0,
        display: 'flex',
        color: theme.palette.text.secondary,
    },
});

const FirstPageIcon = () => (
    <svg
        className="MuiSvgIcon-root-1474"
        focusable="false"
        viewBox="0 0 24 24"
        aria-hidden="true"
        role="presentation"
        width="24"
        height="24"
        fill="currentColor"
    >
        <path
            d="M18.41 16.59L13.82 12l4.59-4.59L17 6l-6 6 6 6zM6 6h2v12H6z"
            fill="currentColor"
        />
        <path fill="none" d="M24 24H0V0h24v24z" />
    </svg>
);

const LastPageIcon = () => (
    <svg
        className="MuiSvgIcon-root-280"
        focusable="false"
        viewBox="0 0 24 24"
        aria-hidden="true"
        role="presentation"
        width="24"
        height="24"
        fill="currentColor"
    >
        <path d="M5.59 7.41L10.18 12l-4.59 4.59L7 18l6-6-6-6zM16 6h2v12h-2z" />
        <path fill="none" d="M0 0h24v24H0V0z" />
    </svg>
);

type Props = {
    nextPageButtonDisabled: boolean,
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
            const { currentPage, classes, theme, nextPageButtonDisabled } = this.props;

            return (
                <div
                    className={classes.root}
                >
                    <IconButton
                        dataTest={'search-pagination-first-page'}
                        onClick={this.handleFirstPageButtonClick}
                        disabled={currentPage <= 1}
                        aria-label="First Page"
                    >
                        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
                    </IconButton>
                    <IconButton
                        dataTest={'search-pagination-previous-page'}
                        onClick={this.handleBackButtonClick}
                        disabled={currentPage <= 1}
                        aria-label="Previous Page"
                    >
                        {theme.direction === 'rtl' ? <IconChevronRight24 /> : <IconChevronLeft24 />}
                    </IconButton>
                    <IconButton
                        dataTest={'search-pagination-next-page'}
                        onClick={this.handleNextButtonClick}
                        disabled={nextPageButtonDisabled}
                        aria-label="Next Page"
                    >
                        {theme.direction === 'rtl' ? <IconChevronLeft24 /> : <IconChevronRight24 />}
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
export const withNavigation = () =>
    (InnerComponent: React.ComponentType<any>) =>
        withStyles(styles, { withTheme: true })(getNavigation(InnerComponent));
