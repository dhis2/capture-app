import * as React from 'react';
import classNames from 'classnames';
import i18n from '@dhis2/d2-i18n';
import { IconInfoFilled24 } from '@dhis2/ui';
import { withStyles, type WithStyles, type Theme } from '@material-ui/core/styles';
import { ViewEventSection } from '../../Section/ViewEventSection.component';
import { ViewEventSectionHeader } from '../../Section/ViewEventSectionHeader.component';
import type { PlainProps } from './IndicatorsSection.types';

type Props = PlainProps & WithStyles<typeof getStyles>;

const headerText = i18n.t('Indicators');

const getStyles = (theme: Theme) => ({
    badge: {
        backgroundColor: theme.palette.grey[300],
    },
    indicator: {
        marginTop: theme.typography.pxToRem(5),
        marginBottom: theme.typography.pxToRem(5),
        borderRadius: theme.typography.pxToRem(4),
        backgroundColor: theme.palette.grey[100],
        display: 'flex',
    },
    textIndicator: {
        padding: theme.typography.pxToRem(10),
    },
    keyValueIndicatorItem: {
        padding: theme.typography.pxToRem(10),
    },
    keyValueIndicator: {
        alignItems: 'center',
        justifyContent: 'space-between',
    },
});

class IndicatorsSectionPlain extends React.Component<Props> {
    getIndicators = () => this.props.indicators || {};

    renderHeader = (count: number) => {
        const classes = this.props.classes;
        return (
            <ViewEventSectionHeader
                icon={IconInfoFilled24}
                text={headerText}
                badgeClass={classes.badge}
                badgeCount={count}
            />
        );
    }

    renderTextItems = (displayTexts: Array<any>, classes: any) => displayTexts.map(displayText => (
        <div
            className={classNames(classes.indicator, classes.textIndicator)}
            key={displayText.id}
        >
            {displayText.message}
        </div>
    ))

    renderKeyValueItems = (keyValuePairs: Array<any>, classes: any) => keyValuePairs.map(pair => (
        <div className={classNames(classes.indicator, classes.keyValueIndicator)} key={pair.id}>
            <div className={classes.keyValueIndicatorItem}>{pair.key}</div>
            <div className={classes.keyValueIndicatorItem}>{pair.value}</div>
        </div>
    ));

    render() {
        const classes = this.props.classes;
        const indicators = this.getIndicators();
        const displayTexts = indicators.displayTexts || [];
        const displayKeyValuePairs = indicators.displayKeyValuePairs || [];
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

export const IndicatorsSectionComponent = withStyles(getStyles)(IndicatorsSectionPlain);
