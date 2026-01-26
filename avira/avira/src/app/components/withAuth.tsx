"use client";

import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  return function ProtectedComponent(props: P) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
      if (status === "unauthenticated") {
        // redirect to login but keep "callbackUrl" so they return to where they came from
        router.push(
          `/auth?mode=signin&callbackUrl=${encodeURIComponent(pathname)}`
        );
      }
    }, [status, router, pathname]);

    if (status === "loading") {
      return <p>Loading...</p>; // can replace with spinner
    }

    if (!session) {
      return null; // don't flash content before redirect
    }

    return <WrappedComponent {...props} />;
  };
}
