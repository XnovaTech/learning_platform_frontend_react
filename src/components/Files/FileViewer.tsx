import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FileText, Download } from 'lucide-react';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  fileUrl: string;
  filename: string;
};

export function FileViewer({ isOpen, onClose, fileUrl, filename }: Props) {
  const extension = filename.split('.').pop()?.toLowerCase();

  const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension ?? '');
  const isPdf = extension === 'pdf';
  const isWord = ['doc', 'docx'].includes(extension ?? '');

  const renderFileContent = () => {
    if (isPdf) {
      return <iframe src={fileUrl} className="w-full h-[80vh] rounded" title={filename} />;
    }

    if (isImage) {
      return <img src={fileUrl} alt={filename} className="max-h-[80vh] w-full mx-auto rounded object-cover" />;
    }

    if (isWord) {
      return (
        <div className="text-center py-10">
          <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <p className="font-medium mb-2">Word Document</p>
          <p className="text-sm text-muted-foreground mb-4">This file type cannot be previewed. Please download to view.</p>
          <Button asChild>
            <a href={fileUrl} download={filename}>
              <Download className="h-4 w-4 mr-2" />
              Download File
            </a>
          </Button>
        </div>
      );
    }

    return (
      <div className="text-center py-10">
        <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <p className="font-medium">Preview not available</p>
        <p className="text-sm text-muted-foreground mb-4">This file type cannot be previewed in the browser.</p>
        <Button asChild>
          <a href={fileUrl} download={filename}>
            <Download className="h-4 w-4 mr-2" />
            Download File
          </a>
        </Button>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="min-w-xs md:min-w-4xl  max-w-5xl max-h-[95vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className='text-left'>{filename}</DialogTitle>
        </DialogHeader>

        <div className="overflow-auto">{renderFileContent()}</div>
      </DialogContent>
    </Dialog>
  );
}
