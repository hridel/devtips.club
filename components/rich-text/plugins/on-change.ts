import { EditorState } from 'lexical';
import { useEffect } from 'react';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

const OnChangePlugin = ({
    onChange,
}: {
    onChange: (editorState: EditorState) => void;
}) => {
    const [editor] = useLexicalComposerContext();
    useEffect(() => {
        return editor.registerUpdateListener(({ editorState }) => {
            onChange(editorState);
        });
    }, [editor, onChange]);
    return null;
};

export default OnChangePlugin;
