"use client";

import { SatoriAnimated } from "@/lib/animated";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function Home() {
  const Router = useRouter();

  return (
    <SatoriAnimated>
      <div
        key="photo-container"
        style={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          alignItems: "center",
          flexDirection: "row",
          width: "100%",
          height: "100%",
          gap: 8,
          background: "red",
        }}
      >
        {Array(3)
          .fill(0)
          .map((_, i) => (
            <img
              key={`photo photo-${i + 1}`}
              src={`/photos/${i + 1}.jpg`}
              className="cursor-pointer"
              onClick={() => Router.push(`/${i + 1}`)}
              style={{
                width: 180,
                height: 400,
                borderRadius: 0,
                objectFit: "cover",
                zIndex: 1,
              }}
            />
          ))}
      </div>
    </SatoriAnimated>
  );
}
