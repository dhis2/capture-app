import React from 'react';
import { cx } from '@emotion/css';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';
import { colors, IconInfo16, IconWarning16 } from '@dhis2/ui';
import { useOrgUnitNameWithAncestors } from '../../../../metadataRetrieval/orgUnitName';
import { useTermLabel } from '../../../../metaData';
import { customTerms } from '../../../../utils/customTerms';
import { OrgUnitScopes } from '../hooks/useTransferValidation';
import { ProgramAccessLevels } from '../hooks/useProgramAccessLevel';

type Props = {
    ownerOrgUnitId: string;
    validOrgUnitId?: string;
    programAccessLevel: string;
    orgUnitScopes: {
        origin: keyof typeof OrgUnitScopes | null;
        destination: keyof typeof OrgUnitScopes | null;
    };
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
    },
    alert: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '14px',
        padding: '14px 10px',
        borderRadius: '4px',
        '&.info': {
            backgroundColor: colors.grey200,
        },
        '&.warning': {
            backgroundColor: colors.yellow100,
        },
    },
} as const;

const InfoBoxesPlain = ({
    ownerOrgUnitId,
    validOrgUnitId,
    programAccessLevel,
    orgUnitScopes,
    classes,
}: Props & WithStyles<typeof styles>) => {
    const { displayName: ownerOrgUnitName } = useOrgUnitNameWithAncestors(ownerOrgUnitId);
    const { displayName: newOrgUnitName } = useOrgUnitNameWithAncestors(validOrgUnitId ?? null);
    const enrollmentLabel = useTermLabel('enrollment');

    const showWarning = [ProgramAccessLevels.PROTECTED, ProgramAccessLevels.CLOSED].includes(programAccessLevel as any)
        && orgUnitScopes.destination === OrgUnitScopes.SEARCH;

    return (
        <div className={classes.container}>
            {newOrgUnitName && (
                <div className={cx(classes.alert, { info: true })}>
                    <IconInfo16 color={colors.grey600} />
                    {customTerms.i18n.t(
                        'Transferring {{enrollmentLabel}} ownership from {{ownerOrgUnit}} to {{newOrgUnit}}{{escape}}',
                        {
                            enrollmentLabel,
                            ownerOrgUnit: ownerOrgUnitName,
                            newOrgUnit: newOrgUnitName,
                            escape: '.',
                        },
                    )}
                </div>
            )}

            {showWarning && (
                <div className={cx(classes.alert, { warning: true })}>
                    <IconWarning16 />
                    {customTerms.i18n.t(
                        'You will lose access to the {{enrollmentLabel}} '
                            + 'when transferring ownership to {{organisationUnit}}.',
                        { enrollmentLabel, organisationUnit: newOrgUnitName },
                    )}
                </div>
            )}
        </div>
    );
};

export const InfoBoxes = withStyles(styles)(InfoBoxesPlain);
