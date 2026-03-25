
export function createSvg (title) {
  let l = 20;
  if(title) {
    l = 20 + title.length * 15;
  }
  const startText = `
  <div xmlns="http://www.w3.org/1999/xhtml" 
  style="width:${l}px;height:32px;background:#bb76c2;line-height:32px;text-align:center;">
  ${title}
  </div>`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${l}" height="40">` +
  '<rect x="0" y="0" width="100%" height="100%" fill="transparent" stroke-width="0" stroke="#ffffff"></rect>' +
  '<foreignObject x="1" y="1" width="100%" height="100%">' + startText +
  '</foreignObject>' +
  '</svg>';
  const url = "data:image/svg+xml;charset=utf-8,"+ encodeURIComponent(svg);
  return url;
}