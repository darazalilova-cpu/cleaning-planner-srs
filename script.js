'use strict';
const P = window.Planner;
const $ = id => document.getElementById(id);
let tasks = [], editing = null, blocked = false;
const uid = () => crypto.randomUUID();
const dateText = s => new Date(s).toLocaleString('ru-RU', {day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit',hour12:false});
function message(text, error=false) { $('message').textContent = text; $('message').className = error ? 'error' : ''; }
for (const id of ['room','filterRoom']) for (const room of P.rooms) { const option=document.createElement('option');option.value=room;option.textContent=room;$(id).append(option); }
function save(next) {
  if (blocked) { message('Не удалось загрузить данные. Сначала проверьте хранилище или подтвердите очистку.',true); return false; }
  try { P.persist(localStorage,next); tasks=next; render(); message('Изменения сохранены'); return true; }
  catch { message('Не удалось сохранить изменения',true); return false; }
}
function clearForm() { editing=null; $('taskForm').reset(); $('formHeading').textContent='Новое дело';$('intervalLabel').hidden=true;for(const el of document.querySelectorAll('.error'))el.textContent=''; }
function edit(task) {
  editing=task.id;$('formHeading').textContent='Редактирование дела';
  for(const id of ['title','room','description','due'])$(id).value=task[id];
  $('repeat').value=[0,1,7].includes(task.interval)?String(task.interval):'custom';$('interval').value=task.interval||2;$('intervalLabel').hidden=$('repeat').value!=='custom';$('reminder').value=task.reminder===null?'none':String(task.reminder);$('title').focus();
}
function button(text, fn, className='secondary') { const b=document.createElement('button');b.type='button';b.textContent=text;b.className=className;b.addEventListener('click',fn);return b; }
function render() {
  const visible=P.select(tasks,{room:$('filterRoom').value,status:$('filterStatus').value,period:$('filterPeriod').value});
  $('taskList').replaceChildren();$('empty').hidden=visible.length>0;$('counter').textContent=`Показано ${visible.length} из ${tasks.length}`;
  const fragment=document.createDocumentFragment();
  for(const task of visible) {
    const li=document.createElement('li');li.className='task';const h=document.createElement('h3');h.textContent=task.title;li.append(h);
    const meta=document.createElement('p');meta.className='meta';meta.textContent=`${task.room} · ${dateText(task.due)} · ${task.interval ? 'Каждые '+task.interval+' дн.' : 'Разовое дело'}`;li.append(meta);
    const badge=document.createElement('span');badge.className='badge';badge.textContent=task.status==='completed'?'Выполнено':'Не выполнено';li.append(badge);
    if(task.status==='pending' && new Date(task.due)<new Date()){const late=document.createElement('span');late.className='badge overdue';late.textContent='Просрочено';li.append(late);}
    if(task.description){const p=document.createElement('p');p.textContent=task.description;li.append(p);}
    if(task.completedAt){const p=document.createElement('p');p.className='meta';p.textContent='Выполнено: '+dateText(task.completedAt);li.append(p);}
    const actions=document.createElement('div');actions.className='actions';
    if(task.status==='pending')actions.append(button('Выполнить',()=>{if(save(P.complete(tasks,task.id,new Date(),uid())) && editing===task.id)clearForm();},''),button('Редактировать',()=>edit(task)));
    actions.append(button('Удалить',()=>{if(confirm('Удалить это дело? Выполненные экземпляры серии сохранятся.')){if(save(tasks.filter(t=>t.id!==task.id)) && editing===task.id)clearForm();}},'danger'));
    li.append(actions);fragment.append(li);
  }
  $('taskList').append(fragment);
}
$('taskForm').addEventListener('submit',event=>{
  event.preventDefault();const input={title:$('title').value,room:$('room').value,description:$('description').value,due:$('due').value,interval:$('repeat').value==='custom'?Number($('interval').value):Number($('repeat').value),reminder:$('reminder').value==='none'?null:Number($('reminder').value)};
  const errors=P.validate(input);if($('repeat').value==='custom' && input.interval===0)errors.interval='Интервал от 1 до 365 дней';
  for(const id of ['title','room','description','due','interval']){ $(id+'Error').textContent=errors[id]||'';$(id).setAttribute('aria-invalid',String(Boolean(errors[id]))); }
  if(Object.keys(errors).length){const first=Object.keys(errors)[0];$(first)?.focus();return;}
  const next=editing?P.update(tasks,editing,input):[...tasks,P.create(input,uid())];if(save(next)){clearForm();$('title').focus();}
});
$('repeat').addEventListener('change',()=>{$('intervalLabel').hidden=$('repeat').value!=='custom';});
$('cancel').addEventListener('click',clearForm);$('addButton').addEventListener('click',()=>{clearForm();$('title').focus();});
$('filters').addEventListener('change',render);$('filters').addEventListener('reset',()=>setTimeout(render,0));
$('dismissReminders').addEventListener('click',()=>{$('reminders').hidden=true;});
$('resetData').addEventListener('click',()=>{if(confirm('Очистить повреждённые данные? Это удалит все сохранённые дела.')){try{localStorage.removeItem('cleaning-planner-v1');blocked=false;tasks=[];$('resetData').hidden=true;render();message('Данные очищены');}catch{message('Не удалось сохранить изменения',true);}}});
try{tasks=P.decode(localStorage.getItem('cleaning-planner-v1'));}catch{blocked=true;message('Не удалось загрузить данные',true);$('resetData').hidden=false;}
render();
