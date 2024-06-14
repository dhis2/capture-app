// @flow
/* eslint-disable complexity */
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import type { ComponentType } from 'react';
import { useSelector } from 'react-redux';
import i18n from '@dhis2/d2-i18n';
import { Button, spacers } from '@dhis2/ui';
import { withStyles } from '@material-ui/core';
import log from 'loglevel';
import { FlatList } from 'capture-ui';
import { useQueryClient } from 'react-query';
import { errorCreator, FEATURES, useFeature } from 'capture-core-utils';
import { Widget } from '../Widget';
import { LoadingMaskElementCenter } from '../LoadingMasks';
import { NoticeBox } from '../NoticeBox';
import type { PlainProps } from './widgetProfile.types';
import {
    useProgram,
    useTrackedEntityInstances,
    useClientAttributesWithSubvalues,
    useUserRoles,
    useTeiDisplayName,
} from './hooks';
import { DataEntry, dataEntryActionTypes, TEI_MODAL_STATE, convertClientToView } from './DataEntry';
import { ReactQueryAppNamespace } from '../../utils/reactQueryHelpers';
import { CHANGELOG_ENTITY_TYPES } from '../WidgetsChangelog';
import { OverflowMenu } from './OverflowMenu';

const styles = {
    header: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
    },
    container: {
        padding: `0 ${spacers.dp16}`,
        marginBottom: spacers.dp8,
    },
    actions: {
        display: 'flex',
        gap: '4px',
    },
};

const showEditModal = (loading, error, showEdit, modalState) =>
    !loading && !error && showEdit && modalState !== TEI_MODAL_STATE.CLOSE;

const WidgetProfilePlain = ({
    teiId,
    programId,
    readOnlyMode = false,
    orgUnitId = '',
    onUpdateTeiAttributeValues,
    onDeleteSuccess,
    classes,
}: PlainProps) => {
    const supportsChangelog = useFeature(FEATURES.changelogs);
    const queryClient = useQueryClient();
    const [open, setOpenStatus] = useState(true);
    const [modalState, setTeiModalState] = useState(TEI_MODAL_STATE.CLOSE);
    const { loading: programsLoading, program, error: programsError } = useProgram(programId);
    const { storedAttributeValues, storedGeometry, hasError } = useSelector(({ trackedEntityInstance }) => ({
        storedAttributeValues: trackedEntityInstance?.attributeValues,
        storedGeometry: trackedEntityInstance?.geometry,
        hasError: trackedEntityInstance?.hasError,
    }));
    const {
        loading: trackedEntityInstancesLoading,
        error: trackedEntityInstancesError,
        trackedEntity,
        trackedEntityInstanceAttributes,
        trackedEntityTypeName,
        trackedEntityTypeAccess,
        geometry,
    } = useTrackedEntityInstances(teiId, programId, storedAttributeValues, storedGeometry);
    const {
        loading: userRolesLoading,
        error: userRolesError,
        userRoles,
    } = useUserRoles();

    const isEditable = useMemo(() =>
        trackedEntityInstanceAttributes.length > 0 && trackedEntityTypeAccess.write && !readOnlyMode,
    [trackedEntityInstanceAttributes, readOnlyMode, trackedEntityTypeAccess]);

    const loading = programsLoading || trackedEntityInstancesLoading || userRolesLoading;
    const error = programsError || trackedEntityInstancesError || userRolesError;
    const clientAttributesWithSubvalues = useClientAttributesWithSubvalues(teiId, program, trackedEntityInstanceAttributes);
    const teiDisplayName = useTeiDisplayName(program, storedAttributeValues, clientAttributesWithSubvalues, teiId);
    const displayChangelog = supportsChangelog && program && program.trackedEntityType?.changelogEnabled;

    const displayInListAttributes = useMemo(() => clientAttributesWithSubvalues
        .filter(item => item.displayInList)
        .map((clientAttribute) => {
            const { attribute, key } = clientAttribute;
            const value = convertClientToView(clientAttribute);
            return {
                attribute, key, value, reactKey: attribute,
            };
        }), [clientAttributesWithSubvalues]);

    const onSaveExternal = useCallback(() => {
        queryClient.removeQueries([ReactQueryAppNamespace, 'changelog', CHANGELOG_ENTITY_TYPES.TRACKED_ENTITY, teiId]);
    }, [queryClient, teiId]);

    useEffect(() => {
        hasError && setTeiModalState(TEI_MODAL_STATE.OPEN_ERROR);
    }, [hasError]);

    useEffect(() => {
        if (storedAttributeValues?.length > 0) {
            setTeiModalState(TEI_MODAL_STATE.CLOSE);
            onUpdateTeiAttributeValues && onUpdateTeiAttributeValues(storedAttributeValues, teiDisplayName);
        }
    }, [storedAttributeValues, onUpdateTeiAttributeValues, teiDisplayName]);

    const canWriteData = useMemo(
        () => trackedEntityTypeAccess?.data?.write && program?.access?.data?.write,
        [trackedEntityTypeAccess, program],
    );

    const renderProfile = () => {
        if (loading) {
            return <LoadingMaskElementCenter />;
        }

        if (error) {
            log.error(errorCreator('Profile widget could not be loaded')({ error }));
            return <span>{i18n.t('Profile widget could not be loaded. Please try again later')}</span>;
        }

        return (
            <div className={classes.container}>
                <FlatList dataTest="profile-widget-flatlist" list={displayInListAttributes} />
            </div>
        );
    };

    return (
        <div data-test="profile-widget">
            <Widget
                header={
                    <div className={classes.header}>
                        <div>{i18n.t('{{trackedEntityTypeName}} profile', {
                            trackedEntityTypeName,
                            interpolation: { escapeValue: false },
                        })}</div>
                        <div className={classes.actions}>
                            {isEditable && (
                                <Button onClick={() => setTeiModalState(TEI_MODAL_STATE.OPEN)} secondary small>
                                    {i18n.t('Edit')}
                                </Button>
                            )}
                            <OverflowMenu
                                trackedEntityTypeName={trackedEntityTypeName}
                                canWriteData={canWriteData}
                                trackedEntity={trackedEntity}
                                onDeleteSuccess={onDeleteSuccess}
                                displayChangelog={displayChangelog}
                                teiId={teiId}
                                programAPI={program}
                            />
                        </div>
                    </div>
                }
                onOpen={useCallback(() => setOpenStatus(true), [setOpenStatus])}
                onClose={useCallback(() => setOpenStatus(false), [setOpenStatus])}
                open={open}
            >
                {renderProfile()}
            </Widget>
            {showEditModal(loading, error, isEditable, modalState) && (
                <>
                    <DataEntry
                        onCancel={() => setTeiModalState(TEI_MODAL_STATE.CLOSE)}
                        onDisable={() => setTeiModalState(TEI_MODAL_STATE.OPEN_DISABLE)}
                        programAPI={program}
                        orgUnitId={orgUnitId}
                        clientAttributesWithSubvalues={clientAttributesWithSubvalues}
                        userRoles={userRoles}
                        trackedEntityInstanceId={teiId}
                        onSaveSuccessActionType={dataEntryActionTypes.TEI_UPDATE_SUCCESS}
                        onSaveErrorActionType={dataEntryActionTypes.TEI_UPDATE_ERROR}
                        onSaveExternal={onSaveExternal}
                        modalState={modalState}
                        geometry={geometry}
                        trackedEntityName={trackedEntityTypeName}
                    />
                    <NoticeBox formId="trackedEntityProfile-edit" />
                </>
            )}
        </div>
    );
};

export const WidgetProfile: ComponentType<$Diff<PlainProps, CssClasses>> = withStyles(styles)(WidgetProfilePlain);
