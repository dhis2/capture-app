// @flow

import * as React from 'react';
import i18n from '@dhis2/d2-i18n';
import { Warning as WarningIcon } from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';
import { OutputSection } from '../OutputSection.component';
import { OutputSectionHeader } from '../OutputSectionHeader.component';


type Props = {
    classes: Object,
    warnings: ?Array<any>,
}

const headerText = i18n.t('Warnings');

const getStyles = (theme: Theme) => ({
    badge: {
        backgroundColor: theme.palette.warning.light,
    },
    warning: {
        marginTop: theme.typography.pxToRem(5),
        marginBottom: theme.typography.pxToRem(5),
        padding: theme.typography.pxToRem(10),
        borderRadius: theme.typography.pxToRem(4),
        backgroundColor: theme.palette.warning.lighter,
    },
});

class WarningsSection extends React.Component<Props> {
    renderHeader = () => {
        const { classes, warnings } = this.props;
        const count = warnings ? warnings.length : 0;
        return (
            <OutputSectionHeader
                icon={WarningIcon}
                text={headerText}
                badgeClass={classes.badge}
                badgeCount={count}
            />
        );
    }

    renderItems = (warnings: Array<any>) => warnings.map(warning => (
        <div
            className={this.props.classes.warning}
            key={warning.id}
        >
            {warning.message}
        </div>
    ))
    render() {
        const { warnings } = this.props;
        return warnings && warnings.length > 0 ? (
            <OutputSection
                collapsable
                header={this.renderHeader()}
            >
                heeeeelo
                {this.renderItems(warnings)}
            </OutputSection>
        ) : null;
    }
}

export default withStyles(getStyles)(WarningsSection);
