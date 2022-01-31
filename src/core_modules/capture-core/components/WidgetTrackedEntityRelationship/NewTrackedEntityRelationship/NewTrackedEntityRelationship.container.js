// @flow
import React, { useCallback, useMemo, useState } from 'react';
import * as ReactDOM from 'react-dom';
import { withStyles } from '@material-ui/core';
import { Widget } from '../../Widget';
import { NewTrackedEntityRelationshipComponent } from './NewTrackedEntityRelationship.component';
import { NewTEIRelationshipStatuses } from '../WidgetTrackedEntityRelationship.const';
import type { Props } from './NewTrackedEntityRelationship.types';
import { useFilteredRelationshipTypes } from '../hooks';
import { LinkButton } from '../../Buttons/LinkButton.component';
import { Breadcrumbs } from './Breadcrumbs/Breadcrumbs';
import { useLocationQuery } from '../../../utils/routing';

const styles = {
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#FAFAFA',
    },
    bar: {
        color: '#494949',
        padding: '8px',
        display: 'inline-block',
        fontSize: '14px',
        borderRadius: '4px',
        marginBottom: '10px',
        backgroundColor: '#E9EEF4',
    },
    linkText: {
        backgroundColor: 'transparent',
        fontSize: 'inherit',
        color: 'inherit',
    },
};

export const NewTrackedEntityRelationshipPlain = ({
    renderRef,
    showDialog,
    hideDialog,
    relationshipTypes,
    trackedEntityType,
    classes,
    ...passOnProps
}: Props) => {
    const [selectedRelationshipType, setSelectedRelationshipType] = useState();
    const [creationMode, setCreationMode] = useState();
    const { programId } = useLocationQuery();
    const filteredRelationshipTypes = useFilteredRelationshipTypes(relationshipTypes, trackedEntityType, programId);

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
        <>
            <div className={classes.container}>
                <div className={classes.bar}>
                    <LinkButton onClick={onCancel} className={classes.linkText}>
                        Go back without saving relationship
                    </LinkButton>
                </div>
                <Widget
                    noncollapsible
                    header={<Breadcrumbs />}
                >
                    <NewTrackedEntityRelationshipComponent
                        relationshipTypes={filteredRelationshipTypes}
                        trackedEntityType={trackedEntityType}
                        programId={programId}
                        pageStatus={pageStatus}
                        onSelectType={onSelectRelationshipType}
                        {...passOnProps}
                    />
                </Widget>
            </div>
        </>
    ), renderRef.current);
};

export const NewTrackedEntityRelationship = withStyles(styles)(NewTrackedEntityRelationshipPlain);
