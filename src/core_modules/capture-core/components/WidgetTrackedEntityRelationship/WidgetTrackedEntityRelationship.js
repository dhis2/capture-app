// @flow
import React, { useCallback, useState } from 'react';
import { Button } from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import { NewTrackedEntityRelationship } from './NewTrackedEntityRelationship/NewTrackedEntityRelationship.container';
import type { Props } from './WidgetTrackedEntityRelationship.types';

export const WidgetTrackedEntityRelationship = ({ ...PassOnProps }: Props) => {
    const [showDialog, setShowDialog] = useState(false);

    const changeDialogView = useCallback(() => {
        setShowDialog(prevState => !prevState);
    }, []);

    return (
        <>
            <Button
                onClick={changeDialogView}
            >
                {i18n.t('New Relationship')}
            </Button>

            <NewTrackedEntityRelationship
                showDialog={showDialog}
                hideDialog={changeDialogView}
                {...PassOnProps}
            />
        </>
    );
};
