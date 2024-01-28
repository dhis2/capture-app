// @flow

export type TransferModalProps = {|
    enrollment: Object,
    setOpenTransfer: (toggle: boolean) => void,
    onUpdateOwnership: (newOrgUnitId: string) => void,
|}
