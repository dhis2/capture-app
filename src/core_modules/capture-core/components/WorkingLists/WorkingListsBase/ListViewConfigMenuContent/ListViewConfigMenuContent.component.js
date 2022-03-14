// @flow
import React, { useState, useRef, useCallback, useMemo, type ComponentType } from 'react';
import { withStyles } from '@material-ui/core/styles';
import i18n from '@dhis2/d2-i18n';
import { ListViewLoader } from '../ListViewLoader';
import { TemplateMaintenance, dialogModes } from '../TemplateMaintenance';
import type { Props } from './listViewConfigMenuContent.types';

const getStyles = (theme: Theme) => ({
    delete: {
        color: theme.palette.error.dark,
    },
});

const ListViewConfigMenuContentPlain = (props: Props) => {
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
    const [maintenanceDialogOpenMode, setMaintenanceDialogOpenMode] = useState(null);
    const templateMaintenanceInstance = useRef(null);

    const handleClose = useCallback(() => {
        setMaintenanceDialogOpenMode(null);
    }, []);

    const handleUpdateTemplate = useCallback((...args) => {
        setMaintenanceDialogOpenMode(null);
        onUpdateTemplate && onUpdateTemplate(...args);
    }, [onUpdateTemplate]);

    const handleAddTemplate = useCallback((...args) => {
        setMaintenanceDialogOpenMode(null);
        onAddTemplate && onAddTemplate(...args);
    }, [onAddTemplate]);

    const handleDeleteTemplate = useCallback((...args) => {
        setMaintenanceDialogOpenMode(null);
        onDeleteTemplate && onDeleteTemplate(...args);
    }, [onDeleteTemplate]);

    const handleSetSharingSettings = useCallback((...args) => {
        setMaintenanceDialogOpenMode(null);
        onSetTemplateSharingSettings && onSetTemplateSharingSettings(...args);
    }, [onSetTemplateSharingSettings]);

    const getSaveItem = useCallback(() => ({
        key: 'save',
        clickHandler: () => {
            // $FlowFixMe[incompatible-use] automated comment
            templateMaintenanceInstance.current.handleUpdateTemplate();
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
        const currentViewContents = [];
        const savedViewContents = [];

        const { access, isDefault, notPreserved, name } = currentTemplate;

        if (onAddTemplate) {
            currentViewContents.push(getSaveAsItem(!!isDefault, currentViewHasTemplateChanges));
        }

        if (!isDefault && !notPreserved && access.write && access.update && currentViewHasTemplateChanges && onUpdateTemplate) {
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
            />
            <TemplateMaintenance
                // $FlowFixMe[incompatible-type] automated comment
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

export const ListViewConfigMenuContent: ComponentType<$Diff<Props, CssClasses>> =
    withStyles(getStyles)(ListViewConfigMenuContentPlain);
