// @flow
import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { ProgramSelector } from './ProgramSelector';
import { RegUnitSelector } from './RegUnitSelector';

const getStyles = (theme: Theme) => ({
    sectionFieldsInSection: {
        margin: theme.spacing.unit,
    },
});
type Props = {
    classes: Object,
};

const SectionContents = (props: Props) => {
    const { classes } = props;
    return (
        <div
            className={classes.sectionFieldsInSection}
        >
            <RegUnitSelector />
            <ProgramSelector />
        </div>
    );
};
export default withStyles(getStyles)(SectionContents);
