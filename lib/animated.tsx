import { AnimatePresence, motion, usePresence } from "framer-motion";
import {
  CSSProperties,
  Children,
  DetailedHTMLProps,
  FC,
  HTMLAttributes,
  ReactElement,
  useEffect,
} from "react";
import { useSatori } from "./boundary";
import { useRouter } from "next/router";

type SatoriChildren = ReactElement<
  { children: ReactElement } & DetailedHTMLProps<
    HTMLAttributes<any>,
    HTMLElement
  >
>;

const SatoriComponent: FC<{
  children: ReactElement;
  layoutStyles: CSSProperties | undefined;
}> = ({ children, layoutStyles = {} }) => {
  const Component = motion(children.type);

  return (
    <Component
      {...children.props}
      layoutId={children.key}
      initial={layoutStyles}
      exit={layoutStyles}
      animate={children.props.style}
    />
  );
};

const SatoriRenderer: FC<{
  children: ReactElement;
  styles: Record<string, CSSProperties | undefined>;
}> = ({ children, styles }) => {
  return (
    <>
      {Children.toArray(children).map((child) => {
        child = child as ReactElement;
        if (!child.key) return;

        const layoutStyles = styles ? styles[child.key] : {};

        return (
          <SatoriComponent key={child.key} layoutStyles={layoutStyles}>
            {child}
          </SatoriComponent>
        );
      })}
    </>
  );
};

const useSatoriTargetLookup = (children: SatoriChildren) => {
  const satori = useSatori();
  const router = useRouter();
  const styles = satori.styles.get(satori.target);
  const parentKey = router.asPath;

  useEffect(() => {
    if (!children.key) return;
    const childrens: Record<string, Record<string, CSSProperties>> = {};

    Children.toArray(children.props.children).forEach((value) => {
      const child = value as ReactElement;
      if (!child.key) return;
      childrens[child.key] = child.props.style;
    });

    satori.styles.set(parentKey, {
      [children.key]: children.props.style,
      ...childrens,
    });

    return () => {
      satori.styles.delete(parentKey);
    };
  }, []);

  return styles;
};

export const SatoriAnimated: FC<{
  children: SatoriChildren;
}> = ({ children }) => {
  const styles = useSatoriTargetLookup(children);

  const photos = (
    <SatoriRenderer styles={styles || {}}>
      {children.props.children}
    </SatoriRenderer>
  );

  const ContainerComponent = motion(children.type);

  return (
    <ContainerComponent
      layoutId={children.key}
      key={children.key}
      style={children.props.style}
    >
      {photos}
    </ContainerComponent>
  );
};
