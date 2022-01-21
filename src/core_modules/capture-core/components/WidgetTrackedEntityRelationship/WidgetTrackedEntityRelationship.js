// @flow
import React, { useCallback, useState } from 'react';
import { Button } from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import { NewTrackedEntityRelationship } from './NewTrackedEntityRelationship/NewTrackedEntityRelationship.container';
import type { Props } from './WidgetTrackedEntityRelationsip.types';

export const WidgetTrackedEntityRelationship = ({ relationshipTypes, renderRef }: Props) => {
    const [showDialog, setShowDialog] = useState(false);

    const onStartNewRelationship = useCallback(() => {
        setShowDialog(prevState => !prevState);
    }, []);

    const hideDialog = useCallback(() => {
        setShowDialog(prevState => !prevState);
    }, []);

    return (
        <>
            <Button
                onClick={onStartNewRelationship}
            >
                {i18n.t('New Relationship')}
            </Button>

            <NewTrackedEntityRelationship
                relationshipTypes={relationshipTypes}
                renderRef={renderRef}
                showDialog={showDialog}
                hideDialog={hideDialog}
            />
        </>
    );
};
