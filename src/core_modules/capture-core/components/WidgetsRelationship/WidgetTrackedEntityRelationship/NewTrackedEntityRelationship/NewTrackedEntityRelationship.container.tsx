import React, { useCallback, useState } from 'react';
import { Button, spacersNum } from '@dhis2/ui';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';
import i18n from '@dhis2/d2-i18n';
import { NewTrackedEntityRelationshipPortal } from './NewTrackedEntityRelationship.portal';
import type { ContainerProps } from './NewTrackedEntityRelationship.types';

const styles = {
    container: {
        padding: `${spacersNum.dp8}px ${spacersNum.dp12}px ${spacersNum.dp12}px`,
    },
};

const NewTrackedEntityRelationshipPlain = ({
    renderElement,
    teiId,
    orgUnitId,
    programId,
    trackedEntityTypeName,
    relationshipTypes,
    trackedEntityTypeId,
    onCloseAddRelationship,
    onOpenAddRelationship,
    renderTrackedEntitySearch,
    renderTrackedEntityRegistration,
    onSelectFindMode,
    readOnly,
    hideButton,
    classes,
}: ContainerProps & WithStyles<typeof styles>) => {
    const [addWizardVisible, setAddWizardVisible] = useState(false);

    const closeAddWizard = useCallback(() => {
        setAddWizardVisible(false);
        onCloseAddRelationship && onCloseAddRelationship();
    }, [onCloseAddRelationship]);

    const openAddWizard = useCallback(() => {
        setAddWizardVisible(true);
        onOpenAddRelationship && onOpenAddRelationship();
    }, [onOpenAddRelationship]);

    return (
        <div className={classes.container}>
            {!hideButton && !readOnly && (
                <Button
                    onClick={openAddWizard}
                    small
                    secondary
                >
                    {i18n.t('New Relationship')}
                </Button>
            )}

            {
                addWizardVisible && (
                    <NewTrackedEntityRelationshipPortal
                        relationshipTypes={relationshipTypes}
                        teiId={teiId}
                        orgUnitId={orgUnitId}
                        trackedEntityTypeName={trackedEntityTypeName}
                        trackedEntityTypeId={trackedEntityTypeId}
                        programId={programId}
                        renderElement={renderElement}
                        onSave={closeAddWizard}
                        onCancel={closeAddWizard}
                        renderTrackedEntitySearch={renderTrackedEntitySearch}
                        renderTrackedEntityRegistration={renderTrackedEntityRegistration}
                        onSelectFindMode={onSelectFindMode}
                    />
                )
            }
        </div>
    );
};

export const NewTrackedEntityRelationship =
    withStyles(styles)(NewTrackedEntityRelationshipPlain);
