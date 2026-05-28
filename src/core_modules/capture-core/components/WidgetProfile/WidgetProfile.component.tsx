import React, { useEffect, useState, useCallback, useMemo, type ComponentType } from 'react';
import { useSelector } from 'react-redux';
import i18n from '@dhis2/d2-i18n';
import { Button, spacers, colors } from '@dhis2/ui';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';
import log from 'loglevel';
import { FlatList } from 'capture-ui';
import { useQueryClient } from '@tanstack/react-query';
import { errorCreator, FEATURES, useFeature } from 'capture-core-utils';
import { Widget } from '../Widget';
import { LoadingMaskElementCenter } from '../LoadingMasks';
import { NoticeBox } from '../NoticeBox';
import type { Props } from './widgetProfile.types';
import {
    useProgram,
    useTrackedEntityInstances,
    useClientAttributesWithSubvalues,
    useTeiDisplayName,
} from './hooks';
import { CurrentUser } from '../../utils/userInfo/CurrentUser';
import { DataEntry, dataEntryActionTypes, TEI_MODAL_STATE, convertClientToView } from './DataEntry';
import { ReactQueryAppNamespace } from '../../utils/reactQueryHelpers';
import { CHANGELOG_ENTITY_TYPES } from '../WidgetsChangelog';
import { OverflowMenu } from './OverflowMenu';
import {
    useDataEntryFormConfig,
} from '../DataEntries/common/TEIAndEnrollment';
import { useEnrollmentAccessContext } from '../Pages/common/EnrollmentOverviewDomain/EnrollmentAccessContext';

const styles: Readonly<any> = {
    header: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
    },
    container: {
        padding: `0 ${spacers.dp12}`,
        marginBottom: spacers.dp8,
    },
    actions: {
        display: 'flex',
        gap: '4px',
    },
    emptyText: {
        color: colors.grey600,
        fontWeight: 400,
        fontSize: '14px',
        lineHeight: '19px',
        marginTop: 0,
    },
};

const showEditModal = (loading: boolean, error: any, showEdit: boolean, modalState: string, program: any) =>
    !loading && !error && showEdit && modalState !== TEI_MODAL_STATE.CLOSE && Boolean(program?.id);

const computeLoadingState = (
    programsLoading: boolean,
    trackedEntityInstancesLoading: boolean,
    configIsFetched: boolean,
) => programsLoading || trackedEntityInstancesLoading || !configIsFetched;

const computeError = (
    programsError: any,
    trackedEntityInstancesError: any,
) => programsError || trackedEntityInstancesError;

const WidgetProfilePlain = ({
    teiId,
    programId,
    readOnlyMode = false,
    orgUnitId = '',
    onUpdateTeiAttributeValues,
    onDeleteSuccess,
    classes,
}: Props & WithStyles<typeof styles>) => {
    const supportsChangelog = useFeature(FEATURES.changelogs);
    const queryClient = useQueryClient();
    const [open, setOpenStatus] = useState(true);
    const [modalState, setTeiModalState] = useState(TEI_MODAL_STATE.CLOSE);
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
        geometry,
    } = useTrackedEntityInstances(teiId, programId, storedAttributeValues, storedGeometry);
    const {
        programWriteAccess,
        trackedEntityTypeWriteAccess,
    } = useEnrollmentAccessContext();
    const trackedEntityTypeName = program?.trackedEntityType?.displayName;
    const userRoles = CurrentUser.get().userRoles;

    const hasNoAttributes = !program?.programTrackedEntityAttributes?.length;

    const isEditable = useMemo(
        () => !hasNoAttributes && trackedEntityTypeWriteAccess && !readOnlyMode,
        [hasNoAttributes, trackedEntityTypeWriteAccess, readOnlyMode],
    );

    const profileButtonLabel = useMemo(() => {
        if (readOnlyMode || hasNoAttributes) return null;
        if (!isEditable) return i18n.t('View profile');
        if (isEditable) return i18n.t('Edit');
        return null;
    }, [isEditable, readOnlyMode, hasNoAttributes]);

    const loading = computeLoadingState(programsLoading, trackedEntityInstancesLoading, configIsFetched);
    const error = computeError(programsError, trackedEntityInstancesError);
    const clientAttributesWithSubvalues = useClientAttributesWithSubvalues(
        teiId,
        program as any,
        trackedEntityInstanceAttributes,
    );
    const teiDisplayName = useTeiDisplayName(program, storedAttributeValues, clientAttributesWithSubvalues, teiId);
    const displayChangelog = supportsChangelog && program && program.trackedEntityType?.changelogEnabled;

    const displayInListAttributes = useMemo(() => clientAttributesWithSubvalues
        .filter((item: any) => item.displayInList)
        .map((clientAttribute: any) => {
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
        hasError && setTeiModalState(TEI_MODAL_STATE.OPEN_ERROR);
    }, [hasError]);

    useEffect(() => {
        if (storedAttributeValues?.length > 0) {
            setTeiModalState(TEI_MODAL_STATE.CLOSE);
            onUpdateTeiAttributeValues && onUpdateTeiAttributeValues(storedAttributeValues, teiDisplayName);
        }
    }, [storedAttributeValues, onUpdateTeiAttributeValues, teiDisplayName]);

    const canWriteData = useMemo(
        () => trackedEntityTypeWriteAccess && programWriteAccess,
        [trackedEntityTypeWriteAccess, programWriteAccess],
    );

    const renderProfile = () => {
        if (loading) {
            return <LoadingMaskElementCenter />;
        }

        if (error) {
            log.error(errorCreator('Profile widget could not be loaded')({ error }));
            return <span>{i18n.t('Profile widget could not be loaded. Please try again later')}</span>;
        }

        if (hasNoAttributes) {
            return (
                <div className={classes.container}>
                    <p className={classes.emptyText}>
                        {trackedEntityTypeName
                            ? i18n.t('No attributes configured for {{trackedEntityTypeName}}', {
                                trackedEntityTypeName,
                                interpolation: { escapeValue: false },
                            })
                            : i18n.t('No attributes configured')}
                    </p>
                </div>
            );
        }

        return (
            <div className={classes.container}>
                <FlatList dataTest="profile-widget-flatlist" list={displayInListAttributes} />
            </div>
        );
    };

    const handleOnDisable = useCallback(() => setTeiModalState(TEI_MODAL_STATE.OPEN_DISABLE), [setTeiModalState]);
    const handleOnEnable = useCallback(() => setTeiModalState(TEI_MODAL_STATE.OPEN), [setTeiModalState]);
    const handleOpen = useCallback(() => setOpenStatus(true), [setOpenStatus]);
    const handleClose = useCallback(() => setOpenStatus(false), [setOpenStatus]);

    const isEmptyList = !loading && !error && !hasNoAttributes && displayInListAttributes.length === 0;

    const trackedEntityProp = useMemo(() => ({
        trackedEntity: trackedEntity ? (trackedEntity.trackedEntity || teiId) : teiId,
    }), [trackedEntity, teiId]);

    const widgetHeader = (
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
                {profileButtonLabel && (
                    <Button onClick={() => setTeiModalState(TEI_MODAL_STATE.OPEN)} secondary small>
                        {profileButtonLabel}
                    </Button>
                )}
                <OverflowMenu
                    trackedEntityTypeName={trackedEntityTypeName}
                    canWriteData={canWriteData}
                    trackedEntity={trackedEntityProp}
                    onDeleteSuccess={onDeleteSuccess}
                    displayChangelog={!!displayChangelog}
                    trackedEntityData={clientAttributesWithSubvalues}
                    teiId={teiId}
                    programAPI={program}
                    readOnlyMode={readOnlyMode}
                />
            </div>
        </div>
    );

    return (
        <div data-test="profile-widget">
            <Widget
                header={widgetHeader}
                onOpen={handleOpen}
                onClose={handleClose}
                open={open}
                noncollapsible={isEmptyList}
            >
                {renderProfile()}
            </Widget>
            {showEditModal(loading, error, Boolean(profileButtonLabel), modalState, program) && (
                <>
                    <DataEntry
                        onCancel={() => setTeiModalState(TEI_MODAL_STATE.CLOSE)}
                        onDisable={handleOnDisable}
                        onEnable={handleOnEnable}
                        programAPI={program}
                        dataEntryFormConfig={dataEntryFormConfig}
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
                        readOnly={!isEditable}
                        accessReadOnly={!trackedEntityTypeWriteAccess}
                    />
                    <NoticeBox formId="trackedEntityProfile-edit" />
                </>
            )}
        </div>
    );
};

export const WidgetProfile = withStyles(styles)(WidgetProfilePlain) as ComponentType<Props>;
