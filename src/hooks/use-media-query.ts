/* eslint-disable @eslint-react/hooks-extra/no-direct-set-state-in-use-effect */
import { useEffect, useState } from "react";

type MediaQuery = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

const TAILWIND_BREAKPOINTS: Record<MediaQuery, number> = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
};

export function useBreakpoint(breakpoint: MediaQuery): boolean {
  const [isAbove, setIsAbove] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth >= TAILWIND_BREAKPOINTS[breakpoint];
  });

  useEffect(() => {
    function handleResize() {
      setIsAbove(window.innerWidth >= TAILWIND_BREAKPOINTS[breakpoint]);
    }

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, [breakpoint]);

  return isAbove;
}

// export function useMediaQuery(): MediaQuery {
//   const [breakpoint, setBreakpoint] = useState<string>("loading");
//   const [mounted, setMounted] = useState(false);
//
//   useEffect(() => {
//     setMounted(true);
//
//     const updateBreakpoint = () => {
//       const width = window.innerWidth;
//
//       if (width >= 1536) {
//         // eslint-disable-next-line @eslint-react/hooks-extra/no-direct-set-state-in-use-effect
//         setBreakpoint("2xl");
//       } else if (width >= 1280) {
//         setBreakpoint("xl");
//       } else if (width >= 1024) {
//         setBreakpoint("lg");
//       } else if (width >= 768) {
//         setBreakpoint("md");
//       } else if (width >= 640) {
//         setBreakpoint("sm");
//       } else {
//         setBreakpoint("xs");
//       }
//     };
//
//     // Initial check
//     updateBreakpoint();
//
//     // Add event listener
//     window.addEventListener("resize", updateBreakpoint);
//
//     // Clean up
//     return () => window.removeEventListener("resize", updateBreakpoint);
//   }, []);
// }
