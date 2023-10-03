// @flow
import * as React from 'react';
import type { RenderFoundation } from '../../metaData';

export type FormRef = $ReadOnly<{|
  formRef?: (instance: any) => void
|}>

export type OwnProps = $ReadOnly<{|
  formFoundation: RenderFoundation,
  id: string,
  formHorizontal?: boolean,
  getCustomContent?: (beforeSectionId: string) => React.Node,
  ...FormRef
|}>

export type PropsFromRedux = $ReadOnly<{|
  isFormInReduxStore: boolean,
|}>

export type Props = {|
  ...CssClasses,
  ...OwnProps,
  ...PropsFromRedux,
|}

export type PropsForPureComponent = $Diff<Props, FormRef>
