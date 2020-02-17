// @flow
import * as React from 'react';
import TemplatesLoader from './TemplatesLoader.component';

type PassOnProps = {|
    onLoadTemplates: Function,
    onCancelLoadTemplates: Function,
    templates: ?Object,
    loadTemplatesError: ?string,
|};

type Props = {
    onPreCleanData: Function,
    listId: string,
    skipReload: boolean,
    onResetSkipReload?: ?Function,
    ...PassOnProps,
};

const WorkingListsPreCleaner = (props: Props) => {
    const {
        onPreCleanData,
        listId,
        skipReload,
        onResetSkipReload,
        ...passOnProps
    } = props;
    const [isCleaning, setCleaningStatus] = React.useState(true);

    React.useEffect(() => {
        if (skipReload) {
            setCleaningStatus(false);
            return () => {
                onResetSkipReload && onResetSkipReload(listId);
            };
        }

        onPreCleanData(listId);
        setCleaningStatus(false);
        return undefined;
    }, []);

    if (isCleaning && !skipReload) {
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
