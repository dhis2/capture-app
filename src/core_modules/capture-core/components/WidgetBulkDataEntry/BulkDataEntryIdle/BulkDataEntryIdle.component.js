// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import i18n from '@dhis2/d2-i18n';
import { IconChevronRight16, DataTable, DataTableBody, DataTableRow, DataTableCell } from '@dhis2/ui';
import type { PlainProps } from './BulkDataEntryIdle.types';
import { Widget } from '../../Widget';

const styles = () => ({
    container: {
        height: 'fit-content',
        maxHeight: '100vh',
        overflowY: 'auto',
    },
    table: {
        borderWidth: '1px 0 0 0 !important',
    },
    title: {
        '&:hover': {
            cursor: 'pointer',
            textDecoration: 'underline',
        },
    },
    configChevronCell: {
        textAlign: 'right',
    },
});

const BulkDataEntryIdleComponenetPlain = ({
    bulkDataEntryConfigurations,
    onSelectConfiguration,
    classes,
}: PlainProps) => (
    <div className={classes.container} data-test="widget-bulk-data-entry-idle">
        <Widget header={i18n.t('Bulk data entry')} noncollapsible>
            <DataTable className={classes.table} dataTest="bulk-data-entry-table">
                <DataTableBody dataTest="bulk-data-entry-body">
                    {bulkDataEntryConfigurations.map(config => (
                        <DataTableRow
                            key={config.dataKey}
                            onClick={() => onSelectConfiguration(config.configKey)}
                        >
                            <DataTableCell>
                                <strong className={classes.title}>{config.title}</strong>
                                {config.subtitle && <div>{config.subtitle}</div>}
                            </DataTableCell>
                            <DataTableCell>
                                <div className={classes.configChevronCell}>
                                    <IconChevronRight16 />
                                </div>
                            </DataTableCell>
                        </DataTableRow>
                    ))}
                </DataTableBody>
            </DataTable>
        </Widget>
    </div>
);

export const BulkDataEntryIdleComponenet = withStyles(styles)(BulkDataEntryIdleComponenetPlain);
