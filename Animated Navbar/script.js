  const nav = document.getElementById('siteNav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  });

  const links = document.querySelectorAll('.nav-links a');
  const liquid = document.getElementById('liquid');
  const container = document.getElementById('navLinks');

  function moveLiquidTo(el){
    const cRect = container.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    liquid.style.width = r.width + 'px';
    liquid.style.transform = `translateX(${r.left - cRect.left - 6}px)`;
  }

  function setActive(el){
    links.forEach(a => a.classList.remove('active'));
    el.classList.add('active');
  }

  let activeEl = document.querySelector('.nav-links a.active');

  links.forEach(a => {
    a.addEventListener('mouseenter', () => moveLiquidTo(a));
    a.addEventListener('click', (e) => {
      e.preventDefault();
      setActive(a);
      activeEl = a;
      moveLiquidTo(a);
    });
  });

  container.addEventListener('mouseleave', () => moveLiquidTo(activeEl));


  window.addEventListener('load', () => moveLiquidTo(activeEl));
