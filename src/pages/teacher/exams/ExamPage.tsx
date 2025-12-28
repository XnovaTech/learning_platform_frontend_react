import React, { useState } from 'react';
import { uploadExamFile } from '../../../services/testService';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';
import PdfEditor from '@/components/Files/PdfEditor';

export default function ExamPage() {
  const [file, setFile] = useState<File | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>('/sample.pdf');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setFile(e.target.files[0]);
  };

  const uploadMutation = useMutation({
    mutationFn: (file: File) => uploadExamFile(file),
    onSuccess: (response) => {
      setPdfUrl(response.data);
      toast.success('File uploaded and converted successfully');
    },
    onError: () => toast.error('Failed to upload and convert file'),
  });

  const handleUpload = () => {
    if (!file) return;
    uploadMutation.mutate(file);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900">Exam Test</h2>

      <div className="flex items-center justify-between gap-4">
        <input type="file" accept=".doc,.docx" onChange={handleFileChange} className="block w-fit cursor-pointer text-sm" />

        <Button size="sm" onClick={handleUpload} disabled={!file || uploadMutation.isPending}>
          {uploadMutation.isPending ? 'Uploading...' : 'Upload and Convert'}
        </Button>
      </div>

      {pdfUrl && (
        <div className="space-y-4 mt-8">
          <h3 className="text-lg font-medium text-gray-900">PDF Review </h3>
          <PdfEditor pdfUrl={pdfUrl} />
        </div>
      )}
    </div>
  );
}
