import React from 'react';
import { withStyles, createStyles, type WithStyles } from '@material-ui/core/styles';
import i18n from '@dhis2/d2-i18n';
import { Section, SectionHeaderSimple } from '../../../../../Section';
import { SectionContents } from './SectionContents.component';
import type { RegistrationSectionProps } from './RegistrationSection.types';

const styles = createStyles({
    section: {
        backgroundColor: 'white',
        maxWidth: '892px',
    },
});

type Props = RegistrationSectionProps & WithStyles<typeof styles>;

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

export const RegistrationSection = withStyles(styles)(RegistrationSectionPlain);
