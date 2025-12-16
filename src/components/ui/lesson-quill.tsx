import type { LessonPayloadType } from "@/types/lesson";
import {useRef} from "react";
import ReactQuill from "react-quill-new";
import 'react-quill-new/dist/quill.snow.css';

interface QuillHelperProps {
    setForm: (form: LessonPayloadType) => void ;
    form: LessonPayloadType;
    uploadFn: (formData: FormData) => Promise<{url: string}>;
}

export function LessonQuill({ setForm, form, uploadFn }: QuillHelperProps) {
    const quillRef = useRef<any>(null);

     const imageHandler = () => {
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
    
          const range = editor?.getSelection();
    
          console.log('response data is', res.url)
            editor.insertEmbed(range.index,'image', res.url);
            editor.setSelection(range.index + 1);
    
            console.log("data is", editor.root.innerHTML);
        };
      };
    
      // quill modules
      const quillModules = {
        toolbar: {
          container: [
            ['bold', 'italic', 'underline'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['link', 'image'],
            ['clean'],
          ],
          handlers:{
            image: imageHandler,
          }
        }
      }
    
      const quillFormats = [
        'bold',
        'italic',
        'underline',
        'list',
        'link',
        'image'
      ];

      return (
         <div className="rounded-xl border  bg-transparent border-gray-50 focus-within:ring-1 focus-within:ring-primary transition-all duration-300">
                    <ReactQuill
                      ref={quillRef}
                      theme="snow"
                      formats={quillFormats}
                      modules={quillModules}
                      className="rounded-xl min-h-[180px] [&_.ql-toolbar]:rounded-t-xl [&_.ql-container]:rounded-b-xl [&_.ql-container]:min-h-40"
                      value={form.description || ''}
                      onChange={(value: string) => setForm({ ...form, description: value })}
                      placeholder="Write your lesson content here..."
                    />
    </div>
      )
    
}

