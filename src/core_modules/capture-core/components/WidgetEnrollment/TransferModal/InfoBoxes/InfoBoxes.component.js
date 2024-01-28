// @flow
import React from 'react';
import cx from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import { colors, IconInfo16 } from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import { useOrgUnitName } from '../../../../metadataRetrieval/orgUnitName';
import { OrgUnitScopes } from '../hooks/useTransferValidation';
import { ProgramAccessLevels } from '../hooks/useProgramAccessLevel';

type Props = {
    ownerOrgUnitId: string,
    validOrgUnitId: ?string,
    programAccessLevel: string,
    orgUnitScopes: {
        ORIGIN: $Keys<typeof OrgUnitScopes>,
        DESTINATION: $Keys<typeof OrgUnitScopes>,
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
        '&.error': {
            backgroundColor: colors.red600,
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
    const { displayName: ownerOrgUnitName } = useOrgUnitName(ownerOrgUnitId);
    const { displayName: newOrgUnitName } = useOrgUnitName(validOrgUnitId);

    const showWarning = [ProgramAccessLevels.PROTECTED, ProgramAccessLevels.PROTECTED].includes(programAccessLevel)
        && orgUnitScopes.DESTINATION === OrgUnitScopes.SEARCH;

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
                    <IconInfo16 />
                    {i18n.t('You will lose access to the enrollment when transferring ownership to {{organisationUnit}}.', {
                        organisationUnit: newOrgUnitName,
                    })}
                </div>
            )}
        </div>
    );
};

export const InfoBoxes = withStyles(styles)(InfoBoxesPlain);
