import { AnimatePresence, CustomDomComponent, motion } from "framer-motion";

import {
  CSSProperties,
  Children,
  DetailedHTMLProps,
  FC,
  Fragment,
  HTMLAttributes,
  PropsWithChildren,
  ReactElement,
  ReactNode,
  useEffect,
} from "react";
import { useSatori } from "./boundary";
import { useRouter } from "next/router";

export const SatoriAnimated: FC<{
  children: ReactElement<
    { children: ReactElement } & DetailedHTMLProps<
      HTMLAttributes<any>,
      HTMLElement
    >
  >;
}> = ({ children }) => {
  const satori = useSatori();
  const router = useRouter();
  const styles = satori.styles[satori.target!];

  const parentKey = router.asPath;

  useEffect(() => {
    if (!children.key) return;
    const childrens: Record<string, Record<string, CSSProperties>> = {};

    Children.toArray(children.props.children).forEach((value) => {
      const child = value as ReactElement;
      if (!child.key) return;
      childrens[child.key] = child.props.style;
    });

    satori.addStyles({
      [parentKey]: { [children.key]: children.props.style, ...childrens },
    });
  }, []);

  if (!children.key || !styles) return;

  const ContainerComponent = motion(children.type);

  const photos = Children.toArray(children.props.children).map((child) => {
    child = child as ReactElement;
    if (!child.key) return;
    console.log(child);
    const Component = motion(child.type);

    const photoStyles = styles[child.key];

    return (
      <Component
        {...child.props}
        key={child.key}
        layoutId={child.key}
        initial={photoStyles}
        exit={photoStyles}
        animate={child.props.style}
        layout
      />
    );
  });

  return (
    <ContainerComponent
      layoutId={children.key}
      key={children.key}
      style={children.props.style}
      layout
    >
      {photos}
    </ContainerComponent>
  );
};
