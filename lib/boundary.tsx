import {
  CSSProperties,
  Children,
  FC,
  PropsWithChildren,
  ReactElement,
  ReactNode,
  createContext,
  isValidElement,
  useContext,
  useEffect,
  useRef,
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

type SatoriBoundaryContextActions = {};
type SatoriStyles = Map<
  ComponentKey | undefined,
  Record<string, CSSProperties | undefined>
>;
type SatoriBoundaryContextState = {
  styles: SatoriStyles;
  target: ComponentKey | undefined;
};

export const SatoriContext = createContext<
  (SatoriBoundaryContextActions & SatoriBoundaryContextState) | null
>(null);

export const SatoriBoundary: FC<PropsWithChildren> = ({ children }) => {
  const styles = useRef<SatoriStyles>(new Map([[undefined, {}]]));

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
    updateChildLookup(filteredChildren, allChildren);
    presentChildren.current = childrenToRender;
  });

  useEffect(() => {
    isInitialRender.current = false;

    return () => {
      isInitialRender.current = true;
      allChildren.clear();
      exitingChildren.clear();
    };
  }, []);

  const presentKeys = presentChildren.current.map(getChildKey);
  const targetKeys = filteredChildren.map(getChildKey);
  const numPresent = presentKeys.length;

  const target = (() => {
    for (let i = 0; i < numPresent; i++) {
      const key = presentKeys[i];

      if (targetKeys.indexOf(key) === -1 && !exitingChildren.has(key)) {
        return key;
      }
    }

    return presentKeys[0];
  })();

  return (
    <SatoriContext.Provider value={{ target, styles: styles.current }}>
      {childrenToRender}
    </SatoriContext.Provider>
  );
};

export const useSatori = () => {
  const context = useContext(SatoriContext);

  if (!context) throw Error("No SatoriBoundary");

  return context;
};
