import React, { type ComponentType, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';
import { capitalizeFirstLetter } from 'capture-core-utils/string/capitalizeFirstLetter';
import { ComposedRegUnitSelector } from './ComposedRegUnitSelector.component';
import { LabelKeys, withCustomLabels } from '../../../../../../../customLabels';
import { isProgramOrganisationUnit } from '../../../../../../../utils/cachedDataQueries';
import type { RegUnitSelectorProps } from './RegUnitSelector.types';

const customLabels = [LabelKeys.orgUnitSingular] as const;

const getStyles = () => ({
    label: {
        paddingTop: '10px',
        '@media (max-width: 523px)': {
            paddingTop: '0px !important',
        },
    },
});

const baseComponentStyles = {
    labelContainerStyle: {
        flexBasis: 200,
    },
    inputContainerStyle: {
        flexBasis: 150,
    },
};

type LabelProps = {
    orgUnitLabel: string;
};

type Props = RegUnitSelectorProps & LabelProps & WithStyles<typeof getStyles>;

const RegUnitSelectorPlain = ({
    programId,
    orgUnitLabel,
    onUpdateSelectedOrgUnit,
    classes,
    ...passOnProps
}: Props) => {
    const queryClient = useQueryClient();

    const handleUpdateSelectedOrgUnit = useCallback(async (orgUnit: Record<string, any>) => {
        if (!programId || !orgUnit) {
            onUpdateSelectedOrgUnit(orgUnit, false);
            return;
        }

        try {
            const isProgramOrgUnit = await isProgramOrganisationUnit({
                queryClient,
                programId,
                orgUnitId: orgUnit.id,
            });
            onUpdateSelectedOrgUnit(orgUnit, !isProgramOrgUnit);
        } catch {
            onUpdateSelectedOrgUnit(orgUnit, true);
        }
    }, [queryClient, programId, onUpdateSelectedOrgUnit]);

    return (
        <ComposedRegUnitSelector
            labelClass={classes.label}
            label={capitalizeFirstLetter(orgUnitLabel)}
            styles={baseComponentStyles}
            onUpdateSelectedOrgUnit={handleUpdateSelectedOrgUnit}
            {...passOnProps}
        />
    );
};

export const RegUnitSelectorComponent =
    withCustomLabels(customLabels)(withStyles(getStyles)(RegUnitSelectorPlain)) as ComponentType<RegUnitSelectorProps>;
