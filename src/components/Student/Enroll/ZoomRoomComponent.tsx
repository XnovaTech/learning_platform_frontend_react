import Lottie from 'lottie-react';
import Hello from '../../../../public/lottie/Welcome.json';
import { Video } from 'lucide-react';

export interface ZoomRoomCompponentProps {
  zoomLink?: string | undefined;
}

export function ZoomRoomComponent({ zoomLink }: ZoomRoomCompponentProps) {
  return (
    <div className=" drop-shadow-2xl backdrop-blur-lg bg-white/50 dark:bg-slate-900/80 rounded-2xl p-6 md:p-8 text-center">
      {zoomLink ? (
        <>
          <div className="flex mb-4 justify-center">
            <Lottie animationData={Hello} loop={true} className=" w-52" />
          </div>

          <h3 className="text-2xm font-semibold text-gray-800 mb-3">Join the Live Class !</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">Click below to enter the Zoom Class Room.</p>
          <a href={zoomLink} target="_blank" rel="noopener noreferrer" className="inline-block text-sm md:text-base px-5 py-3 bg-sky-600 text-white font-semibold rounded-xl hover:bg-sky-700 transition-colors">
            Join Zoom Class
          </a>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center">
          <div className="rounded-full bg-primary/90 p-4 mb-4">
            <Video className="size-8 text-white" />
          </div>
          <h4 className="text-lg font-semibold text-foreground mb-1">Not Found Zoom Link</h4>
        </div>
      )}
    </div>
  );
}
