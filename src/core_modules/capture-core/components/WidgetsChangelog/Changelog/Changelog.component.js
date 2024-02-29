// @flow
import i18n from '@dhis2/d2-i18n';
import {
    Button,
    ButtonStrip,
    DataTable,
    DataTableBody, DataTableCell, DataTableFoot, DataTableRow,
    Modal,
    ModalActions,
    ModalContent,
    ModalTitle, Pagination,
} from '@dhis2/ui';
import React from 'react';
import { ChangelogTableHeader, ChangelogTableRow } from '../common/ChangelogTable';
import type { ChangelogProps } from './Changelog.types';

export const ChangelogComponent = ({
    isOpen,
    setIsOpen,
    records,
    pager,
    setPage,
    setPageSize,
    sortDirection,
    setSortDirection,
}: ChangelogProps) => (
    <Modal
        large
        hide={!isOpen}
        onClose={() => setIsOpen(false)}
    >
        <ModalTitle>{i18n.t('Changelog')}</ModalTitle>

        <ModalContent>
            <DataTable>
                <ChangelogTableHeader
                    sortDirection={sortDirection}
                    setSortDirection={setSortDirection}
                />

                {records && records.length > 0 ? (
                    <DataTableBody>
                        {records?.map(record => (
                            <ChangelogTableRow
                                key={record.reactKey}
                                record={record}
                            />
                        ))}
                    </DataTableBody>
                ) : (
                    <DataTableBody>
                        <DataTableRow>
                            <DataTableCell align={'center'} colSpan="4">
                                {i18n.t('No changes to display')}
                            </DataTableCell>
                        </DataTableRow>
                    </DataTableBody>
                )}
                {pager && (
                    <DataTableFoot>
                        <DataTableRow>
                            <DataTableCell colSpan="4">
                                <Pagination
                                    page={pager.page}
                                    pageSize={pager.pageSize}
                                    onPageChange={setPage}
                                    onPageSizeChange={setPageSize}
                                    isLastPage={!pager.nextPage}
                                />
                            </DataTableCell>
                        </DataTableRow>
                    </DataTableFoot>
                )}
            </DataTable>
        </ModalContent>

        <ModalActions>
            <ButtonStrip>
                <Button
                    onClick={() => setIsOpen(false)}
                    secondary
                >
                    {i18n.t('Close')}
                </Button>
            </ButtonStrip>
        </ModalActions>
    </Modal>
);
