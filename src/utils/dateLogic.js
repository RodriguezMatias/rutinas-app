export function getStoredDate() {
  const stored = localStorage.getItem('lastAccessDate');
  return stored ? new Date(JSON.parse(stored)) : null;
}

export function setStoredDate(date) {
  localStorage.setItem('lastAccessDate', JSON.stringify(date.toISOString()));
}

export function isNewDay() {
  const lastDate = getStoredDate();
  const currentDate = new Date();
  
  if (!lastDate) {
    setStoredDate(currentDate);
    return false; // Initial run
  }

  const isDifferentDay = 
    lastDate.getDate() !== currentDate.getDate() ||
    lastDate.getMonth() !== currentDate.getMonth() ||
    lastDate.getFullYear() !== currentDate.getFullYear();

  if (isDifferentDay) {
    setStoredDate(currentDate);
    return true;
  }

  return false;
}
