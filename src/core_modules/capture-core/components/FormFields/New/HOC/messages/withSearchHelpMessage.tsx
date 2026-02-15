import * as React from 'react';
import { withStyles, WithStyles } from 'capture-core-utils/styles';
import { searchOperatorHelpTexts, helpTextStyle } from '../../../../../constants';

const styles = () => ({
    help: helpTextStyle,
});

type Props = {
    searchOperator?: string;
};

const getSearchHelpMessageHOC = <P extends Record<string, any>>(InnerComponent: React.ComponentType<P>) =>
    class DisplayMessagesHOC extends React.Component<P & Props & WithStyles<typeof styles>> {
        render() {
            const { classes, searchOperator, ...passOnProps } = this.props;
            const helpText = searchOperator && searchOperatorHelpTexts[searchOperator];

            return (
                <>
                    <InnerComponent {...passOnProps as unknown as P} />
                    {helpText && <div className={classes.help}>
                        {helpText} <br />
                    </div>
                    }
                </>
            );
        }
    };

export const withSearchHelpMessage = () => <P extends Record<string, any>>(InnerComponent: React.ComponentType<P>) =>
    withStyles(styles)(getSearchHelpMessageHOC(InnerComponent) as any);
