import Lottie from 'lottie-react';
import LoadingHub from '../../public/lottie/Loading1.json';

export default function Loading() {
  return (
    <div className=" p-5 w-full shadow-xs   rounded-2xl h-[calc(100vh-100px)] flex justify-center items-center  transition-all duration-500">
      <div className="flex flex-col items-center space-y-6">
        <div className=" w-44 h-44 md:w-64 md:h-64 flex justify-center items-center overflow-hidden">
          <Lottie animationData={LoadingHub} loop className="w-full h-full" />
        </div>

        <div className="text-center">
          <p className="text-lg md:text-xl  text-muted-foreground font-semibold animate-pulse">Loading...</p>
        </div>
      </div>
    </div>
  );
}
