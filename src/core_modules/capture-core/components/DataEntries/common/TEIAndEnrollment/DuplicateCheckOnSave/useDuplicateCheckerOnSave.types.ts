import type { InputSearchGroup } from '../../../../../metaData';

export type Input = {
    onSave: () => void;
    hasDuplicate: boolean | null;
    onResetPossibleDuplicates: () => void;
    onReviewDuplicates: (duplicatesReviewPageSize: number) => void;
    searchGroup?: InputSearchGroup | null;
    duplicatesReviewPageSize: number;
};
