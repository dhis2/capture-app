import * as React from 'react';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';

import i18n from '@dhis2/d2-i18n';
import { Section, SectionHeaderSimple } from '../../../../Section';
import { ProgramSelector } from './ProgramSelector';

const getStyles = (theme: any) => ({
    section: {
        backgroundColor: 'white',
        maxWidth: theme.typography.pxToRem(892),
    },
});

type Props = WithStyles<typeof getStyles>;

const renderSectionHeader = () => {
    const title = i18n.t('Program');
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
            <ProgramSelector />
        </Section>
    );
};
export const RegistrationSection = withStyles(getStyles)(RegistrationSectionPlain);
