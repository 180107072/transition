"use client";

import { FC } from "react";
import { motion } from "framer-motion";
import { SatoriAnimated } from "@/lib/animated";
import { useRouter } from "next/router";

const Photo: FC = () => {
  const router = useRouter();

  const id = router.query.id;

  return (
    <SatoriAnimated>
      <div
        key="photo-container"
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
          alignContent: "center",
          width: "100%",
          height: "100%",
          gap: 32,
        }}
      >
        <img
          key={`photo photo-${id}`}
          src={`/photos/${id}.jpg`}
          style={{
            objectFit: "cover",
            width: "auto",
            height: "auto",
            zIndex: 1,
          }}
        />
      </div>
    </SatoriAnimated>
  );
};

export default Photo;
