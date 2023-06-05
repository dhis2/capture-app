// @flow
import React, { useCallback, useState, type ComponentType } from 'react';
import { Button, spacers } from '@dhis2/ui';
import { withStyles } from '@material-ui/core';
import i18n from '@dhis2/d2-i18n';
import { NewTrackedEntityRelationshipPortal } from './NewTrackedEntityRelationship.portal';
import type { ContainerProps, StyledContainerProps } from './NewTrackedEntityRelationship.types';

const styles = {
    container: {
        padding: `0 ${spacers.dp16} ${spacers.dp24} ${spacers.dp16}`,
    },
};

export const NewTrackedEntityRelationshipPlain = ({
    renderElement,
    programId,
    relationshipTypes,
    trackedEntityTypeId,
    onCloseAddRelationship,
    onOpenAddRelationship,
    classes,
}: StyledContainerProps) => {
    const [addWizardVisible, setAddWizardVisibility] = useState(false);

    const closeAddWizard = useCallback(() => {
        setAddWizardVisibility(false);
        onCloseAddRelationship && onCloseAddRelationship();
    }, [onCloseAddRelationship]);

    const openAddWizard = useCallback(() => {
        setAddWizardVisibility(true);
        onOpenAddRelationship && onOpenAddRelationship();
    }, [onOpenAddRelationship]);

    return (
        <div className={classes.container}>
            <Button
                onClick={openAddWizard}
                small
                secondary
            >
                {i18n.t('New Relationship')}
            </Button>

            {
                addWizardVisible && (
                    <NewTrackedEntityRelationshipPortal
                        relationshipTypes={relationshipTypes}
                        trackedEntityTypeId={trackedEntityTypeId}
                        programId={programId}
                        renderElement={renderElement}
                        onSave={closeAddWizard}
                        onCancel={closeAddWizard}
                    />
                )
            }
        </div>
    );
};

export const NewTrackedEntityRelationship: ComponentType<ContainerProps> =
    withStyles(styles)(NewTrackedEntityRelationshipPlain);
