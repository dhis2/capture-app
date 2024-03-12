// @flow
import type { Program } from '../../../../metaData';
import type { EventWorkingListsTemplateSetupOutputProps } from '../TemplateSetup';
import type { CustomMenuContents } from '../../WorkingListsBase';

type ExtractedProps = $ReadOnly<{|
    program: Program,
    programStageId: string,
    storeId: string,
|}>;

type RestProps = $Rest<EventWorkingListsTemplateSetupOutputProps, ExtractedProps>;

export type Props = {|
    ...RestProps,
    ...ExtractedProps,
|};

export type EventWorkingListsViewMenuSetupOutputProps = {|
    ...RestProps,
    programId: string,
    programStageId: string,
    customListViewMenuContents: CustomMenuContents,
|};
