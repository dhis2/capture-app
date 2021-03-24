// @flow
import { type InputSearchGroup, typeof scopeTypes } from '../../../../../metaData';

export type Input = {|
    onSave: () => void,
    duplicateInfo?: {| hasDuplicate: boolean |},
    onCheckForDuplicate: (searchGroup: InputSearchGroup, scopeContext: Object) => void,
    onResetCheckForDuplicate: () => void,
    onReviewDuplicates: (duplicatesReviewPageSize: number) => void,
    searchGroup: ?InputSearchGroup,
    scopeType: $Values<scopeTypes>,
    selectedScopeId: string,
    duplicatesReviewPageSize: number,
|};
