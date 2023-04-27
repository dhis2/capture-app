// @flow
import React, { useCallback, useState } from 'react';
import { Button, spacers } from '@dhis2/ui';
import { withStyles } from '@material-ui/core';
import i18n from '@dhis2/d2-i18n';
import { NewTrackedEntityRelationshipPortal } from './NewTrackedEntityRelationship.portal';
import type { PlainProps } from './NewTrackedEntityRelationship.types';

const styles = {
    container: {
        padding: `0 ${spacers.dp16} ${spacers.dp24} ${spacers.dp16}`,
    },
};

export const NewTrackedEntityRelationshipPlain = ({
    addRelationshipRenderElement,
    programId,
    relationshipTypes,
    trackedEntityTypeId,
    onCloseAddRelationship,
    onOpenAddRelationship,
    getPrograms,
    getSearchGroups = () => {},
    getSearchGroupsAsync = () => {},
    classes,
}: PlainProps) => {
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
                        // $FlowFixMe
                        relationshipTypes={relationshipTypes}
                        trackedEntityTypeId={trackedEntityTypeId}
                        programId={programId}
                        renderElement={addRelationshipRenderElement}
                        onSave={closeAddWizard}
                        onCancel={closeAddWizard}
                        getPrograms={getPrograms}
                        getSearchGroups={getSearchGroups}
                        getSearchGroupsAsync={getSearchGroupsAsync}
                    />
                )
            }
        </div>
    );
};

export const NewTrackedEntityRelationship = withStyles(styles)(NewTrackedEntityRelationshipPlain);
