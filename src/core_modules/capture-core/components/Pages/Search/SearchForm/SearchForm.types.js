// @flow
import type { AvailableSearchOptions } from '../SearchPage.types';

export type OwnProps = {|
  +availableSearchOptions: AvailableSearchOptions,
  +selectedOptionId?: string,
  +classes: {|
    +searchDomainSelectorSection: string,
    +searchButtonContainer: string,
    +searchRow: string,
    +searchRowSelectElement: string,
  |},
|}

export type PropsFromRedux ={|
  +forms: {
    [elementId: string]: {
      loadNr: number
    }
  },
  +searchStatus: string,
|}

export type DispatchersFromRedux = {|
  onSearchViaUniqueIdOnScopeProgram: ({| programId: string, formId: string |}) => void,
  onSearchViaUniqueIdOnScopeTrackedEntityType: ({| trackedEntityTypeId: string, formId: string |}) => void,
|}

export type Props = {|
  ...OwnProps,
  ...DispatchersFromRedux,
  ...PropsFromRedux
|}

