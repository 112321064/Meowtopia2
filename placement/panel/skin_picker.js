document.addEventListener('DOMContentLoaded', function () {
  const storageKey = 'meowtopia-skin-preferences';
  const openButton = document.getElementById('skin-picker-open');
  const modal = document.getElementById('skin-picker-modal');
  const okButton = document.getElementById('skin-picker-ok');
  const fishPreview = document.getElementById('fish-skin-preview');
  const catPreview = document.getElementById('cat-skin-preview');
  const fishName = document.getElementById('fish-skin-name');
  const catName = document.getElementById('cat-skin-name');

  const fishOptions = [
    { id: 'classic', name: 'Classic Fish', image: './image/fish.png' },
    { id: 'hot', name: 'Hot Fish', image: './image/fish-hot1.png' },
    { id: 'ice', name: 'Ice Fish', image: './image/fish-ice1.png' },
    { id: 'pikachu', name: 'Electric Energy', image: './image/pikachu-energy1.png' }
  ];

  const catOptions = [
    { id: 'kuro', name: 'Kuro Cat', image: './image/kuro.png' },
    { id: 'gray', name: 'Gray Cat', image: './image/gray.png' },
    { id: 'dinger', name: 'Dinger Cat', image: './image/dinger.png' },
    { id: 'pikachu', name: 'Pikachu', image: './image/pikachu-cat.png' }
  ];

  let selectedFishIndex = 0;
  let selectedCatIndex = 0;

  function readPreferences() {
    try {
      const saved = JSON.parse(sessionStorage.getItem(storageKey) || '{}');
      return {
        fish: fishOptions.some(option => option.id === saved.fish) ? saved.fish : 'classic',
        cat: catOptions.some(option => option.id === saved.cat) ? saved.cat : 'kuro'
      };
    } catch (error) {
      return { fish: 'classic', cat: 'kuro' };
    }
  }

  function syncFromSavedPreferences() {
    const saved = readPreferences();
    selectedFishIndex = Math.max(0, fishOptions.findIndex(option => option.id === saved.fish));
    selectedCatIndex = Math.max(0, catOptions.findIndex(option => option.id === saved.cat));
    applyPikachuTheme(saved);
    renderSelection();
  }

  function applyPikachuTheme(preferences) {
    const isPikachu = preferences.fish === 'pikachu' || preferences.cat === 'pikachu';
    const heroTitle = document.querySelector('.game-home h1');
    const levelHeading = document.querySelector('.level-select-panel h2');
    const pickerBadge = modal?.querySelector('.skin-picker-badge');
    const pickerTitle = modal?.querySelector('.skin-picker-card h2');
    const openButtonImage = openButton?.querySelector('img');
    const barAvatar = document.getElementById('bar-avatar');
    const hasPlayerPhoto = Boolean(barAvatar?.querySelector('img[alt="Player photo"]'));

    document.body.classList.toggle('pikachu-theme', isPikachu);

    if (heroTitle) {
      heroTitle.textContent = isPikachu ? 'Pikachu Patrol' : 'Sensor Patrol';
    }
    if (levelHeading) {
      levelHeading.textContent = isPikachu ? 'Pick A Thunder Level' : 'Pick A Level';
    }
    if (pickerBadge) {
      pickerBadge.textContent = isPikachu ? 'Pika Style' : 'Dress Up';
    }
    if (pickerTitle) {
      pickerTitle.textContent = isPikachu ? 'Pick Your Pika Team' : 'Pick Your Team';
    }
    if (openButtonImage) {
      openButtonImage.src = isPikachu ? './image/pikachu-cat.png' : './image/catbox.png';
    }
    if (barAvatar && !hasPlayerPhoto) {
      barAvatar.innerHTML = isPikachu
        ? '<img src="./image/pikachu-cat.png" alt="Pikachu avatar">'
        : '&#128049;';
    }
  }

  function renderSelection() {
    const fish = fishOptions[selectedFishIndex];
    const cat = catOptions[selectedCatIndex];
    fishPreview.src = fish.image;
    fishPreview.alt = fish.name;
    fishName.textContent = fish.name;
    catPreview.src = cat.image;
    catPreview.alt = cat.name;
    catName.textContent = cat.name;
  }

  function cycleOption(type, direction) {
    if (type === 'fish') {
      selectedFishIndex = (selectedFishIndex + direction + fishOptions.length) % fishOptions.length;
    } else {
      selectedCatIndex = (selectedCatIndex + direction + catOptions.length) % catOptions.length;
    }
    renderSelection();
  }

  function openModal() {
    syncFromSavedPreferences();
    modal.classList.add('show');
    modal.setAttribute('aria-hidden', 'false');
  }

  function closeModal() {
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
  }

  openButton?.addEventListener('click', openModal);
  okButton?.addEventListener('click', function () {
    const preferences = {
      fish: fishOptions[selectedFishIndex].id,
      cat: catOptions[selectedCatIndex].id
    };
    sessionStorage.setItem(storageKey, JSON.stringify({
      fish: preferences.fish,
      cat: preferences.cat
    }));
    applyPikachuTheme(preferences);
    closeModal();
  });

  modal?.addEventListener('click', function (event) {
    if (event.target === modal) {
      closeModal();
    }
  });

  modal?.querySelectorAll('.skin-arrow').forEach(button => {
    button.addEventListener('click', function () {
      const row = button.closest('.skin-picker-row');
      const pickerType = row?.dataset.picker || 'fish';
      const direction = Number(button.dataset.direction || 1);
      cycleOption(pickerType, direction);
    });
  });

  syncFromSavedPreferences();
});
