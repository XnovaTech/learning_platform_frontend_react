'';

import Link from 'next/link';
import Lottie from 'lottie-react';
import { Button } from '@/components/ui/button';
import fourOhFour from './../public/lottie/NotFound.json';

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center ">
      <div className="w-full max-w-xl mx-auto text-center space-y-6">
        <div className="mx-auto  w-9/12 ">
          <Lottie animationData={fourOhFour} loop={true} className="w-full h-full" />
        </div>

        <div className="space-y-2">
          <h1 className="text-5xl  font-bold tracking-tight text-primary">Oops! Page not found</h1>
          <p className="text-muted-foreground  mt-5">The page you are looking for doesn’t exist or was moved.</p>
        </div>

        <div className="flex items-center justify-center gap-4">
          <Link href="/">
            <Button >Go Home</Button>
          </Link>
          <Button type="button" variant="outline" onClick={() => (typeof window !== 'undefined' ? window.history.back() : null)}>
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
}
