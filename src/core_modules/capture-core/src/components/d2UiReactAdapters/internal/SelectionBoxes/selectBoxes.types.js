// @flow
import * as React from 'react';

export type OptionRendererInputData = {
    name: string,
    value: any,
};

export type OptionsArray = Array<OptionRendererInputData> | Array<Object>;

export type OptionRenderer = (data: OptionRendererInputData, isSelected: boolean) => React.Element<any>;
