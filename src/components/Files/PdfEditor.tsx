import { useEffect, useRef } from 'react';

interface Props {
  pdfUrl: string;
}

export default function PdfEditor({ pdfUrl }: Props) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;

    const { NutrientViewer } = window;
    if (container && NutrientViewer) {
      NutrientViewer.load({
        container,
        document: pdfUrl,
      });
    }

    return () => {
      NutrientViewer?.unload(container);
    };
  }, []);

  return <div ref={containerRef} className="w-full h-[90vh] mx-auto border rounded-lg overflow-hidden" />;
}



