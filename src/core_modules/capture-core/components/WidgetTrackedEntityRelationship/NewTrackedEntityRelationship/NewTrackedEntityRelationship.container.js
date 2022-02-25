// @flow
import React, { useCallback, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import * as ReactDOM from 'react-dom';
import { withStyles } from '@material-ui/core';
import i18n from '@dhis2/d2-i18n';
import { Widget } from '../../Widget';
import { NewTrackedEntityRelationshipComponent } from './NewTrackedEntityRelationship.component';
import { NewTEIRelationshipStatuses } from '../WidgetTrackedEntityRelationship.const';
import type { Props } from './NewTrackedEntityRelationship.types';
import { LinkButton } from '../../Buttons/LinkButton.component';
import { Breadcrumbs } from './Breadcrumbs/Breadcrumbs';
import { useLocationQuery } from '../../../utils/routing';
import { creationModeStatuses } from './NewTrackedEntityRelationship.const';
import { requestSaveRelationshipForTei, startTeiSearchForWidget } from './NewTrackedEntityRelationship.actions';

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
    setShowDialog,
    hideDialog,
    relationshipTypes,
    trackedEntityType,
    classes,
    ...passOnProps
}: Props) => {
    const [selectedRelationshipType, setSelectedRelationshipType] = useState();
    const [creationMode, setCreationMode] = useState();
    const { programId, teiId } = useLocationQuery();
    const dispatch = useDispatch();

    const handleAddRelationship = useCallback((linkedTei) => {
        if (selectedRelationshipType) {
            const {
                constraintSide,
                id,
            } = selectedRelationshipType;
            const linkedTeiConstraintSide: string = constraintSide !== 'from' ? 'from' : 'to';

            const serverData = {
                relationships: [{
                    relationshipType: id,
                    [constraintSide]: {
                        trackedEntity: teiId,
                    },
                    [linkedTeiConstraintSide]: {
                        trackedEntity: linkedTei,
                    },
                }],
            };

            dispatch(requestSaveRelationshipForTei({ serverData }));
            setShowDialog();
        }
    }, [dispatch, selectedRelationshipType, setShowDialog, teiId]);

    const pageStatus = useMemo(() => {
        if (!selectedRelationshipType) {
            return NewTEIRelationshipStatuses.MISSING_RELATIONSHIP_TYPE;
        }
        if (!creationMode) {
            return NewTEIRelationshipStatuses.MISSING_CREATION_MODE;
        }
        if (creationMode === creationModeStatuses.SEARCH) {
            return NewTEIRelationshipStatuses.LINK_TO_EXISTING;
        }
        return NewTEIRelationshipStatuses.DEFAULT;
    }, [creationMode, selectedRelationshipType]);

    const onSelectRelationshipType = useCallback(
        relationshipType => setSelectedRelationshipType(relationshipType),
        []);

    const onCancel = useCallback(() => {
        hideDialog();
        setSelectedRelationshipType();
        setCreationMode();
    }, [hideDialog]);

    const onResetRelationshipType = useCallback(() => {
        setSelectedRelationshipType();
        setCreationMode();
    }, []);

    const onResetCreationMode = useCallback(() => {
        setCreationMode();
    }, []);

    const onSetCreationMode = useCallback((value) => {
        setCreationMode(value);
        dispatch(startTeiSearchForWidget({ selectedRelationshipType }));
    }, [dispatch, selectedRelationshipType]);

    if (!showDialog || !renderRef.current) {
        return null;
    }

    return ReactDOM.createPortal((
        <>
            <div className={classes.container}>
                <div className={classes.bar}>
                    <LinkButton onClick={onCancel} className={classes.linkText}>
                        {i18n.t('Go back without saving relationship')}
                    </LinkButton>
                </div>
                <Widget
                    noncollapsible
                    header={<Breadcrumbs
                        pageStatus={pageStatus}
                        selectedRelationshipType={selectedRelationshipType}
                        onResetRelationshipType={onResetRelationshipType}
                        onResetCreationMode={onResetCreationMode}
                    />}
                >
                    <NewTrackedEntityRelationshipComponent
                        relationshipTypes={relationshipTypes}
                        trackedEntityType={trackedEntityType}
                        addRelationship={handleAddRelationship}
                        programId={programId}
                        pageStatus={pageStatus}
                        onSelectType={onSelectRelationshipType}
                        onSetCreationMode={onSetCreationMode}
                        {...passOnProps}
                    />
                </Widget>
            </div>
        </>
    ), renderRef.current);
};

export const NewTrackedEntityRelationship = withStyles(styles)(NewTrackedEntityRelationshipPlain);
