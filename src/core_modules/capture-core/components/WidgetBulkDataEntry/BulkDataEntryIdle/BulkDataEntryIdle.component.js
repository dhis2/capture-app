// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import i18n from '@dhis2/d2-i18n';
import { IconChevronRight16, DataTable, DataTableBody, DataTableRow, DataTableCell } from '@dhis2/ui';
import type { PlainProps } from './BulkDataEntryIdle.types';
import { Widget } from '../../Widget';

const styles = () => ({
    container: {
        width: '260px',
        minWidth: '260px',
        height: 'fit-content',
        maxHeight: '100vh',
        overflowY: 'scroll',
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
});

const BulkDataEntryIdleComponenetPlain = ({
    bulkDataEntryConfigurations,
    onSelectConfiguration,
    classes,
}: PlainProps) => (
    <div className={classes.container}>
        <Widget header={i18n.t('Bulk data entry')} noncollapsible>
            <DataTable className={classes.table}>
                <DataTableBody>
                    {bulkDataEntryConfigurations.map(config => (
                        <DataTableRow
                            key={config.dataKey}
                            onClick={() =>
                                onSelectConfiguration({
                                    configKey: config.configKey,
                                    dataKey: config.dataKey,
                                    pluginSource: config.pluginSource,
                                    title: config.title,
                                })
                            }
                        >
                            <DataTableCell>
                                <strong className={classes.title}>{config.title}</strong>
                                {config.subtitle && <div>{config.subtitle}</div>}
                            </DataTableCell>
                            <DataTableCell>
                                <IconChevronRight16 />
                            </DataTableCell>
                        </DataTableRow>
                    ))}
                </DataTableBody>
            </DataTable>
        </Widget>
    </div>
);

export const BulkDataEntryIdleComponenet = withStyles(styles)(BulkDataEntryIdleComponenetPlain);
