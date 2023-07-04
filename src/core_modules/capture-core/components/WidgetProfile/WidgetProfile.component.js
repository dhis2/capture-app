// @flow
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import type { ComponentType } from 'react';
import { useSelector } from 'react-redux';
import i18n from '@dhis2/d2-i18n';
import { Button, spacers } from '@dhis2/ui';
import { withStyles } from '@material-ui/core';
import log from 'loglevel';
import { FlatList } from 'capture-ui';
import { errorCreator } from 'capture-core-utils';
import { Widget } from '../Widget';
import { LoadingMaskElementCenter } from '../LoadingMasks';
import { NoticeBox } from '../NoticeBox';
import { convertValue as convertClientToView } from '../../converters/clientToView';
import type { Props } from './widgetProfile.types';
import { useProgram, useTrackedEntityInstances, useClientAttributesWithSubvalues, useUserRoles } from './hooks';
import { DataEntry, dataEntryActionTypes, TEI_MODAL_STATE, getTeiDisplayName } from './DataEntry';

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
};

const showEditModal = (loading, error, showEdit, modalState) =>
    !loading && !error && showEdit && modalState !== TEI_MODAL_STATE.CLOSE;

const WidgetProfilePlain = ({
    teiId,
    programId,
    showEdit = false,
    orgUnitId = '',
    onUpdateTeiAttributeValues,
    classes,
}: Props) => {
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
        trackedEntityInstanceAttributes,
        trackedEntityTypeName,
        geometry,
    } = useTrackedEntityInstances(teiId, programId, storedAttributeValues, storedGeometry);
    const {
        loading: userRolesLoading,
        error: userRolesError,
        userRoles,
    } = useUserRoles();

    const isEditable = useMemo(() =>
        trackedEntityInstanceAttributes.length > 0 && showEdit,
    [trackedEntityInstanceAttributes, showEdit]);

    const loading = programsLoading || trackedEntityInstancesLoading || userRolesLoading;
    const error = programsError || trackedEntityInstancesError || userRolesError;
    const clientAttributesWithSubvalues = useClientAttributesWithSubvalues(program, trackedEntityInstanceAttributes);
    const teiDisplayName = getTeiDisplayName(program, storedAttributeValues, clientAttributesWithSubvalues, teiId);

    const displayInListAttributes = useMemo(() => clientAttributesWithSubvalues
        .filter(item => item.displayInList)
        .map(({ optionSet, attribute, key, value: clientValue, valueType }) => {
            let value;
            if (optionSet && optionSet.id) {
                const selectedOption = optionSet.options.find(option => option.code === clientValue);
                value = selectedOption && selectedOption.name;
            } else {
                value = convertClientToView(clientValue, valueType);
            }
            return {
                attribute, key, value, reactKey: attribute,
            };
        }), [clientAttributesWithSubvalues]);

    useEffect(() => {
        hasError && setTeiModalState(TEI_MODAL_STATE.OPEN_ERROR);
    }, [hasError]);

    useEffect(() => {
        if (storedAttributeValues?.length > 0) {
            setTeiModalState(TEI_MODAL_STATE.CLOSE);
            onUpdateTeiAttributeValues && onUpdateTeiAttributeValues(storedAttributeValues, teiDisplayName);
        }
    }, [storedAttributeValues, onUpdateTeiAttributeValues, teiDisplayName]);

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
                        <div>{i18n.t('{{TETName}} profile', {
                            TETName: trackedEntityTypeName,
                            interpolation: { escapeValue: false },
                        })}</div>
                        {isEditable && (
                            <Button onClick={() => setTeiModalState(TEI_MODAL_STATE.OPEN)} secondary small>
                                {i18n.t('Edit')}
                            </Button>
                        )}
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

export const WidgetProfile: ComponentType<$Diff<Props, CssClasses>> = withStyles(styles)(WidgetProfilePlain);
