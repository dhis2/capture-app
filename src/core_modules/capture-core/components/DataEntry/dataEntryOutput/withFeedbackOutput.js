// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import Card from '@material-ui/core/Card';
import { Menu, MenuItem } from '@dhis2/ui';
import { withStyles } from '@material-ui/core/styles';
import i18n from '@dhis2/d2-i18n';
import { getDataEntryKey } from '../common/getDataEntryKey';
import { withDataEntryOutput } from './withDataEntryOutput';


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
        backgroundColor: '#f5f5f5 !important',
        paddingLeft: theme.typography.pxToRem(10),
        marginTop: theme.typography.pxToRem(8),
    },
    keyValuePairKey: {
        flexGrow: 1,
        margin: 0,
    },
    keyValue: {
        margin: 0,
        fontSize: '0.875rem',
    },
    card: {
        padding: theme.typography.pxToRem(10),
        borderRadius: theme.typography.pxToRem(5),
    },
    labelContainer: {
        display: 'flex',
    },
});

const getFeedbackOutput = () =>
    class FeedbackOutputBuilder extends React.Component<Props> {
        renderFeedbackItems = (feedbackItems: any, classes: any) =>
            (<div>
                {feedbackItems.displayTexts &&
                    feedbackItems.displayTexts.map(item => (
                        <MenuItem
                            dense
                            key={item.id}
                            className={classes.listItem}
                            button={false}
                            label={<p className={classes.keyValuePairKey}> {item.message} </p>}
                        />
                    ),
                    )}
                {feedbackItems.displayKeyValuePairs &&
                    feedbackItems.displayKeyValuePairs.map(item => (
                        <MenuItem
                            key={item.id}
                            button={false}
                            className={classes.listItem}
                            dense
                            label={
                                <div className={classes.labelContainer}>
                                    <p className={classes.keyValuePairKey}> {item.key} </p>
                                    <p className={classes.keyValue}> {item.value} </p>
                                </div>
                            }
                        />
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
                            <Menu dense>
                                {feedbackItems && this.renderFeedbackItems(feedbackItems, classes)}
                            </Menu>
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

export const withFeedbackOutput = () =>
    (InnerComponent: React.ComponentType<any>) =>

        withDataEntryOutput()(
            InnerComponent,
            withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(getFeedbackOutput())));
