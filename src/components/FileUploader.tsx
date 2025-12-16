import React, { useRef, useState, type DragEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FileIcon, X, Upload } from 'lucide-react';
import type { LessonDocumentType } from '@/types/lessondocument';

interface FileUploaderProps {
  label: string;
  existing: LessonDocumentType[];
  newFiles: File[];
  onRemoveExisting: (docId: number) => void;
  onChangeNew: (files: File[]) => void;
}

export default function FileUploader({ label, existing, newFiles, onRemoveExisting, onChangeNew }: FileUploaderProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const newFileList = Array.from(files);
    onChangeNew([...newFiles, ...newFileList]);
  };

  const handleDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleBrowse = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  const removeNewFile = (index: number) => {
    const updatedNewFiles = newFiles.filter((_, i) => i !== index);
    onChangeNew(updatedNewFiles);
  };

  const allFiles = [...existing, ...newFiles];

  return (
    <div className="space-y-3 col-span-2">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <div className="h-8 w-1 bg-primary rounded-full" />
        {label}
      </h3>

      {allFiles.length > 0 && (
        <div className="space-y-2">
          {existing.map((doc, index) => (
            <div key={`existing-${doc.id}`} className="flex items-center justify-between p-2 border rounded-lg">
              <div className="flex items-center gap-2">
                <FileIcon className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm">{doc.filename}</span>
              </div>
              <Button type="button" variant="red" size="sm" onClick={() => onRemoveExisting(doc.id)}>
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
          {newFiles.map((file, index) => (
            <div key={`new-${index}`} className="flex items-center justify-between p-2 border rounded-lg">
              <div className="flex items-center gap-2">
                <FileIcon className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm">{file.name}</span>
              </div>
              <Button type="button" variant="red" size="sm" onClick={() => removeNewFile(index)}>
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <label
        htmlFor={label}
        className={`
          w-full h-28 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25
          hover:border-primary/50 transition-colors cursor-pointer bg-muted/10 hover:bg-muted/20 group
          ${dragActive && 'border-primary bg-primary/5'}
        `}
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
      >
        <FileIcon className={`text-muted-foreground/50 h-8 w-8 mb-2 transition-colors ${dragActive ? 'text-primary' : 'group-hover:text-primary/70'}`} />

        <p className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">Drag & drop files or click to upload</p>
        <p className="text-xs text-muted-foreground mt-1">Max size: 2MB per file</p>
      </label>

      <Input ref={fileRef} id={label} type="file" multiple accept="*/*" onChange={handleBrowse} className="hidden" />

      <Button type="button" className="w-full" onClick={() => fileRef.current?.click()}>
        <Upload className="h-4 w-4 mr-2" />
        Choose Files
      </Button>
    </div>
  );
}
