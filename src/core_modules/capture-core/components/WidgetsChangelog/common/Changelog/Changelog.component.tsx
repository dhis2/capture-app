import React from 'react';
import i18n from '@dhis2/d2-i18n';
import {
    Button,
    ButtonStrip,
    DataTable,
    DataTableBody,
    DataTableCell,
    DataTableFoot,
    DataTableRow,
    Modal,
    ModalActions,
    ModalContent,
    ModalTitle,
    Pagination,
} from '@dhis2/ui';
import { ChangelogFilterBar } from '../ChangelogFilterBar';
import { ChangelogTableHeader, ChangelogTableRow } from '../ChangelogTable';
import type { ChangelogProps } from './Changelog.types';

export const ChangelogComponent = ({
    isOpen,
    close,
    records,
    loading,
    pager,
    defaultPage,
    defaultPageSize,
    columnToSortBy,
    setColumnToSortBy,
    attributeToFilterBy,
    setAttributeToFilterBy,
    supportsChangelogV2,
    entityType,
    filterValue,
    setFilterValue,
    setPage,
    setPageSize,
    sortDirection,
    setSortDirection,
    dataItemDefinitions,
}: ChangelogProps) => (
    <Modal
        large
        hide={!isOpen}
        dataTest={'changelog-modal'}
        onClose={close}
    >
        <ModalTitle>{i18n.t('Changelog')}</ModalTitle>
        <ModalContent>
            {supportsChangelogV2 && (
                <ChangelogFilterBar
                    attributeToFilterBy={attributeToFilterBy ?? null}
                    setAttributeToFilterBy={setAttributeToFilterBy}
                    filterValue={filterValue}
                    setFilterValue={setFilterValue}
                    dataItemDefinitions={dataItemDefinitions}
                    entityType={entityType}
                />
            )}
            <DataTable dataTest={'changelog-data-table'} layout={'fixed'}>
                <ChangelogTableHeader
                    columnToSortBy={columnToSortBy}
                    setColumnToSortBy={setColumnToSortBy}
                    sortDirection={sortDirection}
                    setSortDirection={setSortDirection}
                    entityType={entityType}
                    supportsChangelogV2={supportsChangelogV2}
                />
                <DataTableBody dataTest={'changelog-data-table-body'} loading={loading}>
                    {records && records.length > 0 ? (
                        records.map(record => (
                            <ChangelogTableRow key={record.reactKey} record={record} />
                        ))
                    ) : (
                        <DataTableRow>
                            <DataTableCell align={'center'} colSpan="5">
                                {i18n.t('No changes to display') as React.ReactNode}
                            </DataTableCell>
                        </DataTableRow>
                    )}
                </DataTableBody>
                <DataTableFoot>
                    <DataTableRow>
                        <DataTableCell colSpan="5">
                            <Pagination
                                page={pager?.page ?? defaultPage}
                                pageSize={pager?.pageSize ?? defaultPageSize}
                                onPageChange={setPage}
                                onPageSizeChange={setPageSize}
                                isLastPage={!pager?.nextPage}
                                dataTest={'changelog-pagination'}
                                disabled={loading}
                            />
                        </DataTableCell>
                    </DataTableRow>
                </DataTableFoot>
            </DataTable>
        </ModalContent>

        <ModalActions>
            <ButtonStrip>
                <Button onClick={close} secondary>
                    {i18n.t('Close') as React.ReactNode}
                </Button>
            </ButtonStrip>
        </ModalActions>
    </Modal>
);
