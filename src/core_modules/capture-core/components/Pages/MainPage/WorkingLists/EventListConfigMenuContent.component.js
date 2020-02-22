// @flow
import * as React from 'react';
import i18n from '@dhis2/d2-i18n';
import EventListLoader from './EventListLoader.component';
import { TemplateSaver, dialogModes } from './SaveTemplate';

type PassOnProps = {
    listId: string,
    eventsData: ?Object,
    currentPage: ?number,
    rowsPerPage: ?number,
};

type Props = {
    ...PassOnProps,
    currentTemplate: Object,
    filters: Object,
    sortById: ?string,
    sortByDirection: ?string,
    columnOrder: ?Array<Object>,
    onAddTemplate: Function,
    onUpdateTemplate: Function,
    defaultConfig: Map<string, Object>,
};

const EventListConfigMenuContent = (props: Props) => {
    const {
        currentTemplate,
        filters,
        sortById,
        sortByDirection,
        columnOrder,
        onAddTemplate,
        onUpdateTemplate,
        defaultConfig,
        ...passOnProps
    } = props;
    const [saveDialogOpenMode, setSaveDialogOpenMode] = React.useState(null);

    const customMenuContents = React.useMemo(() => {
        const menuContents = [];

        if (!currentTemplate.isDefault) {
            menuContents.push({
                clickHandler: () => {
                    setSaveDialogOpenMode(dialogModes.REPLACE);
                },
                element: (
                    <div>
                        {i18n.t('Save template')}
                    </div>
                ),
            });
        }

        menuContents.push({
            clickHandler: () => {
                setSaveDialogOpenMode(dialogModes.NEW);
            },
            element: (
                <div>
                    {i18n.t('Save template as...')}
                </div>
            ),
        });

        return menuContents;
    }, [currentTemplate]);

    const closeHandler = React.useCallback(() => {
        setSaveDialogOpenMode(null);
    }, []);

    const addTemplateHandler = React.useCallback(() => {
        onAddTemplate({
            filters,
            sortById,
            sortByDirection,
            columnOrder,
            defaultConfig,
        });
    }, [
        onAddTemplate,
        filters,
        sortById,
        sortByDirection,
        columnOrder,
        defaultConfig,
    ]);

    const updateTemplateHandler = React.useCallback(() => {
        onUpdateTemplate(currentTemplate, {
            filters,
            sortById,
            sortByDirection,
            columnOrder,
            defaultConfig,
        });
    }, [
        onUpdateTemplate,
        currentTemplate,
        filters,
        sortById,
        sortByDirection,
        columnOrder,
        defaultConfig,
    ]);

    return (
        <React.Fragment>
            <EventListLoader
                {...passOnProps}
                defaultConfig={defaultConfig}
                filters={filters}
                sortById={sortById}
                sortByDirection={sortByDirection}
                currentTemplate={currentTemplate}
                customMenuContents={customMenuContents}
            />
            <TemplateSaver
                open={!!saveDialogOpenMode}
                onClose={closeHandler}
                mode={saveDialogOpenMode}
                onAddTemplate={addTemplateHandler}
                onUpdateTemplate={updateTemplateHandler}
                filters={filters}
                sortById={sortById}
                sortByDirection={sortByDirection}
            />
        </React.Fragment>
    );
};

export default EventListConfigMenuContent;
