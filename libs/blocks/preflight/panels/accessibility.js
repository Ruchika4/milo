import { html, signal, useEffect } from '../../../deps/htm-preact.js';

const DEF_ICON = 'purple';
const DEF_DESC = 'Checking...';
const pass = 'green';
const fail = 'red';

const content = signal({});
const altResult = signal({ icon: DEF_ICON, title: 'Image alt value', description: DEF_DESC });

async function checkAlt() {
  const images = document.querySelectorAll('img');
  const imagesWithoutAlt = [];
  const result = { ...altResult.value };
  images.forEach((img) => {
    const alt = img.getAttribute('alt');
    if (!alt || alt.trim() === '') {
      imagesWithoutAlt.push(img.getAttribute('src').split('?')[0]);
    }
  });
  if (!imagesWithoutAlt.length) {
    result.icon = pass;
    result.description = 'Reason: All Image are valid';
  } else {
    result.icon = fail;
    result.description = 'Reason: Alt attribute and values are missing for one or more images on the page';
  }
  content.value = imagesWithoutAlt;
  altResult.value = result;
  return result.icon;
}

function AccessibilityItem({ icon, title, description }) {
  return html`
    <div class=seo-item>
      <div class="result-icon ${icon}"></div>
      <div class=seo-item-text>
        <p class=seo-item-title>${title}</p>
        <p class=seo-item-description>${description}</p>
      </div>
    </div>`;
}

export default function Accessibility() {
  useEffect(() => { checkAlt(); }, []);

  return html`
  <div class=seo-column>
        <${AccessibilityItem} icon=${altResult.value.icon} title=${altResult.value.title} description=${altResult.value.description} />
    </div>
  <div>
  ${content.value.length > 0 && html`
  <table border='1|1' width=100%>
    <thead>
    <th>Image Src</th>
    </thead>
    <tbody>
    ${Object.keys(content.value).map((key) => html`   
    <tr>${content.value[key]}</tr>
    `)}
    </tbody>
    </table>
    `}
  </div>`;
}
