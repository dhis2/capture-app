import React from 'react';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';
import { capitalizeFirstLetter } from 'capture-core-utils/string/capitalizeFirstLetter';
import { ComposedRegUnitSelector } from './ComposedRegUnitSelector.component';
import { getProgramFromProgramIdThrowIfNotFound } from '../../../../../../../metaData';
import type { RegUnitSelectorProps } from './RegUnitSelector.types';
import { withCustomLabels } from '../../../../../../../HOC/withCustomLabels';

const customLabels = {
    orgUnitLabel: { key: 'orgUnit' },
} as const;

const getStyles = () => ({
    label: {
        paddingTop: '10px',
        '@media (max-width: 523px)': {
            paddingTop: '0px !important',
        },
    },
});

type Props = RegUnitSelectorProps & WithStyles<typeof getStyles>;

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
        const { classes, onUpdateSelectedOrgUnit, programId, orgUnitLabel, ...passOnProps } = this.props;
        return (
            <ComposedRegUnitSelector
                labelClass={classes.label}
                label={capitalizeFirstLetter(orgUnitLabel)}
                styles={RegUnitSelectorPlain.baseComponentStyles}
                onUpdateSelectedOrgUnit={this.handleUpdateSelectedOrgUnit}
                {...passOnProps}
            />
        );
    }
}

export const RegUnitSelectorComponent = withCustomLabels(customLabels)(withStyles(getStyles)(RegUnitSelectorPlain));
