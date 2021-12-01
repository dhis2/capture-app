// @flow
import type { Program } from '../../../../metaData';
import type { CustomMenuContents } from '../../WorkingListsBase';
import type { EventWorkingListsTemplateSetupOutputProps } from '../TemplateSetup';

type ExtractedProps = $ReadOnly<{|
    downloadRequest: { url: string, queryParams: ?Object },
    program: Program,
    programStageId: string
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
