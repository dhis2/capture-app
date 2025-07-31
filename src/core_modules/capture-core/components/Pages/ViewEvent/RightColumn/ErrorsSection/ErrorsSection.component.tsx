import * as React from 'react';
import i18n from '@dhis2/d2-i18n';
import { IconErrorFilled24 } from '@dhis2/ui';
import { withStyles, type WithStyles } from '@material-ui/core/styles';
import type { Theme } from '@material-ui/core/styles';
import { ViewEventSection } from '../../Section/ViewEventSection.component';
import { ViewEventSectionHeader } from '../../Section/ViewEventSectionHeader.component';
import { MessageSection } from './MessageSection.component';
import type { PlainProps } from './ErrorsSection.types';

const getStyles = (theme: Theme) => ({
    badge: {
        backgroundColor: theme.palette.error.main,
        color: theme.palette.error.contrastText,
    },
});

type Props = PlainProps & WithStyles<typeof getStyles>;

const ErrorsSectionPlain = ({ classes, errors }: Props) => {
    const headerText = i18n.t('Errors');
    const count = errors ? errors.length : 0;

    const renderHeader = () => (
        <ViewEventSectionHeader
            icon={IconErrorFilled24}
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
            <MessageSection messages={errors} />
        </ViewEventSection>
    );
};

export const ErrorsSectionComponent = withStyles(getStyles)(ErrorsSectionPlain);
