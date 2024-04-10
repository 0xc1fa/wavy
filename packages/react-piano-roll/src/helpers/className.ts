export function cn(...args: (string | undefined | boolean)[]) {
  return args
    .filter((x): x is string => typeof x === "string" && x !== "")
    .map((x) => x.trim())
    .join(" ");
}
