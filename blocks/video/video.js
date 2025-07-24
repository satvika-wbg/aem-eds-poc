import {
  div, img, video, source, button, span
} from '../../scripts/dom-helpers.js';

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function observeVideo(block, autoplay) {
  const videoPlayerEl = block.querySelector('video');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        if (!(prefersReducedMotion.matches) && autoplay && (videoPlayerEl.dataset.state !== 'pause')) {
          const playButton = document.getElementById('playButton');
          const pauseButton = document.getElementById('pauseButton');
          playButton.classList.add('inactive');
          playButton.removeAttribute('tabindex');
          pauseButton.classList.remove('inactive');
          pauseButton.setAttribute('tabindex', 0); // hide 'play' button
          videoPlayerEl.play(); // Play the video when it enters the viewport
        }
      } else {
        videoPlayerEl.pause(); // Pause the video when it leaves the viewport
      }
    });
  }, { threshold: 0.5 });
  observer.observe(videoPlayerEl);
}

function createVideoPlayer(videoSrc) {
  const pauseIcon = `https://wwwstg.worldbank.org/ext/icons/video-pause.svg`;
  const playIcon = `https://wwwstg.worldbank.org/ext/icons/video-play.svg`;

  // adding newlines after paren makes this harder to read
  /* eslint-disable function-paren-newline */
  const videoPlayer = div({ class: 'video-container' },
    div({ class: 'video-play', id: 'playButton', tabindex: 0 },
      button({ class: 'lp lp-play', 'aria-label': 'video-play-btn' }, span({
        class: 'play-icon controls',
      })),
    ),
    div({ class: 'video-pause inactive', id: 'pauseButton' },
      button({ class: 'video-pause-btn', 'aria-label': 'video-pause-btn' }, span({
        class: 'lp lp-pause',
      })),
    ),
    video({ id: 'videoPlayer', preload: 'none'},
      source({ src: videoSrc, type: 'video/mp4', media: '(min-width: 768px)' }, 'Your browser does not support the video tag.'),
    ),
  );

  const videoEl = videoPlayer.querySelector('video');
  videoEl.muted = true;
  videoEl.playsInline = true;
  videoEl.loop = true;

  return videoPlayer;
}

function attachListeners() {
  const videoPlayer = document.getElementById('videoPlayer');
  const playButton = document.getElementById('playButton');
  const pauseButton = document.getElementById('pauseButton');

  // Play the video when the play button is clicked or a keyboard button pressed
  ['click', 'keydown'].forEach((eventType) => {
    playButton.addEventListener(eventType, (event) => {
      if (eventType === 'keydown' && event.key !== 'Enter') return; // escape non-enter keys
      playButton.classList.add('inactive');
      playButton.removeAttribute('tabindex');
      pauseButton.classList.remove('inactive');
      pauseButton.setAttribute('tabindex', 0);
      videoPlayer.autoplay = true;
      videoPlayer.dataset.state = 'play';
      videoPlayer.play();
    });
  });

  ['click', 'keydown'].forEach((eventType) => {
    pauseButton.addEventListener(eventType, (event) => {
      if (eventType === 'keydown' && event.key !== 'Enter') return; // escape non-enter keys
      playButton.classList.remove('inactive');
      playButton.setAttribute('tabindex', 0);
      pauseButton.classList.add('inactive');
      pauseButton.removeAttribute('tabindex');
      videoPlayer.autoplay = false;
      videoPlayer.dataset.state = 'pause';
      videoPlayer.pause();
    });
  });
}

export default function decorate(block) {
  
  const link = block.querySelector('a').href;
  block.textContent = '';
  const videoWrapper = div(createVideoPlayer(link))
  block.innerHTML = '';
  block.appendChild(videoWrapper);

  // add observer for video and listeners for play/pause
  observeVideo(block, 'autoplay');
  attachListeners();

}

