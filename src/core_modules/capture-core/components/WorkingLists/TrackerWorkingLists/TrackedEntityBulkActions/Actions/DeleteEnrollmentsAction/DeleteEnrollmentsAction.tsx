import React, { useState } from 'react';
import i18n from '@dhis2/d2-i18n';
import { Button } from '@dhis2/ui';
import { useAuthority } from '../../../../../../utils/userInfo/useAuthority';
import { EnrollmentDeleteModal } from './EnrollmentDeleteModal';
import { ConditionalTooltip } from '../../../../../Tooltips/ConditionalTooltip';
import type { PlainProps } from './DeleteEnrollmentsAction.types';
import { useTermLabel } from '../../../../../../metaData';
import { customTerms } from '../../../../../../utils/customTerms';

const getTooltipContent = (
    programDataWriteAccess: boolean,
    bulkDataEntryIsActive: boolean,
    enrollmentsLabel: string,
) => {
    if (!programDataWriteAccess) {
        return customTerms.i18n.t('You do not have access to delete {{enrollmentsLabel}}', { enrollmentsLabel });
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
}: PlainProps) => {
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const { hasAuthority } = useAuthority({ authority: CASCADE_DELETE_TEI_AUTHORITY });
    const enrollmentsLabel = useTermLabel('enrollment', { programId, plural: true });
    const tooltipContent = getTooltipContent(programDataWriteAccess, bulkDataEntryIsActive, enrollmentsLabel);
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
                    {customTerms.i18n.t('Delete {{enrollmentsLabel}}', { enrollmentsLabel })}
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
