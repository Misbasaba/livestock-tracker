let animals = [];

document.addEventListener('DOMContentLoaded', async () => {
  await loadTranslations();
  
  const savedLang = localStorage.getItem('preferredLanguage');
  if (savedLang) {
    currentLang = savedLang;
    document.getElementById('languagePicker').classList.add('d-none');
    document.getElementById('mainApp').classList.remove('d-none');
    loadAnimals();
    renderAllText();
    renderAnimalList();
  } else {
    document.getElementById('languagePicker').classList.remove('d-none');
  }
});

function selectLanguage(lang) {
  setLanguage(lang);
  document.getElementById('languagePicker').classList.add('d-none');
  document.getElementById('mainApp').classList.remove('d-none');
  loadAnimals();
  renderAnimalList();
}

function changeLanguageFromSettings() {
  const lang = document.getElementById('settingsLang').value;
  setLanguage(lang);
  renderAnimalList();
}

function loadAnimals() {
  const stored = localStorage.getItem('animals');
  animals = stored ? JSON.parse(stored) : [];
}

function saveAnimals() {
  localStorage.setItem('animals', JSON.stringify(animals));
}

function renderAnimalList() {
  const list = document.getElementById('animalList');
  const empty = document.getElementById('emptyState');
  
  if (animals.length === 0) {
    list.innerHTML = '';
    empty.classList.remove('d-none');
    return;
  }
  
  empty.classList.add('d-none');
  
  list.innerHTML = animals.map(animal => {
    const nextVacc = getNextVaccination(animal);
    const status = nextVacc ? getStatus(nextVacc.dueDate) : 'up-to-date';
    const statusClass = status === 'overdue' ? 'status-overdue' : status === 'due-soon' ? 'status-due' : 'status-ok';
    
    return `
      <div class="col-12 col-md-6">
        <div class="animal-card" onclick="openAnimalDetail('${animal.id}')">
          <div class="d-flex align-items-center">
            <div style="font-size: 36px; margin-right: 12px;">🐄</div>
            <div class="flex-grow-1">
              <div class="fw-bold">${animal.name || 'Unnamed'}</div>
              <div class="text-muted small">#${animal.tagNumber} · ${t(animal.species)}</div>
            </div>
            <span class="status-dot ${statusClass}"></span>
          </div>
          ${nextVacc ? `<div class="mt-2 small"><strong>${t('nextVaccination')}:</strong> ${nextVacc.vaccine} — ${daysUntil(nextVacc.dueDate)} ${t('daysLeft')}</div>` : ''}
        </div>
      </div>
    `;
  }).join('');
}

function getNextVaccination(animal) {
  if (!animal.schedule || animal.schedule.length === 0) return null;
  const upcoming = animal.schedule.filter(v => !v.completed).sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  return upcoming[0] || null;
}

function openAddAnimal() {
  document.getElementById('addAnimalModal').classList.remove('d-none');
  document.getElementById('inputName').value = '';
  document.getElementById('inputTag').value = '';
  document.getElementById('inputAge').value = '';
  document.getElementById('inputBreed').value = '';
}

function saveAnimal() {
  const name = document.getElementById('inputName').value.trim();
  const tag = document.getElementById('inputTag').value.trim();
  const species = document.getElementById('inputSpecies').value;
  const age = document.getElementById('inputAge').value;
  const breed = document.getElementById('inputBreed').value.trim();
  
  if (!name || !tag || !age) {
    alert('Please fill name, tag, and age');
    return;
  }
  
  const newAnimal = {
    id: Date.now().toString(),
    name: name,
    tagNumber: tag,
    species: species,
    ageMonths: parseInt(age),
    breed: breed,
    schedule: []
  };
  
  newAnimal.schedule = generateSchedule(newAnimal);
  animals.push(newAnimal);
  saveAnimals();
  closeModal('addAnimalModal');
  renderAnimalList();
}

function openAnimalDetail(id) {
  const animal = animals.find(a => a.id === id);
  if (!animal) return;
  
  const content = document.getElementById('animalDetailContent');
  content.innerHTML = `
    <h5>🐄 ${animal.name} — #${animal.tagNumber}</h5>
    <p class="text-muted">${t(animal.species)} · ${animal.ageMonths} months · ${animal.breed || '-'}</p>
    <h6 class="mt-3">${t('vaccinationHistory')}</h6>
    ${animal.schedule.map((v, i) => `
      <div class="d-flex justify-content-between align-items-center border-bottom py-2">
        <div>
          <div>${v.vaccine} ${v.completed ? '✅' : ''}</div>
          <div class="small text-muted">${new Date(v.dueDate).toLocaleDateString()}</div>
        </div>
        ${!v.completed ? `<button class="btn btn-sm btn-success" onclick="markVaccinated('${animal.id}', ${i})">✅</button>` : ''}
      </div>
    `).join('')}
  `;
  
  document.getElementById('animalDetailModal').classList.remove('d-none');
}

function markVaccinated(animalId, index) {
  const animal = animals.find(a => a.id === animalId);
  if (!animal) return;
  
  const vaccine = animal.schedule[index];
  vaccine.completed = true;
  vaccine.completedDate = new Date().toISOString();
  
  if (vaccine.recurring && vaccine.recurring !== 'once') {
    const months = vaccine.recurring.includes('6') ? 6 : vaccine.recurring.includes('3') ? 3 : 12;
    animal.schedule.push({
      vaccine: vaccine.vaccine,
      disease: vaccine.disease,
      dueDate: addMonths(new Date(), months),
      recurring: vaccine.recurring
    });
  }
  
  saveAnimals();
  openAnimalDetail(animalId);
  renderAnimalList();
}

function openSettings() {
  document.getElementById('settingsLang').value = currentLang;
  document.getElementById('settingsModal').classList.remove('d-none');
}

function closeModal(id) {
  document.getElementById(id).classList.add('d-none');
}
