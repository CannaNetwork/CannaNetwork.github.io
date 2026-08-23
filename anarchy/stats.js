const bytes = n => n ? `${(n / 1024 / 1024 / 1024).toFixed(1)} GB` : '--';
const uptime = s => {
  s = Number(s || 0);
  const d = Math.floor(s / 86400), h = Math.floor(s % 86400 / 3600), m = Math.floor(s % 3600 / 60);
  return d ? `${d}d ${h}h` : h ? `${h}h ${m}m` : `${m}m`;
};
const set = (key, value) => document.querySelector(`[data-${key}]`).textContent = value;

fetch('../data/server-status.json', { cache: 'no-store' })
  .then(r => { if (!r.ok) throw Error(); return r.json(); })
  .then(data => {
    const s = data.server || {}, sys = data.system || {}, online = data.ok && s.online;
    set('status', online ? 'Online' : 'Offline');
    set('players', `${s.currentPlayers || 0}/${s.maxPlayers || 0}`);
    // Folia has independent region ticks, so a single TPS/MSPT is not meaningful.
    set('tps', s.tps?.oneMinute ? Number(s.tps.oneMinute).toFixed(2) : 'Folia N/A');
    set('mspt', s.mspt?.average ? `${Number(s.mspt.average).toFixed(1)} ms` : 'Folia N/A');
    set('ram', `${bytes(sys.ram?.usedBytes)} / ${bytes(sys.ram?.maxBytes)}`);
    set('cpu', sys.cpu?.systemLoad !== undefined ? Number(sys.cpu.systemLoad).toFixed(1) : '--');
    set('uptime', uptime(s.uptimeSeconds));
    set('version', s.minecraftVersion || '--');
    set('updated', data.snapshotTime ? `Updated ${new Date(data.snapshotTime).toLocaleString()}` : 'Waiting for the first snapshot…');

    const list = document.querySelector('[data-player-list]');
    list.innerHTML = '';
    const players = data.players || [];
    if (!players.length) list.textContent = 'Nobody is online right now.';
    players.forEach(p => {
      const el = document.createElement('div');
      el.className = 'player';
      el.innerHTML = `<div><strong>${p.username}</strong><span>Online</span></div><b>${p.ping ?? '--'}ms</b>`;
      list.append(el);
    });
  })
  .catch(() => {
    set('status', 'Offline');
    document.querySelector('[data-player-list]').textContent = 'No status snapshot is available yet.';
  });
