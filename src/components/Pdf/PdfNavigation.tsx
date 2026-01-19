import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PdfNavigationProps {
  currentPage: number;
  totalPages: number;
  onPrevPage: () => void;
  onNextPage: () => void;
}

export default function PdfNavigation({ currentPage, totalPages, onPrevPage, onNextPage }: PdfNavigationProps) {
  return (
    <div className=" border-t p-3 flex items-center justify-center gap-4">
      <Button variant="black" size="sm" onClick={onPrevPage} disabled={currentPage === 1}>
        <ChevronLeft className="w-4 h-4" />
      </Button>
      <span className="text-sm font-medium">
        Page {currentPage} of {totalPages}
      </span>
      <Button variant="black" size="sm" onClick={onNextPage} disabled={currentPage === totalPages}>
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );
}
