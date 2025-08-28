// Mobile nav
const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');
if (toggle) {
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!open));
    nav.classList.toggle('open');
  });
}

// Simple responsive class for nav
const mq = window.matchMedia('(max-width: 820px)');
function handleNav(e){
  if(e.matches){
    document.querySelector('.main-nav').style.display = 'none';
    toggle.style.display = 'inline-block';
  } else {
    document.querySelector('.main-nav').style.display = 'flex';
    toggle.style.display = 'none';
  }
}
handleNav(mq);
mq.addEventListener('change', handleNav);

// Carousel auto-rotation + buttons
const track = document.querySelector('.carousel-track');
const prevBtn = document.querySelector('.carousel-btn.prev');
const nextBtn = document.querySelector('.carousel-btn.next');

let autoScroll;
function startAuto(){
  stopAuto();
  autoScroll = setInterval(() => {
    track.scrollBy({left: 300, behavior: 'smooth'});
    if (track.scrollLeft + track.clientWidth >= track.scrollWidth - 2) {
      track.scrollTo({left: 0, behavior: 'smooth'});
    }
  }, 3500);
}
function stopAuto(){ if (autoScroll) clearInterval(autoScroll); }

if (track){
  startAuto();
  track.addEventListener('mouseenter', stopAuto);
  track.addEventListener('mouseleave', startAuto);
}

prevBtn?.addEventListener('click', () => {
  stopAuto();
  track.scrollBy({left: -300, behavior: 'smooth'});
  startAuto();
});
nextBtn?.addEventListener('click', () => {
  stopAuto();
  track.scrollBy({left: 300, behavior: 'smooth'});
  startAuto();
});

// Keyboard support for carousel
track?.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') { track.scrollBy({left: 300, behavior: 'smooth'}); }
  if (e.key === 'ArrowLeft') { track.scrollBy({left: -300, behavior: 'smooth'}); }
});

// Flip on tap for touch screens
document.querySelectorAll('.course-card .flip').forEach(card=>{
  card.addEventListener('click', ()=> card.classList.toggle('tapped'));
});

// Tapped state style toggle
const style = document.createElement('style');
style.innerHTML = `
  .course-card .flip.tapped{ transform: rotateY(180deg); }
`;
document.head.appendChild(style);

// // Replace the existing submit handler with this:
// form?.addEventListener('submit', async (e) => {
//   e.preventDefault();
//   const data = Object.fromEntries(new FormData(form).entries());
//   if (!data.name || !data.email || !data.interest) {
//     note.textContent = 'Please fill all required fields.';
//     note.style.color = '#ff6b6b';
//     return;
//   }
//   try {
//     const res = await fetch('/api/submit', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(data)
//     });
//     if (res.ok) {
//       note.textContent = 'Thank you! We will reach out shortly.';
//       note.style.color = '#59d390';
//       form.reset();
//     } else {
//       note.textContent = 'There was an issue. Please try again.';
//       note.style.color = '#ff6b6b';
//     }
//   } catch {
//     note.textContent = 'Network error. Please try later.';
//     note.style.color = '#ff6b6b';
//   }
// });

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.form'); // ensure this matches your form class
  const note = document.querySelector('.form-note');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault(); // prevent page refresh

    const data = Object.fromEntries(new FormData(form).entries());

    // basic validation
    if (!data.name || !data.email || !data.interest) {
      note.textContent = 'Please fill all required fields.';
      note.style.color = '#ff6b6b';
      return;
    }

    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        note.textContent = 'Thank you! We will reach out shortly.';
        note.style.color = '#59d390';
        form.reset();
      } else {
        const j = await res.json().catch(()=> ({}));
        note.textContent = j.error || 'There was an issue. Please try again.';
        note.style.color = '#ff6b6b';
      }
    } catch (err) {
      note.textContent = 'Network error. Please try later.';
      note.style.color = '#ff6b6b';
    }
  });
});


//render courses
async function renderCourses() {
  try {
    const res = await fetch('/api/courses');
    const courses = await res.json();
    const trackEl = document.querySelector('.carousel-track');
    if (!trackEl) return;

    trackEl.innerHTML = courses.map(c => `
      <div class="course-card">
        <div class="flip">
          <div class="front">
            <div class="glyph">✶</div>
            <h3>${c.title}</h3>
            <p class="tagline">${c.tagline || ''}</p>
          </div>
          <div class="back">
            <h4>What you’ll learn</h4>
            <ul>${(c.topics||[]).map(t => `<li>${t}</li>`).join('')}</ul>
            <button class="btn small enroll">Enroll</button>
          </div>
        </div>
      </div>
    `).join('');

    // rebind flip taps for new nodes
    trackEl.querySelectorAll('.course-card .flip').forEach(card=>{
      card.addEventListener('click', ()=> card.classList.toggle('tapped'));
    });
  } catch(e) {
    console.warn('Failed to load courses', e);
  }
}
renderCourses();

// Year
document.getElementById('year').textContent = new Date().getFullYear();
