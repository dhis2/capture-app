// @flow
import * as React from 'react';

export type OptionRendererInputData = {
    id?: ?string,
    name: string,
    value: any,
};

export type OptionsArray = Array<OptionRendererInputData> | Array<Object>;

export type OptionRenderer = (data: OptionRendererInputData, isSelected: boolean) => React.Node;
