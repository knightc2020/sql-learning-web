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
        doc: 'SELECT * FROM transaction_history',
        extensions: [
          basicSetup,
          sql(),
          EditorView.theme({
            '&': { height: '300px' },
            '.cm-scroller': { overflow: 'auto' },
            '.cm-content, .cm-gutter': { minHeight: '100%' },
            '.cm-gutters': { backgroundColor: '#f8fafc', borderRight: '1px solid #e2e8f0' },
            '.cm-activeLineGutter': { backgroundColor: '#f1f5f9' },
            '.cm-line': { padding: '0 4px' },
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
    <div className="flex flex-col">
      <div className="bg-gray-50 border-b border-gray-200 p-4">
        <button
          onClick={handleExecute}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          <svg className="w-4 h-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
          </svg>
          运行查询
        </button>
      </div>
      <div className="flex-1 bg-white" ref={editorParentRef} />
    </div>
  );
};

export default SQLEditor; 