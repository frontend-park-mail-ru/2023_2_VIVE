export function getHrefFromLink(aTag) {
  const splittedHref = aTag.href.split(aTag.host);
  return splittedHref[splittedHref.length - 1];
}
