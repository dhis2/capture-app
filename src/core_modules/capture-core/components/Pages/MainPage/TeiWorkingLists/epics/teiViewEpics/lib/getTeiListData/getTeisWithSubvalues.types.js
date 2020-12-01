// @flow

export type SubvalueKeysByType = {| [string]: Array<any> |};

export type SubvaluesByType = Array<{|type: string, subvalues: {|[key: string]: any|}|}>;
