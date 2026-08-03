const base = import.meta.env.BASE_URL.replace(/\/$/, "");

/** Build a public URL that also works under the GitHub Pages project base path. */
export function deployPath(path: string) {
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export const officialMedia = (filename: string) =>
  `https://aihuangpu.ai/manus-storage/${filename}`;
