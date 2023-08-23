import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import { FC, PropsWithChildren, useEffect } from "react";
import { useSatori } from "./boundary";

export const SatoriAnimated: FC<PropsWithChildren> = ({ children }) => {
  const router = useRouter();
  const satori = useSatori();
  const parentKey = router.asPath;

  useEffect(() => {
    satori.addChildren({ [parentKey]: children });
  }, []);

  return <AnimatePresence>{children}</AnimatePresence>;
};
