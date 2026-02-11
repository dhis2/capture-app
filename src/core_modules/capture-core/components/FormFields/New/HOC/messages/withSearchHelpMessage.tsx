import * as React from 'react';
import { colors, spacers } from '@dhis2/ui';
import { withStyles, WithStyles } from 'capture-core-utils/styles';
import { searchOperatorHelpTexts } from '../../../../../constants';

const styles = () => ({
    help: {
        marginTop: spacers.dp4,
        marginInline: 0,
        marginBottom: 0,
        fontSize: 12,
        lineHeight: '14px',
        color: colors.grey700,
    },
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
