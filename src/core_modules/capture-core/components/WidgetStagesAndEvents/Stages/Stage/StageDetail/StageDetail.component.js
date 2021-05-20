// @flow
import React, { type ComponentType } from 'react';
import i18n from '@dhis2/d2-i18n';
import { withStyles } from '@material-ui/core';
import {
    Table,
    Row,
    Cell,
    HeaderCell,
    Head,
    Body,
} from 'capture-ui';
import { colors, spacersNum } from '@dhis2/ui';
import { formatValueForView, getValueByKeyFromEvent } from '../helpers';
import { dataElementTypes } from '../../../../../metaData';
import type { Props } from './stageDetail.types';


const styles = {
    table: {
        display: 'block',
        overflowX: 'auto',
    },
    row: {
        maxWidth: '100%',
        whiteSpace: 'nowrap',
    },
    container: {
        display: 'flex',
        padding: spacersNum.dp8,
        backgroundColor: colors.grey200,
        alignItems: 'center',
    },
};
const StageDetailPlain = ({ events, data, classes }: Props) => {
    const defaultColumns = [
        { id: 'status', header: i18n.t('Status') },
        { id: 'eventDate', header: i18n.t('Report date') },
        { id: 'orgUnitName', header: i18n.t('Registering unit'),
        }];

    const dataSource = events.reduce((acc, currentEvent) => {
        const keys = [
            { id: 'status', type: dataElementTypes.STATUS },
            { id: 'eventDate', type: dataElementTypes.DATE },
            { id: 'orgUnitName', type: dataElementTypes.TEXT }];
        const dataElementsInEvent = currentEvent.dataValues
            .map(item => ({ id: item.dataElement,
                value: formatValueForView(item.value, data.get(item.dataElement).type),
            }));

        acc.push([
            ...keys.map(key => ({
                id: key.id,
                value: formatValueForView(getValueByKeyFromEvent(currentEvent, key.id), key.type),
            })),
            ...dataElementsInEvent]);
        return acc;
    }, []);

    function renderHeaderRow() {
        const dataElementHeaders = events[0].dataValues.map((item) => {
            const dataElement = data.get(item.dataElement);
            return { id: item.dataElement, header: dataElement.formName };
        });
        const headerCells = [...defaultColumns, ...dataElementHeaders]
            .map(column => (
                <HeaderCell
                    key={column.id}
                >
                    {column.header}
                </HeaderCell>
            ));
        return (
            <Row
                className={classes.row}
            >
                {headerCells}
            </Row>
        );
    }

    function renderRows() {
        return dataSource
            .map((row, index) => {
                const cells = row
                    .map(column => (
                        <Cell
                            key={column.id}
                        >
                            <div >
                                {column.value}
                            </div>
                        </Cell>
                    ));

                return (
                    <Row
                        className={classes.row}
                        key={events[index].event}
                    >
                        {cells}
                    </Row>
                );
            });
    }

    return (
        <div className={classes.container}>
            <Table
                className={classes.table}
            >
                <Head>
                    {renderHeaderRow()}
                </Head>
                <Body>
                    {renderRows()}
                </Body>
            </Table>

        </div>
    );
};

export const StageDetail: ComponentType<$Diff<Props, CssClasses>> = withStyles(styles)(StageDetailPlain);
