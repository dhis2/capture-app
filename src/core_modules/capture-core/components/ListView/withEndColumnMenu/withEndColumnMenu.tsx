import * as React from 'react';
import { getMenuColumnSettings } from './getMenuColumnSettings';

type Props = {

}

type Settings = {
    getCellBody: (row: {eventId: string, [elementId: string]: any}, props: any) => React.ReactNode;
    getCellHeader?: ((props: any) => React.ReactNode) | null;
    headerCellStyle?: any | null;
    bodyCellStyle?: any | null;
}

export const withEndColumnMenu = () =>
    (InnerComponent: React.ComponentType<any>) =>
        class CustomEndCellHOC extends React.Component<Props> {
            getCustomEndCellBody = (row: {eventId: string, [elementId: string]: any}, props: any) => {
                const settings: Settings = getMenuColumnSettings();
                return settings.getCellBody(row, props);
            }

            getCustomEndCellHeader = (row: string, props: any) => {
                const settings: Settings = getMenuColumnSettings();
                return settings.getCellHeader && settings.getCellHeader(props);
            }

            render() {
                const settings: Settings = getMenuColumnSettings();
                return (
                    <InnerComponent
                        getCustomEndCellHeader={this.getCustomEndCellHeader}
                        getCustomEndCellBody={this.getCustomEndCellBody}
                        customEndCellHeaderStyle={settings.headerCellStyle}
                        customEndCellBodyStyle={settings.bodyCellStyle}
                        {...this.props}
                    />
                );
            }
        }
;
