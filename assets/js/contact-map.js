/* Keep page scrolling separate from deliberate map zoom controls. */
(() => {
    const frame = document.querySelector('.contact-map-frame');
    if (!frame) return;
    const map = frame.querySelector('iframe');
    const buttons = [...frame.querySelectorAll('[data-map-zoom]')];
    let level = 0;
    const render = () => {
        const scale = 2 ** level;
        const latitude = 40.7532;
        const longitude = -73.9822;
        const url = new URL(map.src);
        url.searchParams.set('bbox', [longitude - .005 / scale, latitude - .003 / scale, longitude + .005 / scale, latitude + .003 / scale].join(','));
        url.searchParams.set('marker', `${latitude},${longitude}`);
        map.src = url.toString();
        buttons.forEach(button => { button.disabled = button.dataset.mapZoom === 'in' ? level >= 3 : level <= -3; });
    };
    buttons.forEach(button => button.addEventListener('click', () => {
        level = Math.max(-3, Math.min(3, level + (button.dataset.mapZoom === 'in' ? 1 : -1)));
        render();
    }));
})();
