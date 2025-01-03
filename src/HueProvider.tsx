import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
  useRef,
} from "react";

interface HueContextProps {
  hue: number;
  hueRef: React.MutableRefObject<number>;
}

const HueContext = createContext<HueContextProps | undefined>(undefined);

export const HueProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const hueRef = useRef(0);
  const [hue, setHue] = useState(0);

  useEffect(() => {
    let running = true;

    let lastTimestamp = 0;
    function update(timestamp: number = 0) {
      if (!running) {
        return;
      }

      const delta = timestamp - lastTimestamp;
      lastTimestamp = timestamp;

      hueRef.current = (hueRef.current += (delta / 1000) * 30) % 360;
      setHue(hueRef.current);

      requestAnimationFrame(update);
    }
    update();

    return () => {
      running = false;
    };
  }, []);

  return (
    <HueContext.Provider value={{ hue, hueRef }}>
      {children}
    </HueContext.Provider>
  );
};

export const useHue = (): HueContextProps => {
  const context = useContext(HueContext);
  if (context === undefined) {
    throw new Error("useHue must be used within a HueProvider");
  }

  return context;
};
