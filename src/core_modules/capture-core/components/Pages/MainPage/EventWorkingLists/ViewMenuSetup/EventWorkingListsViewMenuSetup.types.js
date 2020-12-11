// @flow
import type { EventProgram } from '../../../../../metaData';
import type { EventWorkingListsTemplateSetupOutputProps } from '../TemplateSetup';
import type { CustomMenuContents } from '../../WorkingLists';

type ExtractedProps = $ReadOnly<{|
  downloadRequest: { url: string, queryParams: ?Object },
  program: EventProgram,
|}>;

type RestProps = $Rest<EventWorkingListsTemplateSetupOutputProps, ExtractedProps>;

export type Props = {|
  ...RestProps,
  ...ExtractedProps,
|};

export type EventWorkingListsViewMenuSetupOutputProps = {|
  ...RestProps,
  programId: string,
  customListViewMenuContents: CustomMenuContents,
|};
