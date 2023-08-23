import { motion, useIsPresent, usePresence, useScroll } from "framer-motion";
import {
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
  addChildren: (key: Record<string, ReactNode>) => void;
};

export const SatoriContext = createContext<SatoriBoundaryContextActions | null>(
  null
);

export const SatoriBoundary: FC<PropsWithChildren> = ({ children }) => {
  const [animated, addChildren] = useState<Record<string, ReactNode>>({});

  const filteredChildren = onlyElements(children);
  let childrenToRender = filteredChildren;

  const exitingChildren = useRef(
    new Map<ComponentKey, ReactElement<any> | undefined>()
  ).current;
  const presentChildren = useRef(childrenToRender);

  const allChildren = useRef(
    new Map<ComponentKey, ReactElement<any>>()
  ).current;

  useEffect(() => {
    updateChildLookup(filteredChildren, allChildren);
    return () => {
      exitingChildren.clear();
    };
  }, []);

  const presentKeys = presentChildren.current.map(getChildKey);
  const targetKeys = filteredChildren.map(getChildKey);

  const numPresent = presentKeys.length;

  for (let i = 0; i < numPresent; i++) {
    const key = presentKeys[i];

    if (targetKeys.indexOf(key) === -1) {
      exitingChildren.set(key, undefined);
    }
  }

  console.log(childrenToRender[0].type());
  if (exitingChildren.size) {
    childrenToRender = [];
  }

  exitingChildren.forEach((component, key) => {
    if (targetKeys.indexOf(key) !== -1) return;

    const child = allChildren.get(key);
    if (!child) return;

    const insertionIndex = presentKeys.indexOf(key);

    let exitingComponent = component;
    if (!exitingComponent) {
      exitingComponent = <Fragment key={getChildKey(child)}>{child}</Fragment>;
      exitingChildren.set(key, exitingComponent);
    }

    childrenToRender.splice(insertionIndex, 0, exitingComponent);
  });

  return (
    <SatoriContext.Provider value={{ addChildren }}>
      {exitingChildren.size
        ? childrenToRender
        : childrenToRender.map((child) => cloneElement(child))}
    </SatoriContext.Provider>
  );
};

export const useSatori = () => {
  const context = useContext(SatoriContext);

  if (!context) throw Error("No SatoriBoundary");

  return context;
};
