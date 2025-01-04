import "@fontsource/maple-mono/400.css";
import "@fontsource/maple-mono/800.css";

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

const Crabolyainer = styled.div({
  display: "flex",
  flexDirection: "column",
  transform: "translateX(-10px) rotate(7.5deg)",

  h1: {
    color: "var(--primary)",
    fontSize: "4rem",
    textAlign: "center",
    fontWeight: 800,
    lineHeight: 1,
    margin: "0 0 16px",
    filter: "drop-shadow(2px 2px 0 var(--shadow))",
  },
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
        <Crabolyainer>
          <h1>
            crabolyn
            <br />
            club
          </h1>
          <Crabolyn />
        </Crabolyainer>
        <Links>
          <a href="/crabolyn/crabolyn.stl" download>
            <span>.stl</span>
          </a>
          <a href="/crabolyn/crabolyn_raw.zip" download>
            <span>.obj (raw)</span>
          </a>
        </Links>
      </Container>
    </>
  );
}

export default App;
