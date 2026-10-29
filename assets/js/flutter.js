// 페이지 전체를 천천히 날아다니는 작은 나비 (클릭 통과, 움직임 줄이기 설정이면 끔)
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const layer = document.createElement('div');
  layer.className = 'flutter-layer';
  layer.setAttribute('aria-hidden', 'true');
  document.body.appendChild(layer);

  const tints = ['hue-rotate(185deg) saturate(1.6)', 'hue-rotate(185deg) saturate(1.6)', 'none', 'hue-rotate(35deg) saturate(1.4)'];
  const rand = (a, b) => a + Math.random() * (b - a);
  const count = innerWidth < 768 ? 2 : 3;
  const flies = [];

  function spawn(f, first) {
    const W = innerWidth, H = innerHeight;
    const fromLeft = Math.random() < .5;
    f.x = first ? rand(0, W) : (fromLeft ? -40 : W + 40);
    f.y = rand(H * .12, H * .8);
    f.heading = fromLeft ? rand(-.4, .4) : Math.PI + rand(-.4, .4);
    f.speed = rand(38, 64);
    f.phase = rand(0, Math.PI * 2);
    f.turn = 0;
    f.wait = first ? rand(0, 2500) : rand(2500, 9000);
    const s = Math.round(rand(20, innerWidth < 768 ? 26 : 32));
    f.el.style.setProperty('--s', s + 'px');
    f.el.style.setProperty('--o', rand(.75, .95).toFixed(2));
    f.el.style.setProperty('--sp', rand(.6, .95).toFixed(2) + 's');
    f.el.style.setProperty('--f', tints[Math.floor(Math.random() * tints.length)]);
    f.el.classList.remove('is-on');
  }

  for (let i = 0; i < count; i++) {
    const el = document.createElement('span');
    el.className = 'flutter';
    el.innerHTML = '<span class="bfs"></span>';
    layer.appendChild(el);
    const f = { el };
    spawn(f, true);
    flies.push(f);
  }

  let last = performance.now();
  function tick(now) {
    const dt = Math.min((now - last) / 1000, .05);
    last = now;
    const W = innerWidth, H = innerHeight;
    for (const f of flies) {
      if (f.wait > 0) { f.wait -= dt * 1000; continue; }
      if (!f.el.classList.contains('is-on')) f.el.classList.add('is-on');
      // 방향을 조금씩 바꾸며 위아래로 하늘거림
      f.turn += rand(-1, 1) * dt * 2.2;
      f.turn *= .97;
      f.heading += f.turn * dt;
      if (f.y < H * .08) f.heading += .6 * dt * Math.sign(Math.cos(f.heading) || 1);
      if (f.y > H * .88) f.heading -= .6 * dt * Math.sign(Math.cos(f.heading) || 1);
      f.phase += dt * 5;
      const vx = Math.cos(f.heading) * f.speed;
      const vy = Math.sin(f.heading) * f.speed + Math.sin(f.phase) * 22;
      f.x += vx * dt;
      f.y += vy * dt;
      const tilt = Math.max(-28, Math.min(28, vx / f.speed * 22 + vy / f.speed * 6));
      f.el.style.transform = `translate3d(${f.x.toFixed(1)}px, ${f.y.toFixed(1)}px, 0) rotate(${tilt.toFixed(1)}deg)`;
      if (f.x < -80 || f.x > W + 80 || f.y < -80 || f.y > H + 80) spawn(f, false);
    }
    raf = requestAnimationFrame(tick);
  }
  let raf = requestAnimationFrame(tick);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(raf);
    else { last = performance.now(); raf = requestAnimationFrame(tick); }
  });
})();
