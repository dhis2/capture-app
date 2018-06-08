// @flow
/**
 * @namespace MainPage
 */
import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';
import LoadingMask from '../../LoadingMasks/LoadingMask.component';

const styles = () => ({
    loaderContainer: {
        display: 'flex',
        justifyContent: 'center',
    },
});

type Props = {
    isLoading: boolean,
    selectionsError: ?string,
    classes: {
        loaderContainer: string,
    }
};

const getLoadHandler = (InnerComponent: React.ComponentType<any>) =>
    class MainPageInputHandler extends React.Component<Props> {
        render() {
            const { isLoading, selectionsError, classes, ...passOnProps } = this.props;

            if (isLoading) {
                return (
                    <div
                        className={classes.loaderContainer}
                    >
                        <LoadingMask />
                    </div>
                );
            }
            if (selectionsError) {
                return (
                    <div>
                        { selectionsError }
                    </div>
                );
            }

            return (
                <InnerComponent
                    {...passOnProps}
                />
            );
        }
    };

/**
 * HOC for MainPage component. Handling load status and load errors
 * @alias withLoadHandling
 * @memberof MainPage
 */

export default () => (InnerComponent: React.ComponentType<any>) =>
    withStyles(styles)(getLoadHandler(InnerComponent));
