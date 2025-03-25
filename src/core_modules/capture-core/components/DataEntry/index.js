// This file is kept for backward compatibility
// New code should import from the TypeScript files directly

// Components
export { DataEntry } from './DataEntry.container';

// HOCs
export { withDataEntryField } from './dataEntryField/withDataEntryField';
export { withDataEntryFieldIfApplicable } from './dataEntryField/withDataEntryFieldIfApplicable';
export { withBrowserBackWarning } from './withBrowserBackWarning';
export { withCancelButton } from './withCancelButton';
export { withSaveHandler } from './withSaveHandler/withSaveHandler';
export { withFeedbackOutput } from './dataEntryOutput/withFeedbackOutput.tsx';
export { withIndicatorOutput } from './dataEntryOutput/withIndicatorOutput.tsx';
export { withCleanUp } from './withCleanUp';
export { withAskToCreateNew } from './withAskToCreateNew';

// misc
export { inMemoryFileStore } from './file/inMemoryFileStore';

// constants
export { placements } from './constants/placements.const';

// actions
export {
    actionTypes as mainActionTypes,
    startRunRulesPostUpdateField,
    rulesExecutedPostUpdateField,
} from './actions/dataEntry.actions';
export { actionTypes as loadNewActionTypes } from './actions/dataEntryLoadNew.actions';
export { actionTypes as loadEditActionTypes, cleanUpDataEntry } from './actions/dataEntry.actions';
export { getDataEntryKey } from './common/getDataEntryKey';

