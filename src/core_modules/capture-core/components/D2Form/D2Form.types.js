// @flow

import type { RenderFoundation } from '../../metaData';

export type FormRef = {|
  formRef?: (instance: any) => void
|}

export type OwnProps = {|
  formFoundation: RenderFoundation,
  id: string,
  formHorizontal?: boolean,
  ...FormRef
|};

export type PropsFromRedux = {|
  isFormInReduxStore: boolean,
|}
export type DispatchersFromRedux = {|
  dispatchRemoveFormData: () => void,
  dispatchRemoveSectionFormData: (formSectionId: string) => void,
|}

export type Props = {|
  ...CssClasses,
  ...OwnProps,
  ...PropsFromRedux,
  ...DispatchersFromRedux,
|}

export type PropsForPureComponent = $Diff<Props, FormRef>
