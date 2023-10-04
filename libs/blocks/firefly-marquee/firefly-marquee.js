/*
 * Marquee - v6.0
 */

import { applyHoverPlay, decorateButtons, getBlockSize } from '../../utils/decorate.js';
import { createTag } from '../../utils/utils.js';

function setFireflyPrompt(media) {
  // Get all the element from media div
  const allP = media.querySelectorAll('p');
  // Create various options for the prompt
  const fireflyOptions = createTag('div', { class: 'options' });
  const textToImage = createTag('button', { class: 'options', id: 'textToImage' }, `${allP[0].innerText.split('|')[0]}`);
  const generativeFill = createTag('button', { class: 'options', id: 'generativeFill' }, `${allP[2].innerText.split('|')[0]}`);
  const textEffects = createTag('button', { class: 'options', id: 'textEffects' }, `${allP[4].innerText.split('|')[0]}`);

  fireflyOptions.append(textToImage);
  fireflyOptions.append(generativeFill);
  fireflyOptions.append(textEffects);
  media.append(fireflyOptions);
  const textToImageButton = media.querySelector('#textToImage');
  const generativeFillButton = media.querySelector('#generativeFill');
  const textEffectsButton = media.querySelector('#textEffects');
  textToImageButton.classList.add('selected');

  /* Set the default image */
  allP[3].classList.add('hide');
  allP[5].classList.add('hide');

  // Hide the text for media
  allP[0].classList.add('hide');
  allP[2].classList.add('hide');
  allP[4].classList.add('hide');
  // Create prompt
  const fireflyPrompt = createTag('div', { class: 'overlay', id: 'fireflyprompt' });
  const fireflyText = createTag('input', { class: 'prompt', id: 'fireflyinput', placeholder: `${allP[0].innerText.split('|')[1]}`, autofocus: 'autofocus' });
  const fireflyButton = createTag('button', { class: 'con-button blue button-xl button-justified-mobile', id: 'generate' }, `${allP[0].innerText.split('|')[2]}`);
  fireflyPrompt.append(fireflyText);
  fireflyPrompt.append(fireflyButton);
  media.append(fireflyPrompt);
  const generateButton = media.querySelector('#generate');
  generateButton.addEventListener('click', () => {
    const inputValue = media.querySelector('.prompt')?.value;
    if (textToImage.classList.contains('selected')) {
      // eslint-disable-next-line no-restricted-globals
      location.href = `https://firefly.adobe.com/generate/images?prompt=${inputValue}`;
    }
    if (textEffectsButton.classList.contains('selected')) {
      // eslint-disable-next-line no-restricted-globals
      location.href = `https://firefly.adobe.com/generate/font-styles?prompt=${inputValue}`;
    }
  });

  /* Handle action on click of each firefly option button */

  textToImageButton.addEventListener('click', () => {
    textToImageButton.classList.add('selected');
    generativeFillButton.classList.remove('selected');
    textEffectsButton.classList.remove('selected');

    allP[1].classList.remove('hide');
    allP[3].classList.add('hide');
    allP[5].classList.add('hide');

    const genFillButtonTemp = media.querySelector('#genFill');
    if (genFillButtonTemp) genFillButtonTemp.remove();
    const fireflyPromptTemp = media.querySelector('#fireflyprompt');
    fireflyPromptTemp.classList.remove('genfill');
    fireflyPromptTemp.classList.add('overlay');
    fireflyPromptTemp.append(fireflyText);
    fireflyPromptTemp.append(fireflyButton);
    fireflyText.setAttribute('placeholder', `${allP[0].innerText.split('|')[1]}`);
  });

  generativeFillButton.addEventListener('click', () => {
    textToImageButton.classList.remove('selected');
    generativeFillButton.classList.add('selected');
    textEffectsButton.classList.remove('selected');

    allP[1].classList.add('hide');
    allP[3].classList.remove('hide');
    allP[5].classList.add('hide');

    const fireflyTextTemp = media.querySelector('#fireflyinput');
    const fireflyButtonTemp = media.querySelector('#generate');
    const fireflyPromptTemp = media.querySelector('#fireflyprompt');
    fireflyTextTemp.remove();
    fireflyButtonTemp.remove();
    fireflyPromptTemp.classList.remove('overlay');
    fireflyPromptTemp.classList.add('genfill');
    const genFillButton = createTag('button', { class: 'con-button blue button-xl button-justified-mobile', id: 'genFill' }, `${allP[2].innerText.split('|')[2]}`);
    fireflyPromptTemp.append(genFillButton);
    genFillButton.addEventListener('click', () => {
      // eslint-disable-next-line no-restricted-globals
      location.href = 'https://firefly.adobe.com/upload/inpaint';
    });
  });

  textEffectsButton.addEventListener('click', () => {
    textToImageButton.classList.remove('selected');
    generativeFillButton.classList.remove('selected');
    textEffectsButton.classList.add('selected');

    allP[1].classList.add('hide');
    allP[3].classList.add('hide');
    allP[5].classList.remove('hide');

    const genFillButtonTemp = media.querySelector('#genFill');
    if (genFillButtonTemp) genFillButtonTemp.remove();
    const fireflyTextTemp = media.querySelector('#fireflyinput');
    if (fireflyTextTemp) fireflyText.setAttribute('placeholder', 'Tiger Fur');
    else {
      const fireflyPromptTemp = media.querySelector('#fireflyprompt');
      fireflyPromptTemp.classList.remove('genfill');
      fireflyPromptTemp.classList.add('overlay');
      fireflyText.setAttribute('placeholder', `${allP[4].innerText.split('|')[1]}`);
      fireflyPromptTemp.append(fireflyText);
      fireflyPromptTemp.append(fireflyButton);
    }
  });
}

const decorateVideo = (container, video, isInteractive) => {
  if (video.nodeName === 'A' && video.href.includes('.mp4')) {
    // no special attrs handling
    container.innerHTML = `<video preload="metadata" playsinline autoplay muted loop>
      <source src="${video.href}" type="video/mp4" />
    </video>`;
  } else if (video.attributes.getNamedItem('controls')) {
    video.removeAttribute('controls');
    video.setAttribute('muted', '');
    video.setAttribute('autoplay', '');
    video.setAttribute('loop', '');

    const attrs = [...video.attributes].map((a) => a.name).join(' ');
    container.innerHTML = `<video preload="metadata" ${attrs}>
        <source src="${video.firstElementChild.src}" type="video/mp4" />
      </video>`;
  }
  applyHoverPlay(container.firstElementChild);
  container.classList.add('has-video');
  if (isInteractive) {
    setFireflyPrompt(container);
  }
};

const decorateBlockBg = (block, node) => {
  const viewports = ['mobile-only', 'tablet-only', 'desktop-only'];
  const childCount = node.childElementCount;
  const { children } = node;

  node.classList.add('background');

  if (childCount === 2) {
    children[0].classList.add(viewports[0]);
    children[1].classList.add(viewports[1], viewports[2]);
  }

  [...children].forEach(async (child, index) => {
    if (childCount === 3) {
      child.classList.add(viewports[index]);
    }
    const video = child.querySelector('video, a[href*=".mp4"]');
    if (video) {
      decorateVideo(child, video);
    }

    const pic = child.querySelector('picture');
    if (pic && (child.childElementCount === 2 || child.textContent?.trim())) {
      const { handleFocalpoint } = await import('../section-metadata/section-metadata.js');
      handleFocalpoint(pic, child, true);
    }
  });

  if (!node.querySelector(':scope img') && !node.querySelector(':scope video')) {
    block.style.background = node.textContent;
    node.remove();
  }
};

// [headingSize, bodySize, detailSize]
const blockTypeSizes = {
  interactiveMarquee: {
    small: ['xl', 'm', 'm'],
    medium: ['xl', 'm', 'm'],
    large: ['xxl', 'xl', 'l'],
    xlarge: ['xxl', 'xl', 'l'],
  },
};

function decorateText(el, size) {
  const headings = el.querySelectorAll('h1, h2, h3, h4, h5, h6');
  const heading = headings[headings.length - 1];
  const config = blockTypeSizes.interactiveMarquee[size];
  const decorate = (headingEl, typeSize) => {
    headingEl.classList.add(`heading-${typeSize[0]}`);
    headingEl.nextElementSibling?.classList.add(`body-${typeSize[1]}`);
    const sib = headingEl.previousElementSibling;
    if (sib) {
      const className = sib.querySelector('img, .icon') ? 'icon-area' : `detail-${typeSize[2]}`;
      sib.classList.add(className);
      sib.previousElementSibling?.classList.add('icon-area');
    }
  };
  decorate(heading, config);
}

function decorateMultipleIconArea(iconArea) {
  iconArea.querySelectorAll(':scope > picture').forEach((picture) => {
    const src = picture.querySelector('img')?.getAttribute('src');
    const a = picture.nextElementSibling;
    if (src?.endsWith('.svg') || a?.tagName !== 'A') return;
    if (!a.querySelector('img')) {
      a.innerHTML = '';
      a.className = '';
      a.appendChild(picture);
    }
  });
  if (iconArea.childElementCount > 1) iconArea.classList.add('icon-area-multiple');
}

function extendButtonsClass(text) {
  const buttons = text.querySelectorAll('.con-button');
  if (buttons.length === 0) return;
  buttons.forEach((button) => { button.classList.add('button-justified-mobile'); });
}

const decorateImage = (media, isInteractive) => {
  media.classList.add('image');

  const imageLink = media.querySelector('a');
  const picture = media.querySelector('picture');

  if (imageLink && picture && !imageLink.parentElement.classList.contains('modal-img-link')) {
    imageLink.textContent = '';
    imageLink.append(picture);
  }
  if (isInteractive) {
    setFireflyPrompt(media);
  }
};

export default function init(el) {
  const isLight = el.classList.contains('light');
  const isInteractive = el.classList.contains('large');
  if (!isLight) el.classList.add('dark');
  const children = el.querySelectorAll(':scope > div');
  const foreground = children[children.length - 1];
  if (children.length > 1) {
    children[0].classList.add('background');
    decorateBlockBg(el, children[0]);
  }
  foreground.classList.add('foreground', 'container');
  const headline = foreground.querySelector('h1, h2, h3, h4, h5, h6');
  const text = headline.closest('div');
  text.classList.add('text');
  const media = foreground.querySelector(':scope > div:not([class])');

  if (media) {
    media.classList.add('media');
    const video = media.querySelector('video, a[href*=".mp4"]');
    if (video && !isInteractive) {
      decorateVideo(media, video, isInteractive);
    } else {
      decorateImage(media, isInteractive);
    }
  }

  const firstDivInForeground = foreground.querySelector(':scope > div');
  if (firstDivInForeground?.classList.contains('media')) el.classList.add('row-reversed');

  const size = getBlockSize(el);
  decorateButtons(text, size === 'large' ? 'button-xl' : 'button-l');
  decorateText(text, size);
  const iconArea = text.querySelector('.icon-area');
  if (iconArea?.childElementCount > 1) decorateMultipleIconArea(iconArea);
  extendButtonsClass(text);
}
