// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import Warning from '@material-ui/icons/Warning';
import { withStyles } from '@material-ui/core/styles';
import i18n from '@dhis2/d2-i18n';
import getDataEntryKey from '../common/getDataEntryKey';
import withInfoWidget from './withInfoWidget';


type Props = {
    warningItems: Array<any>,
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

const getWarningWidget = () =>
    class WarningWidgetBuilder extends React.Component<Props> {
        renderWarningItems = (warningItems: any, classes: any) =>
            (<div>
                {warningItems &&
                    warningItems.map(item => (
                        <li
                            key={item}
                            className={classes.listItem}
                        >
                            <Typography variant="body1">
                                {item}
                            </Typography>
                        </li>
                    ),
                    )}
            </div>)

        render = () => {
            const { warningItems, classes } = this.props;
            return (
                <div>
                    {warningItems &&
                    <Card className={classes.card}>
                        <div className={classes.header}>
                            <Warning />
                            <div className={classes.headerText}>
                                {i18n.t('Warnings')}
                            </div>
                        </div>
                        <ul className={classes.list}>
                            {warningItems && this.renderWarningItems(warningItems, classes)}
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
        warningItems: state.rulesEffectsGeneralWarnings && state.rulesEffectsGeneralWarnings[key] ?
            state.rulesEffectsGeneralWarnings[key] : null,
    };
};

const mapDispatchToProps = () => ({});

export default () =>
    (InnerComponent: React.ComponentType<any>) =>
        // $FlowSuppress
        withInfoWidget()(
            InnerComponent,
            withStyles(styles)(connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(getWarningWidget())));
