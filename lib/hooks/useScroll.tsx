import { useTimelineContext } from "./useTimelineContext";

export const useScroll = () => {
  const { setSettings: setContext } = useTimelineContext();

  const scrollTo = ({ day }: { day: Date }) => {
    setContext((prev) => ({ ...prev, focusedDate: day }));

    window.requestAnimationFrame(() => {
      const el: Element | null = document.querySelector(
        ".timeline-background-focused-date-position"
      );

      if (el) {
        el.scrollIntoView({
          block: "nearest",
          inline: "center",
          behavior: "smooth",
        });
      }
    });
  };

  return scrollTo;
};
