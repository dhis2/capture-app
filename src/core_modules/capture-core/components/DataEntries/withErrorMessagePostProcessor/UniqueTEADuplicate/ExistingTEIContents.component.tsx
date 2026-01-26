import React from 'react';
import { withStyles, WithStyles } from 'capture-core-utils/styles';
import i18n from '@dhis2/d2-i18n';
import { Button, ModalContent, ModalTitle, ModalActions } from '@dhis2/ui';
import { CardList } from '../../../CardList';
import type { Props } from './existingTeiContents.types';


const styles = ({
    customDialogActions: {
        marginInline: 4,
    },
});

const ExistingTEIContentsComponentPlain = ({
    attributeValues,
    teiId,
    dataElements,
    onCancel,
    programId,
    ExistingUniqueValueDialogActions,
    classes,
}: Props & WithStyles<typeof styles>) => {
    const items = [
        {
            id: teiId,
            values: attributeValues,
        },
    ];

    return (
        <React.Fragment>
            <ModalContent>
                <ModalTitle>
                    {i18n.t('Registered person')}
                </ModalTitle>
                <CardList
                    currentProgramId={programId}
                    items={items}
                    dataElements={dataElements}
                />
            </ModalContent>
            <ModalActions>
                <Button
                    onClick={onCancel}
                    secondary
                >
                    {i18n.t('Cancel')}
                </Button>
                {ExistingUniqueValueDialogActions && (
                    <div className={classes.customDialogActions}>
                        <ExistingUniqueValueDialogActions
                            attributeValues={attributeValues}
                            teiId={teiId}
                        />
                    </div>
                )}
            </ModalActions>
        </React.Fragment>
    );
};

export const ExistingTEIContentsComponent =
    withStyles(styles)(ExistingTEIContentsComponentPlain);
