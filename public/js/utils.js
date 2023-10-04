export let errorDiv = `<div class="input-error-msg"></div>`;

export function getHrefFromA(aTag) {
  let splittedHref = aTag.href.split(aTag.host);
  return splittedHref[splittedHref.length - 1];
}
