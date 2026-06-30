/* Owner report interactions */
function show(id) {
  var panel = document.getElementById(id);
  var btn = document.querySelector('[data-tab="'+id+'"]');
  if (!panel || !btn) return;
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('on'));
  document.querySelectorAll('.tab').forEach(b => {
    b.classList.remove('on');
    b.setAttribute('aria-selected','false');
  });
  panel.classList.add('on');
  btn.classList.add('on');
  btn.setAttribute('aria-selected','true');
  if (id === 'reviews') {
    filterReviews('all');
  }
}

function setActiveStat(filter) {
  document.querySelectorAll('.scard[data-filter]').forEach(card => {
    var active = card.dataset.filter === filter;
    card.classList.toggle('on', active);
    card.setAttribute('aria-pressed', active ? 'true' : 'false');
  });
}

function filterReviews(filter) {
  var cards = document.querySelectorAll('.rc[data-sentiment]');
  var note = document.getElementById('review-filter-note');
  cards.forEach(card => {
    var match = filter === 'all' || card.dataset.sentiment === filter;
    card.classList.toggle('hidden', !match);
  });
  if (note) {
    var labels = {
      all: 'Showing all new review items. Total new messages also includes 2 Wilmington press mentions in the Press tab.',
      negative: 'Showing negative, flagged, and low-rating review items.',
      positive: 'Showing positive review items. Positive total also includes 2 Wilmington press mentions in the Press tab.'
    };
    note.textContent = labels[filter] || labels.all;
  }
}

document.querySelectorAll('.scard[data-filter]').forEach(card => {
  card.addEventListener('click', () => {
    var filter = card.dataset.filter;
    setActiveStat(filter);
    if (filter === 'ratings') {
      show('overview');
      var ratings = document.querySelector('.pgrid');
      if (ratings) ratings.scrollIntoView({behavior:'smooth', block:'start'});
      return;
    }
    show('reviews');
    filterReviews(filter);
  });
});

