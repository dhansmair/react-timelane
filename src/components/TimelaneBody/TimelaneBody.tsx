import { PropsWithChildren } from "react";
import { TimelaneLayout } from "../TimelaneLayout/TimelaneLayout";
import { TimelaneSelectionLayer } from "./TimelaneSelectionLayer";
import { ItemId } from "../../types";

export interface TimelaneBodyProps {
  /**
   * callback that provides an array of item IDs of selected items.
   */
  onSelect?: (selection: ItemId[]) => void;
}

/**
 * `<TimelaneBody>` is a container for `<TimelaneLane>` components.
 *
 * It must be a child component of `<Timelane>`.
 *
 * It also provides the <b>item selection layer</b>, i.e. it will render a dashed
 * rectangle to visualize the selection range and provides the `onSelect()`
 * callback.
 */
export function TimelaneBody({
  onSelect = () => undefined,
  children,
}: PropsWithChildren<TimelaneBodyProps>) {
  return (
    <TimelaneLayout.Body>
      <TimelaneSelectionLayer onSelect={onSelect}>
        <div className="timelane-body">{children}</div>
      </TimelaneSelectionLayer>
    </TimelaneLayout.Body>
  );
}
