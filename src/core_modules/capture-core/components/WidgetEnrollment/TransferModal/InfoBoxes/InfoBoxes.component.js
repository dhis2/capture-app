// @flow
import React from 'react';
import cx from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import { colors, IconInfo16, IconWarning16 } from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import { useOrgUnitNameWithAncestors } from '../../../../metadataRetrieval/orgUnitName';
import { OrgUnitScopes } from '../hooks/useTransferValidation';
import { ProgramAccessLevels } from '../hooks/useProgramAccessLevel';

type Props = {
    ownerOrgUnitId: string,
    validOrgUnitId: ?string,
    programAccessLevel: string,
    orgUnitScopes: {
        origin: $Keys<typeof OrgUnitScopes>,
        destination: $Keys<typeof OrgUnitScopes>,
    },
    classes: Object,
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
};

const InfoBoxesPlain = ({
    ownerOrgUnitId,
    validOrgUnitId,
    programAccessLevel,
    orgUnitScopes,
    classes,
}: Props) => {
    const { displayName: ownerOrgUnitName } = useOrgUnitNameWithAncestors(ownerOrgUnitId);
    const { displayName: newOrgUnitName } = useOrgUnitNameWithAncestors(validOrgUnitId);

    const showWarning = [ProgramAccessLevels.PROTECTED, ProgramAccessLevels.CLOSED].includes(programAccessLevel)
        && orgUnitScopes.destination === OrgUnitScopes.SEARCH;

    return (
        <div className={classes.container}>
            {newOrgUnitName && (
                <div className={cx(classes.alert, { info: true })}>
                    <IconInfo16 color={colors.grey600} />
                    {i18n.t('Transferring enrollment ownership from {{ownerOrgUnit}} to {{newOrgUnit}}{{escape}}', {
                        ownerOrgUnit: ownerOrgUnitName,
                        newOrgUnit: newOrgUnitName,
                        escape: '.',
                    })}
                </div>
            )}

            {showWarning && (
                <div className={cx(classes.alert, { warning: true })}>
                    <IconWarning16 />
                    {i18n.t('You will lose access to the enrollment when transferring ownership to {{organisationUnit}}.', {
                        organisationUnit: newOrgUnitName,
                    })}
                </div>
            )}
        </div>
    );
};

export const InfoBoxes = withStyles(styles)(InfoBoxesPlain);
