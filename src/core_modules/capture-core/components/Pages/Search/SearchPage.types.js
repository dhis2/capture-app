// @flow
import { RenderFoundation } from '../../../metaData';

export type SearchGroup = Array<{|
  +searchForm: RenderFoundation,
  +unique: boolean,
  +formId: string,
  +searchScope: string,
  +minAttributesRequiredToSearch: number
|}>

export type SelectedSearchScope = $ReadOnly<{|
  value: ?string,
  label: ?string
|}>

export type AvailableSearchOptions = $ReadOnly<{
    [elementId: string]: {|
      +searchOptionId: string,
      +searchOptionName: string,
      +searchGroups: SearchGroup |}
  }>

export type TrackedEntityTypesWithCorrelatedPrograms = $ReadOnly<{
  [elementId: string]: {|
    +trackedEntityTypeId: string,
    +trackedEntityTypeName: string,
    +programs: Array<{|
      +programName: string,
      +programId: string,
    |}>
  |}
}>

export type OwnProps = {|
  +classes: Object,
|}

export type PropsFromRedux ={|
  +error: boolean,
  +ready: boolean,
|}

export type Props = {|
  +dispatch: ReduxDispatch,
  ...OwnProps,
  ...PropsFromRedux
|}

