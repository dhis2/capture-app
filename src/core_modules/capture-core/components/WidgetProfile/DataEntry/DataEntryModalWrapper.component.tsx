import React, { type ReactNode } from 'react';
import { Modal, ModalTitle, ModalContent, ModalActions, ButtonStrip, spacersNum } from '@dhis2/ui';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';
import { ReadOnlyBadge } from '../../ReadOnlyBadge';

const styles = {
    title: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: `${spacersNum.dp8}px`,
    },
};

type Props = {
    title: ReactNode;
    actions: ReactNode;
    onClose: () => void;
    trackedEntityName: string;
    accessReadOnly?: boolean;
    children: ReactNode;
};

const DataEntryModalWrapperPlain = ({
    classes,
    title,
    actions,
    onClose,
    trackedEntityName,
    accessReadOnly,
    children,
}: Props & WithStyles<typeof styles>) => (
    <Modal large onClose={onClose} dataTest="modal-edit-profile">
        <ModalTitle>
            <div className={classes.title}>
                <span>{title}</span>
                <ReadOnlyBadge
                    trackedEntityTypeWriteAccess={!accessReadOnly}
                    trackedEntityName={trackedEntityName}
                    inlineLabel
                />
            </div>
        </ModalTitle>
        <ModalContent>{children}</ModalContent>
        <ModalActions>
            <ButtonStrip end>{actions}</ButtonStrip>
        </ModalActions>
    </Modal>
);

export const DataEntryModalWrapper = withStyles(styles)(DataEntryModalWrapperPlain);
