// @flow
import { type InputSearchGroup } from '../../../../../metaData';

export type Input = {|
    onSave: () => void,
    hasDuplicate: ?boolean,
    onResetPossibleDuplicates: () => void,
    onReviewDuplicates: (duplicatesReviewPageSize: number) => void,
    searchGroup: ?InputSearchGroup,
    duplicatesReviewPageSize: number,
|};
