import type { ReactElement } from 'react';

export type OptionRendererInputData = {
    id?: string | null;
    name: string;
    value: any;
};

export type OptionsArray = Array<OptionRendererInputData> | Array<any>;

export type OptionRenderer = (data: OptionRendererInputData, isSelected: boolean) => ReactElement<any>;
