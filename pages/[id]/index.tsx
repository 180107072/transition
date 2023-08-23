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
      <motion.div
        key="photo-container"
        layoutId="photo-container"
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
        <motion.img
          key={`photo photo-${id}`}
          layoutId={String(id)}
          src={`/photos/${id}.jpg`}
          className="cursor-pointer"
          initial={{
            width: 180,
            height: 400,
            borderRadius: 0,
          }}
          exit={{
            width: 180,
            height: 400,
          }}
          animate={{
            width: "auto",
            height: "auto",
            borderRadius: 10,
          }}
          transition={{
            duration: 0.6,
          }}
          style={{
            borderRadius: 10,
            objectFit: "cover",
            zIndex: 1,
          }}
        />
      </motion.div>
    </SatoriAnimated>
  );
};

export default Photo;
