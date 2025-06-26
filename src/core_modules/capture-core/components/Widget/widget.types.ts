import { WidgetCollapsibleProps } from './widgetCollapsible.types';
import { WidgetNonCollapsibleProps } from './widgetNonCollapsible.types';

type CollapsibleProps = WidgetCollapsibleProps & {
    noncollapsible?: false;
};

type NonCollapsibleProps = WidgetNonCollapsibleProps & {
    noncollapsible: true;
};

export type Props = CollapsibleProps | NonCollapsibleProps;
