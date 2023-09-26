import { html, signal, useEffect } from '../../../deps/htm-preact.js';

const content = signal({});

async function checkAlt() {
  const images = document.querySelectorAll('img');
  const imagesWithoutAlt = [];
  images.forEach((img) => {
    const alt = img.getAttribute('alt');
    if (!alt || alt.trim() === '') {
      imagesWithoutAlt.push(img.getAttribute('src').split('?')[0]);
    }
  });
  if (!imagesWithoutAlt.length) {
    imagesWithoutAlt.push('All images are valid.');
  }
  content.value = imagesWithoutAlt;
}

export default function Accessibility() {
  useEffect(() => { checkAlt(); }, []);

  return html`
  <div class=preflight-general-content>
  <div class="preflight-content-heading">
      <div>Image Src</div>
    </div>
    ${content.value.map((img) => html`
    <div class=>${img}</div>
    `)}
  </div>`;
}
