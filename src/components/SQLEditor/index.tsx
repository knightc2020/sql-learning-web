import React, { useEffect, useRef, useState } from 'react';
import { EditorView, basicSetup } from 'codemirror';
import { sql } from '@codemirror/lang-sql';
import { EditorState } from '@codemirror/state';
import { keymap } from '@codemirror/view';
import { indentWithTab } from '@codemirror/commands';
import { syntaxHighlighting, defaultHighlightStyle } from '@codemirror/language';

interface SQLEditorProps {
  onExecute: (sql: string) => void;
  onEditorMount?: (editor: EditorView) => void;
}

export const SQLEditor: React.FC<SQLEditorProps> = ({ onExecute, onEditorMount }) => {
  const editorRef = useRef<EditorView | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isEditorMounted, setIsEditorMounted] = useState(false);

  // 初始化编辑器
  useEffect(() => {
    if (!containerRef.current || editorRef.current) return;

    const startState = EditorState.create({
      doc: 'SELECT * FROM customers',
      extensions: [
        basicSetup,
        sql(),
        keymap.of([indentWithTab]),
        syntaxHighlighting(defaultHighlightStyle),
        EditorView.theme({
          '&': {
            fontSize: '14px'
          },
          '.cm-scroller': {
            fontFamily: 'Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
            overflow: 'auto !important',
            height: '180px !important'
          },
          '.cm-content': {
            padding: '8px 0',
            minHeight: '180px'
          },
          '.cm-line': {
            padding: '0 8px',
            lineHeight: '1.6'
          },
          '.cm-gutters': {
            backgroundColor: '#f5f5f5',
            borderRight: '1px solid #e0e0e0',
            color: '#666666',
            minWidth: '40px'
          },
          '.cm-activeLineGutter': {
            backgroundColor: '#e8f2ff',
            color: '#333333'
          },
          '.cm-activeLine': {
            backgroundColor: '#f8fafd'
          },
          '&.cm-focused': {
            outline: 'none'
          },
          '.cm-matchingBracket': {
            backgroundColor: '#e8f2ff',
            color: '#0550ae',
            fontWeight: 'bold'
          },
          '.cm-selectionMatch': {
            backgroundColor: '#e8f2ff'
          },
          '.cm-cursor': {
            borderLeftColor: '#0550ae'
          },
          '.cm-keyword': { color: '#0550ae', fontWeight: 'bold' },
          '.cm-operator': { color: '#0550ae' },
          '.cm-number': { color: '#116329' },
          '.cm-string': { color: '#0a3069' },
          '.cm-comment': { color: '#6e7781', fontStyle: 'italic' }
        })
      ]
    });

    const view = new EditorView({
      state: startState,
      parent: containerRef.current
    });

    editorRef.current = view;
    setIsEditorMounted(true);
    if (onEditorMount) {
      onEditorMount(view);
    }

    // 清理函数
    return () => {
      if (editorRef.current) {
        editorRef.current.destroy();
        editorRef.current = null;
        setIsEditorMounted(false);
      }
    };
  }, [onEditorMount]);

  // 处理查询执行
  const handleExecute = () => {
    if (!editorRef.current) return;
    const query = editorRef.current.state.doc.toString();
    onExecute(query);
  };

  return (
    <div className="flex flex-col rounded-lg overflow-hidden border border-gray-200">
      <div className="bg-gray-50 border-b border-gray-200 p-3">
        <button
          onClick={handleExecute}
          className="inline-flex items-center px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          <svg className="w-4 h-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
          </svg>
          运行查询
        </button>
      </div>
      <div className="relative bg-white" style={{ height: '200px' }}>
        <div 
          ref={containerRef}
          className="absolute inset-0 overflow-hidden"
          style={{ 
            backgroundColor: '#ffffff',
            visibility: isEditorMounted ? 'visible' : 'hidden' 
          }}
        />
      </div>
    </div>
  );
};

export default SQLEditor; 