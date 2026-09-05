import * as React from 'react';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';
import { capitalizeFirstLetter } from 'capture-core-utils/string/capitalizeFirstLetter';

import type { OrgUnit } from '@dhis2/rules-engine-javascript';
import { ComposedRegUnitSelector } from './ComposedRegUnitSelector.component';
import { getProgramFromProgramIdThrowIfNotFound } from '../../../../../../metaData';
import { withCustomLabels } from '../../../../../../HOC/withCustomLabels';

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

type Props = {
    selectedProgramId?: string | null;
    onUpdateSelectedOrgUnit: (orgUnit: OrgUnit | null | undefined, resetProgramSelection: boolean) => void;
    programId: string;
    orgUnitLabel: string;
} & WithStyles<typeof getStyles>;

class RegUnitSelectorPlain extends React.Component<Props> {
    static baseComponentStyles = {
        labelContainerStyle: {
            flexBasis: 200,
        },
        inputContainerStyle: {
            flexBasis: 150,
        },
    };

    handleUpdateSelectedOrgUnit = (orgUnit: OrgUnit) => {
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

        onUpdateSelectedOrgUnit(
            orgUnit,
            program?.organisationUnits ? !program.organisationUnits[(orgUnit as any).id] : false,
        );
    }

    render() {
        const { classes, onUpdateSelectedOrgUnit, programId, orgUnitLabel, ...passOnProps } = this.props;
        return (
            <ComposedRegUnitSelector
                labelClass={classes.label}
                label={capitalizeFirstLetter(orgUnitLabel)}
                styles={RegUnitSelectorPlain.baseComponentStyles}
                onUpdateSelectedOrgUnit={this.handleUpdateSelectedOrgUnit}
                {...passOnProps as any}
            />
        );
    }
}
export const RegUnitSelectorComponent = withCustomLabels(customLabels)(withStyles(getStyles)(RegUnitSelectorPlain));
