// @flow
import React from 'react';
import i18n from '@dhis2/d2-i18n';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import CardList from '../../../../../CardList/CardList.component';
import { DataElement } from '../../../../../../metaData';

type Props = {
    attributeValues: {[id: string]: any},
    dataElements: Array<DataElement>,
    onLink: (values: Object) => void,
    onCancel: Function,
};

class ExistingTEIContents extends React.Component<Props> {
    handleLink = () => {
        this.props.onLink(this.props.attributeValues);
    }
    render() {
        const { attributeValues, dataElements, onCancel } = this.props;

        const items = [
            {
                id: 'foundTEI',
                values: attributeValues,
            },
        ];

        return (
            <React.Fragment>
                <DialogContent>
                    <DialogTitle>
                        {i18n.t('Registered person')}
                    </DialogTitle>
                    <CardList
                        items={items}
                        dataElements={dataElements}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={onCancel} color="primary">
                        {i18n.t('Cancel')}
                    </Button>
                    <Button onClick={this.handleLink} color="primary" autoFocus>
                        {i18n.t('Link')}
                    </Button>
                </DialogActions>
            </React.Fragment>
        );
    }
}

export default ExistingTEIContents;
