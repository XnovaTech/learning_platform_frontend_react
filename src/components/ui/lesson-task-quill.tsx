import { useRef } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

interface QuillHelperProps {
  value: string;
  onChange: (value: string) => void;
  uploadFn?: (formData: FormData) => Promise<{ url: string }>;
}

export function LessonTaskQuill({ value, onChange, uploadFn }: QuillHelperProps) {
  const quillRef = useRef<any>(null);

  const imageHandler = async () => {
    if (!uploadFn) return;

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.click();

    input.onchange = async () => {
      if (!input.files?.[0]) return;

      const formData = new FormData();
      formData.append('image', input.files[0]);

      const res = await uploadFn(formData);

      const editor = quillRef.current?.getEditor();
      if (!editor) return;

      const range = editor.getSelection();
      editor.insertEmbed(range?.index ?? 0, 'image', res.url);
      editor.setSelection((range?.index ?? 0) + 1);
    };
  };

  const quillModules = {
    toolbar: {
      container: [['bold', 'italic', 'underline'], [{ list: 'ordered' }, { list: 'bullet' }], ['link', 'image'], ['clean']],
      handlers: {
        image: imageHandler,
      },
    },
  };

  const quillFormats = ['bold', 'italic', 'underline', 'list', 'link', 'image'];

  return (
     <div className="rounded-xl border bg-transparent border-gray-50 focus-within:ring-1 focus-within:ring-primary transition-all duration-300">
      <ReactQuill
        ref={quillRef}
        theme="snow"
        formats={quillFormats}
        modules={quillModules}
        defaultValue={value} 
        onBlur={() => {
          const editor = quillRef.current?.getEditor();
          if (!editor) return;
          onChange(editor.root.innerHTML);
        }}
        placeholder="Write your question here..."
        className="rounded-xl min-h-[150px] [&_.ql-toolbar]:rounded-t-xl [&_.ql-container]:rounded-b-xl [&_.ql-container]:min-h-[140px]"
      />
    </div>
  );
}
