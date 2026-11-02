/* НейроКвест — статический образовательный проект, без внешних API.
 * Примеры нейросетевой генерации — заранее подготовленные иллюстрации.
 * «Обучение робота» — демонстрация классификатора ближайшего соседа, НЕ LLM.
 */
(() => {
'use strict';
const cfg = Object.assign({schoolName:'Онлайн-школа «Тетрика»',courseName:'Курс «Искусственный интеллект» для 1–4 классов',courseDescription:'Увлекательные занятия по искусственному интеллекту',courseUrl:'https://tetrika-school.ru/'}, window.NEUROQUEST_CONFIG || {});
const $ = (q) => document.querySelector(q);
const app = $('#app');
const storageKey = 'neuroquest-lunya-v1';
const missions = [
  {title:'Фото или нейросеть?',icon:'📸',min:'5 мин',desc:'Попробуй отличить настоящую фотографию от картинки, созданной ИИ.',intro:'Привет, детектив! Даже очень необычная картинка может оказаться настоящей. Смотри внимательно! ',hint:'Выбирай то изображение, которое, по твоему мнению, создано искусственным интеллектом. Даже взрослые иногда ошибаются!'},
  {title:'Что умеет ИИ?',icon:'🧠',min:'4 мин',desc:'Узнай, в чём ИИ помогает людям, а что ему пока недоступно.',intro:'У меня есть суперспособности, но я не волшебница! Давай узнаем мои настоящие возможности.',hint:'ИИ работает с информацией: текстами, картинками и звуками. Но у него нет настоящего тела и органов чувств.'},
  {title:'Магия точного запроса',icon:'✨',min:'6 мин',desc:'Научись формулировать запросы и собери свою волшебную идею.',intro:'Секрет ИИ прост: чем понятнее задание, тем проще получить полезный ответ. Ты готов стать мастером промптов?',hint:'Хороший запрос объясняет: ЧТО нужно, ПРО КОГО, В КАКОМ СТИЛЕ и ДЛЯ КОГО.'},
  {title:'Обучи робота',icon:'🤖',min:'7 мин',desc:'Покажи роботу примеры и посмотри, как он начнёт угадывать.',intro:'Моему другу Робби нужна помощь! Сначала покажем ему примеры животных, потом проверим, чему он научился.',hint:'Робот запоминает признаки и подписи примеров. Если учить его на ошибках, он тоже может начать ошибаться.'},
  {title:'Поймай ошибку',icon:'🔎',min:'5 мин',desc:'Проверь утверждения и не дай ИИ тебя запутать.',intro:'Бывает, ИИ отвечает очень уверенно, даже если ошибается. Превращаемся в проверяющих факты!',hint:'Сравни ответ с тем, что точно знаешь. Если сомневаешься — проверь в книге или спроси взрослого.'},
  {title:'Секреты безопасности',icon:'🛡️',min:'4 мин',desc:'Научись отличать безопасные запросы от личных секретов.',intro:'Последняя миссия — самая важная. Настоящий исследователь ИИ бережёт личные данные!',hint:'Не отправляй ИИ пароль, телефон, адрес, документы, фотографии других людей и другие личные сведения.'}
];
const photos = [
  {q:'Где изображение, созданное нейросетью?',images:[['assets/real_cat.webp','Котик у окна',false],['assets/ai_cat_rocket.webp','Котик-космонавт',true]],why:'Котик у окна — настоящая фотография. А котик в космическом шлеме здесь создан ИИ.'},
  {q:'Какую картинку придумал ИИ?',images:[['assets/ai_space_cat.webp','Путешественник среди звёзд',true],['assets/real_astronaut.webp','Настоящий космонавт',false]],why:'Человек в скафандре — реальная фотография, а фантастический космический кот — рисунок ИИ.'},
  {q:'Найди картинку от нейросети.',images:[['assets/real_rocket.webp','Ракета перед запуском',false],['assets/ai_cat_guardian.webp','Кошечка с волшебным щитом',true]],why:'Ракету действительно фотографировали. Волшебную кошечку придумала нейросеть.'},
  {q:'Которое изображение создано ИИ?',images:[['assets/ai_magic_cat.webp','Волшебная кошечка',true],['assets/real_coffee.webp','Чашка кофе',false]],why:'Кофе — реальная фотография. Кошечку в фантастическом стиле создал ИИ.'}
];
const abilities = [
  ['📚','Придумать смешную сказку',true,'ИИ умеет сочинять тексты по запросу.'],
  ['🍦','Самому съесть мороженое',false,'У ИИ нет тела, поэтому он ничего не ест.'],
  ['🎨','Предложить идею для рисунка',true,'ИИ может подсказать идеи и даже создавать изображения.'],
  ['🌷','Почувствовать запах цветов',false,'ИИ не нюхает цветы так, как это делает человек.'],
  ['🧩','Помочь объяснить сложную тему',true,'ИИ умеет объяснять, но важные ответы нужно проверять.'],
  ['🦮','Самостоятельно вывести собаку гулять',false,'Чат-бот сам не может выйти на прогулку.']
];
const promptQuizzes = [
  {q:'Хочешь сказку про дракона. Как попросить ИИ?',items:['Напиши что-нибудь.','Придумай короткую весёлую сказку про доброго дракона для детей 7 лет.','Дракон.'],correct:1,why:'Здесь ясно сказано: что создать, о ком, насколько длинное и для кого.'},
  {q:'Нужна идея для подарка другу. Что лучше написать?',items:['Подарок.','Сделай хорошо.','Предложи 3 идеи подарков для друга 9 лет, который любит космос.'],correct:2,why:'Такой запрос содержит возраст, интерес друга и число идей.'}
];
const mistakes = [
  ['🐘','У слона десять ног.',false,'Обычно у слона четыре ноги.'],
  ['🌕','Луна светит своим собственным светом.',false,'Луна отражает солнечный свет.'],
  ['🗓️','В обычном календарном году двенадцать месяцев.',true,'Это верно: в году 12 месяцев.'],
  ['🐝','Пчёлы помогают опылять многие растения.',true,'Да, пчёлы переносят пыльцу между цветками.'],
  ['☀️','Солнце — холодная ледяная планета.',false,'Солнце — очень горячая звезда, а не планета.']
];
const safety = [
  ['🔐','Мой секретный пароль',false,'Пароли нельзя писать в чатах с ИИ.'],
  ['🦕','Придумай сказку про динозавра',true,'Идея для сказки — безопасный запрос.'],
  ['🏡','Точный домашний адрес',false,'Домашний адрес — личная информация.'],
  ['💜','Мой любимый цвет — фиолетовый',true,'Любимый цвет обычно не раскрывает важные личные данные.'],
  ['📱','Номер телефона мамы',false,'Чужие номера телефонов тоже нужно защищать.'],
  ['🪐','Объясни, почему у Сатурна есть кольца',true,'Учебный вопрос безопасен и полезен.']
];
const animalTrain = [
  {kind:'cat',face:'🐱',label:'Рыжик',features:[1,.96,.08]},
  {kind:'dog',face:'🐶',label:'Бублик',features:[.09,.10,.96]},
  {kind:'cat',face:'🐈',label:'Пушинка',features:[.92,.90,.15]},
  {kind:'dog',face:'🐕',label:'Дружок',features:[.13,.15,.88]},
  {kind:'cat',face:'🐈‍⬛',label:'Ночка',features:[.86,.98,.18]},
  {kind:'dog',face:'🐩',label:'Снежок',features:[.22,.11,.79]}
];
const animalTest = [
  {kind:'cat',face:'🐈',label:'Новый ученик №1',features:[.97,.86,.13]},
  {kind:'dog',face:'🐕‍🦺',label:'Новый ученик №2',features:[.16,.17,.89]},
  {kind:'cat',face:'🐱',label:'Новый ученик №3',features:[.89,.83,.18]}
];
const boss = [
  {q:'Какая просьба поможет получить точный ответ?',items:['Придумай что-то.','Напиши 3 загадки про планеты для второклассника.','Просто помоги.'],correct:1,why:'Точный запрос помогает нейросети понять задание.'},
  {q:'ИИ сказал, что у человека 6 рук. Что делать?',items:['Поверить сразу.','Проверить информацию.','Рассказать как факт.'],correct:1,why:'Даже убедительный ответ ИИ может быть ошибкой.'},
  {q:'Что можно отправить в чат с ИИ?',items:['Пароль от аккаунта.','Домашний адрес.','Просьбу придумать сказку.'],correct:2,why:'Запрос на сказку не содержит личных данных.'}
];
const defaultState = () => ({screen:'welcome',mission:0,round:0,stars:0,completed:[],earned:[],training:[],sound:false,selectedPrompt:{who:'котика',where:'в космосе',action:'летит на ракете',style:'мультяшный'},promptMade:false});
let state=defaultState();
try { const saved=JSON.parse(localStorage.getItem(storageKey)||'null'); if(saved && typeof saved==='object') {
  state={...state,...saved};
  if(!['welcome','map','mission','boss','final'].includes(state.screen)) state.screen='welcome';
  if(!Number.isInteger(state.mission)||state.mission<0||state.mission>5) state.mission=0;
  if(!Number.isInteger(state.round)||state.round<0||state.round>20) state.round=0;
  if(!Number.isFinite(state.stars)||state.stars<0) state.stars=0;
  if(!Array.isArray(state.completed)) state.completed=[];
  if(!Array.isArray(state.earned)) state.earned=[];
  if(!Array.isArray(state.training)) state.training=[];
  if(!state.selectedPrompt||typeof state.selectedPrompt!=='object') state.selectedPrompt=defaultState().selectedPrompt;
} } catch(e) { /* Local storage may be unavailable */ }
let feedback=null, catMessage='', catMood='normal', catTimer=null;
const escapeHtml=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const save=()=>{try{localStorage.setItem(storageKey,JSON.stringify(state));}catch(e){/* private mode */}};
const say=(msg,mood='normal')=>{
 catMessage=msg;catMood=mood;
 const bubble=$('#cat-speech');if(bubble)bubble.textContent=msg;
 const cat=$('#guide-cat');if(cat){cat.classList.remove('cat-cheer','cat-thinking');if(mood==='cheer'||mood==='thinking'){void cat.offsetWidth;cat.classList.add('cat-'+mood);}}
 $('#status-live').textContent=msg;
};
const sound=(kind='ding')=>{if(!state.sound)return;try{const ctx=new (window.AudioContext||window.webkitAudioContext)();const frequencies=kind==='ding'?[660,880]:[350,294];frequencies.forEach((f,i)=>{const osc=ctx.createOscillator(),gain=ctx.createGain(),now=ctx.currentTime+i*.11;osc.type='sine';osc.frequency.setValueAtTime(f,now);gain.gain.setValueAtTime(.0001,now);gain.gain.exponentialRampToValueAtTime(.07,now+.02);gain.gain.exponentialRampToValueAtTime(.0001,now+.21);osc.connect(gain);gain.connect(ctx.destination);osc.start(now);osc.stop(now+.23)});setTimeout(()=>ctx.close(),650)}catch(e){}};
const confetti=()=>{const l=$('#confetti-layer');l.innerHTML='';if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;for(let i=0;i<35;i++){let el=document.createElement('span');el.className='confetti-piece';el.style.left=`${Math.random()*100}%`;el.style.background=['#9078f5','#ffc5da','#ffdf76','#97e8c4','#91d4fd'][i%5];el.style.setProperty('--dur',`${1.8+Math.random()*2}s`);el.style.setProperty('--rot',`${Math.random()*200}deg`);el.style.animationDelay=`${Math.random()*.8}s`;l.appendChild(el)}setTimeout(()=>l.replaceChildren(),4700)};
const catSVG=()=>`<svg class="cat-svg" viewBox="0 0 280 300" role="img" aria-label="Луня, весёлая кошечка в фиолетовой кофте, машет лапкой"><defs><linearGradient id="coat-grad" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#b7a6ff"/><stop offset="1" stop-color="#7868dd"/></linearGradient><linearGradient id="fur-grad" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#fff"/><stop offset="1" stop-color="#f3e4f3"/></linearGradient></defs><g class="cat-tail"><path d="M207 214 Q268 187 242 151 Q230 137 219 150 Q222 162 226 164 Q235 180 197 184" fill="none" stroke="#f5e3ef" stroke-width="30" stroke-linecap="round"/></g><g class="cat-body"><ellipse cx="138" cy="220" rx="72" ry="71" fill="url(#coat-grad)"/><path d="M99 224 Q140 239 176 221" fill="none" stroke="#6b5bd0" stroke-width="4" opacity=".6"/><ellipse cx="137" cy="224" rx="24" ry="28" fill="#dfd4ff"/><path d="M139 206 l6 11 12 1 -9 8 3 12 -12 -6 -11 6 2 -12 -9 -8 12 -1z" fill="#fff"/></g><path d="M88 239 q-20 30-45 9" fill="none" stroke="#f8e9f2" stroke-width="24" stroke-linecap="round"/><g class="cat-paw-wave"><ellipse cx="191" cy="174" rx="25" ry="34" transform="rotate(-35 191 174)" fill="url(#fur-grad)" stroke="#eed9ed" stroke-width="2"/><ellipse cx="197" cy="169" rx="8" ry="6" fill="#f5a9bf"/><circle cx="183" cy="153" r="4" fill="#f5a9bf"/><circle cx="196" cy="149" r="4" fill="#f5a9bf"/><circle cx="208" cy="154" r="4" fill="#f5a9bf"/></g><g class="cat-head"><path d="M55 100 L48 19 Q48 7 59 13 L115 57 Q140 44 166 54 L222 14 Q232 9 230 23 L218 102 Z" fill="url(#fur-grad)" stroke="#ead3e6" stroke-width="3"/><path d="M67 82 L61 37 L103 70" fill="#f6acc7"/><path d="M185 69 L217 37 L209 84" fill="#f6acc7"/><ellipse cx="138" cy="117" rx="100" ry="90" fill="url(#fur-grad)" stroke="#e9d3e6" stroke-width="3"/><g class="cat-eyes"><ellipse cx="101" cy="111" rx="20" ry="28" fill="#30265a"/><ellipse cx="176" cy="111" rx="20" ry="28" fill="#30265a"/><circle cx="95" cy="103" r="8" fill="#fff"/><circle cx="170" cy="103" r="8" fill="#fff"/><circle cx="109" cy="124" r="3" fill="#fff"/><circle cx="184" cy="124" r="3" fill="#fff"/></g><ellipse cx="81" cy="148" rx="18" ry="10" fill="#f8bbc9" opacity=".85"/><ellipse cx="195" cy="148" rx="18" ry="10" fill="#f8bbc9" opacity=".85"/><path d="M128 143 Q139 151 149 143 L139 139Z" fill="#dd8da5"/><path d="M138 149 Q133 165 120 155 M138 149 Q145 165 156 155" fill="none" stroke="#7d5e87" stroke-width="3" stroke-linecap="round"/><path d="M64 143 L31 136 M67 153 L32 158 M207 143 L241 136 M206 153 L243 157" stroke="#b7a2ba" stroke-width="2" stroke-linecap="round"/><path d="M102 50 Q138 33 177 50" fill="none" stroke="#f5effb" stroke-width="7"/></g><g><ellipse cx="140" cy="48" rx="43" ry="11" fill="#8270d9"/><rect x="104" y="29" width="71" height="21" rx="11" fill="#ad9ff6"/><ellipse cx="123" cy="39" rx="19" ry="11" fill="#74cde7" stroke="#6157a6" stroke-width="6"/><ellipse cx="163" cy="39" rx="19" ry="11" fill="#74cde7" stroke="#6157a6" stroke-width="6"/><path d="M111 33 L124 28 M152 33 L165 27" stroke="#f5ffff" stroke-width="3"/></g></svg>`;
const guide=(message)=>`<aside class="game-card guide-card"><div class="guide-label">🐾 Твой друг Луня</div><button class="guide-cat" type="button" id="guide-cat" data-action="hint" title="Нажми на кошечку для подсказки">${catSVG()}</button><div class="speech-bubble" id="cat-speech">${escapeHtml(catMessage||message)}</div><div class="guide-buttons"><button type="button" data-action="hint" class="btn btn-secondary small">💡 Подсказка</button><button type="button" data-action="map" class="btn btn-white small">🗺️ Карта</button></div><div class="guide-foot">Нажми на меня — я помогу!</div></aside>`;
const stars=()=>`<div class="stars" aria-label="${state.stars} звёзд">⭐ ${state.stars}</div>`;
const progress=(pct)=>`<div class="progress-track" role="progressbar" aria-label="Прогресс" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${pct}"><div class="progress-fill" style="width:${pct}%"></div></div>`;
const box=(title,desc,body,pct=0,opts={})=>`<div class="quest-layout"><section class="game-card quest-main"><div class="quest-top"><span class="step-label">${opts.boss?'🏆 Финальное испытание':`Миссия ${state.mission+1} из 6`}</span>${stars()}</div>${progress(pct)}<div class="eyebrow">${opts.boss?'Остался последний шаг!':'Вперёд, исследователь!'}</div><h1 class="mission-title">${title}</h1><p class="mission-description">${desc}</p>${body}</section>${guide(opts.boss?'Ты почти мастер ИИ!':missions[state.mission].intro)}</div>`;
const count=(n,total)=>`<span class="question-count">Задание ${n} из ${total}</span>`;
const answerBtns=(items,prefix,cols='')=>`<div class="options ${cols}">${items.map((it,i)=>`<button class="choice-btn ${feedback&&feedback.selection===i?(feedback.correct?'correct':'incorrect'):''}" data-action="${prefix}" data-value="${i}" ${feedback?'disabled':''}>${escapeHtml(it)}</button>`).join('')}</div>`;
const feedbackUI=()=>feedback?`<div class="answer-feedback ${feedback.correct?'':'try'}" role="status"><b>${feedback.correct?'🌟 Отлично!': '💜 Узнали кое-что новое!'}</b><p>${escapeHtml(feedback.why)}</p></div><div class="mission-actions"><button class="btn btn-primary" data-action="next">${feedback.nextText||'Продолжить →'}</button></div>`:'';
const award=(key,correct,pts=10)=>{if(correct&&!state.earned.includes(key)){state.earned.push(key);state.stars+=pts} save(); if(correct){sound('ding');say(['Мур-р! Как здорово получилось!','Ура, ты настоящий исследователь!','Отличная работа! Мяу!','Ты справился! Горжусь тобой!'][Math.floor(Math.random()*4)],'cheer')} else {sound('soft');say('Ничего страшного! Ошибки помогают учиться. Прочитай объяснение и идём дальше.','thinking')}};
const setFeedback=(selection,correct,why,extra={})=>{feedback={selection,correct,why,...extra};award(extra.key||`m${state.mission}-${state.round}`,correct,extra.points||10);render();};
const photoContent=()=>{const entry=photos[state.round]||photos[0];return `${count(state.round+1,photos.length)}<div class="question-box"><h2 class="question-title">${entry.q}</h2><div class="photo-grid">${entry.images.map((im,i)=>`<button data-action="photo" data-value="${i}" class="photo-tile ${feedback&&feedback.selection===i?(feedback.correct?'correct':'incorrect'):''}" ${feedback?'disabled':''}><img src="${im[0]}" alt="${escapeHtml(im[1])}" loading="eager"/><div class="tile-caption">Картинка ${i===0?'А':'Б'} ${feedback? (im[2]?'· создана ИИ':'· фотография') : ''}</div></button>`).join('')}</div><p class="photo-note">💬 Здесь использованы настоящие фотографии и заранее созданные ИИ-иллюстрации. Иногда отличить их гораздо сложнее!</p></div>${feedbackUI()}`};
const abilitiesContent=()=>{const entry=abilities[state.round]||abilities[0];return `${count(state.round+1,abilities.length)}<div class="question-box"><div class="big-emoji">${entry[0]}</div><h2 class="question-title text-center">${entry[1]}</h2><p class="muted text-center">Как ты думаешь, может ли это сделать чат-бот с искусственным интеллектом?</p>${answerBtns(['✅ Да, умеет','❌ Нет, не умеет'],'ability')}</div>${feedbackUI()}`};
const promptOptions={who:[['котика','🐱'],['дракона','🐉'],['робота','🤖'],['единорога','🦄']],where:[['в космосе','🚀'],['в волшебном лесу','🌳'],['в подводном царстве','🌊'],['на Луне','🌙']],action:[['летит на ракете','🚀'],['ищет сокровище','💎'],['танцует','💃'],['спасает друзей','🦸']],style:[['мультяшный','🎨'],['сказочный','✨'],['яркий','🌈'],['в стиле комикса','💥']]};
const promptSentence=()=>`Нарисуй ${state.selectedPrompt.style==='мультяшный'?'мультяшного':state.selectedPrompt.style==='сказочный'?'сказочного':state.selectedPrompt.style==='яркий'?'яркого':'в стиле комикса'} ${state.selectedPrompt.who}, который ${state.selectedPrompt.action} ${state.selectedPrompt.where}. Сделай картинку доброй и красочной.`;
const promptContent=()=>{
 if(state.round<2){const q=promptQuizzes[state.round];return `${count(state.round+1,3)}<div class="question-box"><h2 class="question-title">${q.q}</h2>${answerBtns(q.items,'prompt-quiz','three')}</div>${feedbackUI()}`}
 const d=state.selectedPrompt;
 return `${count(3,3)}<div class="question-box"><h2 class="question-title">Собери собственное волшебное задание!</h2><p class="muted">Выбери 4 детали — и увидишь, как из них получается точный запрос.</p><div class="prompt-grid">${Object.entries(promptOptions).map(([key,arr])=>`<div class="prompt-field"><label for="select-${key}">${({who:'Кого?',where:'Где?',action:'Что делает?',style:'В каком стиле?'})[key]}</label><select id="select-${key}" data-prompt-key="${key}">${arr.map(([val,emoji])=>`<option value="${escapeHtml(val)}" ${d[key]===val?'selected':''}>${emoji} ${escapeHtml(val)}</option>`).join('')}</select></div>`).join('')}</div><div class="prompt-result"><div><span class="micro-label">Твой запрос</span><p id="prompt-text">${escapeHtml(promptSentence())}</p></div><div class="prompt-stage"><span id="prompt-preview">${(promptOptions.who.find(x=>x[0]===d.who)||[])[1]||'🐱'}</span><small id="prompt-preview-place">${(promptOptions.where.find(x=>x[0]===d.where)||[])[1]||'🚀'} Идея для рисунка</small></div></div><span class="demo-note">Это конструктор запроса, а не подключённая нейросеть. По такому описанию можно создать изображение в настоящем ИИ-сервисе вместе со взрослым.</span></div>${state.promptMade?`<div class="answer-feedback"><b>🌟 Готово!</b><p>Ты самостоятельно создал подробный запрос. Теперь ты знаешь один из главных секретов общения с ИИ!</p></div><div class="mission-actions"><button class="btn btn-primary" data-action="next">Завершить миссию →</button></div>`:`<div class="mission-actions"><button class="btn btn-primary" data-action="make-prompt">✨ Собрать промпт!</button></div>`}`;
};
const predict=(animal)=>{if(!state.training.length)return null;let nearest=state.training.map(row=>{const source=animalTrain[row.id];const dist=source.features.reduce((s,a,i)=>s+(a-animal.features[i])**2,0);return {...row,dist}}).sort((a,b)=>a.dist-b.dist);return nearest[0].label};
const trainContent=()=>{
 let i=state.round;
 if(i<animalTrain.length){const a=animalTrain[i];return `${count(i+1,animalTrain.length+animalTest.length)}<div class="training-dots">${animalTrain.map((_,n)=>`<span class="training-dot ${n<i?'done':n===i?'active':''}"></span>`).join('')}</div><div class="question-box"><div class="train-layout"><div class="animal-frame"><div class="animal-emoji">${a.face}</div></div><div><span class="micro-label">Обучаем робота</span><h2 class="question-title">Это ${a.label}. Кто это?</h2><p class="muted">Нажми правильную подпись, чтобы Робби запомнил пример.</p>${answerBtns(['🐱 Кошка','🐶 Собака'],'train')}</div></div></div>${feedbackUI()}<p class="demo-note">Здесь робот обучается на примерах при помощи простого браузерного алгоритма, а не большой нейросети.</p>`}
 const j=i-animalTrain.length,a=animalTest[j];const guess=predict(a);const correct=guess===a.kind;return `${count(i+1,animalTrain.length+animalTest.length)}<div class="question-box"><span class="micro-label">Проверка знаний Робби</span><h2 class="question-title">Знакомься: ${a.label}</h2><div class="train-layout"><div class="animal-frame"><div class="animal-emoji">${a.face}</div></div><div><p class="muted">Я сравнил нового зверька с теми примерами, которым ты меня научил.</p><div class="robot-result">🤖 Робби думает: <strong>${guess==='cat'?'КОШКА':'СОБАКА'}</strong></div><p>${correct?'✅ Робби угадал!':'🔍 Робби ошибся. Значит, нужно внимательнее выбирать примеры для обучения.'}</p></div></div></div><div class="mission-actions"><button class="btn btn-secondary" data-action="retrain">🔄 Переобучить</button><button class="btn btn-primary" data-action="train-test-next">${j===animalTest.length-1?'Завершить миссию →':'Следующий зверёк →'}</button></div><p class="demo-note">Робби — учебная модель «ближайшего примера» на JavaScript. Настоящие нейросети могут обучаться намного сложнее.</p>`;
};
const mistakesContent=()=>{const a=mistakes[state.round];return `${count(state.round+1,mistakes.length)}<div class="question-box"><span class="micro-label">ИИ утверждает:</span><div class="quote-fact"><span>${a[0]}</span><strong>«${a[1]}»</strong></div><h2 class="question-title text-center">Можно верить этому ответу?</h2>${answerBtns(['✅ Всё верно','🔍 Есть ошибка'],'mistake')}</div>${feedbackUI()}`};
const safetyContent=()=>{const a=safety[state.round];return `${count(state.round+1,safety.length)}<div class="question-box"><span class="micro-label">Можно ли написать это в чат с ИИ?</span><div class="quote-fact"><span>${a[0]}</span><strong>«${a[1]}»</strong></div>${answerBtns(['✅ Можно','🔒 Нельзя'],'safety')}</div>${feedbackUI()}`};
const bossContent=()=>{const q=boss[Math.min(state.round,boss.length-1)];return `${count(state.round+1,boss.length)}<div class="question-box"><h2 class="question-title">${q.q}</h2>${answerBtns(q.items,'boss','three')}</div>${feedbackUI()}`};
const mainMissionContent=()=>[photoContent,abilitiesContent,promptContent,trainContent,mistakesContent,safetyContent][state.mission]();
function render(){
 document.title='НейроКвест 🐾 · Приключение с Луней';
 if(state.screen==='welcome'){
 app.innerHTML=`<section class="game-card welcome"><div class="welcome-copy"><div class="eyebrow">✦ Для любознательных детей 1–4 классов</div><h1>Нейро<span class="gradient-text">Квест</span> 🐾</h1><p class="welcome-subtitle">Подружись с искусственным интеллектом! Пройди 6 миссий, научи робота, найди секретные подсказки и стань мастером ИИ!</p><div class="welcome-features"><span class="feature-pill">🎮 Игровой формат</span><span class="feature-pill">⏱️ 30–40 минут</span><span class="feature-pill">⭐ Награды</span></div><div class="btn-row"><button class="btn btn-primary" data-action="start">🚀 ${state.completed.length?'Продолжить приключение':'Начать приключение'}</button><button class="btn btn-white" data-action="parents">👨‍👩‍👧 Родителям</button></div></div><div class="hero-art"><div class="hero-halo"></div><div class="hero-character"><div class="hero-cat-svg">${catSVG()}</div><div class="hero-hello">Привет! Я Луня!<br/>Пойдём играть? 💜</div></div><span class="float-shape one">⭐</span><span class="float-shape two">✨</span><span class="float-shape three">💜</span></div></section>`;
 }else if(state.screen==='map'){
 let idx=state.completed.length;
 app.innerHTML=`<section class="game-card quest-map"><div class="map-heading"><div class="eyebrow">🗺️ Карта приключений</div><h1>Выбирай следующую миссию!</h1><p>Луня уже приготовила для тебя задания. Проходи уровни по порядку.</p><div class="map-summary">${stars()} <span class="feature-pill">🏆 Выполнено ${state.completed.length}/6</span></div></div><div class="map-grid">${missions.map((m,i)=>{let done=state.completed.includes(i),locked=i>idx;return `<button class="map-tile ${done?'done':locked?'locked':'current'}" data-action="open-mission" data-value="${i}" ${locked?'disabled':''}><span class="map-icon">${m.icon}</span><strong>${i+1}. ${m.title}</strong><span>${m.min} · ${done?'✅ Выполнено':locked?'🔒 Откроется позже':'👉 Нажми, чтобы начать'}</span></button>`}).join('')}</div><div class="map-bottom"><div class="map-tip">🐾 ${state.completed.length===6?'Все ключи собраны! Остался финальный экзамен.':'Проходи миссии и собирай звёзды! Ошибаться не страшно.'}</div><button class="btn btn-primary" data-action="${state.completed.length===6?'open-boss':'continue-mission'}">${state.completed.length===6?'🏆 Финальное испытание →':'Продолжить приключение →'}</button></div></section>`;
 }else if(state.screen==='mission'){
 let total=[photos.length,abilities.length,3,animalTrain.length+animalTest.length,mistakes.length,safety.length][state.mission];
 let pct=Math.min(100,Math.round((state.round/total)*100));
 app.innerHTML=box(`${missions[state.mission].icon} ${missions[state.mission].title}`,missions[state.mission].desc,mainMissionContent(),pct);
 }else if(state.screen==='boss'){
 app.innerHTML=box('🏆 Финальный суперуровень','Проверь, чему ты научился! Ответь на 3 вопроса — и тебя ждёт поздравление от Луни!',bossContent(),Math.round(state.round/boss.length*100),{boss:true});
 }else if(state.screen==='final'){
 app.innerHTML=`<section class="game-card final-screen"><div class="final-celebration" aria-hidden="true"><span class="final-sparkle sparkle-left">✨</span><div class="final-cat">${catSVG()}</div><span class="final-sparkle sparkle-right">🌟</span></div><div class="eyebrow">🎉 Все миссии пройдены!</div><h1>Ура! Ты — Мастер ИИ!</h1><p class="final-message">Мяу! Ты справился со всеми испытаниями! Я тобой горжусь! 💜</p><p>Теперь ты знаешь, как задавать вопросы нейросетям, находить ошибки и беречь свои секреты. Продолжай исследовать мир ИИ!</p><div class="trophy-row"><div class="trophy">⭐ <strong>${state.stars}</strong> звёзд</div><div class="trophy">✅ <strong>6/6</strong> миссий</div><div class="trophy">🎉 <strong>Мастер</strong> ИИ</div></div><div class="btn-row centered final-restart"><button class="btn btn-secondary" data-action="restart">🔁 Пройти ещё раз</button></div><div class="final-cta"><h2>✨ Продолжим открывать мир ИИ?</h2><p>${escapeHtml(cfg.courseDescription)}</p><div class="btn-row centered">${validLink(cfg.courseUrl)?`<button class="btn btn-primary" data-action="course-link">📚 Узнать о курсе →</button>`:`<button class="btn btn-primary" data-action="parents">📚 Узнать о курсе →</button>`}<button class="btn btn-white" data-action="parents">Информация для родителей</button></div></div></section>`;
 }
 $('#sound-toggle').textContent=state.sound?'🔊':'🔇';
 if(state.screen==='mission'||state.screen==='boss'){if(feedback){say(feedback.correct?'Мур-мур! Молодец!':'Не переживай, тренируемся дальше!',feedback.correct?'cheer':'thinking')}else if(!catMessage){say(state.screen==='boss'?'Уже финишная прямая! Верю в тебя.':missions[state.mission].intro)}}
}
const validLink=(s)=>{try{const u=new URL(s);return u.protocol==='https:'||u.protocol==='http:'}catch(e){return false}};
function questionAnswer(action,val){
 if(feedback)return;
 let result=false,why='';
 if(action==='photo'){const ent=photos[state.round];result=!!ent.images[val]?.[2];why=ent.why;}
 if(action==='ability'){const a=abilities[state.round];result=(val===0)===a[2];why=a[3]}
 if(action==='prompt-quiz'){const a=promptQuizzes[state.round];result=val===a.correct;why=a.why}
 if(action==='train'){const a=animalTrain[state.round];const userKind=val===0?'cat':'dog';result=userKind===a.kind;why=result?'Верно! Робби запомнил этот пример.':'Этот пример запомнится с ошибочной подписью. Так робот может путаться!';state.training.push({id:state.round,label:userKind});save()}
 if(action==='mistake'){const a=mistakes[state.round];result=(val===0)===a[2];why=a[3]}
 if(action==='safety'){const a=safety[state.round];result=(val===0)===a[2];why=a[3]}
 if(action==='boss'){const a=boss[state.round];result=val===a.correct;why=a.why}
 setFeedback(val,result,why,{key:action+':'+(action==='boss'?'boss':state.mission)+':'+state.round,points:action==='boss'?15:10});
}
function advance(){
 feedback=null;catMessage='';catMood='normal';
 if(state.screen==='boss'){
  state.round++;
  if(state.round>=boss.length){state.screen='final';state.round=0;confetti()}
 }else if(state.screen==='mission'){
  const total=[photos.length,abilities.length,3,animalTrain.length+animalTest.length,mistakes.length,safety.length][state.mission];
  state.round++;
  if(state.round>=total){
   if(!state.completed.includes(state.mission))state.completed.push(state.mission);
   state.completed.sort((a,b)=>a-b);
   state.screen='map';state.round=0;
   confetti();
   say('Миссия выполнена! Получи воображаемую медаль! 🏅','cheer');
  }
 }
 save();render();scrollToTop();
}
const scrollToTop=()=>{window.scrollTo({top:0,behavior:'smooth'})};
function showParents(){
 const root=$('#modal-root');
 root.innerHTML=`<div class="modal-backdrop" data-action="close-modal-backdrop"><div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><button class="icon-btn modal-close" type="button" data-action="close-modal" aria-label="Закрыть">✕</button><div class="eyebrow">Родителям 💜</div><h2 id="modal-title">${escapeHtml(cfg.courseName)}</h2><p>Этот квест знакомит детей 1–4 классов с основами искусственного интеллекта через увлекательные игровые задания.</p><ul><li>Учим задавать понятные вопросы нейросетям.</li><li>Знакомимся с идеей машинного обучения.</li><li>Тренируем внимательность и проверку фактов.</li><li>Осваиваем безопасное поведение в интернете.</li></ul><p><strong>${escapeHtml(cfg.schoolName)}</strong></p><p>${escapeHtml(cfg.courseDescription)}</p><div class="btn-row">${validLink(cfg.courseUrl)?`<button class="btn btn-primary" data-action="course-link">📚 Сайт школы «Тетрика»</button>`:''}<button class="btn btn-secondary" data-action="close-modal">Закрыть</button></div></div></div>`;
 root.querySelector('.modal-close')?.focus();
}
function showHelp(){const root=$('#modal-root');root.innerHTML=`<div class="modal-backdrop" data-action="close-modal-backdrop"><div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><button class="icon-btn modal-close" data-action="close-modal">✕</button><h2 id="modal-title">🐾 Как играть</h2><p>Привет! Я Луня. Тебя ждут шесть миссий и финальный вызов!</p><ul><li>Нажимай на варианты ответов.</li><li>За правильные ответы получай звёзды ⭐</li><li>Если ошибёшься — ничего страшного, я всё объясню.</li><li>Нажимай на кошечку, когда нужна подсказка.</li><li>Можно закрыть вкладку и продолжить позже на этом же устройстве.</li><li>В конце Луня поздравит тебя с прохождением квеста!</li></ul><div class="btn-row"><button class="btn btn-primary" data-action="close-modal">Понятно!</button></div></div></div>`;root.querySelector('.modal-close')?.focus();}
function openMission(i){if(i>state.completed.length)return;state.screen='mission';state.mission=i;state.round=0;state.training=[];state.promptMade=false;feedback=null;catMessage=missions[i].intro;save();render();scrollToTop();}
function restart(){state=defaultState();feedback=null;catMessage='';save();render();scrollToTop()}
app.addEventListener('click',(event)=>{
 const btn=event.target.closest('[data-action]');if(!btn||btn.disabled)return;
 const action=btn.dataset.action,val=Number(btn.dataset.value);
 if(['photo','ability','prompt-quiz','train','mistake','safety','boss'].includes(action)){questionAnswer(action,val);return}
 if(action==='start'){state.screen='map';save();render();scrollToTop()}
 if(action==='open-mission'){openMission(val)}
 if(action==='continue-mission'){openMission(state.completed.length)}
 if(action==='next'){advance()}
 if(action==='map'){feedback=null;state.screen='map';save();catMessage='';render();scrollToTop()}
 if(action==='hint'){const text=state.screen==='boss'?'Вспомни наши три главных правила: точный запрос, проверка фактов и безопасность.':missions[state.mission].hint;say(text,'thinking')}
 if(action==='make-prompt'){state.promptMade=true;award('prompt-builder',true,15);save();render()}
 if(action==='retrain'){state.round=0;state.training=[];state.earned=state.earned.filter(key=>!key.startsWith('train:'+state.mission+':'));save();feedback=null;say('Давай начнём обучение заново. Теперь роботу будет проще!');render()}
 if(action==='train-test-next'){
  let a=animalTest[state.round-animalTrain.length];if(a){let correct=predict(a)===a.kind;award('test:'+state.round,correct,10)}advance();
 }
 if(action==='open-boss'){state.screen='boss';state.round=0;feedback=null;catMessage='У тебя всё получится!';save();render();scrollToTop()}
 if(action==='parents'){showParents()}
 if(action==='course-link'&&validLink(cfg.courseUrl)){window.open(cfg.courseUrl,'_blank','noopener,noreferrer')}
 if(action==='restart'){restart()}
});
app.addEventListener('change',event=>{
 const select=event.target.closest('[data-prompt-key]');if(!select)return;
 const key=select.dataset.promptKey;
 if(Object.prototype.hasOwnProperty.call(promptOptions,key) && promptOptions[key].some(row=>row[0]===select.value)){
  state.selectedPrompt[key]=select.value;save();
  const text=$('#prompt-text');if(text)text.textContent=promptSentence();
  const face=$('#prompt-preview'),place=$('#prompt-preview-place');
  if(face)face.textContent=(promptOptions.who.find(x=>x[0]===state.selectedPrompt.who)||[])[1]||'🐱';
  if(place)place.textContent=(promptOptions.where.find(x=>x[0]===state.selectedPrompt.where)||[])[1]+' Идея для рисунка';
 }
});
$('#brand-link').addEventListener('click',event=>{event.preventDefault();state.screen='welcome';feedback=null;catMessage='';save();render()});
$('#sound-toggle').addEventListener('click',()=>{state.sound=!state.sound;save();$('#sound-toggle').textContent=state.sound?'🔊':'🔇';if(state.sound)sound()});
$('#help-btn').addEventListener('click',showHelp);
$('#parent-link').addEventListener('click',showParents);
$('#modal-root').addEventListener('click',event=>{const btn=event.target.closest('[data-action]');if(!btn)return;const action=btn.dataset.action;if(action==='close-modal'||(action==='close-modal-backdrop'&&event.target===btn))$('#modal-root').innerHTML='';if(action==='course-link'&&validLink(cfg.courseUrl))window.open(cfg.courseUrl,'_blank','noopener,noreferrer')});
document.addEventListener('keydown',event=>{if(event.key==='Escape')$('#modal-root').innerHTML=''});
render();
})();
