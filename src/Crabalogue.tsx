import crabalogue from "./crabalogue.json";

interface CrabolynEntry {
  name: string;
  color: string;
  fullPath: string;
  thumbPath: string;
}

type Crabalogue = CrabolynEntry[];

import { useState, useEffect, useRef } from "react";
import { keyframes } from "@emotion/react";

const fadeIn = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

const ImageLoader = ({
  color,
  src,
  alt,
}: {
  color: string;
  src: string;
  alt: string;
}) => {
  const fallbackRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 },
    );

    const currentImgRef = fallbackRef.current;
    if (currentImgRef) {
      observer.observe(currentImgRef);
    }

    return () => {
      if (currentImgRef) {
        observer.unobserve(currentImgRef);
      }
    };
  }, []);

  return (
    <div
      css={{
        backgroundColor: color,
        borderRadius: "16px",
        aspectRatio: "1/1",
        overflow: "hidden",
        width: "100%",
      }}
      ref={fallbackRef}
    >
      {isVisible && (
        <img
          css={{
            animation: `${fadeIn} 0.5s ease-out`,
            width: "100%",
            aspectRatio: "1/1",
          }}
          src={src}
          alt={alt}
        />
      )}
    </div>
  );
};

function Entry({ entry }: { entry: CrabolynEntry }) {
  const { name, color, thumbPath } = entry;

  return (
    <div
      css={{
        borderRadius: "16px",
        padding: "1rem",

        "&:nth-of-type(odd)": {
          backgroundColor: "var(--primary)",
          filter: "drop-shadow(8px 8px 0 var(--shadow-inverse))",
          transform: "rotate(-1deg)",

          h2: {
            color: "white",
          },
        },
        "&:nth-of-type(even)": {
          backgroundColor: "var(--tertiary)",
          filter: "drop-shadow(8px 8px 0 var(--shadow))",
          transform: "rotate(1deg)",
        },
      }}
    >
      <h2
        css={{
          fontSize: "1.5rem",
          textAlign: "center",
          fontWeight: "400",
          margin: "0 0 16px",
        }}
      >
        {name}
      </h2>
      <ImageLoader color={color} src={`./crabalogue/${thumbPath}`} alt={name} />
    </div>
  );
}

export default function Crabalogue() {
  return (
    <div
      css={{
        display: "flex",
        gap: "32px",
        flexDirection: "column",
        margin: "0 auto",
      }}
    >
      {crabalogue.map((entry, i) => (
        <Entry key={i} entry={entry} />
      ))}
    </div>
  );
}
