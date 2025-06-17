/* eslint-disable complexity */
import React, { useEffect, useState, useCallback, useMemo, type ComponentType } from 'react';
import { useSelector } from 'react-redux';
import i18n from '@dhis2/d2-i18n';
import { Button, spacers } from '@dhis2/ui';
import { withStyles, type WithStyles } from '@material-ui/core';
import log from 'loglevel';
import { FlatList } from 'capture-ui';
import { useQueryClient } from 'react-query';
import { errorCreator, FEATURES, useFeature } from 'capture-core-utils';
import { Widget } from '../Widget';
import { LoadingMaskElementCenter } from '../LoadingMasks';
import { NoticeBox } from '../NoticeBox';
import type { Props } from './widgetProfile.types';
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
import {
    useDataEntryFormConfig,
} from '../DataEntries/common/TEIAndEnrollment';

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

const showEditModal = (loading: boolean, error: any, showEdit: boolean, modalState: string) =>
    !loading && !error && showEdit && modalState !== TEI_MODAL_STATE.CLOSE;

type ComponentProps = Props & WithStyles<typeof styles>;

const WidgetProfilePlain = ({
    teiId,
    programId,
    readOnlyMode = false,
    orgUnitId = '',
    onUpdateTeiAttributeValues,
    onDeleteSuccess,
    classes,
}: ComponentProps) => {
    const supportsChangelog = useFeature(FEATURES.changelogs);
    const queryClient = useQueryClient();
    const [open, setOpen] = useState<boolean>(true);
    const [modalState, setModalState] = useState<string>(TEI_MODAL_STATE.CLOSE);
    const { loading: programsLoading, program, error: programsError } = useProgram(programId);
    const { storedAttributeValues, storedGeometry, hasError } = useSelector(({ trackedEntityInstance }: any) => ({
        storedAttributeValues: trackedEntityInstance?.attributeValues,
        storedGeometry: trackedEntityInstance?.geometry,
        hasError: trackedEntityInstance?.hasError,
    }));
    const { configIsFetched, dataEntryFormConfig } = useDataEntryFormConfig({ selectedScopeId: programId });
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
        (Array.isArray(trackedEntityInstanceAttributes) && trackedEntityInstanceAttributes.length > 0) && trackedEntityTypeAccess?.data?.write && !readOnlyMode,
    [trackedEntityInstanceAttributes, readOnlyMode, trackedEntityTypeAccess]);

    const loading = programsLoading || trackedEntityInstancesLoading || userRolesLoading || !configIsFetched;
    const error = programsError ?? trackedEntityInstancesError ?? userRolesError;
    const clientAttributesWithSubvalues = useClientAttributesWithSubvalues(teiId, program as any, Array.isArray(trackedEntityInstanceAttributes) ? trackedEntityInstanceAttributes : []);
    const teiDisplayName = useTeiDisplayName(program, storedAttributeValues, clientAttributesWithSubvalues, teiId);
    const displayChangelog = supportsChangelog && program?.trackedEntityType?.changelogEnabled;

    const displayInListAttributes = useMemo(() => clientAttributesWithSubvalues
        .filter(item => item.displayInList)
        .map((clientAttribute) => {
            const { attribute, key, valueType } = clientAttribute;
            const value = convertClientToView(clientAttribute);
            return {
                attribute, key, value, valueType, reactKey: attribute,
            };
        }), [clientAttributesWithSubvalues]);

    const onSaveExternal = useCallback(() => {
        queryClient.removeQueries([ReactQueryAppNamespace, 'changelog', CHANGELOG_ENTITY_TYPES.TRACKED_ENTITY, teiId]);
    }, [queryClient, teiId]);

    useEffect(() => {
        hasError && setModalState(TEI_MODAL_STATE.OPEN_ERROR);
    }, [hasError]);

    useEffect(() => {
        if (storedAttributeValues?.length > 0) {
            setModalState(TEI_MODAL_STATE.CLOSE);
            onUpdateTeiAttributeValues?.(storedAttributeValues, teiDisplayName);
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
    const handleOnDisable = useCallback(() => setModalState(TEI_MODAL_STATE.OPEN_DISABLE), [setModalState]);
    const handleOnEnable = useCallback(() => setModalState(TEI_MODAL_STATE.OPEN), [setModalState]);

    return (
        <div data-test="profile-widget">
            <Widget
                header={
                    <div className={classes.header}>
                        <div>
                            {trackedEntityTypeName
                                ? i18n.t('{{trackedEntityTypeName}} profile', {
                                    trackedEntityTypeName,
                                    interpolation: { escapeValue: false },
                                })
                                : i18n.t('Profile')}
                        </div>
                        <div className={classes.actions}>
                            {isEditable && (
                                <Button onClick={() => setModalState(TEI_MODAL_STATE.OPEN)} secondary small>
                                    {i18n.t('Edit')}
                                </Button>
                            )}
                            <OverflowMenu
                                trackedEntityTypeName={trackedEntityTypeName}
                                canWriteData={canWriteData}
                                trackedEntity={trackedEntity as any}
                                onDeleteSuccess={onDeleteSuccess}
                                displayChangelog={!!displayChangelog}
                                trackedEntityData={clientAttributesWithSubvalues}
                                teiId={teiId}
                                programAPI={program}
                                readOnlyMode={readOnlyMode ?? false}
                            />
                        </div>
                    </div>
                }
                onOpen={useCallback(() => setOpen(true), [setOpen])}
                onClose={useCallback(() => setOpen(false), [setOpen])}
                open={open}
            >
                {renderProfile()}
            </Widget>
            {showEditModal(loading, error, isEditable, modalState) && (
                <>
                    <DataEntry
                        onCancel={() => setModalState(TEI_MODAL_STATE.CLOSE)}
                        onDisable={handleOnDisable}
                        onEnable={handleOnEnable}
                        programAPI={program}
                        dataEntryFormConfig={dataEntryFormConfig}
                        orgUnitId={orgUnitId}
                        clientAttributesWithSubvalues={clientAttributesWithSubvalues}
                        userRoles={userRoles ?? []}
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

export const WidgetProfile = withStyles(styles)(WidgetProfilePlain) as ComponentType<Props>;
