// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import Error from '@material-ui/icons/Error';
import { withStyles } from '@material-ui/core/styles';
import i18n from '@dhis2/d2-i18n';
import getDataEntryKey from '../common/getDataEntryKey';
import withDataEntryOutput from './withDataEntryOutput';


type Props = {
    errorItems: ?Array<any>,
    errorOnCompleteItems: ?Array<any>,
    saveAttempted: boolean,
    classes: {
        list: string,
        listItem: string,
        card: string,
        header: string,
        headerText: string,
    },
};

const styles = (theme: Theme) => ({
    card: {
        padding: theme.typography.pxToRem(10),
        backgroundColor: theme.palette.error[100],
        borderRadius: theme.typography.pxToRem(5),
    },
    list: {
        margin: 0,
    },
    listItem: {
        paddingLeft: theme.typography.pxToRem(10),
        marginTop: theme.typography.pxToRem(8),
    },
    header: {
        color: '#902c02',
        display: 'flex',
        alignItems: 'center',
    },
    headerText: {
        marginLeft: theme.typography.pxToRem(10),
    },
});

const getErrorOutput = () =>
    class ErrorOutputBuilder extends React.Component<Props> {
        static renderErrorItems = (errorItems: any, classes: any) =>
            (<div>
                {errorItems
                    .map(item => (
                        <li
                            key={item.id}
                            className={classes.listItem}
                        >
                            <Typography variant="body1">
                                {item.message}
                            </Typography>
                        </li>
                    ))
                }
            </div>)

        name: string;
        constructor(props) {
            super(props);
            this.name = 'ErrorOutputBuilder';
        }

        getVisibleErrorItems() {
            const { errorItems, errorOnCompleteItems, saveAttempted } = this.props;
            if (saveAttempted) {
                const errorItemsNoNull = errorItems || [];
                const errorOnCompleteItemsNoNull = errorOnCompleteItems || [];
                return [
                    ...errorItemsNoNull,
                    ...errorOnCompleteItemsNoNull,
                ];
            }

            return errorItems || [];
        }

        render = () => {
            const { classes } = this.props;
            const visibleItems = this.getVisibleErrorItems();
            return (
                <div>
                    {visibleItems && visibleItems.length > 0 &&
                    <Card className={classes.card}>
                        <div className={classes.header}>
                            <Error />
                            <div className={classes.headerText}>
                                {i18n.t('Errors')}
                            </div>
                        </div>
                        <ul className={classes.list}>
                            {ErrorOutputBuilder.renderErrorItems(visibleItems, classes)}
                        </ul>

                    </Card>
                    }
                </div>

            );
        }
    };


const mapStateToProps = (state: ReduxState, props: any) => {
    const itemId = state.dataEntries[props.id].itemId;
    const key = getDataEntryKey(props.id, itemId);
    return {
        errorItems: state.rulesEffectsGeneralErrors[key] ?
            state.rulesEffectsGeneralErrors[key].error : null,
        errorOnCompleteItems: state.rulesEffectsGeneralErrors[key] ?
            state.rulesEffectsGeneralErrors[key].errorOnComplete : null,
    };
};

const mapDispatchToProps = () => ({});

export default () =>
    (InnerComponent: React.ComponentType<any>) =>
        withDataEntryOutput()(
            InnerComponent,
            withStyles(styles)(
                connect(mapStateToProps, mapDispatchToProps)(getErrorOutput())));
