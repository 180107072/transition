import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import {
  CSSProperties,
  Children,
  FC,
  Fragment,
  PropsWithChildren,
  ReactElement,
  ReactNode,
  cloneElement,
  createContext,
  isValidElement,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type ComponentKey = string | number;

const getChildKey = (child: ReactElement<any>): ComponentKey => child.key || "";

function updateChildLookup(
  children: ReactElement<any>[],
  allChildren: Map<ComponentKey, ReactElement<any>>
) {
  children.forEach((child) => {
    const key = getChildKey(child);
    allChildren.set(key, child);
  });
}

function onlyElements(children: ReactNode): ReactElement<any>[] {
  const filtered: ReactElement<any>[] = [];

  Children.forEach(children, (child) => {
    if (isValidElement(child)) filtered.push(child);
  });

  return filtered;
}

type SatoriBoundaryContextActions = {
  addStyles: (
    obj: Record<string, Record<string, CSSProperties | undefined>>
  ) => void;
};

type SatoriBoundaryContextState = {
  styles: Record<string, Record<string, CSSProperties | undefined>>;
  target: ComponentKey | undefined;
};

export const SatoriContext = createContext<
  (SatoriBoundaryContextActions & SatoriBoundaryContextState) | null
>(null);

export const SatoriBoundary: FC<PropsWithChildren> = ({ children }) => {
  const [styles, setStyles] = useState<
    Record<string, Record<string, CSSProperties | undefined>>
  >({});

  const filteredChildren = onlyElements(children);
  let childrenToRender = filteredChildren;

  const exitingChildren = useRef(
    new Map<ComponentKey, ReactElement<any> | undefined>()
  ).current;

  const presentChildren = useRef(childrenToRender);

  const allChildren = useRef(
    new Map<ComponentKey, ReactElement<any>>()
  ).current;

  const isInitialRender = useRef(true);

  useEffect(() => {
    isInitialRender.current = false;

    updateChildLookup(filteredChildren, allChildren);
    presentChildren.current = childrenToRender;
    return () => {
      isInitialRender.current = true;
      allChildren.clear();
      exitingChildren.clear();
    };
  }, [children]);

  const addStyles = (
    style: Record<string, Record<string, CSSProperties | undefined>>
  ) => {
    setStyles({
      ...styles,
      ...style,
    });
  };

  const presentKeys = presentChildren.current.map(getChildKey);
  const targetKeys = filteredChildren.map(getChildKey);
  const numPresent = presentKeys.length;

  const target = useMemo(() => {
    for (let i = 0; i < numPresent; i++) {
      const key = presentKeys[i];

      if (targetKeys.indexOf(key) === -1 && !exitingChildren.has(key)) {
        return key;
      }
    }

    return presentKeys[0];
  }, [children]);

  return (
    <SatoriContext.Provider value={{ addStyles, target, styles }}>
      {childrenToRender}
    </SatoriContext.Provider>
  );
};

export const useSatori = () => {
  const context = useContext(SatoriContext);

  if (!context) throw Error("No SatoriBoundary");

  return context;
};
