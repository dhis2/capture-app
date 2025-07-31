import * as React from 'react';
import i18n from '@dhis2/d2-i18n';
import { IconWarningFilled24 } from '@dhis2/ui';
import { withStyles, type WithStyles } from '@material-ui/core/styles';
import type { Theme } from '@material-ui/core/styles';
import { ViewEventSection } from '../../Section/ViewEventSection.component';
import { ViewEventSectionHeader } from '../../Section/ViewEventSectionHeader.component';
import { MessageSection } from '../ErrorsSection/MessageSection.component';
import type { PlainProps } from './WarningsSection.types';

const getStyles = (theme: Theme) => ({
    badge: {
        backgroundColor: theme.palette.grey[700],
        color: theme.palette.common.white,
    },
});

type Props = PlainProps & WithStyles<typeof getStyles>;

const WarningsSectionPlain = ({ classes, warnings }: Props) => {
    const headerText = i18n.t('Warnings');
    const count = warnings ? warnings.length : 0;

    const renderHeader = () => (
        <ViewEventSectionHeader
            icon={IconWarningFilled24}
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
            <MessageSection messages={warnings} />
        </ViewEventSection>
    );
};

export const WarningsSectionComponent = withStyles(getStyles)(WarningsSectionPlain);
