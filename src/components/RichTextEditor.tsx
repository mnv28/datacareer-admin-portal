import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { Button } from '@/components/ui/button';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  Table as TableIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Heading1,
  Heading2,
  Heading3,
  Undo,
  Redo,
  Plus,
  Minus,
  Columns,
  Rows,
} from 'lucide-react';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
}

const RichTextEditor = ({ content, onChange }: RichTextEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableCell,
      TableHeader,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }

  const addTable = () => {
    editor
      .chain()
      .focus()
      .insertTable({ rows: 5, cols: 3, withHeaderRow: true })
      .run();
  };

  const addRow = () => {
    editor.chain().focus().addRowAfter().run();
  };

  const removeRow = () => {
    editor.chain().focus().deleteRow().run();
  };

  const addColumn = () => {
    editor.chain().focus().addColumnAfter().run();
  };

  const removeColumn = () => {
    editor.chain().focus().deleteColumn().run();
  };

  return (
    <div className="border rounded-md">
      <div className="border-b p-2 flex flex-wrap gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? 'bg-gray-100' : ''}
        >
          <Bold size={16} />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive('italic') ? 'bg-gray-100' : ''}
        >
          <Italic size={16} />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={editor.isActive('underline') ? 'bg-gray-100' : ''}
        >
          <UnderlineIcon size={16} />
        </Button>
        <div className="w-px h-6 bg-gray-200 mx-1" />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={editor.isActive('heading', { level: 1 }) ? 'bg-gray-100' : ''}
        >
          <Heading1 size={16} />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={editor.isActive('heading', { level: 2 }) ? 'bg-gray-100' : ''}
        >
          <Heading2 size={16} />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={editor.isActive('heading', { level: 3 }) ? 'bg-gray-100' : ''}
        >
          <Heading3 size={16} />
        </Button>
        <div className="w-px h-6 bg-gray-200 mx-1" />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive('bulletList') ? 'bg-gray-100' : ''}
        >
          <List size={16} />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive('orderedList') ? 'bg-gray-100' : ''}
        >
          <ListOrdered size={16} />
        </Button>
        <div className="w-px h-6 bg-gray-200 mx-1" />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={editor.isActive({ textAlign: 'left' }) ? 'bg-gray-100' : ''}
        >
          <AlignLeft size={16} />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={editor.isActive({ textAlign: 'center' }) ? 'bg-gray-100' : ''}
        >
          <AlignCenter size={16} />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={editor.isActive({ textAlign: 'right' }) ? 'bg-gray-100' : ''}
        >
          <AlignRight size={16} />
        </Button>
        <div className="w-px h-6 bg-gray-200 mx-1" />
        <Button
          variant="ghost"
          size="sm"
          onClick={addTable}
        >
          <TableIcon size={16} />
        </Button>
        <div className="flex items-center gap-1 px-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={addRow}
            disabled={!editor.isActive('table')}
            title="Add Row"
          >
            <Rows size={16} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={removeRow}
            disabled={!editor.isActive('table')}
            title="Remove Row"
          >
            <Minus size={16} />
          </Button>
        </div>
        <div className="flex items-center gap-1 px-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={addColumn}
            disabled={!editor.isActive('table')}
            title="Add Column"
          >
            <Columns size={16} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={removeColumn}
            disabled={!editor.isActive('table')}
            title="Remove Column"
          >
            <Minus size={16} />
          </Button>
        </div>
        <div className="w-px h-6 bg-gray-200 mx-1" />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
        >
          <Undo size={16} />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
        >
          <Redo size={16} />
        </Button>
      </div>
      <EditorContent editor={editor} className="prose max-w-none p-4 min-h-[200px]" />
    </div>
  );
};

export default RichTextEditor; 