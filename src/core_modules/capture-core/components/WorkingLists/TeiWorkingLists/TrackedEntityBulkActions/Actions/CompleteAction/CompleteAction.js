// @flow

import i18n from '@dhis2/d2-i18n';
import React, { useState } from 'react';
import {
    Button,
    ButtonStrip,
    DataTableCell,
    DataTableRow,
    Modal,
    ModalActions,
    ModalContent,
    ModalTitle,
} from '@dhis2/ui';
import { ConditionalTooltip } from '../../../../../Tooltips/ConditionalTooltip';
import { BulkActionCountTable } from '../../../../WorkingListsBase/BulkActionBar';
import { useCompleteBulkEnrollments } from './hooks/useCompleteBulkEnrollments';

type Props = {
    selectedRows: { [id: string]: any },
    programId: string,
    onUpdateList: () => void,
};

export const CompleteAction = ({ selectedRows, programId, onUpdateList }: Props) => {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const {
        enrollmentCounts,
        completeEnrollments,
        isLoading,
        isError,
        isCompletingEnrollments,
    } = useCompleteBulkEnrollments({
        selectedRows,
        programId,
        modalIsOpen,
        setModalIsOpen,
        onUpdateList,
    });

    return (
        <>
            <Button
                small
                onClick={() => setModalIsOpen(true)}
            >
                {i18n.t('Complete enrollments')}
            </Button>

            {modalIsOpen && (
                <Modal
                    small
                    onClose={() => setModalIsOpen(false)}
                >
                    <ModalTitle>
                        {i18n.t('Complete enrollments')}
                    </ModalTitle>
                    <ModalContent>
                        {i18n.t('Are you sure you want to complete all active enrollments?')}

                        <BulkActionCountTable
                            isLoading={isLoading}
                            total={enrollmentCounts.active}
                        >
                            <DataTableRow>
                                <DataTableCell>
                                    {i18n.t('Active')}
                                </DataTableCell>
                                <DataTableCell align={'center'}>
                                    {enrollmentCounts?.active}
                                </DataTableCell>
                            </DataTableRow>
                            <DataTableRow>
                                <DataTableCell>
                                    {i18n.t('Already completed')}
                                </DataTableCell>
                                <DataTableCell align={'center'}>
                                    {enrollmentCounts?.completed}
                                </DataTableCell>
                            </DataTableRow>
                        </BulkActionCountTable>
                    </ModalContent>

                    <ModalActions>
                        <ButtonStrip>
                            <Button
                                secondary
                                onClick={() => setModalIsOpen(false)}
                            >
                                {i18n.t('Cancel')}
                            </Button>

                            <ConditionalTooltip
                                enabled={enrollmentCounts?.active === 0}
                                content={i18n.t('No active enrollments to complete')}
                            >
                                <Button
                                    primary
                                    onClick={completeEnrollments}
                                    disabled={isLoading || isError || enrollmentCounts?.active === 0}
                                    loading={isCompletingEnrollments}
                                >
                                    {i18n.t('Complete')}
                                </Button>
                            </ConditionalTooltip>
                        </ButtonStrip>
                    </ModalActions>
                </Modal>
            )}
        </>
    );
};
