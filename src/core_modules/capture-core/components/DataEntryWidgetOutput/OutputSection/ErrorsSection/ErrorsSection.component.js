// @flow

import * as React from 'react';
import i18n from '@dhis2/d2-i18n';
import { Error as ErrorIcon } from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';
import { OutputSection } from '../OutputSection.component';
import { OutputSectionHeader } from '../OutputSectionHeader.component';


type Props = {
    classes: Object,
    errors: ?Array<any>,
}

const headerText = i18n.t('Errors');

const getStyles = (theme: Theme) => ({
    badge: {
        backgroundColor: theme.palette.error.main,
        color: 'white',
    },
    error: {
        marginTop: theme.typography.pxToRem(5),
        marginBottom: theme.typography.pxToRem(5),
        padding: theme.typography.pxToRem(10),
        borderRadius: theme.typography.pxToRem(4),
        backgroundColor: theme.palette.error.lighter,
    },
});

class ErrorsSection extends React.Component<Props> {
    renderHeader = () => {
        const { classes, errors } = this.props;
        const count = errors ? errors.length : 0;
        return (
            <OutputSectionHeader
                icon={ErrorIcon}
                text={headerText}
                badgeClass={classes.badge}
                badgeCount={count}
            />
        );
    }

    renderItems = (errors: Array<any>) => errors.map(error => (
        <div
            className={this.props.classes.error}
            key={error.id}
        >
            {error.message}
        </div>
    ));

    render() {
        const { errors } = this.props;
        return errors && errors.length > 0 ? (
            <OutputSection
                collapsable
                header={this.renderHeader()}
            >
                {this.renderItems(errors)}
            </OutputSection>
        ) : null;
    }
}

export default withStyles(getStyles)(ErrorsSection);

