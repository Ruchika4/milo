import { html, signal, useEffect } from '../../../deps/htm-preact.js';

const content = signal({});

async function checkAlt() {
  const images = document.querySelectorAll('img');
  const imagesWithoutAlt = [];
  images.forEach((img) => {
    let imageDetail = {};
    const alt = img.getAttribute('alt');
    if (!alt || alt.trim() === '') {
      imageDetail = { src: img.getAttribute('src').split('?')[0] };
      imagesWithoutAlt.push(imageDetail);
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
    ${Object.values(content.value).map((src) => html`
    <div class=>${src}</div>
    `)}
  </div>`;
}
