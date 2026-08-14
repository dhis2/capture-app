import React, { useState } from 'react';
import i18n from '@dhis2/d2-i18n';
import { Button } from '@dhis2/ui';
import { useAuthority } from '../../../../../../utils/authority/useAuthority';
import { Authorities } from '../../../../../../utils/authority/authorities';
import { EnrollmentDeleteModal } from './EnrollmentDeleteModal';
import { ConditionalTooltip } from '../../../../../Tooltips/ConditionalTooltip';
import type { PlainProps } from './DeleteEnrollmentsAction.types';

const getTooltipContent = (programDataWriteAccess: boolean, bulkDataEntryIsActive: boolean) => {
    if (!programDataWriteAccess) {
        return i18n.t('You do not have access to delete enrollments');
    }
    if (bulkDataEntryIsActive) {
        return i18n.t('There is a bulk data entry with unsaved changes');
    }
    return '';
};

export const DeleteEnrollmentsAction = ({
    selectedRows,
    programDataWriteAccess,
    programId,
    onUpdateList,
    bulkDataEntryIsActive,
}: PlainProps) => {
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const { hasAuthority } = useAuthority(Authorities.ENROLLMENT_CASCADE_DELETE);
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
