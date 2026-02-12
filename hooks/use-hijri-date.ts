export function useHijriDate() {
  const tanggal = new Intl.DateTimeFormat("id-ID", {
    calendar: "islamic",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  return tanggal;
}
