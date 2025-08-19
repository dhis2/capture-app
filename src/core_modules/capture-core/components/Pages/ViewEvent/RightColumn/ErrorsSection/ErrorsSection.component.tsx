import * as React from 'react';
import i18n from '@dhis2/d2-i18n';
import { IconErrorFilled24 } from '@dhis2/ui';
import { withStyles, type WithStyles } from '@material-ui/core/styles';
import { ViewEventSection } from '../../Section/ViewEventSection.component';
import { ViewEventSectionHeader } from '../../Section/ViewEventSectionHeader.component';
import type { PlainProps } from './ErrorsSection.types';

type Props = PlainProps & WithStyles<typeof getStyles>;

const headerText = i18n.t('Errors');

const getStyles = (theme: any) => ({
    badge: {
        backgroundColor: theme.palette.error.main,
        color: 'white',
    },
    error: {
        marginTop: theme.typography.pxToRem(5),
        marginBottom: theme.typography.pxToRem(5),
        padding: theme.typography.pxToRem(10),
        borderRadius: theme.typography.pxToRem(4),
        backgroundColor: theme.palette.error.light,
    },
});

class ErrorsSectionPlain extends React.Component<Props> {
    renderHeader = () => {
        const { classes, errors } = this.props;
        const count = errors ? errors.length : 0;
        return (
            <ViewEventSectionHeader
                icon={IconErrorFilled24}
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
            <ViewEventSection
                collapsable
                header={this.renderHeader()}
            >
                {this.renderItems(errors)}
            </ViewEventSection>
        ) : null;
    }
}

export const ErrorsSectionComponent = withStyles(getStyles)(ErrorsSectionPlain);
