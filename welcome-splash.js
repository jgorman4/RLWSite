(() => {
  'use strict';

  const preferenceKey = 'rlw:welcome-splash:dismissed';
  try {
    if (localStorage.getItem(preferenceKey) === 'true') return;
  } catch {
    // Storage may be unavailable; the announcement should still work.
  }

  const dialog = document.createElement('dialog');
  dialog.className = 'welcome-splash';
  dialog.setAttribute('aria-label', 'Welcome to Real Life Waller: our new home');
  dialog.innerHTML = `
    <img class="welcome-splash-image" src="assets/welcome-splash.png"
      width="1536" height="1024"
      alt="Join us at our new home starting November 1st. Jones Elementary School, 35753 Owens Rd, Hempstead, TX 77445. Sundays at 9:30 AM in the gym.">
    <form method="dialog" class="welcome-splash-controls">
      <label class="welcome-splash-preference">
        <input type="checkbox" name="remember"> Don't show this again
      </label>
      <button class="button" type="submit" autofocus>Okay</button>
    </form>`;
  document.body.append(dialog);

  const previousFocus = document.activeElement;
  const previousOverflow = document.body.style.overflow;
  dialog.addEventListener('keydown', (event) => {
    if (event.key !== 'Tab') return;
    const checkbox = dialog.querySelector('input');
    const button = dialog.querySelector('button');
    if (event.shiftKey && document.activeElement === checkbox) {
      event.preventDefault();
      button.focus();
    } else if (!event.shiftKey && document.activeElement === button) {
      event.preventDefault();
      checkbox.focus();
    }
  });
  dialog.querySelector('form').addEventListener('submit', () => {
    if (dialog.querySelector('input').checked) {
      try {
        localStorage.setItem(preferenceKey, 'true');
      } catch {
        // Dismiss normally even when the browser blocks storage.
      }
    }
  });
  dialog.addEventListener('close', () => {
    document.body.style.overflow = previousOverflow;
    dialog.remove();
    if (previousFocus instanceof HTMLElement) previousFocus.focus();
  }, { once: true });
  dialog.showModal();
  document.body.style.overflow = 'hidden';
})();
