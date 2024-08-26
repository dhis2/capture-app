// @flow
import React, { useState } from 'react';
import i18n from '@dhis2/d2-i18n';
import {
    Button,
} from '@dhis2/ui';
import { useAuthority } from '../../../../../../utils/userInfo/useAuthority';
import { ConditionalTooltip } from '../../../../../Tooltips/ConditionalTooltip';
import { EnrollmentDeleteModal } from './EnrollmentDeleteModal';

type Props = {
    selectedRows: { [id: string]: boolean },
    programId: string,
    onUpdateList: () => void,
}

const CASCADE_DELETE_TEI_AUTHORITY = 'F_ENROLLMENT_CASCADE_DELETE';

export const DeleteEnrollmentsAction = ({
    selectedRows,
    programId,
    onUpdateList,
}: Props) => {
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const { hasAuthority } = useAuthority({ authority: CASCADE_DELETE_TEI_AUTHORITY });

    return (
        <>
            <ConditionalTooltip
                enabled={!hasAuthority}
                content={i18n.t('You do not have the required authority to delete enrollments')}
            >
                <Button
                    small
                    onClick={() => setIsDeleteDialogOpen(true)}
                    disabled={!hasAuthority}
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
