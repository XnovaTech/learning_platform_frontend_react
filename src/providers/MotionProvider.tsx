'';

import { usePathname } from "next/navigation";
import { PropsWithChildren, useEffect } from "react";
import { AnimatePresence, motion } from 'framer-motion';

export default function MotionProvider({ children }: PropsWithChildren) {
    const pathname = usePathname();
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [pathname]);

    return <AnimatePresence mode='wait'>
        <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
        >
            {children}
        </motion.div>
    </AnimatePresence>
}