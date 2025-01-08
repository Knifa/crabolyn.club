import "@fontsource/maple-mono/400.css";
import "@fontsource/maple-mono/800.css";

import "./App.css";

import { useEffect } from "react";
import Crabalogue from "./Crabalogue";
import Crabolyn from "./Crabolyn";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";

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
  gap: "64px",
  minHeight: "100vh",
  justifyContent: "space-evenly",
  margin: "auto",
  padding: "64px 16px",
});

const Crabolyainer = styled.div({
  display: "flex",
  flexDirection: "column",
  margin: "0 auto",
  maxWidth: "512px",
  transform: "translateX(-12px) rotate(6deg)",
  width: "100%",

  h1: {
    color: "var(--primary)",
    fontSize: "4rem",
    textAlign: "center",
    fontWeight: 800,
    lineHeight: 1,
    margin: "0 0 16px",
    filter: "drop-shadow(2px 2px 0 var(--shadow-inverse))",
    animation: "h1-wiggle 5s ease-in-out infinite",
  },
});

const linkWiggleStart = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(2deg);
  }
`;

const linkWiggleLoop = keyframes`
  0% {
    transform: rotate(2deg);
  }
  50% {
    transform: rotate(-2deg);
  }
  100% {
    transform: rotate(2deg);
  }
`;

const LinkContainer = styled.div({
  display: "flex",
  gap: "16px",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",

  a: {
    backgroundColor: "var(--tertiary)",
    color: "black",
    filter: "drop-shadow(8px 8px 0 var(--shadow))",
    fontSize: "1.5rem",
    textAlign: "center",
    textDecoration: "none",
    borderRadius: "16px",
    display: "block",
    padding: "1rem",

    "&:hover": {
      color: "white",
      textDecoration: "underline",
      textDecorationThickness: "0.15rem",
      backgroundColor: "var(--primary)",
      filter: "drop-shadow(8px 8px 0 var(--shadow-inverse))",
      animation: `
        ${linkWiggleStart} 0.25s 1 ease-in-out,
        ${linkWiggleLoop} 1s 0.25s ease-in-out infinite
      `,
    },
  }
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
        <LinkContainer>
          <a href="/crabolyn/crabolyn.stl" download>
            .stl
          </a>
          <a href="/crabolyn/crabolyn_raw.zip" download>
            .obj (raw)
          </a>
        </LinkContainer>
        <Crabalogue />
      </Container>
    </>
  );
}

export default App;
