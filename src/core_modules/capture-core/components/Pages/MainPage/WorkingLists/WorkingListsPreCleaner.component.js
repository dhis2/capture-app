// @flow
import * as React from 'react';
import TemplatesLoader from './TemplatesLoader.component';

type PassOnProps = {|
    onLoadTemplates: Function,
    templates: ?Object,
    loadTemplatesError: ?string,
|};

type Props = {
    onPreCleanData: Function,
    listId: string,
    ...PassOnProps,
};

const WorkingListsPreCleaner = (props: Props) => {
    const { onPreCleanData, listId, ...passOnProps } = props;
    const [isCleaning, setCleaningStatus] = React.useState(true);
    React.useEffect(() => {
        onPreCleanData(listId);
        setCleaningStatus(false);
    }, []);

    if (isCleaning) {
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
