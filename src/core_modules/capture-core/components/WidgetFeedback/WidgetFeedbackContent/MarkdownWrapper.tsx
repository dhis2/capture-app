import React, { ComponentType } from 'react';
import { spacersNum, colors } from '@dhis2/ui';
import Markdown from 'react-markdown';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';
import remarkGfm from 'remark-gfm';

export type MarkdownWrapperProps = {
    title: string;
    content?: string;
    color?: string;
}

const styles = {
    container: {
        width: '100%',
        margin: '8px 0px',
        display: 'flex',
        gap: '1rem',
    },
    title: {
        flex: '1 0 50%',
        minWidth: '50%',
    },
    content: {
        flex: '0 1 auto',
        maxWidth: '50%',
        minWidth: '0',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
    },
    legend: {
        height: '12px',
        width: '12px',
        minWidth: '12px',
        borderRadius: '2px',
    },
    markdown: {
        fontSize: '14px',
        lineHeight: 1.45,
        color: colors.grey900,
        '&:first-child': {
            marginTop: 0,
        },
        '& p': {
            margin: `${spacersNum.dp8}px 0 0 0`,
            display: 'inline-block',
        },
        '& p:first-child': {
            marginTop: 0,
        },
        '& h1': {
            fontSize: '18px',
            fontWeight: 700,
            lineHeight: 1.25,
            margin: `${spacersNum.dp12}px 0 ${spacersNum.dp8}px 0`,
            paddingBottom: spacersNum.dp4,
            borderBottom: `2px solid ${colors.grey400}`,
            color: colors.grey900,
        },
        '& h2': {
            fontSize: '16px',
            fontWeight: 700,
            margin: `${spacersNum.dp12}px 0 ${spacersNum.dp4}px 0`,
            color: colors.grey900,
        },
        '& h3': {
            fontSize: '15px',
            fontWeight: 600,
            margin: `${spacersNum.dp8}px 0 ${spacersNum.dp4}px 0`,
            color: colors.grey900,
        },
        '& h4, & h5, & h6': {
            fontSize: '14px',
            fontWeight: 600,
            margin: `${spacersNum.dp8}px 0 ${spacersNum.dp4}px 0`,
            color: colors.grey900,
        },
        '& strong': {
            fontWeight: 700,
            color: colors.grey900,
        },
        '& em': {
            fontStyle: 'italic',
            color: colors.grey900,
        },
        '& a': {
            color: colors.blue800,
            textDecoration: 'underline',
        },
        '& ul, & ol': {
            margin: `${spacersNum.dp8}px 0 0 0`,
            paddingInlineStart: spacersNum.dp16,
        },
        '& li': {
            marginTop: spacersNum.dp4,
        },
        '& code': {
            fontFamily: 'Menlo, Monaco, Consolas, monospace',
            fontSize: '12px',
            background: colors.grey200,
            padding: `1px ${spacersNum.dp4}px`,
            borderRadius: '3px',
        },
        '& pre': {
            margin: `${spacersNum.dp8}px 0 0 0`,
            padding: spacersNum.dp8,
            background: colors.grey200,
            borderRadius: '4px',
            overflow: 'auto',
            fontSize: '12px',
        },
        '& pre code': {
            background: 'transparent',
            padding: 0,
        },
        '& blockquote': {
            margin: `${spacersNum.dp8}px 0 0 0`,
            paddingInlineStart: spacersNum.dp12,
            borderInlineStart: `4px solid ${colors.grey400}`,
            color: colors.grey800,
            fontStyle: 'italic',
        },
        '& hr': {
            margin: `${spacersNum.dp12}px 0`,
            border: 'none',
            borderTop: `1px solid ${colors.grey400}`,
        },
        '& table': {
            borderCollapse: 'collapse',
            width: '100%',
            margin: `${spacersNum.dp8}px 0`,
            fontSize: '13px',
            lineHeight: '18px',
        },
        '& th, & td': {
            padding: `${spacersNum.dp4}px ${spacersNum.dp8}px`,
            border: `1px solid ${colors.grey300}`,
            textAlign: 'left',
        },
        '& th': {
            fontWeight: 600,
            color: colors.grey800,
            whiteSpace: 'nowrap',
        },
        '& td': {
            color: colors.grey900,
        },
    },
};

type Props = MarkdownWrapperProps & WithStyles<typeof styles>;
const MarkdownWrapperComponent = ({ title, content, color, classes }:Props) => (
    <div className={classes.container} >
        <div className={classes.title}>
            <div className={classes.markdown}><Markdown remarkPlugins={[remarkGfm]}>{title}</Markdown></div>
        </div>

        { content &&
            <div className={classes.content}>
                { color && <span className={classes.legend} style={{ backgroundColor: color }} /> }
                <div className={classes.markdown}>
                    <Markdown remarkPlugins={[remarkGfm]}>{content}</Markdown>
                </div>
            </div>
        }
    </div>
);

export const MarkdownWrapper = withStyles(styles)(MarkdownWrapperComponent) as ComponentType<MarkdownWrapperProps>;
