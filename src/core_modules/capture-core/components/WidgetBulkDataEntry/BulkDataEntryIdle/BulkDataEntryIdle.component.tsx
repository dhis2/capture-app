import React, { type ComponentType } from 'react';
import { withStyles } from '@material-ui/core/styles';
import i18n from '@dhis2/d2-i18n';
import { IconChevronRight16, DataTable, DataTableBody, DataTableRow, DataTableCell } from '@dhis2/ui';
import type { PlainProps } from './BulkDataEntryIdle.types';
import { Widget } from '../../Widget';

const styles: Readonly<any> = {
    container: {
        width: '260px',
        minWidth: '260px',
        height: 'fit-content',
        maxHeight: '100vh',
        overflowY: 'auto',
    },
    table: {
        borderWidth: '1px 0 0 0 !important',
    },
    title: {
        border: 'none',
        background: 'none',
        padding: 0,
        font: 'inherit',
        fontWeight: 'bold',
        textAlign: 'left',
        '&:hover': {
            cursor: 'pointer',
            textDecoration: 'underline',
        },
    },
};

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
                        >
                            <DataTableCell>
                                <button
                                    type="button"
                                    className={classes.title}
                                    onClick={() => onSelectConfiguration(config.configKey)}
                                >
                                    {config.title}
                                </button>
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

export const BulkDataEntryIdleComponenet = withStyles(styles)(BulkDataEntryIdleComponenetPlain) as ComponentType<Omit<PlainProps, 'classes'>>;
