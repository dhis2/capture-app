// @flow
import { type SearchGroup } from '../../../../../../metaData';

export type OwnProps = {|
    id: string,
    searchGroups: any,
    onChangePage: Function,
    onNewSearch: Function,
    onEditSearch: Function,
    getResultsView: Function,
    selectedProgramId: ?string,
    selectedTrackedEntityTypeId: string,
    trackedEntityTypeName: string,
|}

type PropsFromRedux = {|
    resultsLoading: boolean,
    teis: any,
    currentPage: number,
    searchValues: any,
    searchGroup: SearchGroup
|}

export type Props = {|...OwnProps, ...PropsFromRedux |}
