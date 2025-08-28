import { WidgetCollapsiblePropsPlain } from './widgetCollapsible.types';
import { WidgetNonCollapsiblePropsPlain } from './widgetNonCollapsible.types';

type CollapsibleProps = WidgetCollapsiblePropsPlain & {
    noncollapsible?: false;
};

type NonCollapsibleProps = WidgetNonCollapsiblePropsPlain & {
    noncollapsible: true;
};

export type Props = CollapsibleProps | NonCollapsibleProps;
