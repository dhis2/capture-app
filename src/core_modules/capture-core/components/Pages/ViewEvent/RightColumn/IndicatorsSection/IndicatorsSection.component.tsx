import * as React from 'react';
import i18n from '@dhis2/d2-i18n';
import { IconVisualizationColumn24 } from '@dhis2/ui';
import { withStyles, type WithStyles } from '@material-ui/core/styles';
import type { Theme } from '@material-ui/core/styles';
import { ViewEventSection } from '../../Section/ViewEventSection.component';
import { ViewEventSectionHeader } from '../../Section/ViewEventSectionHeader.component';
import type { PlainProps } from './IndicatorsSection.types';

const getStyles = (theme: Theme) => ({
    badge: {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
    },
    indicator: {
        padding: theme.typography.pxToRem(8),
        marginBottom: theme.typography.pxToRem(4),
        backgroundColor: theme.palette.grey[100],
        borderRadius: theme.typography.pxToRem(4),
    },
});

type Props = PlainProps & WithStyles<typeof getStyles>;

const IndicatorsSectionPlain = ({ classes, indicators }: Props) => {
    const headerText = i18n.t('Indicators');
    const count = indicators ? indicators.length : 0;

    const renderHeader = () => (
        <ViewEventSectionHeader
            icon={IconVisualizationColumn24}
            text={headerText}
            badgeClass={classes.badge}
            badgeCount={count}
        />
    );

    const renderIndicators = () => indicators?.map((indicator, index) => (
        <div key={indicator.id || `indicator-${index}`} className={classes.indicator}>
            {indicator.displayName}: {indicator.value}
        </div>
    ));

    return count > 0 && (
        <ViewEventSection
            collapsable
            header={renderHeader()}
        >
            {renderIndicators()}
        </ViewEventSection>
    );
};

export const IndicatorsSectionComponent = withStyles(getStyles)(IndicatorsSectionPlain);
