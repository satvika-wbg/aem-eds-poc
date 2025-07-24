export default function decorate(block) {
  console.log('test video block', block);
  const btnContainer = block.querySelector('.button-container');
  if (btnContainer) {
    const scrollIndicator = document.createElement('a');
    scrollIndicator.className = 'scroll-indicator';
    const spanElement = document.createElement('span');
    spanElement.className = 'lp lp-chevron-down';
    spanElement.addEventListener('click', () => {
        //logic on scroll icon click
});
    const divElement = document.createElement('div');
    divElement.innerText = 'Scroll to explore';
    scrollIndicator.appendChild(divElement);
    scrollIndicator.appendChild(spanElement);
    // Replace the old button container with the new scroll indicator
    btnContainer.replaceWith(scrollIndicator);
  }
}