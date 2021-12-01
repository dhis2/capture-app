// @flow
import React from 'react';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import i18n from '@dhis2/d2-i18n';
import type { CardDataElementsInformation } from '../../../Pages/Search/SearchResults/SearchResults.types';
import { CardList } from '../../../CardList';
import { Button } from '../../../Buttons';

type Props = {
    attributeValues: {[id: string]: any},
    dataElements: CardDataElementsInformation,
    onLink: (values: Object) => void,
    onCancel: Function,
    programId?: string,
};

export class ExistingTEIContentsComponent extends React.Component<Props> {
    handleLink = () => {
        this.props.onLink(this.props.attributeValues);
    }
    render() {
        const { attributeValues, dataElements, onCancel, programId } = this.props;

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
                        currentProgramId={programId}
                        // $FlowFixMe
                        items={items}
                        dataElements={dataElements}
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={onCancel}
                        secondary
                    >
                        {i18n.t('Cancel')}
                    </Button>
                    <Button
                        onClick={this.handleLink}
                        primary
                    >
                        {i18n.t('Link')}
                    </Button>
                </DialogActions>
            </React.Fragment>
        );
    }
}
