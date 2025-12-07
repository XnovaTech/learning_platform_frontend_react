import React, { useRef, useState, type DragEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ImageIcon, X, Upload } from 'lucide-react';

interface ImageUploaderProps {
  label: string;
  value: File | string | null;
  onChange: (file: File | null) => void;
}

export default function ImageUploader({ label, value, onChange }: ImageUploaderProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFile = (file: File) => {
    if (!file) return;
    onChange(file);
  };

  const handleDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setDragActive(false);

    if (!e.dataTransfer.files?.length) return;
    handleFile(e.dataTransfer.files[0]);
  };

  const handleBrowse = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    handleFile(e.target.files[0]);
  };

  return (
    <div className="space-y-3 col-span-2">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <div className="h-8 w-1 bg-primary rounded-full" />
        {label}
      </h3>

      {value ? (
        <div className="relative group">
          <div className="w-full overflow-hidden rounded-lg border border-primary/20 bg-muted/20">
            <img src={value instanceof File ? URL.createObjectURL(value) : String(value)} alt="preview" className="w-full object-cover h-40" />
          </div>

          <Button
            type="button"
            variant="red"
            size="sm"
            className="absolute top-2 hover:scale-100  right-2 opacity-0  duration-300 group-hover:opacity-100 transition-opacity shadow"
            onClick={() => onChange(null)}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      ) : (
        <label
          htmlFor={label}
          className={`
            'w-full h-40 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25',
            'hover:border-primary/50 transition-colors cursor-pointer bg-muted/10 hover:bg-muted/20 group',
            ${dragActive && 'border-primary bg-primary/5'}
          `}
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
        >
          <ImageIcon className={`text-muted-foreground/50 h-12 w-12 mb-3 transition-colors ${dragActive ? 'text-primary' : 'group-hover:text-primary/70'}`} />

          <p className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">Drag & drop or click to upload</p>
          <p className="text-xs text-muted-foreground mt-1">Max size: 2MB</p>
        </label>
      )}

      <Input ref={fileRef} id={label} type="file" accept="image/*" onChange={handleBrowse} className="hidden" />

      {!value && (
        <Button type="button" className="w-full" onClick={() => fileRef.current?.click()}>
          <Upload className="h-4 w-4 mr-2" />
          Choose File
        </Button>
      )}
    </div>
  );
}
