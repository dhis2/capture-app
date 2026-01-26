import React, { type ComponentType } from 'react';
import { WithStyles, withStyles } from 'capture-core-utils/styles';
import i18n from '@dhis2/d2-i18n';
import { DataTable, DataTableBody, DataTableRow, DataTableCell } from '@dhis2/ui';
import type { PlainProps } from './BulkDataEntryIdle.types';
import { Widget } from '../../Widget';
import { DirectionalChevron } from '../../../utils/rtl';

const styles: Readonly<any> = {
    container: {
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
        textAlign: 'start',
        '&:hover': {
            cursor: 'pointer',
            textDecoration: 'underline',
        },
    },
    configChevronCell: {
        textAlign: 'end',
    },
};

type Props = PlainProps & WithStyles< typeof styles>;

const BulkDataEntryIdleComponenetPlain = ({
    bulkDataEntryConfigurations,
    onSelectConfiguration,
    classes,
}: Props) => (
    <div className={classes.container} data-test="widget-bulk-data-entry-idle">
        <Widget header={i18n.t('Bulk data entry')} noncollapsible>
            <DataTable className={classes.table} dataTest="bulk-data-entry-table">
                <DataTableBody dataTest="bulk-data-entry-body">
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
                                <div className={classes.configChevronCell}>
                                    <DirectionalChevron />
                                </div>
                            </DataTableCell>
                        </DataTableRow>
                    ))}
                </DataTableBody>
            </DataTable>
        </Widget>
    </div>
);

export const BulkDataEntryIdleComponenet = withStyles(styles)(BulkDataEntryIdleComponenetPlain) as ComponentType<PlainProps>;
