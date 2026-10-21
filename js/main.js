/* ===== BrightSmile Dental Clinic — front-end interactions ===== */

// ----- Header shadow on scroll + back-to-top -----
const header = document.getElementById('header');
const toTop = document.getElementById('toTop');

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 30);
  toTop.classList.toggle('show', window.scrollY > 500);
});

toTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ----- Mobile nav -----
const hamburger = document.getElementById('hamburger');
const nav = document.getElementById('nav');

hamburger.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  hamburger.classList.toggle('open', open);
  hamburger.setAttribute('aria-expanded', String(open));
});

nav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  });
});

// ----- Active nav link based on scroll position -----
const sections = [...document.querySelectorAll('section[id]')];
const navLinks = [...document.querySelectorAll('.nav__link')];

const setActiveLink = () => {
  const pos = window.scrollY + 120;
  let current = sections[0]?.id;
  for (const section of sections) {
    if (pos >= section.offsetTop) current = section.id;
  }
  navLinks.forEach((l) => {
    l.classList.toggle('active', l.getAttribute('href') === `#${current}`);
  });
};
window.addEventListener('scroll', setActiveLink);
setActiveLink();

// ----- Reveal on scroll -----
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);
document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

// ----- Animated counters -----
const animateCounter = (el) => {
  const target = Number(el.dataset.target);
  const duration = 1600;
  const start = performance.now();

  const tick = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    el.textContent = Math.round(target * eased).toLocaleString('en-IN');
    if (progress < 1) requestAnimationFrame(tick);
    else el.textContent = target.toLocaleString('en-IN') + '+';
  };
  requestAnimationFrame(tick);
};

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);
document.querySelectorAll('.counter').forEach((el) => counterObserver.observe(el));

// ----- Testimonials slider -----
const track = document.getElementById('sliderTrack');
const slides = [...track.children];
const dotsWrap = document.getElementById('dots');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
let index = 0;
let autoTimer;

const perView = () => (window.innerWidth > 1024 ? 3 : window.innerWidth > 640 ? 2 : 1);
const maxIndex = () => slides.length - perView();

const buildDots = () => {
  dotsWrap.innerHTML = '';
  for (let i = 0; i <= maxIndex(); i++) {
    const dot = document.createElement('button');
    dot.setAttribute('aria-label', `Go to review ${i + 1}`);
    dot.addEventListener('click', () => {
      index = i;
      update();
      restartAuto();
    });
    dotsWrap.appendChild(dot);
  }
};

const update = () => {
  index = Math.max(0, Math.min(index, maxIndex()));
  const slideWidth = 100 / perView();
  track.style.transform = `translateX(-${index * slideWidth}%)`;
  [...dotsWrap.children].forEach((d, i) => d.classList.toggle('active', i === index));
};

const restartAuto = () => {
  clearInterval(autoTimer);
  autoTimer = setInterval(() => {
    index = index >= maxIndex() ? 0 : index + 1;
    update();
  }, 5000);
};

prevBtn.addEventListener('click', () => {
  index = index <= 0 ? maxIndex() : index - 1;
  update();
  restartAuto();
});
nextBtn.addEventListener('click', () => {
  index = index >= maxIndex() ? 0 : index + 1;
  update();
  restartAuto();
});

buildDots();
update();
restartAuto();
window.addEventListener('resize', () => {
  buildDots();
  update();
});

// ----- Booking popup modal -----
const modal = document.getElementById('bookingModal');
const modalBox = modal.querySelector('.modal__box');

const openModal = () => {
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
  setTimeout(() => document.getElementById('name').focus(), 250);
};

const closeModal = () => {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
  // Reset the form and message so the popup opens fresh next time
  form.reset();
  note.textContent = '';
  note.className = 'form__note';
};

document.querySelectorAll('[data-booking]').forEach((btn) => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    openModal();
  });
});

modal.querySelectorAll('[data-close]').forEach((el) => {
  el.addEventListener('click', closeModal);
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
});

// Close when clicking outside the form box (on the backdrop)
modalBox.addEventListener('click', (e) => e.stopPropagation());

// ----- Appointment form (demo handler) -----
const form = document.getElementById('appointmentForm');
const note = document.getElementById('formNote');
const dateInput = document.getElementById('date');

// Prevent selecting past dates
dateInput.min = new Date().toISOString().split('T')[0];

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = form.name.value.trim();
  const phone = form.phone.value.trim();

  if (!name || !phone) {
    note.textContent = 'Please fill in your name and phone number.';
    note.className = 'form__note error';
    return;
  }
  if (!/^[+\d][\d\s-]{7,14}$/.test(phone)) {
    note.textContent = 'Please enter a valid phone number.';
    note.className = 'form__note error';
    return;
  }

  note.textContent = `Thank you, ${name.split(' ')[0]}! Your appointment request has been received. We'll call you shortly to confirm.`;
  note.className = 'form__note success';
  form.reset();

  // Auto-close the popup after showing the success message
  setTimeout(closeModal, 2500);
});

// ----- Footer year -----
document.getElementById('year').textContent = new Date().getFullYear();
