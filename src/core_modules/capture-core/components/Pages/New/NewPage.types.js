// @flow
export type ContainerProps = $ReadOnly<{|
  error: boolean,
  ready: boolean,
|}
>

export type Props = {|
  ...ContainerProps
|}

