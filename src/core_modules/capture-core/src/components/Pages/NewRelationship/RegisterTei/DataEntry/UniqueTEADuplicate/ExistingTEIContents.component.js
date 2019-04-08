// @flow
import React from 'react';
import i18n from '@dhis2/d2-i18n';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import CardList from '../../../../../CardList/CardList.component';
import { DataElement } from '../../../../../../metaData';

type Props = {
    attributeValues: {[id: string]: any},
    dataElements: Array<DataElement>,
};

class ExistingTEIContents extends React.Component<Props> {
    render() {
        const { attributeValues, dataElements } = this.props;

        const items = [
            {
                id: 'foundTEI',
                values: attributeValues,
            },
        ];

        return (
            <DialogContent>
                <DialogTitle>
                    {i18n.t('Registered person')}
                </DialogTitle>
                <CardList
                    items={items}
                    dataElements={dataElements}
                />
            </DialogContent>
        );
    }
}

export default ExistingTEIContents;
