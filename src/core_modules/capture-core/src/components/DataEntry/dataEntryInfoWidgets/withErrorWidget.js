// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import Error from '@material-ui/icons/Error';
import { withStyles } from '@material-ui/core/styles';
import i18n from '@dhis2/d2-i18n';
import getDataEntryKey from '../common/getDataEntryKey';
import withInfoWidget from './withInfoWidget';


type Props = {
    errorItems: Array<any>,
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

const getErrorWidget = () =>
    class ErrorWidgetBuilder extends React.Component<Props> {
        renderErrorItems = (errorItems: any, classes: any) =>
            (<div>
                {errorItems &&
                    errorItems.map(item => (
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
            const { errorItems, classes } = this.props;
            return (
                <div>
                    {errorItems &&
                    <Card className={classes.card}>
                        <div className={classes.header}>
                            <Error />
                            <div className={classes.headerText}>
                                {i18n.t('Errors')}
                            </div>
                        </div>
                        <ul className={classes.list}>
                            {this.renderErrorItems(errorItems, classes)}
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
        errorItems: state.rulesEffectsGeneralErrors && state.rulesEffectsGeneralErrors[key] ?
            state.rulesEffectsGeneralErrors[key] : null,
    };
};

const mapDispatchToProps = () => ({});

export default () =>
    (InnerComponent: React.ComponentType<any>) =>
        // $FlowSuppress
        withInfoWidget()(
            InnerComponent,
            withStyles(styles)(connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(getErrorWidget())));
