export function formatMediaDate(date: string | Date) {
  return new Date(date).toLocaleString("en-NG", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatEventDate(date: string | Date) {
  return new Date(date).toLocaleString("en-NG", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatEventDateShort(date: string | Date) {
  return new Date(date).toLocaleDateString("en-NG", {
    month: "long",
    day: "numeric",
  });
}
