// @flow
import * as React from 'react';
import { Modal, ModalActions } from '@dhis2/ui';
import { ReviewDialogContents } from './ReviewDialogContents/ReviewDialogContents.container';
import type { RenderCustomCardActions } from '../CardList/CardList.types';

type Props = {|
    dataEntryId: string,
    open: boolean,
    onCancel: () => void,
    renderCardActions?: RenderCustomCardActions,
    extraActions?: ?React.Node,
    selectedScopeId: string
|};

class ReviewDialogClass extends React.Component<Props > {
    render() {
        const { open, onCancel, extraActions, selectedScopeId, dataEntryId, renderCardActions } = this.props;

        if (!open) {
            return null;
        }

        return (
            <Modal
                hide={!open}
                dataTest={'duplicates-modal'}
                onClose={onCancel}
            >
                <ReviewDialogContents
                    dataEntryId={dataEntryId}
                    selectedScopeId={selectedScopeId}
                    renderCardActions={renderCardActions}
                />
                <ModalActions>
                    {extraActions}
                </ModalActions>
            </Modal>
        );
    }
}

export const PossibleDuplicatesDialog = ReviewDialogClass;
