function generateSchedule(animal) {
  const schedule = [];
  const now = new Date();
  const birthDate = new Date(now);
  birthDate.setMonth(birthDate.getMonth() - parseInt(animal.ageMonths));

  if (animal.species === 'cow' || animal.species === 'buffalo') {
    const fmd1 = addMonths(birthDate, 4);
    if (fmd1 > now) {
      schedule.push({ vaccine: 'FMD-1', disease: 'FMD', dueDate: fmd1, recurring: '6 months' });
    }
    const fmdBooster = addMonths(birthDate, 5);
    if (fmdBooster > now) {
      schedule.push({ vaccine: 'FMD Booster', disease: 'FMD', dueDate: fmdBooster, recurring: '6 months' });
    } else {
      schedule.push({ vaccine: 'FMD', disease: 'FMD', dueDate: addMonths(now, 6), recurring: '6 months' });
    }
    const nextMonsoon = getNextMonsoon();
    schedule.push({ vaccine: 'HS', disease: 'Haemorrhagic Septicaemia', dueDate: nextMonsoon, recurring: '1 year' });
    schedule.push({ vaccine: 'BQ', disease: 'Black Quarter', dueDate: nextMonsoon, recurring: '1 year' });
  }

  if (animal.species === 'goat' || animal.species === 'sheep') {
    schedule.push({ vaccine: 'PPR', disease: 'Peste des Petits Ruminants', dueDate: addMonths(now, 1), recurring: '1 year' });
    schedule.push({ vaccine: 'ET', disease: 'Enterotoxaemia', dueDate: addMonths(now, 1), recurring: '1 year' });
  }

  schedule.push({ vaccine: 'Deworming', disease: 'Internal Parasites', dueDate: addMonths(now, 3), recurring: '3 months' });

  return schedule;
}

function addMonths(date, months) {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

function getNextMonsoon() {
  const now = new Date();
  const year = now.getMonth() > 4 ? now.getFullYear() + 1 : now.getFullYear();
  return new Date(year, 4, 15);
}

function getStatus(dueDate) {
  const now = new Date();
  const due = new Date(dueDate);
  const diffDays = Math.floor((due - now) / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return 'overdue';
  if (diffDays <= 7) return 'due-soon';
  return 'up-to-date';
}

function daysUntil(dueDate) {
  const now = new Date();
  const due = new Date(dueDate);
  return Math.floor((due - now) / (1000 * 60 * 60 * 24));
}
