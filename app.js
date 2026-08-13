document.querySelectorAll('[data-copy]').forEach((button) => {
  button.addEventListener('click', async () => {
    const label = button.querySelector('.copy-label');
    const initial = label?.textContent;
    try { await navigator.clipboard.writeText(button.dataset.copy); }
    catch { return; }
    if (label) label.textContent = 'Copied to clipboard';
    window.setTimeout(() => { if (label) label.textContent = initial; }, 1800);
  });
});
