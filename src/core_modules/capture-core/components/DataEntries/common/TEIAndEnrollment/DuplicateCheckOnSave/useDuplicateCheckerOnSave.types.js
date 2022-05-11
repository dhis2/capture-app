// @flow
import { type InputSearchGroup } from '../../../../../metaData';
import type { SaveForDuplicateCheck } from './types';

export type Input = {|
    onSave: SaveForDuplicateCheck,
    hasDuplicate?: boolean,
    onResetPossibleDuplicates: () => void,
    onReviewDuplicates: (duplicatesReviewPageSize: number) => void,
    searchGroup: ?InputSearchGroup,
    duplicatesReviewPageSize: number,
|};
