import React, {
  FC,
  createContext,
  useContext,
  useRef,
  useState,
  useEffect,
  useLayoutEffect,
} from "react";

type ScrollContextType = {
  scrollPercentage: number;
  setScrollPercentage: (percentage: number) => void;
};

const ScrollSyncContext = createContext<ScrollContextType | undefined>(undefined);

interface ScrollSync extends  FC<{ children: React.ReactNode }> {
  Panel: FC<React.HTMLAttributes<HTMLDivElement>>;
}
const ScrollSync: ScrollSync = ({ children }) => {
  const [scrollPercentage, setScrollPercentage] = useState(0);

  return (
    <ScrollSyncContext.Provider value={{ scrollPercentage, setScrollPercentage }}>
      {children}
    </ScrollSyncContext.Provider>
  );
};

const ScrollSyncPanel: FC<React.HTMLAttributes<HTMLDivElement>> = (props) => {
  const ref = useRef<HTMLDivElement>(null);
  const context = useContext(ScrollSyncContext);
  const isUserScrolling = useRef(true);
  const prevScrollTop = useRef(0);

  if (!context) {
    throw new Error("ScrollSyncPanel must be used within a ScrollSync");
  }

  const { scrollPercentage, setScrollPercentage } = context;

  function handleScroll(event: Event) {
    if (ref.current && isUserScrolling.current) {
      event.preventDefault();
      // ref.current.style.overflowY = "hidden";
      const maxScrollTop = ref.current.scrollHeight - ref.current.clientHeight;
      const percentage = (ref.current.scrollTop / maxScrollTop) * 100;
      setScrollPercentage(percentage);
      ref.current.scrollTop = prevScrollTop.current;
      // ref.current.style.overflowY = "scroll";
    }
    isUserScrolling.current = true; // Reset flag after handling scroll
  };

  useLayoutEffect(() => {
    const currentRef = ref.current;
    currentRef?.addEventListener("scroll", handleScroll);

    return () => currentRef?.removeEventListener("scroll", handleScroll);
  }, []);

  useLayoutEffect(() => {
    const currentRef = ref.current;
    if (currentRef) {
      const maxScrollTop = currentRef.scrollHeight - currentRef.clientHeight;
      const targetScrollTop = (scrollPercentage / 100) * maxScrollTop;

      // Check if we need to update the scrollTop to prevent unnecessary updates
      if (Math.abs(currentRef.scrollTop - targetScrollTop) > 1) {
        isUserScrolling.current = false; // Prevent triggering handleScroll
        currentRef.scrollTop = targetScrollTop;
        prevScrollTop.current = targetScrollTop;
      }
    }
  }, [scrollPercentage]);

  return <div {...props} ref={ref} style={{ ...props.style, overflowY: "scroll", willChange: "scroll-position" }} />;
};

ScrollSync.Panel = ScrollSyncPanel;

export default ScrollSync;
