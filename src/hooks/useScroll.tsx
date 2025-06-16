import { ItemId, SwimlaneId } from "../types";
import { useTimelaneContext } from "./useTimelaneContext";
import { dateToPixel } from "../components/core/utils";

export const useScroll = () => {
  const { settings } = useTimelaneContext();

  function scrollTo(destination: { horz?: Date; vert?: SwimlaneId } | ItemId) {
    if (destination instanceof Object) {
      if (destination.horz !== undefined) {
        scrollToDate(destination.horz);
      }

      if (destination.vert !== undefined) {
        scrollToLane(destination.vert);
      }
    } else {
      scrollToItem(destination);
    }
  }

  function scrollToDate(date: Date) {
    window.requestAnimationFrame(() => {
      const el: HTMLElement | null = document.getElementById(
        "timelane-background-date-anchor"
      );

      if (el) {
        const offsetLeft: number = dateToPixel(date, settings.start, settings);

        el.style.setProperty("left", `${offsetLeft}px`);

        el.scrollIntoView({
          block: "nearest",
          inline: "center",
          behavior: "smooth",
        });
      }
    });
  }

  function scrollToLane(laneId: SwimlaneId) {
    window.requestAnimationFrame(() => {
      const el: HTMLElement | null = document.getElementById(
        `timelane-swimlane-${laneId}`
      );

      if (el) {
        el.scrollIntoView({ block: "center", behavior: "smooth" });
      }
    });
  }

  function scrollToItem(itemId: ItemId) {
    window.requestAnimationFrame(() => {
      const el: HTMLElement | null = document.getElementById(
        `timelane-item-${itemId}`
      );

      if (el) {
        el.scrollIntoView({
          block: "center",
          inline: "center",
          behavior: "smooth",
        });
      }
    });
  }

  return { scrollTo, scrollToDate, scrollToItem, scrollToLane };
};
