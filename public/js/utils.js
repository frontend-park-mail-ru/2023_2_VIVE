export function getHrefFromA(aTag) {
  let splittedHref = aTag.href.split(aTag.host);
  return splittedHref[splittedHref.length - 1];
}
