import { ReactNode } from 'react';

// Define CssClasses interface for TypeScript
export interface CssClasses {
  classes: {
    [key: string]: string;
  };
}

export interface FilteredText {
  id: string;
  message: string;
  color?: string | null;
}

export interface FilteredKeyValue {
  id: string;
  key: string;
  value: string;
  color?: string | null;
}

export type WidgetData = string | FilteredText | FilteredKeyValue;

export interface ContentType {
  widgetData?: Array<WidgetData> | null;
  emptyText: string;
}

export interface ContentTypeWithClasses extends ContentType, CssClasses {}

export interface InputFeedbackProps {
  widgetEffects?: Record<string, any>;
  feedbackEmptyText: string;
}

export interface Props {
  feedback?: Array<string | FilteredText | FilteredKeyValue> | null;
  emptyText: string;
}

export interface IndicatorProps {
  indicators?: Array<string | FilteredText | FilteredKeyValue> | null;
  emptyText: string;
}

export interface InputIndicatorProps {
  widgetEffects?: Record<string, any>;
  indicatorEmptyText: string;
}
