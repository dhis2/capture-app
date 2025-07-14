// @flow
import React, { useState } from 'react';
import i18n from '@dhis2/d2-i18n';
import { Button } from '@dhis2/ui';
import { useAuthority } from '../../../../../../utils/userInfo/useAuthority';
import { EnrollmentDeleteModal } from './EnrollmentDeleteModal';
import { ConditionalTooltip } from '../../../../../Tooltips/ConditionalTooltip';

type Props = {
    selectedRows: { [id: string]: boolean },
    programDataWriteAccess: boolean,
    programId: string,
    onUpdateList: () => void,
    bulkDataEntryIsActive: boolean,
}

const getTooltipContent = (programDataWriteAccess: boolean, bulkDataEntryIsActive: boolean) => {
    if (!programDataWriteAccess) {
        return i18n.t('You do not have access to delete enrollments');
    }
    if (bulkDataEntryIsActive) {
        return i18n.t('There is a bulk data entry with unsaved changes');
    }
    return '';
};

const CASCADE_DELETE_TEI_AUTHORITY = 'F_ENROLLMENT_CASCADE_DELETE';

export const DeleteEnrollmentsAction = ({
    selectedRows,
    programDataWriteAccess,
    programId,
    onUpdateList,
    bulkDataEntryIsActive,
}: Props) => {
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const { hasAuthority } = useAuthority({ authority: CASCADE_DELETE_TEI_AUTHORITY });
    const tooltipContent = getTooltipContent(programDataWriteAccess, bulkDataEntryIsActive);
    const disabled = !programDataWriteAccess || bulkDataEntryIsActive;

    if (!hasAuthority) {
        return null;
    }

    return (
        <>
            <ConditionalTooltip
                enabled={disabled}
                content={tooltipContent}
            >
                <Button
                    small
                    disabled={disabled}
                    onClick={() => setIsDeleteDialogOpen(true)}
                >
                    {i18n.t('Delete enrollments')}
                </Button>
            </ConditionalTooltip>

            {isDeleteDialogOpen && (
                <EnrollmentDeleteModal
                    selectedRows={selectedRows}
                    programId={programId}
                    onUpdateList={onUpdateList}
                    setIsDeleteDialogOpen={setIsDeleteDialogOpen}
                />
            )}
        </>
    );
};
