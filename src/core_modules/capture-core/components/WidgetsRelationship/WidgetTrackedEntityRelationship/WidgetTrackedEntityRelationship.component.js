// @flow
import React, { useCallback, useState } from 'react';
import { Button } from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import { NewTrackedEntityRelationship } from './NewTrackedEntityRelationship';
import type { Props } from './WidgetTrackedEntityRelationship.types';

export const WidgetTrackedEntityRelationship = ({
    relationshipTypes = [],
    trackedEntityTypeId,
    programId,
    addRelationshipRenderElement,
    onOpenAddRelationship,
    onCloseAddRelationship,
    getPrograms,
    getSearchGroups,
    getSearchGroupsAsync,
}: Props) => {
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
        <>
            <Button
                onClick={openAddWizard}
            >
                {i18n.t('New Relationship')}
            </Button>
            {
                addWizardVisible &&
                <NewTrackedEntityRelationship
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
            }
        </>
    );
};
