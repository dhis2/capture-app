// @flow
import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';
import i18n from '@dhis2/d2-i18n';
import { Section, SectionHeaderSimple } from '../../../../Section';
import SectionContents from './SectionContents.component';

const getStyles = (theme: Theme) => ({
    section: {
        backgroundColor: 'white',
        maxWidth: theme.typography.pxToRem(892),
    },
});

type Props = {
    classes: Object,
};

const renderSectionHeader = () => {
    const title = i18n.t('Registration');
    return (
        <SectionHeaderSimple
            title={title}
        />
    );
};

const RegistrationSection = (props: Props) => {
    const { classes, ...passOnProps } = props;
    return (
        <Section
            header={renderSectionHeader()}
            elevation={2}
            className={classes.section}
        >
            <SectionContents />
        </Section>
    );
};
// $FlowFixMe
export default withStyles(getStyles)(RegistrationSection);
