'use client';

import { EditorState } from 'lexical';

import { $generateHtmlFromNodes } from '@lexical/html';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';

import OnChangePlugin from '#/components/rich-text/plugins/on-change';
import ToolbarPlugin from '#/components/rich-text/plugins/toolbar-plugin';

export interface RTEditorProps {
    placeholder: string;
    onChangeCallback: ({
        jsonString,
        htmlString,
    }: {
        jsonString: string;
        htmlString: string;
    }) => void;
}

const RTEditor = (props: RTEditorProps) => {
    const { placeholder, onChangeCallback } = props;
    const [editor] = useLexicalComposerContext();

    function onChange(editorState: EditorState) {
        editor.update(() => {
            const jsonString = JSON.stringify(editorState.toJSON());
            const htmlString = $generateHtmlFromNodes(editor, null);
            onChangeCallback({ htmlString, jsonString });
        });
    }

    return (
        <div className="editor-container">
            <ToolbarPlugin />
            <div className="editor-inner">
                <RichTextPlugin
                    contentEditable={
                        <ContentEditable
                            className="editor-input"
                            aria-placeholder={placeholder}
                            placeholder={
                                <div className="editor-placeholder">
                                    {placeholder}
                                </div>
                            }
                        />
                    }
                    ErrorBoundary={LexicalErrorBoundary}
                />
                <HistoryPlugin />
                <AutoFocusPlugin />
                <OnChangePlugin onChange={onChange} />
            </div>
        </div>
    );
};

export default RTEditor;
