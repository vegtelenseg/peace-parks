import { DAY } from "../constants";

export const formatDateTime = (dateTime: string) => {
  const now = Date.now();
  const then = new Date(dateTime).getTime();
  const timeSinceLastComms = Math.abs(now - then) / 36e5;
  switch (true) {
    case timeSinceLastComms < DAY:
      return "Today";
    case timeSinceLastComms >= DAY && timeSinceLastComms < DAY * 2:
      return "Yesterday";
    default:
      return new Date(dateTime).toLocaleDateString();
  }
};
