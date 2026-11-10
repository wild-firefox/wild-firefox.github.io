document.querySelectorAll('[data-gy-pause]').forEach(button=>{
  button.addEventListener('click',()=>{
    const paused=button.closest('.gy-promo').classList.toggle('gy-paused');
    button.setAttribute('aria-pressed',String(paused));
    button.textContent=paused?'继续演示':'暂停演示';
  });
});
