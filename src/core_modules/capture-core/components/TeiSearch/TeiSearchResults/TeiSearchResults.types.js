// @flow
import { type SearchGroup } from '../../../metaData';

export type OwnProps = {|
    id: string,
    searchGroups: any,
    onChangePage: Function,
    onNewSearch: Function,
    onEditSearch: Function,
    getResultsView: Function,
|}

type PropsFromRedux = {|
    resultsLoading: boolean,
    teis: any,
    currentPage: number,
    searchValues: any,
    selectedProgramId: string,
    selectedTrackedEntityTypeId: string,
    searchGroup: SearchGroup
|}

export type Props = {|...OwnProps, ...PropsFromRedux |}
