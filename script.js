'use strict';
// ใช้ timestamp แทนการลบวินาที เพื่อให้เวลายังตรงเมื่อสลับแท็บ
const $ = id => document.getElementById(id);
const STORAGE_KEY = 'studyflow.v1';
const emptyState = () => ({version:1,sessions:[],scratch:'',draft:{subject:'',goal:'',minutes:preferences.focus},active:null});
let state = emptyState();
let storageWarning = false;
let toastTimeout;
let selectedDay=null;
let activeView="focus";
let calendarMonth=new Date(new Date().getFullYear(),new Date().getMonth(),1);
let notificationRegistration=null;
let notificationSetupError=false;
function toast(message) {
  $('toast').textContent = message; $('toast').hidden = false;
  clearTimeout(toastTimeout); toastTimeout = setTimeout(() => $('toast').hidden = true, 4500);
}
// No product-level duration cap; reject values that cannot form a safe timestamp.
function validDuration(n){return Number.isSafeInteger(n) && n>=1 && n*1000+Date.now()<8640000000000000;}
function draftSeconds(draft){return draft.seconds ?? Math.round(draft.minutes*60);}
function validString(value, max) { return typeof value === 'string' && value.length <= max; }
function validState(data) {
  return data && data.version === 1 && Array.isArray(data.sessions) && data.sessions.length <= 10000 &&
    validString(data.scratch,10000) && data.draft && validString(data.draft.subject,80) &&
    validString(data.draft.goal,500) && validDuration(draftSeconds(data.draft)) &&
    data.sessions.every(s => s && validString(s.subject,80) && validString(s.goal,500) && validString(s.reflection,3000) &&
      validString(s.next,500) && ['ยังงง','พอเข้าใจ','อธิบายได้'].includes(s.understanding) && typeof s.achieved === 'boolean' &&
      Number.isSafeInteger(s.seconds) && s.seconds >= 0 && (s.seconds===0 || validDuration(s.seconds)) && typeof s.date === 'string' && Number.isFinite(Date.parse(s.date)));
}
function validActive(a) {
  return a && ['focus','break'].includes(a.mode) && ['running','paused','review'].includes(a.status) &&
    validDuration(a.total) && Number.isFinite(a.remaining) && a.remaining >= 0 && a.remaining <= a.total &&
    (a.status !== 'running' || Number.isFinite(a.deadline)) && validString(a.subject,80) && validString(a.goal,500);
}
try {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    const parsed = JSON.parse(saved);
    if (!validState(parsed)) throw new Error('Invalid saved data');
    state = parsed;
    if (state.active && !validActive(state.active)) state.active = null;
  }
} catch (error) {
  storageWarning = true;
  setTimeout(() => toast('อ่านข้อมูลเดิมไม่ได้ หากมีไฟล์สำรอง คุณสามารถนำเข้าข้อมูลได้'), 100);
}
function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    $('save-note').textContent = 'บันทึกอัตโนมัติในเครื่องนี้';
    storageWarning = false; return true;
  } catch (error) {
    $('save-note').textContent = 'บันทึกในเครื่องไม่ได้ — กรุณาสำรองข้อมูล';
    if (!storageWarning) toast('พื้นที่เก็บข้อมูลไม่พร้อมใช้งาน กรุณากดสำรองข้อมูลก่อนปิดเว็บ');
    storageWarning = true; return false;
  }
}
function draftToForm() {
  $('subject').value = state.draft.subject; $('goal').value = state.draft.goal;
  setDurationFields(draftSeconds(state.draft)); $('scratch').value = state.scratch;
  updatePresets();
}
function updatePresets() {
  document.querySelectorAll('[data-minutes]').forEach(button => {
    const selected = Number(button.dataset.minutes)*60 === readDurationFields();
    button.classList.toggle('selected', selected); button.setAttribute('aria-pressed', String(selected));
  });
}
function saveDraft() {
  state.draft.subject = $('subject').value; state.draft.goal = $('goal').value;
  const seconds=readDurationFields();
  if(validDuration(seconds)){state.draft.seconds=seconds;state.draft.minutes=seconds/60;}
  $('duration-error').hidden=true;
  updatePresets(); persist(); renderTimer();
}
function remaining() {
  const a = state.active;
  return a ? (a.status === 'running' ? Math.max(0,Math.min(a.total,(a.deadline-Date.now())/1000)) : a.remaining) : draftSeconds(state.draft);
}
function formatTime(seconds) {
  const rounded = Math.ceil(seconds);
  const mm=String(Math.floor(rounded/60)%60).padStart(2,'0');
  const ss=String(rounded%60).padStart(2,'0');
  return rounded>=3600?`${Math.floor(rounded/3600)}:${mm}:${ss}`:`${mm}:${ss}`;
}
function durationLabel(seconds){
  const n=Math.round(seconds);
  const units=[[Math.floor(n/3600),'ชั่วโมง'],[Math.floor(n/60)%60,'นาที'],[n%60,'วินาที']];
  return units.filter(([v])=>v).map(([v,key])=>`${v} ${tr(key)}`).join(' ')||`0 ${tr('วินาที')}`;
}
function renderTimer() {
  const a = state.active;
  const seconds = remaining();
  $('timer').textContent = formatTime(seconds);
  $('timer').classList.toggle('long-time',seconds>=3600);
  $('timer').setAttribute('aria-label',tr('เวลาที่เหลือ')+' '+durationLabel(seconds));
  document.title = a ? `${formatTime(seconds)} · ${a.mode === 'break' ? tr('เวลาพัก') : tr('เวลาโฟกัส')} | Studyflow` : 'Studyflow — '+tr('พื้นที่อ่านหนังสือ');
  $('clock').style.setProperty('--progress', `${a ? (1-seconds/a.total)*360 : 0}deg`);
  $('mode-label').textContent = a?.mode === 'break' ? 'เวลาพัก' : 'เวลาโฟกัส';
  $('timer-status').textContent = !a ? 'พร้อมเมื่อคุณพร้อม' : a.status === 'running' ? 'กำลังจับเวลา' : a.status === 'review' ? 'รอบนี้จบแล้ว' : 'หยุดไว้ชั่วคราว';
  $('clock-caption').textContent = a?.mode === 'break' ? 'พักสายตา ยืดตัวสักนิด' : 'ให้เวลากับสิ่งตรงหน้า';
  $('active-subject').textContent = a?.mode === 'focus' ? a.subject : tr('ทีละเรื่อง ทีละก้าว');
  $('start').textContent = !a ? 'เริ่มโฟกัส' : a.status === 'running' ? 'หยุดชั่วคราว' : a.status === 'review' ? 'เขียนบันทึกหลังอ่าน' : 'จับเวลาต่อ';
  $('finish').hidden = !a || a.mode !== 'focus' || a.status === 'review';
  $('skip-break').hidden = a?.mode !== 'break';
  $('timer-note').textContent = a?.mode === 'break' ? 'รอบถัดไปจะเริ่มเมื่อคุณกดเริ่มโฟกัส' : 'ไม่ต้องสมบูรณ์แบบ แค่เริ่มก็เก่งแล้ว';
  $('setup-form').querySelectorAll('input,textarea,button').forEach(el => el.disabled = !!a);
}
function startOrPause(event) {
  event.preventDefault();
  const a = state.active;
  if (!a) {
    if (!$('subject').value.trim() || !$('goal').value.trim()) { toast('ใส่วิชาและเป้าหมายรอบนี้ก่อนนะ'); return; }
    const total=readDurationFields();
    if(!validDuration(total)){showDurationError();return;}
    saveDraft();
    state.active = {mode:'focus',status:'running',total,remaining:total,deadline:Date.now()+total*1000,subject:state.draft.subject.trim(),goal:state.draft.goal.trim()};
  } else if (a.status === 'review') { openReview(); return; }
  else if (a.status === 'running') {
    a.remaining = remaining();
    if (a.remaining <= 0) { complete(); return; }
    a.status = 'paused';
  } else { a.deadline = Date.now()+a.remaining*1000; a.status='running'; }
  persist(); renderTimer();
}
function complete() {
  if (!state.active || state.active.status==='review') return;
  if(remaining()<=0)void deliverNotification(state.active.mode==='break'?'พักครบแล้ว':'ครบเวลาอ่านแล้ว');
  if (state.active.mode === 'break') {
    state.active = null; persist(); renderTimer(); toast('พักครบแล้ว พร้อมเมื่อไหร่ค่อยเริ่มรอบใหม่'); return;
  }
  state.active.remaining = remaining(); state.active.status = 'review'; persist(); renderTimer(); openReview();
}
function openReview() {
  const a = state.active;
  $('review-summary').textContent = `${a.subject} · ${tr('อ่านไป')} ${durationLabel(a.total-a.remaining)}`;
  if (!$('review').open) $('review').showModal();
}
function isToday(date) { return new Date(date).toDateString() === new Date().toDateString(); }
function textElement(tag, text, className) {
  const element = document.createElement(tag); element.textContent = text;
  if (className) element.className = className;
  return element;
}
function userElement(tag,text) { const el=textElement(tag,text);el.dataset.userContent='';return el; }
function renderHistory() {
  const todays = state.sessions.filter(s => isToday(s.date));
  $('today-time').replaceChildren(document.createTextNode(new Intl.NumberFormat(locale(),{maximumFractionDigits:1}).format(todays.reduce((sum,s)=>sum+s.seconds,0)/60)+' '),textElement('small','นาที'));
  $('today-count').replaceChildren(document.createTextNode(String(todays.length)+' '),textElement('small','รอบ'));
  $('today-goals').replaceChildren(document.createTextNode(String(todays.filter(s=>s.achieved).length)+' '),textElement('small','เป้าหมาย'));
  $('today').textContent = new Intl.DateTimeFormat(locale(),{day:'numeric',month:'long',year:'numeric'}).format(new Date());
  const list = $('history-list'); list.replaceChildren();
  const visibleSessions=state.sessions.filter(s=>!selectedDay || dayKey(new Date(s.date))===selectedDay);
  if (!visibleSessions.length) {
    const empty = textElement('div','','empty'); empty.append(textElement('strong',selectedDay?'วันนี้ยังไม่มีบันทึกการอ่าน':'เริ่มเรื่องราวการเรียนรู้รอบแรกของคุณ'),textElement('p',selectedDay?'เลือกวันอื่น หรือกดดูทุกวัน':'เมื่อลองอ่านและบันทึกรอบแรก ความคืบหน้าจะปรากฏที่นี่')); list.append(empty);
  }
  // ใช้ textContent กับข้อความผู้ใช้ ป้องกันการแทรก HTML
  [...visibleSessions].reverse().forEach(session => {
    const card = textElement('article','','session');
    const top = textElement('div','','session-top'); const title = textElement('div','');
    title.append(userElement('h3',session.subject),textElement('span',`${new Date(session.date).toLocaleString(locale(),{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'})} · ${durationLabel(session.seconds)}`,'meta'));
    top.append(title,textElement('span',session.understanding,'badge')); card.append(top,userElement('p',`${tr(session.achieved?'✓ สำเร็จแล้ว':'กำลังเรียนรู้')} · ${session.goal}`));
    if (session.reflection || session.next) {
      const details = document.createElement('details'); details.append(textElement('summary','ดูบันทึกการเรียนรู้'));
      if (session.reflection) details.append(userElement('p',(tr('สิ่งที่ได้เรียนรู้:')+' ')+session.reflection));
      if (session.next) details.append(userElement('p',(tr('ครั้งหน้าจะทำต่อ:')+' ')+session.next));
      card.append(details);
    }
    const remove=textElement('button','ลบรอบนี้','text-button danger');remove.type='button';remove.addEventListener('click',()=>deleteHistory([session]));card.append(remove);
    list.append(card);
  });
  renderCalendar();
  $('history-clear').disabled=state.sessions.length===0;
  const latest = state.sessions[state.sessions.length-1];
  $('continue-section').hidden = !latest?.next;
  if (latest?.next) { $('continue-title').textContent = latest.subject; $('continue-note').textContent = latest.next; }
}
$('setup-form').addEventListener('submit',startOrPause);
['subject','goal','hours','minutes','seconds'].forEach(id=>$(id).addEventListener('input',saveDraft));
document.querySelectorAll('[data-minutes]').forEach(button=>button.addEventListener('click',()=>{ setDurationFields(Number(button.dataset.minutes)*60); saveDraft(); }));
$('scratch').addEventListener('input',()=>{state.scratch=$('scratch').value; persist();});
$('finish').addEventListener('click',complete);
$('skip-break').addEventListener('click',()=>{state.active=null;persist();renderTimer();});
$('review-form').addEventListener('submit',event=>{
  event.preventDefault(); const a=state.active;
  if (!a || a.status !== 'review') return;
  state.sessions.push({subject:a.subject,goal:a.goal,seconds:Math.round(a.total-a.remaining),date:new Date().toISOString(),reflection:$('reflection').value.trim(),understanding:$('understanding').value,achieved:$('achieved').checked,next:$('next-step').value.trim()});
  state.active={mode:'break',status:'running',total:preferences.breakMinutes*60,remaining:preferences.breakMinutes*60,deadline:Date.now()+preferences.breakMinutes*60000,subject:'',goal:''};
  const saved=persist(); $('review').close(); $('review-form').reset();renderHistory();renderTimer();
  toast(saved ? 'บันทึกแล้ว เก่งมาก! พักสักครู่นะ' : 'เก็บรอบนี้ไว้ชั่วคราวแล้ว กรุณาสำรองข้อมูลก่อนปิดเว็บ');
});
$('continue').addEventListener('click',()=>{
  if (state.active) {toast('จบรอบปัจจุบันหรือข้ามเวลาพักก่อนเริ่มเรื่องถัดไปนะ');return;}
  const latest=state.sessions[state.sessions.length-1];
  state.draft.subject=latest.subject;state.draft.goal=latest.next;draftToForm();persist();
  $('setup-form').scrollIntoView({behavior:'smooth',block:'center'});$('goal').focus();toast('เติมเป้าหมายครั้งก่อนไว้แล้ว กดเริ่มเมื่อพร้อมได้เลย');
});
$('export').addEventListener('click',()=>{
  const backup={...state,active:null};
  const url=URL.createObjectURL(new Blob([JSON.stringify(backup,null,2)],{type:'application/json'}));
  const link=document.createElement('a');link.href=url;link.download=`studyflow-backup-${new Date().toISOString().slice(0,10)}.json`;
  document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
  toast('ส่งออกประวัติและโน้ตแล้ว (ไม่รวมรอบที่กำลังจับเวลา)');
});
$('import').addEventListener('click',()=>{
  if(state.active){toast('บันทึกรอบปัจจุบันและจบเวลาพักก่อนนำเข้าข้อมูลนะ');return;}
  $('import-file').click();
});
$('import-file').addEventListener('change',async event=>{
  const file=event.target.files[0];if(!file)return;
  try {
    if(file.size>10*1024*1024)throw new Error('ไฟล์ใหญ่เกิน 10 MB');
    const data=JSON.parse(await file.text());
    if(!validState(data))throw new Error('รูปแบบไฟล์สำรองไม่ถูกต้อง');
    if(state.active){toast('มีรอบที่กำลังทำงานอยู่ กรุณาจบรอบก่อน');return;}
    if(!await confirmImport())return;
    state={version:1,sessions:data.sessions,scratch:data.scratch,draft:data.draft,active:null};
    const saved=persist();draftToForm();renderHistory();renderTimer();toast(saved?'นำเข้าข้อมูลเรียบร้อยแล้ว':'นำเข้าแล้ว แต่บันทึกในเครื่องไม่ได้ กรุณาสำรองข้อมูลไว้');
  }catch(error){toast('นำเข้าไม่ได้: '+(error instanceof SyntaxError?'ไฟล์ไม่ใช่ JSON ที่ถูกต้อง':(['ไฟล์ใหญ่เกิน 10 MB','รูปแบบไฟล์สำรองไม่ถูกต้อง'].includes(error.message)?error.message:'อ่านไฟล์ไม่ได้ กรุณาเลือกไฟล์สำรองใหม่')));}
  finally{event.target.value='';}
});
// เมื่อรีเฟรชหน้า จะคืนค่ารอบเดิมและคำนวณเวลาที่ผ่านไปจริง
function tick(){if(state.active?.status==='running'&&remaining()<=0)complete();else renderTimer();}
document.addEventListener('visibilitychange',()=>{tick();renderHistory();});
draftToForm();renderHistory();tick();
if(state.active?.status==='review')openReview();
setInterval(tick,500);

// Preferences are stored separately so older study backups remain compatible.
function fillSettings(){
  renderNotificationSettings();
  $('language').value=preferences.language;$('theme').value=preferences.theme;
  $('accent').value=preferences.accent;$('glass').checked=preferences.glass;
  $('default-focus').value=preferences.focus;$('break-minutes').value=preferences.breakMinutes;
}
$('settings-open').addEventListener('click',async()=>{await closeNavigation();fillSettings();$('settings-dialog').showModal();});
$('settings-close').addEventListener('click',()=>$('settings-dialog').close());
function savePreferences(){
  try{localStorage.setItem('studyflow.preferences.v1',JSON.stringify(preferences));$('settings-save').textContent='บันทึกการตั้งค่าอัตโนมัติในอุปกรณ์นี้';}
  catch{$('settings-save').textContent='บันทึกการตั้งค่าไม่ได้ กรุณาตรวจพื้นที่เก็บข้อมูล';}
  applyPreferences();renderHistory();renderTimer();renderNotificationSettings();
  if($('review').open && state.active?.status==='review')openReview();
}
['language','theme','accent'].forEach(id=>$(id).addEventListener('change',()=>{preferences[id]=$(id).value;savePreferences();}));
$('glass').addEventListener('change',()=>{preferences.glass=$('glass').checked;savePreferences();});
$('default-focus').addEventListener('change',()=>{
  if(!validDuration(Number($('default-focus').value)*60)||!Number.isInteger(Number($('default-focus').value))){toast('กรุณาระบุจำนวนนาทีเป็นจำนวนเต็มมากกว่า 0');return;}
  preferences.focus=Number($('default-focus').value);
  state.draft.minutes=preferences.focus;state.draft.seconds=preferences.focus*60;
  setDurationFields(state.draft.seconds);updatePresets();persist();savePreferences();
});
$('break-minutes').addEventListener('change',()=>{
  if(!validDuration(Number($('break-minutes').value)*60)||!Number.isInteger(Number($('break-minutes').value))){toast('กรุณาระบุจำนวนนาทีเป็นจำนวนเต็มมากกว่า 0');return;}
  preferences.breakMinutes=Number($('break-minutes').value);savePreferences();
});
fillSettings();applyPreferences();

function setDurationFields(total){
  $('hours').value=Math.floor(total/3600);$('minutes').value=Math.floor(total/60)%60;$('seconds').value=total%60;
}
function readDurationFields(){
  const values=['hours','minutes','seconds'].map(id=>String($(id).value).trim()==='' ?0:Number($(id).value));
  if(values.some(v=>!Number.isSafeInteger(v)||v<0)||values[1]>59||values[2]>59)return NaN;
  return values[0]*3600+values[1]*60+values[2];
}
function showDurationError(){
  $('duration-error').textContent=tr('กำหนดเวลาอย่างน้อย 1 วินาที โดยช่องนาทีและวินาทีอยู่ระหว่าง 0–59');
  $('duration-error').hidden=false;$('hours').focus();
}
function confirmImport(){
  return new Promise(resolve=>{
    const dialog=$('import-confirm');
    let accepted=false;
    $('import-accept').onclick=()=>{accepted=true;dialog.close();};
    $('import-cancel').onclick=()=>dialog.close();
    dialog.addEventListener('close',()=>resolve(accepted),{once:true});dialog.showModal();
  });
}

function dayKey(date){return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;}
function renderCalendar(){
  const year=calendarMonth.getFullYear(),month=calendarMonth.getMonth();
  $('calendar-month').textContent=new Intl.DateTimeFormat(locale(),{month:'long',year:'numeric'}).format(calendarMonth);
  $('calendar-weekdays').replaceChildren();
  for(let i=0;i<7;i++)$('calendar-weekdays').append(textElement('span',new Intl.DateTimeFormat(locale(),{weekday:'short'}).format(new Date(2024,0,1+i))));
  const counts=new Map();for(const s of state.sessions){const key=dayKey(new Date(s.date));counts.set(key,(counts.get(key)||0)+1);}
  const days=$('calendar-days');days.replaceChildren();
  const offset=(new Date(year,month,1).getDay()+6)%7;
  for(let i=0;i<offset;i++){const spacer=textElement('span','');spacer.setAttribute('aria-hidden','true');days.append(spacer);}
  for(let d=1;d<=new Date(year,month+1,0).getDate();d++){
    const date=new Date(year,month,d),key=dayKey(date),count=counts.get(key)||0;
    const button=textElement('button',String(d),'calendar-day');button.type='button';
    button.classList.toggle('has-sessions',count>0);button.classList.toggle('chosen',selectedDay===key);
    button.setAttribute('aria-pressed',String(selectedDay===key));
    button.setAttribute('aria-label',new Intl.DateTimeFormat(locale(),{dateStyle:'full'}).format(date)+` · ${count} ${tr('รอบ')}`);
    if(key===dayKey(new Date()))button.setAttribute('aria-current','date');
    button.addEventListener('click',()=>{selectedDay=key;renderHistory();const current=[...$('calendar-days').querySelectorAll('button')].find(b=>b.getAttribute('aria-pressed')==='true');current?.focus();});days.append(button);
  }
  const visible=state.sessions.filter(s=>!selectedDay||dayKey(new Date(s.date))===selectedDay);
  const label=selectedDay?new Intl.DateTimeFormat(locale(),{dateStyle:'long'}).format(new Date(selectedDay+'T12:00:00')):tr('ประวัติทุกวัน');
  $('history-filter').textContent=`${label} · ${visible.length} ${tr('รอบ')} · ${durationLabel(visible.reduce((sum,s)=>sum+s.seconds,0))}`;
}
$('month-prev').addEventListener('click',()=>{calendarMonth=new Date(calendarMonth.getFullYear(),calendarMonth.getMonth()-1,1);renderCalendar();});
$('month-next').addEventListener('click',()=>{calendarMonth=new Date(calendarMonth.getFullYear(),calendarMonth.getMonth()+1,1);renderCalendar();});
$('calendar-today').addEventListener('click',()=>{const now=new Date();selectedDay=dayKey(now);calendarMonth=new Date(now.getFullYear(),now.getMonth(),1);renderHistory();});
$('history-all').addEventListener('click',()=>{selectedDay=null;renderHistory();});
$('history-clear').addEventListener('click',()=>deleteHistory([...state.sessions]));
async function deleteHistory(targets){
  if(!targets.length)return;
  const message=targets.length===1?tr('ต้องการลบรอบนี้หรือไม่?')+' '+targets[0].subject:tr('ต้องการลบประวัติทั้งหมดหรือไม่?');
  const accepted=await new Promise(resolve=>{
    const dialog=$('delete-confirm');$('delete-message').textContent=message;
    let yes=false;$('delete-accept').onclick=()=>{yes=true;dialog.close();};$('delete-cancel').onclick=()=>dialog.close();
    dialog.addEventListener('close',()=>resolve(yes),{once:true});dialog.showModal();
  });
  if(!accepted)return;
  // Capture exact objects, so a new session saved while confirming is never removed.
  const before=state.sessions;state.sessions=before.filter(s=>!targets.includes(s));
  if(!persist()){state.sessions=before;toast('ลบไม่ได้ เนื่องจากบันทึกข้อมูลไม่สำเร็จ');return;}
  renderHistory();toast('ลบประวัติแล้ว');$('history-clear').disabled?$('history-all').focus():$('history-clear').focus();
}
function notificationCapability(){
  const ios=/iPad|iPhone|iPod/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
  if(!window.isSecureContext)return 'secure';
  if(ios&&!window.matchMedia('(display-mode: standalone)').matches&&!navigator.standalone)return 'homescreen';
  if(!('Notification' in window)||!('serviceWorker' in navigator))return 'unsupported';
  return 'supported';
}
function renderNotificationSettings(){
  const capability=notificationCapability();
  let message=capability==='secure'?'ต้องเปิดผ่าน HTTPS หรือ localhost จึงจะขออนุญาตได้':capability==='homescreen'?'บน iPhone/iPad ให้เพิ่มเว็บไปยังหน้าจอโฮม แล้วเปิดจากไอคอนก่อน':capability==='unsupported'?'เบราว์เซอร์นี้ไม่รองรับการแจ้งเตือนเว็บ':Notification.permission==='denied'?'การแจ้งเตือนถูกบล็อก ให้เปลี่ยนสิทธิ์ในการตั้งค่าเบราว์เซอร์หรืออุปกรณ์':Notification.permission==='granted'?'อนุญาตการแจ้งเตือนแล้ว':'ยังไม่ได้ขออนุญาตแจ้งเตือน';
  if(capability==='supported'&&notificationSetupError)message='เตรียมการแจ้งเตือนไม่สำเร็จ ลองโหลดหน้าใหม่';
  $('notification-status').textContent=message;
  const granted=capability==='supported'&&Notification.permission==='granted';
  $('notification-permission').disabled=capability!=='supported'||Notification.permission!=='default';
  $('notifications-enabled').checked=!!preferences.notifications;
  $('notifications-enabled').disabled=!granted;
  $('notification-test').disabled=!granted||!preferences.notifications;
}
async function prepareNotifications(){
  if(notificationCapability()!=='supported')return;
  try{
    const registration=await navigator.serviceWorker.register('./sw.js',{scope:'./'});
    if(!registration.active)await new Promise((resolve,reject)=>{
      const worker=registration.installing||registration.waiting;
      if(!worker){reject(new Error('No service worker'));return;}
      const timeout=setTimeout(()=>reject(new Error('Service worker timeout')),10000);
      function check(){if(worker.state==='activated'){clearTimeout(timeout);resolve();}else if(worker.state==='redundant'){clearTimeout(timeout);reject(new Error('Service worker failed'));}}
      worker.addEventListener('statechange',check);check();
    });
    notificationRegistration=registration;notificationSetupError=false;
  }catch{notificationSetupError=true;}
  renderNotificationSettings();
}
async function requestNotificationPermission(){
  if(notificationCapability()!=='supported')return;
  try{
    // Call directly from the tap, before awaiting registration (required on iOS).
    const permission=await Notification.requestPermission();
    preferences.notifications=permission==='granted';savePreferences();
    if(permission==='granted')await prepareNotifications();
  }catch{toast('ขออนุญาตไม่สำเร็จ กรุณาตรวจการตั้งค่าเบราว์เซอร์');}
  renderNotificationSettings();
}
$('notification-permission').addEventListener('click',requestNotificationPermission);
$('notifications-enabled').addEventListener('change',()=>{preferences.notifications=$('notifications-enabled').checked;savePreferences();});
$('notification-test').addEventListener('click',()=>deliverNotification('ทดสอบการแจ้งเตือน',true));
async function deliverNotification(title,test=false){
  if(notificationCapability()!=='supported'||Notification.permission!=='granted'||!preferences.notifications)return;
  try{
    if(!notificationRegistration)await prepareNotifications();
    if(!notificationRegistration)throw new Error('Unavailable');
    await notificationRegistration.showNotification(tr(title),{body:tr(test?'Studyflow พร้อมแจ้งเตือนในอุปกรณ์นี้':'กลับมาที่ Studyflow เพื่อทำขั้นตอนถัดไป'),tag:'studyflow-timer',icon:'./icon.svg'});
    if(test)toast('ส่งคำขอแจ้งเตือนแล้ว ตรวจศูนย์การแจ้งเตือนของอุปกรณ์');
  }catch{toast('แสดงการแจ้งเตือนไม่สำเร็จ ระบบยังแสดงผลในหน้าเว็บ');}
}
document.addEventListener('visibilitychange',()=>{if(!document.hidden)renderNotificationSettings();});
void prepareNotifications();

// Native dialog keeps keyboard focus inside the navigation drawer.
let closingNavigation=null;
$('menu-open').addEventListener('click',()=>{
  $('navigation-drawer').classList.remove('is-closing');$('navigation-drawer').showModal();$('menu-open').setAttribute('aria-expanded','true');
});
function closeNavigation(){
  if(closingNavigation)return closingNavigation;
  const dialog=$('navigation-drawer');if(!dialog.open)return Promise.resolve();
  dialog.classList.add('is-closing');
  closingNavigation=new Promise(resolve=>setTimeout(()=>{dialog.close();dialog.classList.remove('is-closing');$('menu-open').setAttribute('aria-expanded','false');closingNavigation=null;resolve();},window.matchMedia('(prefers-reduced-motion: reduce)').matches?0:180));
  return closingNavigation;
}
$('menu-close').addEventListener('click',closeNavigation);
$('navigation-drawer').addEventListener('cancel',event=>{event.preventDefault();void closeNavigation();});
$('navigation-drawer').addEventListener('click',event=>{if(event.target===$('navigation-drawer')){const r=event.target.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)void closeNavigation();}});
function selectView(view){
  activeView=view;$('focus-view').hidden=view!=='focus';$('history').hidden=view==='focus';$('calendar-panel').hidden=view!=='calendar';
  if(view==='history')selectedDay=null;
  $('current-page').textContent=view==='focus'?'โฟกัส':view==='calendar'?'ปฏิทินการอ่าน':'ประวัติการอ่าน';
  $('history-title').textContent=view==='calendar'?'ปฏิทินการอ่าน':'ทุกครั้งที่อ่าน มีความคืบหน้า';
  document.querySelectorAll('[data-view]').forEach(button=>{if(button.dataset.view===view)button.setAttribute('aria-current','page');else button.removeAttribute('aria-current');});
  renderHistory();
}
document.querySelectorAll('[data-view]').forEach(button=>button.addEventListener('click',async()=>{await closeNavigation();selectView(button.dataset.view);$('current-page').setAttribute('tabindex','-1');$('current-page').focus();window.scrollTo({top:0,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});}));
// App-level invitation appears once per browser origin. Native permission still needs a tap.
function showFirstNotificationInvite(){
  let seen=false;try{seen=localStorage.getItem('studyflow.notification-invite.v1')==='seen';}catch{}
  if(seen)return;
  if(document.querySelector('dialog[open]')){document.querySelector('dialog[open]').addEventListener('close',showFirstNotificationInvite,{once:true});return;}
  try{localStorage.setItem('studyflow.notification-invite.v1','seen');}catch{}
  const supported=notificationCapability()==='supported';
  if(supported&&Notification.permission!=='default')return;
  renderNotificationSettings();$('welcome-status').textContent=tr($('notification-status').textContent);
  $('welcome-allow').hidden=!supported;$('notification-welcome').showModal();
}
$('welcome-later').addEventListener('click',()=>$('notification-welcome').close());
$('welcome-allow').addEventListener('click',()=>{$('notification-welcome').close();void requestNotificationPermission();});
selectView('focus');
setTimeout(showFirstNotificationInvite,350);
