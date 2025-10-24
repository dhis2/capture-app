import * as React from 'react';
import i18n from '@dhis2/d2-i18n';
import { withStyles, type WithStyles } from '@material-ui/core/styles';

import type { OrgUnit } from '@dhis2/rules-engine-javascript';
import { ComposedRegUnitSelector } from './ComposedRegUnitSelector.component';
import { getProgramFromProgramIdThrowIfNotFound } from '../../../../../../metaData';

const getStyles = (theme: any) => ({
    label: {
        paddingTop: '10px',
        [theme.breakpoints.down(523)]: {
            paddingTop: '0px !important',
        },
    },
});

type Props = {
    selectedProgramId?: string | null;
    onUpdateSelectedOrgUnit: (orgUnit: OrgUnit | null | undefined, resetProgramSelection: boolean) => void;
    programId: string;
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
        const { classes, onUpdateSelectedOrgUnit, programId, ...passOnProps } = this.props;
        return (
            <ComposedRegUnitSelector
                labelClass={classes.label}
                label={i18n.t('Organisation Unit')}
                styles={RegUnitSelectorPlain.baseComponentStyles}
                onUpdateSelectedOrgUnit={this.handleUpdateSelectedOrgUnit}
                {...passOnProps as any}
            />
        );
    }
}
export const RegUnitSelectorComponent = withStyles(getStyles)(RegUnitSelectorPlain);
