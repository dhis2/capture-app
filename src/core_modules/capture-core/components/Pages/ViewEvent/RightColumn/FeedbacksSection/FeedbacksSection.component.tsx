import * as React from 'react';
import i18n from '@dhis2/d2-i18n';
import { IconInfo24 } from '@dhis2/ui';
import { withStyles, type WithStyles } from '@material-ui/core/styles';
import type { Theme } from '@material-ui/core/styles';
import { ViewEventSection } from '../../Section/ViewEventSection.component';
import { ViewEventSectionHeader } from '../../Section/ViewEventSectionHeader.component';
import { MessageSection } from '../ErrorsSection/MessageSection.component';
import type { PlainProps } from './FeedbacksSection.types';

const getStyles = (theme: Theme) => ({
    badge: {
        backgroundColor: theme.palette.grey[300],
        color: theme.palette.common.black,
    },
});

type Props = PlainProps & WithStyles<typeof getStyles>;

const FeedbacksSectionPlain = ({ classes, feedbacks }: Props) => {
    const headerText = i18n.t('Feedback');
    const count = feedbacks ? feedbacks.length : 0;

    const renderHeader = () => (
        <ViewEventSectionHeader
            icon={IconInfo24}
            text={headerText}
            badgeClass={classes.badge}
            badgeCount={count}
        />
    );

    return count > 0 && (
        <ViewEventSection
            collapsable
            header={renderHeader()}
        >
            <MessageSection messages={feedbacks} />
        </ViewEventSection>
    );
};

export const FeedbacksSectionComponent = withStyles(getStyles)(FeedbacksSectionPlain);
