import "@fontsource/roboto-mono/400.css";
import "./App.css";

import { css } from "@emotion/css";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { useEffect, useRef } from "react";

import Crabolyn from "./Crabolyn";
import { HueProvider, useHue } from "./HueProvider";

const theme = createTheme({
  typography: {
    fontFamily: ["Roboto Mono", "monospace"].join(","),
  },
  palette: {
    mode: "light",
  },
});

export function AppContainer({ children }: { children: React.ReactNode }) {
  const { hueRef } = useHue();
  const ref = useRef<HTMLDivElement>(null);

  const className = css({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    width: "100vw",
    overflow: "hidden",
  });

  useEffect(() => {
    let running = true;

    function update() {
      if (!running) {
        return;
      }
      if (!ref.current) {
        return;
      }

      ref.current.style.backgroundColor = `hsl(${hueRef.current}, 50%, 80%)`;

      requestAnimationFrame(update);
    }

    update();

    return () => {
      running = false;
    };
  }, [hueRef]);

  return (
    <div className={className} ref={ref}>
      {children}
    </div>
  );
}

export function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <HueProvider>
        <AppContainer>
          <Crabolyn />
        </AppContainer>
      </HueProvider>
    </ThemeProvider>
  );
}

export default App;
