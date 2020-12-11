// @flow

import * as React from 'react';
import classNames from 'classnames';
import i18n from '@dhis2/d2-i18n';
import { Adjust as AdjustIcon } from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';
import ViewEventSection from '../../Section/ViewEventSection.component';
import ViewEventSectionHeader from '../../Section/ViewEventSectionHeader.component';

type Props = {
    classes: Object,
    feedbacks: ?{ displayTexts: ?Array<string>, displayKeyValuePairs: ?Array<{ key: string, value: string }>},
}

const headerText = i18n.t('Feedbacks');

const getStyles = (theme: Theme) => ({
    badge: {
        backgroundColor: theme.palette.grey.light,
    },
    feedback: {
        marginTop: theme.typography.pxToRem(5),
        marginBottom: theme.typography.pxToRem(5),
        borderRadius: theme.typography.pxToRem(4),
        backgroundColor: theme.palette.grey.lighter,
        display: 'flex',
    },
    textFeedback: {
        padding: theme.typography.pxToRem(10),
    },
    keyValueFeedbackItem: {
        padding: theme.typography.pxToRem(10),
    },
    keyValueFeedback: {
        alignItems: 'center',
        justifyContent: 'space-between',
    },
});

class FeedbacksSection extends React.Component<Props> {
    renderHeader = (count: number) => {
        const {classes} = this.props;
        return (
            <ViewEventSectionHeader
                icon={AdjustIcon}
                text={headerText}
                badgeClass={classes.badge}
                badgeCount={count}
            />
        );
    }

    renderTextItems = (displayTexts: Array<any>, classes: Object) => displayTexts.map(displayText => (
        <div
            className={classNames(classes.feedback, classes.textFeedback)}
            key={displayText.id}
        >
            {displayText.message}
        </div>
    ))

    renderKeyValueItems = (keyValuePairs: Array<any>, classes: Object) => keyValuePairs.map(pair => (
        <div className={classNames(classes.feedback, classes.keyValueFeedback)} key={pair.id}>
            <div className={classes.keyValueFeedbackItem}>{pair.key}</div>
            <div className={classes.keyValueFeedbackItem}>{pair.value}</div>
        </div>
    ))

    getFeedbacks = () => this.props.feedbacks || {};

    render() {
        const {classes} = this.props;
        const feedbacks = this.getFeedbacks();
        const displayTexts = feedbacks.displayTexts || [];
        const displayKeyValuePairs = feedbacks.displayKeyValuePairs || [];
        const count = displayTexts.length + displayKeyValuePairs.length;
        return count > 0 ? (
            <ViewEventSection
                collapsable
                header={this.renderHeader(count)}
            >
                {this.renderTextItems(displayTexts, classes)}
                {this.renderKeyValueItems(displayKeyValuePairs, classes)}
            </ViewEventSection>
        ) : null;
    }
}

export default withStyles(getStyles)(FeedbacksSection);
