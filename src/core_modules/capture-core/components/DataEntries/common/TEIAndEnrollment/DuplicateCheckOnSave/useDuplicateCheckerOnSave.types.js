// @flow
import { type InputSearchGroup, typeof scopeTypes } from '../../../../../metaData';
import type { SaveForDuplicateCheck } from './types';

export type Input = {|
    onSave: SaveForDuplicateCheck,
    duplicateInfo?: {| hasDuplicate: boolean |},
    onCheckForDuplicate: (searchGroup: InputSearchGroup, scopeContext: Object) => void,
    onResetCheckForDuplicate: () => void,
    onReviewDuplicates: (duplicatesReviewPageSize: number) => void,
    searchGroup: ?InputSearchGroup,
    scopeType: $Values<scopeTypes>,
    selectedScopeId: string,
    duplicatesReviewPageSize: number,
|};
