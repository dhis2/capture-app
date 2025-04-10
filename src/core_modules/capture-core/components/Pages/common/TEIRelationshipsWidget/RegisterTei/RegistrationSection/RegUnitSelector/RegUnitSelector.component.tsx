import React from 'react';
import i18n from '@dhis2/d2-i18n';
import { withStyles, createStyles, type WithStyles } from '@material-ui/core/styles';
import { ComposedRegUnitSelector } from './ComposedRegUnitSelector.component';
import { getProgramFromProgramIdThrowIfNotFound } from '../../../../../../../metaData';
import type { RegUnitSelectorProps } from './RegUnitSelector.types';

const styles = createStyles({
    label: {
        paddingTop: '10px',
        '@media (max-width: 523px)': {
            paddingTop: '0px !important',
        },
    },
});

type Props = RegUnitSelectorProps & WithStyles<typeof styles>;

class RegUnitSelectorPlain extends React.Component<Props> {
    static baseComponentStyles = {
        labelContainerStyle: {
            flexBasis: 200,
        },
        inputContainerStyle: {
            flexBasis: 150,
        },
    };

    handleUpdateSelectedOrgUnit = (orgUnit: Record<string, any>) => {
        const { programId, onUpdateSelectedOrgUnit } = this.props;
        if (!programId || !orgUnit) {
            onUpdateSelectedOrgUnit(orgUnit, false);
            return;
        }

        let program;
        try {
            program = getProgramFromProgramIdThrowIfNotFound(programId);
        } catch (error) {
            onUpdateSelectedOrgUnit(orgUnit, true);
            return;
        }

        onUpdateSelectedOrgUnit(orgUnit, program?.organisationUnits ? !program.organisationUnits[orgUnit.id] : false);
    }

    render() {
        const { classes, onUpdateSelectedOrgUnit, programId, ...passOnProps } = this.props;
        return (
            <ComposedRegUnitSelector
                labelClass={classes.label}
                label={i18n.t('Organisation Unit')}
                styles={RegUnitSelectorPlain.baseComponentStyles}
                onUpdateSelectedOrgUnit={this.handleUpdateSelectedOrgUnit}
                {...passOnProps}
            />
        );
    }
}

export const RegUnitSelectorComponent = withStyles(styles)(RegUnitSelectorPlain);
