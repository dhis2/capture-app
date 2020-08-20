// @flow
import * as React from 'react';
import classNames from 'classnames';
import i18n from '@dhis2/d2-i18n';
import { Info as InfoIcon } from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';
import ViewEventSection from '../../Section/ViewEventSection.component';
import ViewEventSectionHeader from '../../Section/ViewEventSectionHeader.component';

type Props = {
    classes: Object,
    indicators: ?{ displayTexts: ?Array<string>, displayKeyValuePairs: ?Array<{ key: string, value: string }>},
}

const headerText = i18n.t('Indicators');

const getStyles = (theme: Theme) => ({
    badge: {
        backgroundColor: theme.palette.grey.light,
    },
    indicator: {
        marginTop: theme.typography.pxToRem(5),
        marginBottom: theme.typography.pxToRem(5),
        borderRadius: theme.typography.pxToRem(4),
        backgroundColor: theme.palette.grey.lighter,
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

class IndicatorsSection extends React.Component<Props> {
    renderHeader = (count: number) => {
        const classes = this.props.classes;
        return (
            <ViewEventSectionHeader
                icon={InfoIcon}
                text={headerText}
                badgeClass={classes.badge}
                badgeCount={count}
            />
        );
    }

    renderTextItems = (displayTexts: Array<any>, classes: Object) => displayTexts.map(displayText => (
        <div
            className={classNames(classes.indicator, classes.textIndicator)}
            key={displayText.id}
        >
            {displayText.message}
        </div>
    ))

    renderKeyValueItems = (keyValuePairs: Array<any>, classes: Object) => keyValuePairs.map(pair => (
        <div className={classNames(classes.indicator, classes.keyValueIndicator)} key={pair.id}>
            <div className={classes.keyValueIndicatorItem}>{pair.key}</div>
            <div className={classes.keyValueIndicatorItem}>{pair.value}</div>
        </div>
    ));

    getIndicators = () => this.props.indicators || {};

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

export default withStyles(getStyles)(IndicatorsSection);
