const $ = id => document.getElementById(id);
const el = (tag, cls = '', text = '') => { const node = document.createElement(tag); node.className = cls; node.textContent = text; return node; };
const still = matchMedia('(prefers-reduced-motion: reduce)').matches, small = matchMedia('(max-width: 759px)');
const hero = $('hero'), room = $('room'), floor = $('floor'), stage = $('stage'), dock = $('dock');
// Khung hình trong assets/atlas.png (tranh của mẫu "Văn phòng Agent" trong app): [x, y, rộng, cao, neo x, neo y], đơn vị là điểm ảnh của tranh.
const F = {"desk":[172,240,64,45,32,45],"chair":[362,240,26,39,13,39],"mini":[329,240,32,43,16,43],"kid.codex.front":[313,286,28,28,14,28],"kid.codex.back":[286,286,26,28,13,28],"plant":[586,193,28,46,14,46],"lamp":[91,1,24,73,12,73],"sofa":[116,1,112,50,56,50],"coffee":[229,1,32,48,16,48],"c1.codex.sit":[741,240,22,32,11,32],"c1.codex.wave0":[222,193,28,46,14,46],"c1.codex.wave1":[251,193,30,46,15,46],"c1.codex.front":[47,193,20,46,10,46],"c1.codex.sofaDrink":[126,240,22,45,11,45],"c1.claude.sit":[685,240,22,32,11,32],"c1.claude.wave0":[673,146,28,46,14,46],"c1.claude.wave1":[702,146,30,46,15,46],"c1.claude.front":[498,146,20,46,10,46],"c1.claude.sofaDrink":[103,240,22,45,11,45],"c0.claude.sit":[449,240,24,32,12,32],"c0.claude.wave0":[115,99,32,46,16,46],"c0.claude.wave1":[148,99,38,46,19,46],"c0.claude.front":[685,1,24,46,12,46],"c0.claude.sofaDrink":[692,193,26,45,13,45],"c1.antigravity.sit":[629,240,22,32,11,32],"c1.antigravity.wave0":[369,146,28,46,14,46],"c1.antigravity.wave1":[398,146,30,46,15,46],"c1.antigravity.front":[194,146,20,46,10,46],"c1.antigravity.sofaDrink":[80,240,22,45,11,45],"c0.codex.sit":[509,240,24,32,12,32],"c0.codex.wave0":[459,99,32,46,16,46],"c0.codex.wave1":[492,99,38,46,19,46],"c0.codex.front":[266,99,24,46,12,46],"c0.codex.sofaDrink":[1,240,26,45,13,45]};

// Một hình pixel đặt theo điểm neo (giữa đáy), lệch (dx, dy) điểm ảnh tranh so với gốc; k là số lần phóng.
function sp(name, dx = 0, dy = 0, cls = '', k = 3, placed = true) {
  const [x, y, w, h, ax, ay] = F[name], node = el('i', 'sp ' + cls);
  node.style.cssText = `width:${w * k}px;height:${h * k}px;background-size:${768 * k}px auto;background-position:${-x * k}px ${-y * k}px;` + (placed ? `left:${(dx - ax) * k}px;top:${(dy - ay) * k}px` : '');
  return node;
}

/* ───── Văn phòng ở phần mở đầu ───── */
const LAYOUT = {
  wide: { w: 1440, h: 500, floor: [1500, 760, -50], at: [[215, 300], [590, 440], [920, 300], [1250, 440]], desk: -14, stand: 34,
    decor: [['plant', 50, 200], ['lamp', 420, 110], ['sofa', 735, 85], ['coffee', 1100, 105], ['plant', 1450, 210]] },
  // Màn hẹp: sàn nằm phẳng, bốn bàn xếp hai hàng hai cột, bóng thoại canh giữa cột.
  narrow: { w: 700, h: 930, flat: true, floor: [700, 930, 0], at: [[175, 380], [525, 380], [175, 830], [525, 830]], desk: -20, stand: 28, decor: [] },
};
const LABEL = { run: 'ĐANG LÀM', approve: 'CẦN DUYỆT', ask: 'CÓ CÂU HỎI', done: 'VỪA XONG', idle: 'RẢNH', stopped: 'ĐÃ DỪNG', denied: 'ĐÃ TỪ CHỐI' };
// Trong app, dấu "!" là "cần bạn" (chờ duyệt, chờ trả lời, hoặc lượt bị lỗi) và dấu "✓" là vừa xong, chưa xem.
const MARK = { approve: '! ', ask: '! ', done: '✓ ' };
// Kịch bản mẫu. Câu hỏi và yêu cầu duyệt đến từ Claude Code, vì đó là những thứ app hiện thành thẻ để trả lời.
const start = () => [
  { id: 'codex', who: 'CODEX', task: 'Viết test cho giỏ hàng', look: 'c1.codex', state: 'run', kid: true, steps: ['Đang đọc src/cart.js', 'Đang viết test/cart.test.js', 'Đang chờ agent con chạy test', 'Đang sửa test/cart.test.js'] },
  { id: 'claude', who: 'CLAUDE CODE', task: 'Sửa giá sau giảm', look: 'c0.claude', state: 'approve', short: 'Sửa src/price.js' },
  { id: 'claude2', who: 'CLAUDE CODE', task: 'Thêm mã giảm giá', look: 'c1.claude', state: 'ask', short: 'Mã hết hạn thì làm gì?' },
  { id: 'anti', who: 'ANTIGRAVITY', task: 'Dọn README', look: 'c1.antigravity', state: 'done', result: 'Đã gọn README · 52s', last: 'Đã rút gọn README. Mục Cài đặt vẫn ở đó.' },
];
let agents = start(), opened = '', mode = '', shown = '', focus = '', touched = false, sofa = null;
const waiting = a => a.state === 'approve' || a.state === 'ask';
const opens = a => waiting(a) || a.state === 'done' || a.state === 'run';
// Ô đếm theo cách app đếm: cần bạn, vừa xong, đang làm, rảnh. Agent vừa bị dừng hay bị từ chối đứng lại một lát rồi mới ra sofa, lúc đó chưa tính là rảnh.
const kind = a => waiting(a) ? 'need' : a.state === 'done' ? 'fresh' : a.state === 'run' ? 'run' : a.state === 'idle' ? 'idle' : 'halt';
const mark = a => MARK[a.state] || '';

// Thẻ mở ra từ bóng thoại của Agent (màn hẹp thì nằm dưới cảnh): duyệt, trả lời, đánh dấu đã xem, hoặc dừng.
function request(a) {
  const box = el('div', 'req');
  const button = (text, run, cls = '') => { const one = el('button', cls, text); one.onclick = () => { touched = true; run(); focusCard(); }; box.append(one); };
  if (a.state === 'approve') {
    box.innerHTML = '<h4>Claude muốn sửa <code>src/price.js</code></h4><div class="diff"><span class="d">  return price * discount</span>\n<span class="a">  return price * (1 - discount)</span></div>';
    button('Có', () => work(a, ['Đang sửa src/price.js', 'Đang chạy node test'], 'Bốn test qua · 38s', 'Đã sửa công thức giá sau giảm. Bốn test đều qua.'), 'yes');
    button('Không', () => rest(a, 'denied'));
  } else if (a.state === 'ask') {
    box.append(el('h4', '', 'Mã giảm giá đã hết hạn thì nên làm gì?'));
    button('Báo lỗi cho người mua', () => work(a, ['Đang sửa src/discount.js', 'Đang chạy node test'], 'Năm test qua · 31s', 'Mã hết hạn giờ báo lỗi cho người mua. Năm test đều qua.'));
    button('Bỏ qua mã đó', () => work(a, ['Đang sửa src/discount.js', 'Đang chạy node test'], 'Năm test qua · 29s', 'Mã hết hạn giờ được bỏ qua, giá giữ nguyên. Năm test đều qua.'));
  } else if (a.state === 'done') {
    box.append(el('h4', '', a.last));
    button('Đánh dấu đã xem', () => { a.state = 'idle'; settle(a); });
  } else {
    box.append(el('h4', '', `“${a.task}” đang chạy.`));
    button('Dừng', () => { a.kid = false; rest(a, 'stopped'); });
  }
  return box;
}
// Lượt bị dừng hay bị từ chối thì kết thúc: Agent đứng lại báo một câu, rồi ra sofa như mọi Agent rảnh.
function rest(a, state) {
  clearTimeout(a.timer); a.state = state; settle(a);
  a.timer = setTimeout(() => { a.state = 'idle'; settle(a); }, still ? 0 : 2600);
}
// Đưa con trỏ bàn phím vào thẻ đang mở, để người dùng bàn phím không bị rơi ra đầu trang sau mỗi lần cảnh vẽ lại.
function focusCard() {
  const first = (mode === 'wide' ? floor.querySelector('.bub.open .req button') : dock.querySelector('.req button'));
  if (first) first.focus({ preventScroll: true });
}
// Sau khi được trả lời, Agent quay lại bàn làm tiếp rồi báo xong. Hẹn giờ này không bị vẽ lại làm mất.
function work(a, steps, result, last) {
  a.state = 'run'; a.steps = steps; settle(a);
  clearTimeout(a.timer);
  a.timer = setTimeout(() => { a.state = 'done'; a.result = result; a.last = last; settle(a); }, still ? 0 : steps.length * 1700);
}
function settle(a) { if (opened === a.id) opened = ''; paint(a); update(); }

function link(x0, y0, x1, y1) {
  const line = el('i', 'link');
  line.style.cssText = `left:${x0}px;top:${y0}px;width:${Math.hypot(x1 - x0, y1 - y0)}px;transform:rotate(${Math.atan2(y1 - y0, x1 - x0)}rad)`;
  line.append(el('i'));
  return line;
}
// Agent rảnh ra sofa ngồi (màn hẹp không có sofa thì đứng mờ cạnh bàn).
function seat() {
  if (!sofa) return;
  sofa.querySelectorAll('.guest').forEach(node => node.remove());
  agents.filter(a => a.state === 'idle').forEach((a, n) => sofa.append(sp(a.look + '.sofaDrink', [0, -34, 34][n % 3], -6, 'guest')));
}
function paint(a) {
  (a.anim || []).forEach(clearInterval); a.anim = [];
  const st = a.el, bb = el('div', 'bb'), plan = LAYOUT[mode], sits = a.state === 'run', needs = waiting(a), child = a.kid && sits;
  st.className = 'st ' + a.state + (needs ? ' wait' : '') + (focus && kind(a) !== focus ? ' dim' : '');
  st.replaceChildren(el('i', 'pool'), bb);
  bb.append(sp('desk', plan.desk, -24));
  if (sits || needs || a.state === 'done') {
    const screen = el('div', 'screen ' + (sits ? 'run' : needs ? 'wait' : 'done'), mark(a).trim());
    screen.style.cssText = `left:${(plan.desk - 13) * 3}px;top:-201px;width:75px;height:33px`;
    bb.append(screen);
  }
  if (sits) bb.append(sp(a.look + '.sit', plan.desk, -42, 'typing'));
  bb.append(sp('chair', plan.desk, -8));
  if (needs) {
    const frames = [sp(a.look + '.wave0', plan.stand, -2), sp(a.look + '.wave1', plan.stand, -2)];
    frames[1].hidden = true; bb.append(...frames);
    if (!still) a.anim.push(setInterval(() => { frames[0].hidden = !frames[0].hidden; frames[1].hidden = !frames[1].hidden; }, 380));
  } else if (!sits && !(a.state === 'idle' && sofa)) bb.append(sp(a.look + '.front', plan.stand, -2, a.state === 'idle' ? 'rest' : ''));
  if (child) {
    // Agent con ngồi bàn phụ cạnh Agent đã gọi nó, có đường nối giữa hai bên (như mẫu Văn phòng Agent của app).
    const cx = plan.stand + 8, eye = el('div', 'screen run');
    eye.style.cssText = `left:${(cx - 9) * 3}px;top:-159px;width:54px;height:33px`;
    bb.append(sp('mini', cx, -12), eye, sp('kid.codex.back', cx, 0, 'bob'), link(plan.desk * 3 + 34, -150, cx * 3 - 24, -74));
  }
  const tag = el('div', 'tag', a.who); tag.append(el('small', '', LABEL[a.state] + (child ? ' · 1 AGENT CON' : ''))); bb.append(tag);
  seat();
  if (a.state === 'idle') return;

  const words = sits ? a.steps[0] : needs ? a.short : a.state === 'done' ? a.result : a.state === 'stopped' ? 'Đã dừng lượt này.' : 'Không sửa gì.';
  const bub = el('div', 'bub'), short = el('span', 'short' + (sits ? ' live' : ''), words);
  bub.style.cssText = plan.flat ? 'left:0;bottom:219px' : sits ? `left:${plan.desk * 3}px;bottom:219px` : `left:${plan.stand * 3}px;bottom:156px`;
  if (!plan.flat && a.n === agents.length - 1) bub.classList.add('rightmost');
  if (!plan.flat && !a.n) bub.classList.add('leftmost');
  if (plan.flat) bub.classList.add('wrap');
  bub.append(el('b', '', mark(a) + LABEL[a.state]), short);
  if (sits && !still) { let n = 0; a.anim.push(setInterval(() => { short.textContent = a.steps[++n % a.steps.length]; }, 1700)); }
  if (opens(a)) {
    bub.classList.add('can'); bub.tabIndex = 0; bub.setAttribute('role', 'button');
    bub.setAttribute('aria-label', `${a.who}: ${LABEL[a.state].toLowerCase()}. ${words}`);
    const pick = () => {
      if (opened === a.id) return;
      opened = a.id; agents.forEach(paint); showDock(); focusCard();
      // Màn hẹp: thẻ nằm dưới cảnh, có thể đang ở ngoài màn hình.
      if (mode === 'narrow') dock.scrollIntoView({ block: 'nearest', behavior: still ? 'auto' : 'smooth' });
    };
    bub.onclick = pick; bub.onkeydown = event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); pick(); } };
    if (opened === a.id && mode === 'wide') { bub.classList.add('open', 's-' + a.state); if (!a.n) bub.classList.add('right'); bub.append(request(a)); bub.onclick = null; bub.removeAttribute('role'); bub.removeAttribute('aria-label'); bub.tabIndex = -1; }
  }
  bb.append(bub);
}
function showDock() {
  const a = agents.find(one => one.id === opened && opens(one));
  dock.hidden = !(a && mode === 'narrow');
  if (dock.hidden) return;
  dock.classList.toggle('plain', !waiting(a));
  dock.replaceChildren(el('b', '', a.who + ' · ' + mark(a) + LABEL[a.state]), request(a));
}

// Chữ hiện ra kiểu giải mã.
function decode(node, text) {
  if (still) { node.textContent = text; return; }
  const glyphs = '01<>/|=+-_#', from = performance.now(), turn = node.turn = (node.turn || 0) + 1;
  (function tick(now) {
    if (node.turn !== turn) return;
    const k = Math.min(1, (now - from) / 650), cut = Math.floor(text.length * k);
    node.textContent = text.slice(0, cut) + [...text.slice(cut)].map(ch => ch === ' ' ? ' ' : glyphs[Math.random() * glyphs.length | 0]).join('');
    if (k < 1) requestAnimationFrame(tick);
  })(from);
  // Trình duyệt ngừng vẽ khi thẻ ở nền; chữ thật vẫn phải hiện ra.
  setTimeout(() => { if (node.turn === turn) { node.turn++; node.textContent = text; } }, 1200);
}
// Tiêu đề đếm số Agent đang chờ. Khi không còn ai chờ, cả trang hết màu hổ phách.
function update() {
  const left = agents.filter(waiting), count = k => agents.filter(a => kind(a) === k).length, current = agents.find(a => a.id === opened);
  let redraw = false;
  if (!current || !opens(current)) { const next = left[0] ? left[0].id : ''; if (next !== opened) { opened = next; redraw = true; } }
  if (focus && !count(focus)) { focus = ''; redraw = true; }
  if (redraw) agents.forEach(paint);
  const head = ['Không ai phải chờ bạn.', 'Một đang chờ bạn.', 'Hai đang chờ bạn.'][left.length];
  document.body.classList.toggle('calm', !left.length);
  if (head !== shown) { shown = head; decode($('needs'), head); $('say').textContent = 'Bốn agent, một cửa sổ. ' + head; }
  // Hàng đếm như trong app: bấm một ô để làm nổi các Agent đó, bấm lại để bỏ.
  const kids = agents.filter(a => a.kid && a.state === 'run').length;
  $('chips').replaceChildren(...[['need', 'Cần bạn'], ['fresh', 'Vừa xong'], ['run', 'Đang làm' + (kids ? ' · ' + kids + ' agent con' : '')], ['idle', 'Rảnh']].filter(([k]) => count(k)).map(([k, text]) => {
    const chip = el('button', 'chip ' + k + (focus === k ? ' on' : ''), count(k) + ' ' + text);
    chip.setAttribute('aria-pressed', focus === k);
    chip.onclick = () => { focus = focus === k ? '' : k; agents.forEach(paint); update(); };
    return chip;
  }));
  $('again').hidden = !touched; $('hint').hidden = touched;
  showDock();
}

function build() {
  const next = small.matches ? 'narrow' : 'wide', plan = LAYOUT[next], fit = Math.min(1, room.clientWidth / plan.w);
  // Thẻ mở ra từ Agent ở hàng sau giữ nguyên cỡ khi cảnh thu nhỏ, nên cảnh lùi xuống vừa đủ để thẻ không đè lên chữ và nút phía trên.
  const lift = plan.flat ? 0 : Math.max(0, 160 - 126 * fit);
  stage.style.cssText = `width:${plan.w}px;height:${plan.h}px;margin-left:${-plan.w / 2}px;top:${lift}px;--fit:${fit};--inv:${1 / fit}`;
  room.style.height = plan.h * fit + lift + 'px';
  if (next === mode) return;
  mode = next; hero.classList.toggle('flat', !!plan.flat);
  floor.style.cssText = `width:${plan.floor[0]}px;height:${plan.floor[1]}px;margin-left:${-plan.floor[0] / 2}px;top:${plan.floor[2]}px` + (plan.flat ? ';--rx:0deg' : '');
  floor.replaceChildren(el('div', 'tiles')); sofa = null;
  for (const [name, x, y] of plan.decor) {
    const st = el('div', 'st decor'), bb = el('div', 'bb'); st.style.cssText = `left:${x}px;top:${y}px`; bb.append(sp(name)); st.append(bb); floor.append(st); if (name === 'sofa') sofa = bb;
  }
  agents.forEach((a, n) => { a.n = n; a.el = el('div', 'st'); a.el.style.cssText = `left:${plan.at[n][0]}px;top:${plan.at[n][1]}px`; floor.append(a.el); paint(a); });
  update();
}
addEventListener('resize', build);
hero.addEventListener('pointermove', event => {
  if (still || LAYOUT[mode].flat || event.pointerType === 'touch') return;
  const box = hero.getBoundingClientRect(), x = (event.clientX - box.left) / box.width - .5, y = (event.clientY - box.top) / box.height - .5;
  floor.style.setProperty('--rz', (x * -7) + 'deg'); floor.style.setProperty('--rx', (58 - y * 7) + 'deg');
});
$('again').onclick = () => {
  const old = agents;
  old.forEach(a => { (a.anim || []).forEach(clearInterval); clearTimeout(a.timer); });
  agents = start(); agents.forEach((a, n) => { a.n = n; a.el = old[n].el; });
  opened = ''; focus = ''; touched = false; agents.forEach(paint); update();
};

// Chú giải, theo chú thích của mẫu "Văn phòng Agent" trong app: cần bạn, vừa xong, đang gọi agent con, đang làm, rảnh, chưa rõ.
for (const [frame, title, text, cls] of [['c1.codex.sit', 'Đang làm', 'Ngồi gõ ở bàn, màn hình chạy chữ.'], ['kid.codex.front', 'Đang gọi agent con', 'Robot ngồi bàn phụ, có đường nối về agent đã gọi nó.'],
  ['c0.claude.wave1', 'Cần bạn', 'Đứng vẫy tay, có dấu\u00a0!: chờ bạn duyệt, trả lời, hoặc lượt bị lỗi.'], ['c1.antigravity.front', 'Vừa xong', 'Dấu ✓ còn đó tới khi bạn mở xem.'],
  ['c1.claude.sofaDrink', 'Rảnh', 'Rời bàn: ra sofa, đi lại, uống cà phê.'], ['c0.codex.front', 'Chưa rõ', 'App chưa đọc được trạng thái; nhân vật mờ đi.', 'rest']]) {
  const item = el('div'), words = el('span'), pic = el('span', 'pic'); words.append(el('b', '', title), text); pic.append(sp(frame, 0, 0, cls || '', 2, false)); item.append(pic, words); $('legend').append(item);
}

/* ───── Hai mẫu có chuyển động theo kịch bản: Dừng và Tiếp ───── */
// Một lượt đang chạy trong khung nhỏ: từng bước hiện "Đang…" rồi đổi thành "Đã…".
function turnPlayer(log, state, steps, { after, loop = true } = {}) {
  let timers = [];
  const line = (text, cls = '') => log.appendChild(el('li', cls, text));
  const wait = (ms, run) => timers.push(setTimeout(run, ms));
  function turn() {
    log.textContent = ''; state.textContent = 'ĐANG CHẠY'; log.parentNode.classList.remove('halted');
    if (still) { steps.forEach(step => line(step[1])); if (after) after({ line, wait, at: 0, still: true }); return; }
    let at = 400;
    for (const [doing, done, ms] of steps) { let li; wait(at, () => { li = line(doing, 'now'); }); wait(at += ms, () => { li.textContent = done; li.className = ''; }); at += 300; }
    if (after) at = after({ line, wait, at }) || at;
    if (loop) wait(at + 900, turn);
  }
  return { start() { this.stop(); turn(); }, stop() { timers.forEach(clearTimeout); timers = []; }, line };
}
const solo = turnPlayer($('sololog'), $('solostate'), [['Đang đọc README.md', 'Đã đọc README.md', 1200], ['Đang sửa README.md', 'Đã sửa README.md +4 −12', 1700], ['Đang chạy npm test', 'Đã chạy npm test', 1500]]);
solo.start();
$('stop').onclick = () => {
  const halted = $('solo').classList.contains('halted');
  if (halted) solo.start();
  else { solo.stop(); $('sololog').querySelectorAll('.now').forEach(li => { li.className = ''; }); solo.line('Đã dừng lượt này.', 'end'); $('solostate').textContent = 'ĐÃ DỪNG'; $('solo').classList.add('halted'); }
  $('stop').textContent = halted ? 'Dừng' : 'Chạy lại';
};
// Mẫu "Tiếp": lượt đang chạy, một tin mới được gõ và gửi, việc đi tiếp theo tin đó.
const MORE = 'Thêm test cho trường hợp giảm giá âm';
const duo = turnPlayer($('duolog'), $('duostate'), [['Đang đọc src/cart.js', 'Đã đọc src/cart.js', 1100]], {
  after({ line, wait, at, still: fixed }) {
    const box = $('duobox'), text = $('duotext');
    text.textContent = ''; text.className = ''; box.classList.remove('ready');
    if (fixed) { line(MORE, 'you'); line('Đã sửa test/cart.test.js +18'); $('duostate').textContent = 'ĐÃ XONG'; return 0; }
    let now;
    wait(at, () => { now = line('Đang viết test/cart.test.js', 'now'); });
    [...MORE].forEach((ch, n) => wait(at + 700 + n * 55, () => { text.className = 'typing-now'; text.textContent += ch; box.classList.add('ready'); }));
    at += 700 + MORE.length * 55 + 600;
    wait(at, () => { text.textContent = ''; text.className = ''; box.classList.remove('ready'); line(MORE, 'you'); });
    wait(at += 1500, () => { now.textContent = 'Đã viết test/cart.test.js'; now.className = ''; now = line('Đang thêm test giảm giá âm', 'now'); });
    wait(at += 1900, () => { now.textContent = 'Đã sửa test/cart.test.js +18'; now.className = ''; line('Xong · bảy test qua', 'end'); $('duostate').textContent = 'ĐÃ XONG'; });
    return at + 1800;
  },
});
duo.start();

/* ───── Hình pixel ở mục "Cách hoạt động" và cuối trang ───── */
document.querySelectorAll('[data-cast]').forEach(node => node.dataset.cast.split(' ').forEach(name => node.append(sp(name, 0, 0, '', 1.5, false))));
$('lounge').append(sp('plant', -150, 0, 'dimmed'), sp('lamp', -92, 0, 'dimmed'), sp('sofa', 0, 0, 'dimmed'), sp('c0.claude.sofaDrink', -34, -6, 'guest'), sp('c1.codex.sofaDrink', 0, -6, 'guest'), sp('c1.antigravity.sofaDrink', 34, -6, 'guest'), sp('coffee', 96, 0, 'dimmed'), sp('plant', 150, 0, 'dimmed'));

/* ───── Phim: bốn phần, bấm để nhảy tới ───── */
const film = $('film'), parts = [...document.querySelectorAll('.chapter')];
// Giây bắt đầu của từng phần trong assets/film.mp4.
const CHAPTERS = { thay: 0, duyet: 18, dung: 38, tiep: 52 };
parts.forEach(part => {
  part.onclick = () => {
    const go = () => { film.currentTime = CHAPTERS[part.dataset.id]; film.play(); };
    if (film.readyState >= 1) go(); else { film.addEventListener('loadedmetadata', go, { once: true }); film.load(); }
  };
});
film.addEventListener('timeupdate', () => {
  let on = -1;
  parts.forEach((part, n) => { if (film.currentTime >= CHAPTERS[part.dataset.id]) on = n; });
  parts.forEach((part, n) => part.classList.toggle('on', n === on && (film.currentTime > 0 || !film.paused)));
});

/* ───── Hiện dần khi cuộn tới ───── */
if ('IntersectionObserver' in window && !still) {
  const seen = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('in'); seen.unobserve(entry.target);
    if (entry.target.id === 'tai') decode($('lastline'), $('lastline').textContent);
  }), { threshold: .12, rootMargin: '0px 0px -6% 0px' });
  document.querySelectorAll('.reveal, #tai').forEach(node => seen.observe(node));
} else document.querySelectorAll('.reveal').forEach(node => node.classList.add('in'));

/* ───── Số bản, cỡ tệp và mã SHA-256 lấy từ bản phát hành mới nhất trên GitHub; không lấy được thì giữ số ghi sẵn ───── */
(async () => {
  const show = info => { for (const key of ['version', 'size', 'sha']) if (info[key]) document.querySelectorAll(`[data-rel="${key}"]`).forEach(node => { node.textContent = info[key]; }); };
  // Nhớ trong phiên này để mỗi lần tải lại trang không hỏi GitHub nữa (GitHub giới hạn số lần hỏi theo giờ).
  try { const kept = JSON.parse(sessionStorage.getItem('aw-release') || 'null'); if (kept) { show(kept); return; } } catch { /* không có bộ nhớ phiên cũng không sao */ }
  try {
    const reply = await fetch('https://api.github.com/repos/dat08101999/agent-workspace/releases/latest', { headers: { Accept: 'application/vnd.github+json' } });
    if (!reply.ok) return;
    const release = await reply.json(), asset = (release.assets || []).find(one => one.name === 'Agent-Workspace-arm64.dmg');
    if (!asset) return;
    const info = { version: String(release.tag_name || '').replace(/^v/, ''), size: Math.round(asset.size / 1e6) + ' MB', sha: String(asset.digest || '').replace(/^sha256:/, '') };
    show(info);
    try { sessionStorage.setItem('aw-release', JSON.stringify(info)); } catch { /* như trên */ }
  } catch { /* Trang vẫn đúng với số ghi sẵn. */ }
})();

decode($('line1'), 'Bốn agent, một cửa sổ.');
build();
