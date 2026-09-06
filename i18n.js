'use strict';
// English translations; Thai remains the canonical text in HTML and session data.
const translations = {
'ภาษา':'Language',
"เปิดเมนู":"Open menu","ปิดเมนู":"Close menu","เมนู":"Menu","หมวดหมู่":"Categories","โฟกัส":"Focus","ประวัติการอ่าน":"Study history","การเรียนรู้":"Learning","ปรับแต่งแอป":"Personalize","ให้เราเตือนเมื่อครบเวลาดีไหม?":"Would you like a reminder when time is up?","เปิดการแจ้งเตือนเพื่อรู้ว่าเมื่อไหร่ควรพักหรือกลับมาอ่านต่อ":"Enable notifications to know when to take a break or study again.","ไว้ก่อน":"Not now","อนุญาต":"Allow","เปลี่ยนได้ภายหลังในเมนูตั้งค่า":"You can change this later in Settings.","พื้นที่อ่านหนังสือ":"Your study space","อ่านไป":"Studied","✓ สำเร็จแล้ว":"\u2713 Completed","กำลังเรียนรู้":"In progress","สิ่งที่ได้เรียนรู้:":"What I learned:","ครั้งหน้าจะทำต่อ:":"Next step:","นำเข้าไม่ได้:":"Import failed:",
"ปฏิทินการอ่าน":"Study calendar","เดือนก่อนหน้า":"Previous month","เดือนถัดไป":"Next month","วันนี้":"Today","ดูทุกวัน":"All dates","ลบประวัติทั้งหมด":"Delete all history","จุดใต้วันที่หมายถึงวันที่มีบันทึกการอ่าน":"A dot marks a day with saved sessions.","ลบรอบนี้":"Delete session","ประวัติทุกวัน":"All study history","วันนี้ยังไม่มีบันทึกการอ่าน":"No sessions on this date","เลือกวันอื่น หรือกดดูทุกวัน":"Choose another date or view all dates.","ยืนยันการลบประวัติ":"Delete study history?","ลบแล้วกู้คืนได้จากไฟล์สำรองเท่านั้น":"Deleted history can only be restored from a backup.","ยืนยันการลบ":"Delete","ต้องการลบรอบนี้หรือไม่?":"Delete this session?","ต้องการลบประวัติทั้งหมดหรือไม่?":"Delete all saved sessions?","ลบไม่ได้ เนื่องจากบันทึกข้อมูลไม่สำเร็จ":"Could not save the deletion. Your history has been kept.","ลบประวัติแล้ว":"History deleted.","การแจ้งเตือน":"Notifications","แจ้งเตือนเมื่อครบเวลาอ่านและเวลาพัก":"Notify me when focus time and breaks end","ขออนุญาตแจ้งเตือน":"Allow notifications","ทดสอบการแจ้งเตือน":"Test notification","การเตือนอาจล่าช้าเมื่อสลับแอปหรือล็อกจอ และไม่รับประกันการเตือนเมื่อปิดเว็บ":"Alerts may be delayed in the background or with the screen locked. Alerts are not guaranteed when the app is closed.","ต้องเปิดผ่าน HTTPS หรือ localhost จึงจะขออนุญาตได้":"Open over HTTPS or localhost to request permission.","บน iPhone/iPad ให้เพิ่มเว็บไปยังหน้าจอโฮม แล้วเปิดจากไอคอนก่อน":"On iPhone/iPad, add this app to the Home Screen and open its icon first.","เบราว์เซอร์นี้ไม่รองรับการแจ้งเตือนเว็บ":"This browser does not support web notifications.","การแจ้งเตือนถูกบล็อก ให้เปลี่ยนสิทธิ์ในการตั้งค่าเบราว์เซอร์หรืออุปกรณ์":"Notifications are blocked. Change permission in browser or device settings.","อนุญาตการแจ้งเตือนแล้ว":"Notification permission granted.","ยังไม่ได้ขออนุญาตแจ้งเตือน":"Notification permission has not been requested.","เตรียมการแจ้งเตือนไม่สำเร็จ ลองโหลดหน้าใหม่":"Notification setup failed. Try reloading the page.","ขออนุญาตไม่สำเร็จ กรุณาตรวจการตั้งค่าเบราว์เซอร์":"Permission request failed. Check browser settings.","พักครบแล้ว":"Break complete","ครบเวลาอ่านแล้ว":"Focus session complete","Studyflow พร้อมแจ้งเตือนในอุปกรณ์นี้":"Studyflow notifications are ready on this device.","กลับมาที่ Studyflow เพื่อทำขั้นตอนถัดไป":"Return to Studyflow for your next step.","ส่งคำขอแจ้งเตือนแล้ว ตรวจศูนย์การแจ้งเตือนของอุปกรณ์":"Notification requested. Check your device’s notification centre.","แสดงการแจ้งเตือนไม่สำเร็จ ระบบยังแสดงผลในหน้าเว็บ":"Could not display a notification. The timer still updates in the app.",
'เลือกระยะเวลาอ่าน':'Choose your study duration','ชั่วโมง':'hr','วินาที':'sec',
'กำหนดเองได้ เช่น 40 นาที หรือ 1 ชั่วโมง 20 นาที 30 วินาที':'Set any duration, such as 40 min or 1 hr 20 min 30 sec.',
'กำหนดเวลาอย่างน้อย 1 วินาที โดยช่องนาทีและวินาทีอยู่ระหว่าง 0–59':'Set at least 1 second. Minutes and seconds must be between 0 and 59.',
'กรุณาระบุจำนวนนาทีเป็นจำนวนเต็มมากกว่า 0':'Enter a whole number of minutes greater than 0.',
'นำเข้าข้อมูลสำรอง?':'Import this backup?',
'ข้อมูลในไฟล์จะแทนที่ประวัติและโน้ตปัจจุบัน ควรสำรองข้อมูลเดิมก่อน':'This file will replace your current history and notes. Export your current data first.',
'ยกเลิก':'Cancel','นำเข้าและแทนที่':'Import and replace',
'อ่านไฟล์ไม่ได้ กรุณาเลือกไฟล์สำรองใหม่':'Could not read the file. Please select your backup again.',

'ตั้งค่า':'Settings','พื้นที่เล็ก ๆ สำหรับการเรียนรู้ของคุณ':'A little space for your learning',
'ประวัติการอ่าน ↗':'Study history ↗','วันนี้ อยากเรียนรู้เรื่องอะไร?':'What will you learn today?',
'เริ่มทีละนิด แล้วค่อย ๆ ไปถึงเป้าหมายของคุณ':'Start small. Make a little progress, one session at a time.',
'เวลาอ่านวันนี้':'Focus time today','รอบที่บันทึกวันนี้':'Sessions today','เป้าหมายสำเร็จวันนี้':'Goals completed today','นาที':'min','รอบ':'sessions','เป้าหมาย':'goals',
'ตั้งใจไว้สักเรื่อง':'Set a small intention','วิชาหรือเรื่องที่อ่าน':'Subject or topic','เช่น ฟิสิกส์ · เรื่องแรง':'e.g. Physics · Forces',
'เป้าหมายรอบนี้':'Your goal for this session','เช่น ทำโจทย์เรื่องแรงให้ได้ 10 ข้อ':'e.g. Solve 10 practice questions on forces',
'เวลาโฟกัส':'Focus time','(นาที)':'(minutes)','กำหนดเวลา 1 ถึง 180 นาที':'Set a duration from 1 to 180 minutes',
'เป้าหมายเล็ก ๆ ก็มีความหมาย':'Small goals count, too','ลองเลือกสิ่งที่ทำไหวในหนึ่งรอบ จะได้เห็นความคืบหน้าชัดขึ้น':'Choose something you can finish in one session to make your progress easier to see.',
'ตัวจับเวลา':'Study timer','พร้อมเมื่อคุณพร้อม':'Whenever you’re ready','ให้เวลากับสิ่งตรงหน้า':'A little time for what matters',
'เวลาที่เหลือ':'Time remaining','ทีละเรื่อง ทีละก้าว':'One thing, one step at a time','เริ่มโฟกัส':'Start focusing','จบรอบนี้':'Finish session','ข้ามเวลาพัก':'Skip break',
'ไม่ต้องสมบูรณ์แบบ แค่เริ่มก็เก่งแล้ว':'No need to be perfect. Just begin.',
'พักความคิดไว้ตรงนี้':'Park a thought','นึกเรื่องอื่นขึ้นมา? จดไว้ แล้วค่อยกลับมาดูหลังอ่านจบ':'Something on your mind? Leave it here and come back after your session.',
'บันทึกความคิดระหว่างอ่าน':'Thoughts during your session','เดี๋ยวต้อง…\n\nเก็บไว้ตรงนี้ก่อนได้เลย':'Later, I need to…\n\nLeave it here for now.',
'บันทึกอัตโนมัติในเครื่องนี้':'Saved automatically on this device','อ่านต่อจากครั้งก่อน ↗':'Pick up where you left off ↗',
'ทุกครั้งที่อ่าน มีความคืบหน้า':'Every session is a step forward','สำรองข้อมูล ↓':'Export backup ↓',
'ข้อมูลอยู่ในเบราว์เซอร์นี้ · ไม่มีบัญชีผู้ใช้และไม่มีการซิงก์ข้ามเครื่อง':'Stored in this browser · No account or cross-device sync',
'นำเข้าข้อมูลสำรอง':'Import backup','รอบนี้ คุณได้เรียนรู้อะไรบ้าง?':'What did you learn this time?',
'ลองนึกสิ่งที่จำได้ โดยยังไม่เปิดหนังสือ':'Recall what you learned before opening your book','วันนี้เข้าใจว่า…':'Today I learned…',
'ตอนนี้รู้สึกเข้าใจแค่ไหน?':'How well do you understand it now?',
'ยังงง — ขอทบทวนอีกหน่อย':'Not yet — I need another look','พอเข้าใจ — เริ่มเห็นภาพแล้ว':'Getting there — it’s starting to make sense','อธิบายได้ — พร้อมเล่าให้คนอื่นฟัง':'Confident — I could explain it to someone',
'ทำเป้าหมายรอบนี้สำเร็จแล้ว':'I completed my goal','ครั้งหน้า อยากทำอะไรต่อ?':'What’s your next step?',
'เช่น ทบทวนแรงเสียดทาน แล้วทำข้อ 8–10':'e.g. Review friction, then finish questions 8–10','บันทึกรอบนี้':'Save session',
'บันทึกแล้วจะเริ่มเวลาพักตามที่ตั้งไว้':'Your chosen break starts after saving.',
'พื้นที่ในแบบของคุณ':'Make yourself at home','ปิด':'Close','ปรับให้สบายตา แล้วกลับไปโฟกัสกับสิ่งสำคัญ':'Make it comfortable, then get back to what matters.',
'รูปแบบหน้าจอ':'Appearance','ตามอุปกรณ์':'Use device setting','สว่าง':'Light','มืด':'Dark','สีหลัก':'Accent color',
'ฟ้า':'Blue','ม่วง':'Violet','เขียวอมฟ้า':'Teal','ชมพู':'Rose','พื้นผิวกระจกโปร่งใส':'Translucent glass surfaces',
'ปิดเพื่อให้พื้นหลังทึบและอ่านข้อความได้ชัดขึ้น':'Turn off for solid backgrounds and clearer text.',
'เวลาโฟกัสเริ่มต้น (นาที)':'Default focus (minutes)','เวลาพัก (นาที)':'Break time (minutes)',
'เวลาใหม่จะใช้กับรอบถัดไป ไม่เปลี่ยนรอบที่กำลังทำอยู่':'New durations apply to your next session, not the current one.',
'บันทึกการตั้งค่าอัตโนมัติในอุปกรณ์นี้':'Preferences are saved automatically on this device',
'บันทึกการตั้งค่าไม่ได้ กรุณาตรวจพื้นที่เก็บข้อมูล':'Could not save preferences. Please check your browser storage.',
'อ่านข้อมูลเดิมไม่ได้ หากมีไฟล์สำรอง คุณสามารถนำเข้าข้อมูลได้':'Could not read saved data. You can restore a backup if you have one.',
'บันทึกในเครื่องไม่ได้ — กรุณาสำรองข้อมูล':'Could not save locally — please export a backup',
'พื้นที่เก็บข้อมูลไม่พร้อมใช้งาน กรุณากดสำรองข้อมูลก่อนปิดเว็บ':'Browser storage is unavailable. Please export a backup before closing.',
'เวลาพัก':'Break time','กำลังจับเวลา':'Timer is running','รอบนี้จบแล้ว':'Session complete','หยุดไว้ชั่วคราว':'Paused',
'พักสายตา ยืดตัวสักนิด':'Rest your eyes. Have a stretch.',
'หยุดชั่วคราว':'Pause','เขียนบันทึกหลังอ่าน':'Reflect on this session','จับเวลาต่อ':'Resume',
'รอบถัดไปจะเริ่มเมื่อคุณกดเริ่มโฟกัส':'Start the next session whenever you’re ready.',
'ใส่วิชาและเป้าหมายรอบนี้ก่อนนะ':'Add a subject and a goal first.',
'พักครบแล้ว พร้อมเมื่อไหร่ค่อยเริ่มรอบใหม่':'Break complete. Start again when you’re ready.',
'เริ่มเรื่องราวการเรียนรู้รอบแรกของคุณ':'Your learning journey starts here',
'เมื่อลองอ่านและบันทึกรอบแรก ความคืบหน้าจะปรากฏที่นี่':'Your progress will appear here after you save your first session.',
'ยังงง':'Not yet','พอเข้าใจ':'Getting there','อธิบายได้':'Confident','ดูบันทึกการเรียนรู้':'View reflection',
'บันทึกแล้ว เก่งมาก! พักสักครู่นะ':'Saved. Nice work! Take a little break.',
'เก็บรอบนี้ไว้ชั่วคราวแล้ว กรุณาสำรองข้อมูลก่อนปิดเว็บ':'Session kept in memory. Please export a backup before closing.',
'จบรอบปัจจุบันหรือข้ามเวลาพักก่อนเริ่มเรื่องถัดไปนะ':'Finish your session or skip the break before moving on.',
'เติมเป้าหมายครั้งก่อนไว้แล้ว กดเริ่มเมื่อพร้อมได้เลย':'Your next step is ready. Start when you’re ready.',
'ส่งออกประวัติและโน้ตแล้ว (ไม่รวมรอบที่กำลังจับเวลา)':'Exported history and notes (excluding the active session).',
'บันทึกรอบปัจจุบันและจบเวลาพักก่อนนำเข้าข้อมูลนะ':'Save your session and finish the break before importing.',
'มีรอบที่กำลังทำงานอยู่ กรุณาจบรอบก่อน':'Please finish the active session first.',
'ข้อมูลในไฟล์จะแทนที่ประวัติและโน้ตปัจจุบัน ต้องการนำเข้าหรือไม่?':'This file will replace your current history and notes. Import it?',
'นำเข้าข้อมูลเรียบร้อยแล้ว':'Backup imported.',
'นำเข้าแล้ว แต่บันทึกในเครื่องไม่ได้ กรุณาสำรองข้อมูลไว้':'Imported, but local storage is unavailable. Please keep your backup.',
'ไฟล์ใหญ่เกิน 10 MB':'File is larger than 10 MB','รูปแบบไฟล์สำรองไม่ถูกต้อง':'Invalid backup format','ไฟล์ไม่ใช่ JSON ที่ถูกต้อง':'File is not valid JSON',
'ความคืบหน้าวันนี้':'Today’s progress'
};
const preferenceDefaults = {language:'th',theme:'system',accent:'blue',glass:true,focus:25,breakMinutes:5,notifications:false};
let preferences = {...preferenceDefaults};
try {
  const saved=JSON.parse(localStorage.getItem('studyflow.preferences.v1') || 'null');
  if(saved){
    if(typeof saved.notifications==='boolean')preferences.notifications=saved.notifications;
    if(['th','en','zh-Hans','zh-Hant','ja'].includes(saved.language))preferences.language=saved.language;
    if(['system','light','dark'].includes(saved.theme))preferences.theme=saved.theme;
    if(['blue','violet','teal','rose'].includes(saved.accent))preferences.accent=saved.accent;
    if(typeof saved.glass==='boolean')preferences.glass=saved.glass;
    if(Number.isInteger(saved.focus)&&saved.focus>=1&&saved.focus*60000+Date.now()<8640000000000000)preferences.focus=saved.focus;
    if(Number.isInteger(saved.breakMinutes)&&saved.breakMinutes>=1&&saved.breakMinutes*60000+Date.now()<8640000000000000)preferences.breakMinutes=saved.breakMinutes;
  }
}catch{}
function locale(){return ({th:'th-TH',en:'en-GB','zh-Hans':'zh-CN','zh-Hant':'zh-TW',ja:'ja-JP'})[preferences.language]||'th-TH';}
const englishHeadings={
  'ONE SESSION AT A TIME':'ค่อย ๆ เรียนรู้ไปทีละรอบ',
  'PICK UP WHERE YOU LEFT OFF':'กลับมาอ่านต่อจากครั้งก่อน',
  'YOUR LEARNING JOURNEY':'เส้นทางการเรียนรู้ของคุณ',
  'A LITTLE REFLECTION':'ทบทวนสิ่งที่ได้เรียนรู้',
  'MAKE IT YOURS':'ปรับให้เป็นพื้นที่ของคุณ'
};
function tr(text){
  if(preferences.language==='th')return englishHeadings[text]||text;
  const english=translations[text]||text;
  if(text.startsWith('นำเข้าไม่ได้: '))return tr('นำเข้าไม่ได้:')+' '+tr(text.slice('นำเข้าไม่ได้: '.length));
  if(preferences.language==='en')return english;
  const index={'zh-Hans':0,'zh-Hant':1,ja:2}[preferences.language];
  if(multilingual[english])return multilingual[english][index];
  const prefix='นำเข้าไม่ได้: ';
  if(text.startsWith(prefix))return tr('นำเข้าไม่ได้:')+' '+tr(text.slice(prefix.length));
  return english;
}
// Track original interface strings so changing language is reversible.
// User-created content is marked separately and never passed through translation.
const textRecords=new WeakMap();
function translateUI(){
  const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
  const nodes=[];let node;
  while((node=walker.nextNode()))nodes.push(node);
  for(const n of nodes){
    if(n.parentElement?.closest('script,style,[data-user-content]'))continue;
    let record=textRecords.get(n);
    if(!record||n.nodeValue!==record.output)record={source:n.nodeValue,output:n.nodeValue};
    const trimmed=record.source.trim();
    const output=record.source.replace(trimmed,tr(trimmed));
    if(n.nodeValue!==output)n.nodeValue=output;
    record.output=output;textRecords.set(n,record);
  }
  document.querySelectorAll('[placeholder],[aria-label]').forEach(el=>{
    ['placeholder','aria-label'].forEach(attr=>{
      if(!el.hasAttribute(attr)||el.id==='timer'||el.closest('[data-user-content]'))return;
      const key='original-'+attr;
      if(!el.hasAttribute('data-'+key))el.setAttribute('data-'+key,el.getAttribute(attr));
      el.setAttribute(attr,tr(el.getAttribute('data-'+key)));
    });
  });
}
const deviceTheme=window.matchMedia('(prefers-color-scheme: dark)');
function applyPreferences(){
  document.documentElement.lang=preferences.language;
  document.documentElement.dataset.theme=preferences.theme==='system'?(deviceTheme.matches?'dark':'light'):preferences.theme;
  document.documentElement.dataset.accent=preferences.accent;
  document.documentElement.dataset.glass=String(preferences.glass);
  document.querySelector('meta[name="theme-color"]').content=document.documentElement.dataset.theme==='dark'?'#101827':'#f2f6ff';
  translateUI();
}
applyPreferences();
let translating=false;
const uiObserver=new MutationObserver(()=>{
  if(translating)return;
  translating=true;translateUI();uiObserver.takeRecords();translating=false;
});
uiObserver.observe(document.body,{childList:true,subtree:true,characterData:true});
if(deviceTheme.addEventListener)deviceTheme.addEventListener('change',applyPreferences);
else deviceTheme.addListener(applyPreferences);
