import { SatoriBoundary } from "@/lib/boundary";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const pageKey = router.asPath;

  return (
    <SatoriBoundary>
      <Component {...pageProps} key={pageKey} />
    </SatoriBoundary>
  );
}
