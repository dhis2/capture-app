import React, { useState, useRef, useCallback, useMemo } from 'react';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';
import i18n from '@dhis2/d2-i18n';
import { ListViewLoader } from '../ListViewLoader';
import { TemplateMaintenance, dialogModes } from '../TemplateMaintenance';
import type { Props } from './listViewConfigMenuContent.types';

const getStyles = (theme: any) => ({
    delete: {
        color: theme.palette.error.dark,
    },
});

type PlainProps = Props & WithStyles<typeof getStyles>;

const ListViewConfigMenuContentPlain = (props: PlainProps) => {
    const {
        currentTemplate,
        onAddTemplate,
        onUpdateTemplate,
        onDeleteTemplate,
        onSetTemplateSharingSettings,
        currentViewHasTemplateChanges,
        classes,
        customListViewMenuContents,
        templateSharingType,
        ...passOnProps
    } = props;
    const [maintenanceDialogOpenMode, setMaintenanceDialogOpenMode] = useState<
        'NEW' | 'REPLACE' | 'DELETE' | 'SHARING' | null
    >(null);
    const templateMaintenanceInstance = useRef<any>(null);

    const handleClose = useCallback(() => {
        setMaintenanceDialogOpenMode(null);
    }, []);

    const handleUpdateTemplate = useCallback((template: any) => {
        setMaintenanceDialogOpenMode(null);
        onUpdateTemplate && onUpdateTemplate(template);
    }, [onUpdateTemplate]);

    const handleAddTemplate = useCallback((name: string) => {
        setMaintenanceDialogOpenMode(null);
        onAddTemplate && onAddTemplate(name);
    }, [onAddTemplate]);

    const handleDeleteTemplate = useCallback((template: any) => {
        setMaintenanceDialogOpenMode(null);
        onDeleteTemplate && onDeleteTemplate(template);
    }, [onDeleteTemplate]);

    const handleSetSharingSettings = useCallback((sharingSettings: any, templateId: string) => {
        setMaintenanceDialogOpenMode(null);
        onSetTemplateSharingSettings && onSetTemplateSharingSettings(sharingSettings, templateId);
    }, [onSetTemplateSharingSettings]);

    const getSaveItem = useCallback(() => ({
        key: 'save',
        clickHandler: () => {
            templateMaintenanceInstance.current?.handleUpdateTemplate();
        },
        element: i18n.t('Update view'),
    }), []);

    const getSaveAsItem = useCallback((viewIsDefault: boolean, modified: boolean) => {
        if (viewIsDefault && !modified) {
            return {
                key: 'saveAs',
                element: i18n.t('Save current view...'),
            };
        }

        return {
            key: 'saveAs',
            clickHandler: () => {
                setMaintenanceDialogOpenMode(dialogModes.NEW);
            },
            element: viewIsDefault ? i18n.t('Save current view...') : i18n.t('Save current view as...'),
        };
    }, []);

    const getDeleteItem = useCallback(() => ({
        key: 'delete',
        clickHandler: () => {
            setMaintenanceDialogOpenMode(dialogModes.DELETE);
        },
        element: (
            <div className={classes.delete}>
                {i18n.t('Delete view')}
            </div>
        ),
    }), [
        classes.delete,
    ]);

    const getShareItem = useCallback(() => ({
        key: 'share',
        clickHandler: () => {
            setMaintenanceDialogOpenMode(dialogModes.SHARING);
        },
        element: i18n.t('Share view...'),
    }), []);

    const getSavedViewSubHeader = useCallback((viewName: string) => ({
        key: 'savedViewSubHeader',
        subHeader: viewName.length > 30 ? `${viewName.substring(0, 27)}...` : viewName,
    }), []);

    // eslint-disable-next-line complexity
    const customListViewMenuContentsExtended = useMemo(() => {
        const currentViewContents: any[] = [];
        const savedViewContents: any[] = [];

        const { access, isDefault, notPreserved, name } = currentTemplate;

        if (onAddTemplate) {
            currentViewContents.push(getSaveAsItem(!!isDefault, currentViewHasTemplateChanges));
        }

        if (!isDefault && !notPreserved && access.write && access.update &&
            currentViewHasTemplateChanges && onUpdateTemplate) {
            savedViewContents.push(getSaveItem());
        }

        if (!isDefault && !notPreserved && access.manage) {
            savedViewContents.push(getShareItem());
        }

        if (!isDefault && !notPreserved && access.delete && onDeleteTemplate) {
            savedViewContents.push(getDeleteItem());
        }

        if (savedViewContents.length > 0) {
            savedViewContents.splice(0, 0, getSavedViewSubHeader(name));
        }

        return [
            ...(customListViewMenuContents || []),
            ...currentViewContents,
            ...savedViewContents,
        ];
    }, [
        currentTemplate,
        getSaveItem,
        getSaveAsItem,
        getDeleteItem,
        getShareItem,
        currentViewHasTemplateChanges,
        getSavedViewSubHeader,
        customListViewMenuContents,
        onAddTemplate,
        onUpdateTemplate,
        onDeleteTemplate,
    ]);

    return (
        <React.Fragment>
            <ListViewLoader
                {...passOnProps}
                currentTemplate={currentTemplate}
                customListViewMenuContents={customListViewMenuContentsExtended}
                currentViewHasTemplateChanges={currentViewHasTemplateChanges}
                templateSharingType={templateSharingType}
            />
            <TemplateMaintenance
                ref={templateMaintenanceInstance}
                onClose={handleClose}
                mode={maintenanceDialogOpenMode}
                currentTemplate={currentTemplate}
                onAddTemplate={handleAddTemplate}
                onUpdateTemplate={handleUpdateTemplate}
                onDeleteTemplate={handleDeleteTemplate}
                onSetSharingSettings={handleSetSharingSettings}
                templateSharingType={templateSharingType}
            />
        </React.Fragment>
    );
};

export const ListViewConfigMenuContent = withStyles(getStyles)(ListViewConfigMenuContentPlain);
