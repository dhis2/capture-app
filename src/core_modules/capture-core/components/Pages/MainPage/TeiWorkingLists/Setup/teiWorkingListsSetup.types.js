// @flow
import type { TeiWorkingListsReduxOutputProps } from '../ReduxProvider';
import type {
    DeleteTemplate,
    UpdateList,
} from '../../WorkingListsCommon';

type ExtractedProps = $ReadOnly<{|
    programId: string,
    onDeleteTemplate: DeleteTemplate,
    onUpdateList: UpdateList,
|}>;

type RestProps = $Rest<TeiWorkingListsReduxOutputProps, ExtractedProps>;

export type Props = {|
    ...RestProps,
    ...ExtractedProps,
|};
