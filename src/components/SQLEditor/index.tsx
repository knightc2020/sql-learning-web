import React, { useEffect, useRef } from 'react';
import { EditorView, basicSetup } from 'codemirror';
import { sql } from '@codemirror/lang-sql';
import { EditorState } from '@codemirror/state';

interface SQLEditorProps {
  onExecute: (sql: string) => void;
}

export const SQLEditor: React.FC<SQLEditorProps> = ({ onExecute }) => {
  const editorRef = useRef<EditorView>();
  const editorParentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorParentRef.current && !editorRef.current) {
      const state = EditorState.create({
        doc: 'SELECT 1 as result',
        extensions: [
          basicSetup,
          sql(),
          EditorView.theme({
            '&': { height: '100%' },
            '.cm-scroller': { overflow: 'auto' },
            '.cm-content, .cm-gutter': { minHeight: '100%' },
          }),
        ],
      });

      const view = new EditorView({
        state,
        parent: editorParentRef.current,
      });

      editorRef.current = view;
    }

    return () => {
      editorRef.current?.destroy();
    };
  }, []);

  const handleExecute = () => {
    const query = editorRef.current?.state.doc.toString() || '';
    onExecute(query);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center p-4 bg-white border-b">
        <h3 className="text-lg font-semibold text-gray-800">SQL 编辑器</h3>
        <button
          onClick={handleExecute}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          执行查询
        </button>
      </div>
      <div className="flex-1 overflow-hidden p-4 bg-white" ref={editorParentRef} />
    </div>
  );
};

export default SQLEditor; 