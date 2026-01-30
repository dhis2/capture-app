import * as React from 'react';
import i18n from '@dhis2/d2-i18n';
import { colors, spacers } from '@dhis2/ui';
import { withStyles, WithStyles } from 'capture-core-utils/styles';
import { searchOperators } from '../../../../../metaDataMemoryStoreBuilders';

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

const helpTexts = {
    [searchOperators.EQ]: i18n.t('Exact matches only'),
    [searchOperators.SW]: i18n.t('Must match the start of the value'),
    [searchOperators.EW]: i18n.t('Must match the end of the value'),
};

const getSearchHelpMessageHOC = <P extends Record<string, any>>(InnerComponent: React.ComponentType<P>) =>
    class DisplayMessagesHOC extends React.Component<P & Props & WithStyles<typeof styles>> {
        render() {
            const { classes, searchOperator, ...passOnProps } = this.props;
            const helpText = searchOperator && helpTexts[searchOperator];

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
