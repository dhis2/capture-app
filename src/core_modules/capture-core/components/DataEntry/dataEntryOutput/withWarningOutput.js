// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import Warning from '@material-ui/icons/Warning';
import { withStyles } from '@material-ui/core/styles';
import i18n from '@dhis2/d2-i18n';
import getDataEntryKey from '../common/getDataEntryKey';
import withDataEntryOutput from './withDataEntryOutput';


type Props = {
    warningItems: ?Array<any>,
    warningOnCompleteItems: ?Array<any>,
    saveAttempted: boolean,
    classes: {
        list: string,
        listItem: string,
        card: string,
        header: string,
        headerText: string,
    },
};

const styles = theme => ({
    list: {
        margin: 0,
    },
    listItem: {
        paddingLeft: theme.typography.pxToRem(10),
        marginTop: theme.typography.pxToRem(8),
    },
    header: {
        display: 'flex',
        alignItems: 'center',
    },
    headerText: {
        marginLeft: theme.typography.pxToRem(10),
    },
    card: {
        borderRadius: theme.typography.pxToRem(5),
        padding: theme.typography.pxToRem(10),
        backgroundColor: theme.palette.warning[100],
    },

});

const getWarningOutput = () =>
    class WarningOutputBuilder extends React.Component<Props> {
        static renderWarningItems = (warningItems: any, classes: any) =>
            (<div>
                {warningItems &&
                    warningItems.map(item => (
                        <li
                            key={item.id}
                            className={classes.listItem}
                        >
                            <Typography variant="body1">
                                {item.message}
                            </Typography>
                        </li>
                    ),
                    )}
            </div>)

        getVisibleWarningItems() {
            const { warningItems, warningOnCompleteItems, saveAttempted } = this.props;
            if (saveAttempted) {
                const warningItemsNoNull = warningItems || [];
                const warningOnCompleteItemsNoNull = warningOnCompleteItems || [];
                return [
                    ...warningItemsNoNull,
                    ...warningOnCompleteItemsNoNull,
                ];
            }

            return warningItems || [];
        }

        render = () => {
            const { classes } = this.props;
            const visibleItems = this.getVisibleWarningItems();
            return (
                <div>
                    {visibleItems && visibleItems.length > 0 &&
                    <Card className={classes.card}>
                        <div className={classes.header}>
                            <Warning />
                            <div className={classes.headerText}>
                                {i18n.t('Warnings')}
                            </div>
                        </div>
                        <ul className={classes.list}>
                            {WarningOutputBuilder.renderWarningItems(visibleItems, classes)}
                        </ul>
                    </Card>
                    }
                </div>

            );
        }
    };


const mapStateToProps = (state: ReduxState, props: any) => {
    const {itemId} = state.dataEntries[props.id];
    const key = getDataEntryKey(props.id, itemId);
    return {
        warningItems: state.rulesEffectsGeneralWarnings[key] ?
            state.rulesEffectsGeneralWarnings[key].warning : null,
        warningOnCompleteItems: state.rulesEffectsGeneralWarnings[key] ?
            state.rulesEffectsGeneralWarnings[key].warningOnComplete : null,
    };
};

const mapDispatchToProps = () => ({});

export default () =>
    (InnerComponent: React.ComponentType<any>) =>
        withDataEntryOutput()(
            InnerComponent,
            withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(getWarningOutput())));
