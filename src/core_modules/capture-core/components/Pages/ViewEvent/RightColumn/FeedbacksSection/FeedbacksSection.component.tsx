import * as React from 'react';
import classNames from 'classnames';
import i18n from '@dhis2/d2-i18n';
import { IconInfo24 } from '@dhis2/ui';
import { withStyles, type WithStyles } from '@material-ui/core/styles';
import { ViewEventSection } from '../../Section/ViewEventSection.component';
import { ViewEventSectionHeader } from '../../Section/ViewEventSectionHeader.component';
import type { PlainProps } from './FeedbacksSection.types';

type Props = PlainProps & WithStyles<typeof getStyles>;

const headerText = i18n.t('Feedback');

const getStyles = (theme: any) => ({
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

class FeedbacksSectionPlain extends React.Component<Props> {
    getFeedbacks = () => this.props.feedbacks || {};

    renderHeader = (count: number) => {
        const classes = this.props.classes;
        return (
            <ViewEventSectionHeader
                icon={IconInfo24}
                text={headerText}
                badgeClass={classes.badge}
                badgeCount={count}
            />
        );
    }

    renderTextItems = (displayTexts: Array<any>, classes: any) => displayTexts.map(displayText => (
        <div
            className={classNames(classes.feedback, classes.textFeedback)}
            key={displayText.id}
        >
            {displayText.message}
        </div>
    ))

    renderKeyValueItems = (keyValuePairs: Array<any>, classes: any) => keyValuePairs.map(pair => (
        <div className={classNames(classes.feedback, classes.keyValueFeedback)} key={pair.id}>
            <div className={classes.keyValueFeedbackItem}>{pair.key}</div>
            <div className={classes.keyValueFeedbackItem}>{pair.value}</div>
        </div>
    ))

    render() {
        const classes = this.props.classes;
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

export const FeedbacksSectionComponent = withStyles(getStyles)(FeedbacksSectionPlain);
