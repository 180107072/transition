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
          alignItems: "center",
          flexDirection: "row",
          width: "100%",
          height: "100%",
          gap: 8,
        }}
      >
        {Array(3)
          .fill(0)
          .map((_, i) =>
            i + 1 == 3 ? (
              <motion.img
                key={`photo photo-${i + 1}`}
                layoutId={String(i + 1)}
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
                initial={{
                  width: "auto",
                  height: "auto",
                }}
                animate={{
                  width: 180,
                  height: 400,
                }}
              />
            ) : (
              <motion.img
                key={`photo photo-${i + 1}`}
                layoutId={String(i + 1)}
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
                exit={{
                  opacity: 0,
                }}
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 1,
                }}
              />
            )
          )}
      </div>
    </SatoriAnimated>
  );
}
