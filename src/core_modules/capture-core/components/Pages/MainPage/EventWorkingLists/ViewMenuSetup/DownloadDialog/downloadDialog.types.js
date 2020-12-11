// @flow
export type Props = $ReadOnly<{
  open: boolean,
  onClose: Function,
  request?: { url: string, queryParams: ?Object },
  programStageId: string,
}>;
