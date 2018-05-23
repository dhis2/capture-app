// @flow

type DataEntryPropToIncludeStandard = {|
    id: string,
    type: string,
|};

type DataEntryPropToIncludeSpecial = {|
    inId: string,
    outId: string,
    onConvertIn: (value: any) => any,
    onConvertOut: (dataEntryValue: any, prevValue: any) => any,
|};

export type DataEntryPropToInclude = DataEntryPropToIncludeStandard | DataEntryPropToIncludeSpecial;

export function getDataEntryMeta(dataEntryPropsToInclude: Array<DataEntryPropToInclude>) {
    return dataEntryPropsToInclude
        .reduce((accMeta, propToInclude) => {
            // $FlowSuppress
            accMeta[propToInclude.id || propToInclude.outId] =
                propToInclude.type ?
                    { type: propToInclude.type } :
                    // $FlowSuppress
                    { onConvertOut: propToInclude.onConvertOut.toString(), outId: propToInclude.inId };
            return accMeta;
        }, {});
}
