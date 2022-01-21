// @flow
import React, { useCallback, useMemo, useState } from 'react';
import * as ReactDOM from 'react-dom';
import { colors } from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import { withStyles } from '@material-ui/core';
import { Widget } from '../../Widget';
import { NewTrackedEntityRelationshipComponent } from './NewTrackedEntityRelationship.component';
import { NewTEIRelationshipStatuses } from '../WidgetTrackedEntityRelationship.const';
import type { Props } from './NewTrackedEntityRelationship.types';

const styles = {
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#fff',
        borderRadius: 3,
        borderStyle: 'solid',
        borderColor: colors.grey400,
        borderWidth: 1,
    },
};

export const NewTrackedEntityRelationshipPlain = ({ renderRef, showDialog, hideDialog, classes, ...passOnProps }: Props) => {
    const [selectedRelationshipType, setSelectedRelationshipType] = useState();
    const [creationMode, setCreationMode] = useState();

    const pageStatus = useMemo(() => {
        if (!selectedRelationshipType) {
            return NewTEIRelationshipStatuses.MISSING_RELATIONSHIP_TYPE;
        }
        if (!creationMode) {
            return NewTEIRelationshipStatuses.MISSING_CREATION_MODE;
        }
        return NewTEIRelationshipStatuses.DEFAULT;
    }, [creationMode, selectedRelationshipType]);


    const onSelectRelationshipType = useCallback(
        relationshipType => setSelectedRelationshipType(relationshipType), [],
    );

    const onCancel = useCallback(() => {
        hideDialog();
        setSelectedRelationshipType();
        setCreationMode();
    }, [hideDialog]);

    if (!showDialog || !renderRef.current) {
        return null;
    }

    return ReactDOM.createPortal((
        <div className={classes.container}>
            <Widget
                noncollapsible
                borderless
                header={<p>{i18n.t('New TEI - Relationship handler')}</p>}
            >
                <NewTrackedEntityRelationshipComponent
                    onSelectType={onSelectRelationshipType}
                    pageStatus={pageStatus}
                    onCancel={onCancel}
                    {...passOnProps}
                />
            </Widget>
        </div>
    ), renderRef.current);
};

export const NewTrackedEntityRelationship = withStyles(styles)(NewTrackedEntityRelationshipPlain);
