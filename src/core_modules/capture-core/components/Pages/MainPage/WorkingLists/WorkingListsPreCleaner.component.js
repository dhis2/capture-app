// @flow
import * as React from 'react';
import TemplatesLoader from './TemplatesLoader.component';

type PassOnProps = {|
    onLoadTemplates: Function,
    onCancelLoadTemplates: Function,
    templates: ?Object,
    loadTemplatesError: ?string,
    onAddTemplate: Function,
    onUpdateTemplate: Function,
|};

type Props = {
    onPreCleanData: Function,
    listId: string,
    skipReloadTemplates: boolean,
    skipReloadData: boolean,
    ...PassOnProps,
};

const WorkingListsPreCleaner = (props: Props) => {
    const {
        onPreCleanData,
        listId,
        skipReloadTemplates,
        skipReloadData,
        ...passOnProps
    } = props;

    const [isCleaning, setCleaningStatus] = React.useState(true);

    React.useEffect(() => {
        if (skipReloadTemplates && skipReloadData) {
            setCleaningStatus(false);
            return;
        }

        onPreCleanData(!skipReloadTemplates, listId);
        setCleaningStatus(false);
    }, [
        listId,
        skipReloadTemplates,
        skipReloadData,
        onPreCleanData,
        setCleaningStatus,
    ]);

    if (isCleaning && (!skipReloadTemplates || !skipReloadData)) {
        return null;
    }

    return (
        <TemplatesLoader
            {...passOnProps}
            listId={listId}
        />
    );
};

export default React.memo(WorkingListsPreCleaner);
