(function (root) {
  'use strict';
  const rooms = ['Кухня', 'Ванная', 'Спальня', 'Гостиная', 'Прихожая', 'Другое'];
  const pad = n => String(n).padStart(2, '0');
  function localDate(d = new Date()) {
    return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }
  function validDate(s) {
    return typeof s === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(s) && !Number.isNaN(+new Date(s)) && localDate(new Date(s)) === s;
  }
  function validate(input) {
    const errors = {};
    if (typeof input.title !== 'string' || !input.title.trim() || input.title.trim().length > 100) errors.title = 'Введите название от 1 до 100 символов';
    if (!rooms.includes(input.room)) errors.room = 'Выберите помещение';
    if (typeof input.description !== 'string' || input.description.length > 500) errors.description = 'Не более 500 символов';
    if (!validDate(input.due)) errors.due = 'Укажите корректные дату и время';
    if (!Number.isInteger(input.interval) || input.interval < 0 || input.interval > 365) errors.interval = 'Интервал должен быть целым числом от 1 до 365';
    if (![null, 0, 15, 60].includes(input.reminder)) errors.reminder = 'Недопустимое напоминание';
    return errors;
  }
  function create(input, id, now = new Date()) {
    if (Object.keys(validate(input)).length) throw new Error('Некорректные поля');
    return {...input, title:input.title.trim(), id, seriesId: input.interval ? id : null, status:'pending', createdAt:localDate(now), completedAt:null, notified:false};
  }
  function update(tasks, id, input) {
    if (Object.keys(validate(input)).length) throw new Error('Некорректные поля');
    return tasks.map(t => t.id !== id || t.status !== 'pending' ? t : {...t, ...input, title:input.title.trim(), seriesId:input.interval ? (t.seriesId || t.id) : null, notified: t.due !== input.due || t.reminder !== input.reminder ? false : t.notified});
  }
  function complete(tasks, id, now = new Date(), newId = id + '-next') {
    return tasks.map(t => t.id === id && t.status === 'pending' ? {...t, status:'completed', completedAt:localDate(now)} : t);
  }
  function select(tasks, filters = {}, now = new Date()) {
    return tasks.filter(t => (!filters.room || t.room === filters.room) && (!filters.status || t.status === filters.status)).sort((a,b) => a.due.localeCompare(b.due) || a.createdAt.localeCompare(b.createdAt));
  }
  function decode(raw) {
    if (raw === null) return [];
    const data = JSON.parse(raw);
    if (data.version !== 1 || !Array.isArray(data.tasks)) throw new Error('Формат хранилища не поддерживается');
    const ids = new Set(), activeSeries = new Set();
    for (const t of data.tasks) {
      if (Object.keys(validate(t)).length || typeof t.id !== 'string' || !t.id || ids.has(t.id) || !['pending','completed'].includes(t.status) || !validDate(t.createdAt) || typeof t.notified !== 'boolean' || (t.status === 'completed' ? !validDate(t.completedAt) : t.completedAt !== null) || (t.interval ? typeof t.seriesId !== 'string' || !t.seriesId : t.seriesId !== null)) throw new Error('Повреждённая запись');
      ids.add(t.id);
      if (t.interval && t.status === 'pending') {
        if (activeSeries.has(t.seriesId)) throw new Error('Дубликат активной серии');
        activeSeries.add(t.seriesId);
      }
    }
    return data.tasks;
  }
  const encode = tasks => JSON.stringify({version:1,tasks});
  function persist(storage, tasks) { storage.setItem('cleaning-planner-v1', encode(tasks)); return tasks; }
  const api = {rooms, localDate, validDate, validate, create, update, complete, select, decode, encode, persist};
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.Planner = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
