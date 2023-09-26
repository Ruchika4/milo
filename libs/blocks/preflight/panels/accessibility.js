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
  Object.keys(content.value).map((key) => console.log(content.value[key]));
}

export default function Accessibility() {
  useEffect(() => { checkAlt(); }, []);

  return html`
  <div class=preflight-general-content>
  <table border='1|1'>
    <thead>
    <th>Image Src</th>
    </thead>
    <tbody>
    ${Object.keys(content.value).map((key) => html`   
    <tr>${content.value[key]}</tr>
    `)}
    </tbody>
  </div>`;
}
