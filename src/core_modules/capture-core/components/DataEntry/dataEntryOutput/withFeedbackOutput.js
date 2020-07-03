// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import Card from '@material-ui/core/Card';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import i18n from '@dhis2/d2-i18n';
import getDataEntryKey from '../common/getDataEntryKey';
import withDataEntryOutput from './withDataEntryOutput';


type Props = {
    feedbackItems: {
        displayTexts: [{ key: string, value: string}],
        displayKeyValuePairs: [{ key: string, value: string}],
    },
    classes: {
        listItem: string,
        card: string,
        keyValuePairKey: string,
    },
};

const styles = (theme: Theme) => ({
    listItem: {
        display: 'flex',
        backgroundColor: theme.palette.grey[100],
        paddingLeft: theme.typography.pxToRem(10),
        marginTop: theme.typography.pxToRem(8),
    },
    keyValuePairKey: {
        flexGrow: 1,
    },
    card: {
        padding: theme.typography.pxToRem(10),
        borderRadius: theme.typography.pxToRem(5),
    },

});

const getFeedbackOutput = () =>
    class FeedbackOutputBuilder extends React.Component<Props> {
        renderFeedbackItems = (feedbackItems: any, classes: any) =>
            (<div>
                {feedbackItems.displayTexts &&
                    feedbackItems.displayTexts.map(item => (
                        <ListItem
                            key={item.id}
                            className={classes.listItem}
                            button={false}
                        >
                            <Typography variant="body1">
                                {item.message}
                            </Typography>
                        </ListItem>
                    ),
                    )}
                {feedbackItems.displayKeyValuePairs &&
                    feedbackItems.displayKeyValuePairs.map(item => (
                        <ListItem
                            key={item.id}
                            className={classes.listItem}
                            button={false}
                        >
                            <Typography variant="body1" className={classes.keyValuePairKey}>
                                {item.key}
                            </Typography>
                            <Typography variant="body2">
                                {item.value}
                            </Typography>

                        </ListItem>
                    ),
                    )}
            </div>)

        render = () => {
            const { feedbackItems, classes } = this.props;
            const hasItems = feedbackItems && (feedbackItems.displayTexts || feedbackItems.displayKeyValuePairs);
            return (
                <div>
                    {hasItems &&
                        <Card className={classes.card}>
                            {i18n.t('Feedback')}
                            <List dense>
                                {feedbackItems && this.renderFeedbackItems(feedbackItems, classes)}
                            </List>
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
        feedbackItems: state.rulesEffectsFeedback && state.rulesEffectsFeedback[key] ?
            state.rulesEffectsFeedback[key] : null,
    };
};

const mapDispatchToProps = () => ({});

export default () =>
    (InnerComponent: React.ComponentType<any>) =>
       
        withDataEntryOutput()(
            InnerComponent,
            withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(getFeedbackOutput())));
