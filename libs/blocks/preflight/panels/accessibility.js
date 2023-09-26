import { html, signal, useEffect } from '../../../deps/htm-preact.js';

const DEF_ICON = 'purple';
const DEF_DESC = 'Checking...';
const pass = 'green';
const fail = 'red';

const altResult = signal({ icon: DEF_ICON, title: 'Image alt value', description: DEF_DESC });
const content = signal({});

async function checkAlt() {
  const images = document.querySelectorAll('img');
  const result = { ...altResult.value };
  let altMissing;
  let altValueMissing;
  const altValue = [];
  for (const image of images) {
    const imageDetail = {};
    if (!image.hasAttribute('alt')) {
      altMissing = true;
      imageDetail.src = image.getAttribute('src');
      imageDetail.altAttr = 'missing';
    } else {
      const resp = await fetch(image.alt, { method: 'HEAD' });
      if (!resp.ok) {
        altValueMissing = true;
        imageDetail.src = image.getAttribute('src');
        imageDetail.altAttrValue = 'missing';
      }
    }
    altValue.push(imageDetail);
  }
  let imageGridHtml = '';
  if (altValue.length) {
    imageGridHtml = "<table border='1|1'>";
    imageGridHtml += '<tr>';
    imageGridHtml += '<th class=preflight-content-heading>Image rc</th>';
    imageGridHtml += '<th class=preflight-content-heading>Alt Attribute</th>';
    imageGridHtml += '<th class=preflight-content-heading>Alt Value</th>';
    imageGridHtml += '</tr>';
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < altValue.length; i++) {
      imageGridHtml += '<tr>';
      imageGridHtml += `<td class=preflight-general-content >${altValue[i].src}</td>`;
      imageGridHtml += `<td class=preflight-general-content >${altValue[i].altAttr}</td>`;
      imageGridHtml += `<td class=preflight-general-content >${altValue[i].altAttrValue}</td>`;

      imageGridHtml += '</tr>';
    }
    imageGridHtml += '</table>';
  }
  console.log(imageGridHtml);

  if (altMissing && altValueMissing) {
    result.icon = fail;
    result.description = 'Reason: Alt attribute and values are missing are for one or more image on the page. Details Below:';
  } else if (altValueMissing) {
    result.icon = fail;
    result.description = 'Reason: Alt attribute value not defined for one or more images on the page. Details Below:';
  } else if (altMissing) {
    result.icon = fail;
    result.description = 'Reason: alt attribute missing for one or more images on the page. Details Below:';
  } else {
    result.icon = pass;
    result.description = 'All images are valid.';
  }
  altResult.value = result;
  content.value = imageGridHtml;
  return result.icon;
}

export default function Accessibility() {
  useEffect(() => { checkAlt(); }, []);

  return html`
      <div>
      ${content.value}
      </div>`;
}
