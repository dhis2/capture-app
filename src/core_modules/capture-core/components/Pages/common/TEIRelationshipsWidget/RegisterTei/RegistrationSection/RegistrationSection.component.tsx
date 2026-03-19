import React from 'react';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';
import i18n from '@dhis2/d2-i18n';
import { Section, SectionHeaderSimple } from '../../../../../Section';
import { SectionContents } from './SectionContents.component';
import type { RegistrationSectionProps } from './RegistrationSection.types';

const getStyles = (theme: any) => ({
    section: {
        backgroundColor: 'white',
        maxWidth: theme.typography.pxToRem(892),
    },
});

type Props = RegistrationSectionProps & WithStyles<typeof getStyles>;

const renderSectionHeader = () => {
    const title = i18n.t('Registration');
    return (
        <SectionHeaderSimple
            title={title}
        />
    );
};

const RegistrationSectionPlain = (props: Props) => {
    const { classes, trackedEntityTypeId } = props;
    return (
        <Section
            header={renderSectionHeader()}
            className={classes.section}
        >
            <SectionContents
                trackedEntityTypeId={trackedEntityTypeId}
            />
        </Section>
    );
};

export const RegistrationSection = withStyles(getStyles)(RegistrationSectionPlain);
