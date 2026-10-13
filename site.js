// Loads the YouTube trailer only when the visitor presses play.
document.querySelectorAll('.facade').forEach((button) => {
  button.addEventListener('click', () => {
    const frame = document.createElement('iframe');
    frame.className = 'video';
    frame.src = `https://www.youtube-nocookie.com/embed/${button.dataset.yt}?autoplay=1&rel=0`;
    frame.title = button.dataset.title;
    frame.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
    frame.allowFullscreen = true;
    button.replaceWith(frame);
    frame.focus();
  });
});
