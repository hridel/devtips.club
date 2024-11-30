'use client';

import {
    $isTextNode,
    DOMConversionMap,
    DOMExportOutput,
    DOMExportOutputMap,
    Klass,
    LexicalEditor,
    LexicalNode,
    ParagraphNode,
    TextNode,
} from 'lexical';

import { LexicalComposer } from '@lexical/react/LexicalComposer';

import RTEditor from '#/components/rich-text/rt-editor';
import {
    parseAllowedColor,
    parseAllowedFontSize,
} from '#/components/rich-text/style-config';
import DevTipsTheme from '#/components/rich-text/theme';
import { Label } from '#/components/ui/label';
import { cn } from '#/lib/utils';

export interface RichTextProps {
    label?: string;
    placeholder?: string;
    initValue?: string;
    className?: string;
    required?: boolean;
    contentChangeCallback: ({
        jsonString,
        htmlString,
    }: {
        jsonString: string;
        htmlString: string;
    }) => void;
}

const removeStylesExportDOM = (
    editor: LexicalEditor,
    target: LexicalNode
): DOMExportOutput => {
    const output = target.exportDOM(editor);
    if (output && output.element instanceof HTMLElement) {
        // Remove all inline styles and classes if the element is an HTMLElement
        // Children are checked as well since TextNode can be nested
        // in i, b, and strong tags.
        for (const el of [
            output.element,
            ...output.element.querySelectorAll('[style],[class],[dir="ltr"]'),
        ]) {
            el.removeAttribute('class');
            el.removeAttribute('style');
            if (el.getAttribute('dir') === 'ltr') {
                el.removeAttribute('dir');
            }
        }
    }
    return output;
};

const exportMap: DOMExportOutputMap = new Map<
    Klass<LexicalNode>,
    (editor: LexicalEditor, target: LexicalNode) => DOMExportOutput
>([
    [ParagraphNode, removeStylesExportDOM],
    [TextNode, removeStylesExportDOM],
]);

const getExtraStyles = (element: HTMLElement): string => {
    // Parse styles from pasted input, but only if they match exactly the
    // sort of styles that would be produced by exportDOM
    let extraStyles = '';
    const fontSize = parseAllowedFontSize(element.style.fontSize);
    const backgroundColor = parseAllowedColor(element.style.backgroundColor);
    const color = parseAllowedColor(element.style.color);
    if (fontSize !== '' && fontSize !== '15px') {
        extraStyles += `font-size: ${fontSize};`;
    }
    if (backgroundColor !== '' && backgroundColor !== 'rgb(255, 255, 255)') {
        extraStyles += `background-color: ${backgroundColor};`;
    }
    if (color !== '' && color !== 'rgb(0, 0, 0)') {
        extraStyles += `color: ${color};`;
    }
    return extraStyles;
};

const constructImportMap = (): DOMConversionMap => {
    const importMap: DOMConversionMap = {};

    // Wrap all TextNode importers with a function that also imports
    // the custom styles implemented by the playground
    for (const [tag, fn] of Object.entries(TextNode.importDOM() || {})) {
        importMap[tag] = (importNode) => {
            const importer = fn(importNode);
            if (!importer) {
                return null;
            }
            return {
                ...importer,
                conversion: (element) => {
                    const output = importer.conversion(element);
                    if (
                        output === null ||
                        output.forChild === undefined ||
                        output.after !== undefined ||
                        output.node !== null
                    ) {
                        return output;
                    }
                    const extraStyles = getExtraStyles(element);
                    if (extraStyles) {
                        const { forChild } = output;
                        return {
                            ...output,
                            forChild: (child, parent) => {
                                const textNode = forChild(child, parent);
                                if ($isTextNode(textNode)) {
                                    textNode.setStyle(
                                        textNode.getStyle() + extraStyles
                                    );
                                }
                                return textNode;
                            },
                        };
                    }
                    return output;
                },
            };
        };
    }

    return importMap;
};

const editorConfig = {
    html: {
        export: exportMap,
        import: constructImportMap(),
    },
    namespace: 'DevTipsRichText',
    nodes: [ParagraphNode, TextNode],
    onError(error: Error) {
        throw error;
    },
    theme: DevTipsTheme,
};

const RichText = (props: RichTextProps) => {
    const {
        initValue,
        label,
        required,
        contentChangeCallback,
        className,
        placeholder = 'Enter some rich text...',
    } = props;

    return (
        <div className={cn('min-h-64', className)}>
            {label && (
                <Label className="block text-sm font-medium text-gray-700">
                    {label}
                    {required && <span className="text-red-500">*</span>}
                </Label>
            )}

            <LexicalComposer
                initialConfig={{ ...editorConfig, editorState: initValue }}
            >
                <RTEditor
                    placeholder={placeholder}
                    onChangeCallback={contentChangeCallback}
                />
            </LexicalComposer>
        </div>
    );
};

export default RichText;
