import "@fontsource/maple-mono/400.css";
import "@fontsource/maple-mono/600.css";

import "./App.css";

import { useEffect } from "react";
import Crabolyn from "./Crabolyn";
import styled from "@emotion/styled";

export function HueRotate() {
  useEffect(() => {
    let handle: number | null = null;
    let hue = 0;

    function updateHue(timestamp: number = 0) {
      hue = (timestamp * 0.01) % 360;
      document.documentElement.style.setProperty("--hue", `${hue}`);
      handle = requestAnimationFrame(updateHue);
    }

    updateHue();

    return () => {
      if (handle !== null) {
        cancelAnimationFrame(handle);
      }
    };
  }, []);

  return null;
}

const Container = styled.div({
  display: "flex",
  flexDirection: "column",
  gap: "32px",
  height: "100vh",
  justifyContent: "space-evenly",
  margin: "auto",
  maxWidth: "512px",
  padding: "32px",
});

const Links = styled.div({
  display: "flex",
  gap: "16px",
  justifyContent: "center",
  flexDirection: "column",
});

export function App() {
  return (
    <>
      <HueRotate />
      <Container>
        <h1>crabolyn club</h1>
        <Crabolyn />
        <Links>
          <a href="/crabolyn/crabolyn.stl" download>
            .stl
          </a>
          <a href="/crabolyn/crabolyn_raw.zip" download>
            .obj (raw)
          </a>
        </Links>
      </Container>
    </>
  );
}

export default App;
