import * as React from 'react';
import { withStyles, type WithStyles } from '@material-ui/core/styles';
import i18n from '@dhis2/d2-i18n';
import { Section, SectionHeaderSimple } from '../../../../Section';
import { SectionContents } from './SectionContents.component';

const getStyles = (theme: any) => ({
    section: {
        backgroundColor: 'white',
        maxWidth: theme.typography.pxToRem(892),
    },
});

type Props = WithStyles<typeof getStyles>;

const renderSectionHeader = () => {
    const title = i18n.t('Registration');
    return (
        <SectionHeaderSimple
            title={title}
        />
    );
};

const RegistrationSectionPlain = (props: Props) => {
    const { classes } = props;
    return (
        <Section
            header={renderSectionHeader()}
            className={classes.section}
        >
            <SectionContents />
        </Section>
    );
};
export const RegistrationSection = withStyles(getStyles)(RegistrationSectionPlain);
