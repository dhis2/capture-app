// @flow
import * as React from 'react';
import { getMenuColumnSettings } from './getMenuColumnSettings';

type Props = {

}

type Settings = {
    getCellBody: (row: {eventId: string, [elementId: string]: any}, props: Object) => React.Node,
    getCellHeader?: ?(props: Object) => React.Node,
    headerCellStyle?: ?Object,
    bodyCellStyle?: ?Object,
}

export const withEndColumnMenu = () =>
    (InnerComponent: React.ComponentType<any>) =>
        class CustomEndCellHOC extends React.Component<Props> {
            getCustomEndCellBody = (row: {eventId: string, [elementId: string]: any}, props: Object) => {
                const settings: Settings = getMenuColumnSettings();
                return settings.getCellBody(row, props);
            }

            getCustomEndCellHeader = (row: string, props: Object) => {
                const settings: Settings = getMenuColumnSettings();
                return settings.getCellHeader && settings.getCellHeader(props);
            }

            render() {
                const settings: Settings = getMenuColumnSettings();
                return (
                    // $FlowFixMe[cannot-spread-inexact] automated comment
                    <InnerComponent
                        getCustomEndCellHeader={this.getCustomEndCellHeader}
                        getCustomEndCellBody={this.getCustomEndCellBody}
                        customEndCellHeaderStyle={settings.headerCellStyle}
                        customEndCellBodyStyle={settings.bodyCellStyle}
                        {...this.props}
                    />);
            }
        }
;
