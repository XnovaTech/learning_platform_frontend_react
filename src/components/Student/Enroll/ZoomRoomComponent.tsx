import Lottie from "lottie-react";
import Hello from '../../../../public/lottie/Welcome.json';


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

                    <h3 className="text-2xm font-semibold text-gray-800 mb-3">
                        Join the Live Class !
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                        Click below to enter the Zoom Class Room.
                    </p>
                    <a
                        href={zoomLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block px-7 py-3 bg-sky-600 text-white font-semibold rounded-xl hover:bg-sky-700 transition-colors"
                    >
                        Join Zoom Class
                    </a>
                </>
            ) : (
                <p className="text-center text-gray-600 dark:text-gray-300 py-10 text-lg">No Zoom link available for this lesson.</p>
            )}
        </div>
    )
}