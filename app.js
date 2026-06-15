const APP_VERSION = '2026-06-15 v88'

// ── Supabase ──────────────────────────────────────────────
const SUPABASE_URL = 'https://wwrhyxeuoxxuhtrawkhg.supabase.co'
const SUPABASE_KEY = 'sb_publishable_ZcpwyXIaecTytq1cu8qX1Q_EovV5xtV'
const { createClient } = supabase
const db = createClient(SUPABASE_URL, SUPABASE_KEY)

// ── Strava ────────────────────────────────────────────────
const STRAVA_CLIENT_ID     = '256334'
const STRAVA_CLIENT_SECRET = '5b2aff384b879707ac27575f77f32b2f389e0abe'
const STRAVA_REDIRECT_URI  = 'https://robcay75.github.io/personal-coach/'

// ── State ─────────────────────────────────────────────────
let currentUser = null
let profile = null
let currentTab = 'home'
let ciMode = 'morning'
let includeExercise = true
let healthScore = 0
let mealPortion = 'M'
let sleepQuality = 0
let bodyFeeling = 0
let energyLevel = 0
let eveBodyFeeling = 0
let commuteRpe = 2

const today = localDate(new Date())

// ── Måltids-databas (kcal = M-portion, stjärnor = hälsovärde 1-5) ──
const FOOD_DB = [
  // Frukost
  { keys: ['havregrynsgröt','havregröt','oatmeal','gröt'], kcal: 340, stars: 5 },
  { keys: ['müsli','muesli','granola'], kcal: 380, stars: 4 },
  { keys: ['yoghurt med','yoghurt'], kcal: 180, stars: 5 },
  { keys: ['kvarg'], kcal: 160, stars: 5 },
  { keys: ['smoothiebowl','smoothie bowl'], kcal: 380, stars: 4 },
  { keys: ['smoothie'], kcal: 260, stars: 4 },
  { keys: ['ägg','omelett','scrambled','pocherat'], kcal: 240, stars: 4 },
  { keys: ['kanelbulle','bulle','vetebröd','wienerbröd','croissant'], kcal: 370, stars: 1 },
  { keys: ['pannkaka','pannkakor','plättar','crêpe'], kcal: 480, stars: 2 },
  { keys: ['frukostsmörgås','smörgås','macka','toast'], kcal: 280, stars: 3 },
  { keys: ['proteinshake','protein shake'], kcal: 300, stars: 4 },
  // Sallader
  { keys: ['caesar sallad','caesarsallad'], kcal: 420, stars: 3 },
  { keys: ['nicoise','niçoise'], kcal: 380, stars: 4 },
  { keys: ['poke bowl','poke'], kcal: 480, stars: 4 },
  { keys: ['sallad med lax','laxsallad'], kcal: 420, stars: 5 },
  { keys: ['sallad med kyckling','kycklings'], kcal: 400, stars: 5 },
  { keys: ['sallad'], kcal: 280, stars: 5 },
  // Soppa
  { keys: ['gulaschsoppa','gulasch'], kcal: 460, stars: 3 },
  { keys: ['tomatsoppa'], kcal: 280, stars: 4 },
  { keys: ['linssoppa'], kcal: 340, stars: 5 },
  { keys: ['ärtsoppa'], kcal: 360, stars: 5 },
  { keys: ['soppa'], kcal: 320, stars: 4 },
  // Pasta
  { keys: ['pasta bolognese','spagetti bolognese','köttfärssås'], kcal: 640, stars: 3 },
  { keys: ['pasta carbonara','carbonara'], kcal: 720, stars: 2 },
  { keys: ['pasta pesto','pesto pasta'], kcal: 580, stars: 3 },
  { keys: ['pasta med räkor','räkpasta'], kcal: 560, stars: 3 },
  { keys: ['lasagne'], kcal: 680, stars: 2 },
  { keys: ['pasta'], kcal: 560, stars: 3 },
  // Pizza/Snabbmat
  { keys: ['pizza'], kcal: 820, stars: 1 },
  { keys: ['hamburgare','burger'], kcal: 760, stars: 1 },
  { keys: ['kebab','döner'], kcal: 700, stars: 2 },
  { keys: ['tacos','taco'], kcal: 680, stars: 2 },
  { keys: ['wrap','burrito'], kcal: 560, stars: 2 },
  { keys: ['pommes','pommes frites'], kcal: 480, stars: 1 },
  { keys: ['hotdog','varmkorv'], kcal: 420, stars: 1 },
  // Kött/Fisk
  { keys: ['laxfilé','lax med','grillad lax','ugnslax'], kcal: 460, stars: 5 },
  { keys: ['lax'], kcal: 440, stars: 5 },
  { keys: ['torsk','kolja','fiskfilé','ugnsfisk'], kcal: 340, stars: 5 },
  { keys: ['räkor','räkröra'], kcal: 280, stars: 5 },
  { keys: ['sushi'], kcal: 440, stars: 4 },
  { keys: ['kycklingfilé','grillad kyckling','ugnkyckling'], kcal: 420, stars: 5 },
  { keys: ['kyckling'], kcal: 460, stars: 4 },
  { keys: ['köttbullar'], kcal: 560, stars: 3 },
  { keys: ['biff','entrecote','oxfilé','ryggbiff'], kcal: 540, stars: 3 },
  { keys: ['fläskkotlett','fläsk'], kcal: 520, stars: 3 },
  { keys: ['falukorv','prinskorv','chorizo','korv'], kcal: 500, stars: 2 },
  // Vegetariskt
  { keys: ['linser','röda linser','gröna linser'], kcal: 380, stars: 5 },
  { keys: ['kikärtor','hummus'], kcal: 360, stars: 5 },
  { keys: ['bönsoppa','bönor','kidney'], kcal: 340, stars: 5 },
  { keys: ['tofu'], kcal: 320, stars: 5 },
  { keys: ['wok'], kcal: 480, stars: 4 },
  { keys: ['curry','röd curry','grön curry'], kcal: 540, stars: 4 },
  { keys: ['stir fry'], kcal: 460, stars: 4 },
  // Tillbehör/Enkelt
  { keys: ['risotto'], kcal: 520, stars: 3 },
  { keys: ['ris med'], kcal: 440, stars: 3 },
  { keys: ['ris'], kcal: 360, stars: 3 },
  { keys: ['potatis','potatismos'], kcal: 300, stars: 3 },
  { keys: ['baguette','vitlöksbröd'], kcal: 340, stars: 2 },
  // Snacks/Dessert
  { keys: ['frukt','äpple','banan','apelsin','päron','mango'], kcal: 120, stars: 5 },
  { keys: ['bär','blåbär','hallon','jordgubbar','jordgubbe'], kcal: 80, stars: 5 },
  { keys: ['nötter','mandel','cashew','valnöt','pistasch'], kcal: 200, stars: 4 },
  { keys: ['glass'], kcal: 300, stars: 1 },
  { keys: ['kaka','kex','cookie','muffin'], kcal: 280, stars: 1 },
  { keys: ['choklad'], kcal: 260, stars: 1 },
  { keys: ['godis','skumgodis','lakris'], kcal: 300, stars: 1 },
  { keys: ['chips'], kcal: 320, stars: 1 },
]
const PORTION_MULT = { S: 0.65, M: 1.0, L: 1.45 }

// ── Init ──────────────────────────────────────────────────
function commuteKcalPerMin(type) {
  if (type === 'pendling-cykling')  return settings.commute_bike_kcal_per_min
  if (type === 'pendling-promenad') return settings.commute_walk_kcal_per_min
  return 7 // generellt träningspass
}

async function init() {
  document.getElementById('version-label').textContent = APP_VERSION
  setDateDefaults()
  await handleStravaCallback()
  await Promise.all([loadProfile(), loadSettings()])
  refreshTab('home')
  loadStravaStatus()
  loadWeeklyReports()
  if (window._hcSteps) renderStepsCard(window._hcSteps)
  renderHealthConnectStatus(!!window._hcSteps)
  lucide.createIcons()
  checkWeeklySummary()
}

function setDateDefaults() {
  document.getElementById('w-date').value = today
  document.getElementById('m-date').value = today
  document.getElementById('wt-date').value = today
  document.getElementById('ci-date').value = today
}

// ── Tab switching ─────────────────────────────────────────
function switchTab(name) {
  document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'))
  document.querySelectorAll('.bottom-nav button').forEach(el => el.classList.remove('active'))
  document.getElementById('tab-' + name).classList.add('active')
  document.getElementById('nav-' + name).classList.add('active')
  currentTab = name
  refreshTab(name)
}

function refreshTab(name) {
  if (name === 'home') loadHome()
  if (name === 'workout') { loadWorkouts(); loadCommuteCounts() }
  if (name === 'meal') { loadMeals(); updateCalToday(); drawDeficitChart() }
  if (name === 'weight') loadWeights()
  if (name === 'checkin') { loadCheckins(); drawWellbeingChart(); loadCheckinForm() }
  if (name === 'profile') updateWeightSuggestions()
}

// ── Profile ───────────────────────────────────────────────
async function loadProfile() {
  const { data } = await db.from('profiles').select('*').limit(1).maybeSingle()
  profile = data
  if (profile) fillProfileForm(profile)
}

function fillProfileForm(p) {
  if (p.name) document.getElementById('p-name').value = p.name
  if (p.age) document.getElementById('p-age').value = p.age
  if (p.fitness_level) document.getElementById('p-fitness').value = p.fitness_level
  if (p.weekly_hours) document.getElementById('p-hours').value = p.weekly_hours
  if (p.injuries) document.getElementById('p-injuries').value = p.injuries
  if (p.motivation) document.getElementById('p-motivation').value = p.motivation
  if (p.goal) document.getElementById('p-goal').value = p.goal
  if (p.goal_date) document.getElementById('p-goal-date').value = p.goal_date
  if (p.start_weight) document.getElementById('p-start-weight').value = p.start_weight
  if (p.target_weight) document.getElementById('p-target-weight').value = p.target_weight
}

async function saveProfile() {
  const data = {
    name: val('p-name'),
    age: intVal('p-age'),
    fitness_level: val('p-fitness'),
    weekly_hours: floatVal('p-hours'),
    injuries: val('p-injuries'),
    motivation: val('p-motivation'),
    goal: val('p-goal'),
    goal_date: val('p-goal-date') || null,
    start_weight: floatVal('p-start-weight'),
    target_weight: floatVal('p-target-weight')
  }

  let error
  if (profile?.id) {
    ;({ error } = await db.from('profiles').update(data).eq('id', profile.id))
  } else {
    ;({ error } = await db.from('profiles').insert({ ...data, user_id: currentUser.id }))
  }

  if (error) return setStatus('p-status', 'Fel: ' + error.message, true)
  setStatus('p-status', 'Sparat!')
  await loadProfile()
  loadHome()
}

// ── Home ──────────────────────────────────────────────────
async function loadHome() {
  if (profile) {
    document.getElementById('home-goal').textContent = profile.goal || '—'
    if (profile.goal_date) {
      const days = Math.ceil((new Date(profile.goal_date) - new Date()) / 86400000)
      document.getElementById('home-days').textContent = days > 0 ? days : '0'
    }
  }

  const thirtyAgo = new Date(); thirtyAgo.setDate(thirtyAgo.getDate() - 30)
  const thirtyStr = thirtyAgo.toISOString().split('T')[0]

  const [workoutsRes, mealsRes, checkinTodayRes, checkinsRes, weightTodayRes] = await Promise.all([
    db.from('workouts').select('date, duration_minutes, type').gte('date', thirtyStr).order('date', { ascending: false }),
    db.from('meals').select('date').gte('date', thirtyStr).order('date', { ascending: false }),
    db.from('checkins').select('*').eq('date', today).maybeSingle(),
    db.from('checkins').select('date, sleep_hours, sleep_quality, body_feeling').gte('date', thirtyStr).order('date', { ascending: false }),
    db.from('weight_logs').select('date').eq('date', today).maybeSingle()
  ])

  const workouts = workoutsRes.data || []
  const meals = mealsRes.data || []
  const checkins = checkinsRes.data || []

  document.getElementById('home-streak').textContent = calcStreak([...new Set(workouts.map(w => w.date))])
  document.getElementById('home-ci-streak').textContent = calcStreak([...new Set(checkins.map(c => c.date))])
  document.getElementById('home-meal-streak').textContent = calcStreak([...new Set(meals.map(m => m.date))])

  const weekStart = getWeekStart()
  const weekWorkouts = workouts.filter(w => w.date >= weekStart)
  document.getElementById('home-week-workouts').textContent = weekWorkouts.length

  drawWeekBars(workouts)
  await loadWeightHomeCard()
  showRecovery(checkinTodayRes.data || checkins[0] || null, workouts)

  setPill('today-workout', 'today-workout-label', workouts.some(w => w.date === today), 'Tränat', 'Träning')
  setPill('today-meal', 'today-meal-label', meals.some(m => m.date === today), 'Loggat', 'Måltider')
  setPill('today-checkin', 'today-checkin-label', !!checkinTodayRes.data, 'Klart', 'Check-in')
  setPill('today-weight', 'today-weight-label', !!weightTodayRes.data, 'Loggad', 'Vikt')
  lucide.createIcons()
}

async function loadWeightHomeCard() {
  const card = document.getElementById('weight-home-card')
  if (!profile?.start_weight || !profile?.target_weight) { card.style.display = 'none'; return }

  const { data: weights } = await db.from('weight_logs').select('*').order('date', { ascending: false }).limit(30)
  if (!weights?.length) { card.style.display = 'none'; return }
  card.style.display = 'block'

  const current   = weights[0].weight_kg
  const start     = profile.start_weight
  const target    = profile.target_weight
  const totalLoss = start - target
  const lostSoFar = start - current
  const remaining = current - target
  const pct       = Math.max(0, Math.min(100, Math.round((lostSoFar / totalLoss) * 100)))
  const gained    = lostSoFar < 0

  const deltaEl = document.getElementById('wh-delta')
  const delta = Math.abs(lostSoFar).toFixed(1)
  deltaEl.textContent = (gained ? '+' : '−') + delta + ' kg'
  deltaEl.className   = gained ? 'gained' : ''

  document.getElementById('wh-current').textContent = current
  document.getElementById('wh-bar').style.width     = pct + '%'
  document.getElementById('wh-start-label').textContent  = start + ' kg'
  document.getElementById('wh-target-label').textContent = target + ' kg'
  document.getElementById('wh-pct-label').textContent    = pct + '% klart'

  let statusIcon = '✅', statusText = ''
  if (profile.goal_date) {
    const weeksLeft     = Math.max(0.5, (new Date(profile.goal_date) - new Date()) / (7 * 86400000))
    const neededPerWeek = Math.round(remaining / weeksLeft * 10) / 10
    const totalWeeks    = (new Date(profile.goal_date) - new Date(weights[weights.length - 1].date + 'T00:00:00')) / (7 * 86400000)
    const plannedPerWeek = totalLoss / Math.max(1, totalWeeks)
    const elapsedWeeks  = (new Date() - new Date(weights[weights.length - 1].date + 'T00:00:00')) / (7 * 86400000)
    const shouldHaveLost = plannedPerWeek * elapsedWeeks
    const diff = lostSoFar - shouldHaveLost
    const tolerance = Math.max(0.2, shouldHaveLost * 0.10)

    if (remaining <= 0) {
      statusIcon = '🏆'; statusText = 'Målvikten nådd!'
    } else if (Math.abs(diff) <= tolerance) {
      statusIcon = '✅'; statusText = `Enligt plan · ${neededPerWeek} kg/v kvar`
    } else if (diff > 0) {
      statusIcon = '🟢'; statusText = `Före plan: +${diff.toFixed(1)} kg · ${neededPerWeek} kg/v kvar`
    } else {
      statusIcon = '⚠️'; statusText = `Efter plan: ${diff.toFixed(1)} kg · ${neededPerWeek} kg/v kvar`
    }
  } else {
    statusText = remaining > 0 ? `${remaining.toFixed(1)} kg kvar till målet` : '🏆 Målvikten nådd!'
  }

  document.getElementById('wh-status-icon').textContent = statusIcon
  document.getElementById('wh-status-text').textContent = statusText

  drawWeightHomeCurve(weights.slice().reverse().slice(-8), start, target)
}

function drawWeightHomeCurve(entries, start, target) {
  const svg  = document.getElementById('wh-curve')
  const W = svg.clientWidth || 300, H = 48, pad = 7
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`)
  const allW = [start, ...entries.map(e => e.weight_kg), target]
  const minW = Math.min(...allW) - 1
  const maxW = Math.max(...allW) + 1
  const toY  = w => pad + (H - pad * 2) - ((w - minW) / (maxW - minW)) * (H - pad * 2)

  // Datumbaserad X för hemgrafen
  const goalDate = profile?.goal_date
  const firstDate = new Date(entries[0].date + 'T00:00:00')
  const goalD = goalDate ? new Date(goalDate + 'T00:00:00') : null
  const lastEntryDate = new Date(entries[entries.length - 1].date + 'T00:00:00')
  const maxDate = goalD && goalD > lastEntryDate ? goalD : lastEntryDate
  const timeRange = Math.max(maxDate - firstDate, 1)
  const toX = dateStr => ((new Date(dateStr + 'T00:00:00') - firstDate) / timeRange) * W

  const startPt = `0,${toY(start)}`
  const dataPts = entries.map(e => `${toX(e.date)},${toY(e.weight_kg)}`)
  const allPts  = [startPt, ...dataPts]

  const lastX = toX(entries[entries.length - 1].date)
  const lastY = toY(entries[entries.length - 1].weight_kg)

  svg.innerHTML = `
    <line x1="0" y1="${toY(start)}" x2="${W}" y2="${toY(target)}"
      stroke="#fbbf24" stroke-width="1.5" stroke-dasharray="6,4" opacity="0.5"/>
    <line x1="${lastX}" y1="${lastY}" x2="${W}" y2="${toY(target)}"
      stroke="#4ade80" stroke-width="1.5" stroke-dasharray="5,4" opacity="0.6"/>
    <polyline points="${allPts.join(' ')}" fill="none" stroke="#2563eb"
      stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    ${dataPts.map((p, i) => {
      const [x, y] = p.split(',')
      const isLast = i === dataPts.length - 1
      return `<circle cx="${x}" cy="${y}" r="2" fill="#2563eb"/>`
    }).join('')}
    <circle cx="${W}" cy="${toY(target)}" r="3" fill="none" stroke="#4ade80" stroke-width="1.5" stroke-dasharray="2,2"/>
  `
}

function calcStreak(dates) {
  const sorted = [...new Set(dates)].sort().reverse()
  let streak = 0, check = sorted.includes(today) ? today : prevDay(today)
  for (const d of sorted) {
    if (d === check) { streak++; check = prevDay(check) }
    else if (d < check) break
  }
  return streak
}

function drawWeekBars(workouts) {
  const weekStart = getWeekStart()
  const days = ['Mån','Tis','Ons','Tor','Fre','Lör','Sön']
  const counts = {}
  workouts.filter(w => w.date >= weekStart).forEach(w => {
    counts[w.date] = (counts[w.date] || 0) + 1
  })
  const max = Math.max(1, ...Object.values(counts))
  const container = document.getElementById('week-bars')
  container.innerHTML = ''
  for (let i = 0; i < 7; i++) {
    const d = new Date(weekStart + 'T00:00:00')
    d.setDate(d.getDate() + i)
    const dateStr = localDate(d)
    const count = counts[dateStr] || 0
    const isToday = dateStr === today
    const pct = Math.round((count / max) * 100)
    const wrap = document.createElement('div')
    wrap.className = 'week-bar-wrap'
    wrap.innerHTML = `
      <div class="week-bar${isToday ? ' today' : ''}" style="height:${count ? Math.max(pct, 15) : 3}%"></div>
      <div class="week-bar-label">${days[i]}</div>`
    container.appendChild(wrap)
  }
}

function showRecovery(lastCheckin, workouts) {
  const card = document.getElementById('recovery-card')
  const ring = document.getElementById('recovery-ring')
  const title = document.getElementById('recovery-title')
  const sub = document.getElementById('recovery-sub')
  card.style.display = 'flex'

  const threeDaysAgo = new Date(); threeDaysAgo.setDate(threeDaysAgo.getDate() - 3)
  const recentLoad = workouts.filter(w => w.date >= threeDaysAgo.toISOString().split('T')[0] && w.type !== 'pendling-cykling' && w.type !== 'pendling-promenad').length

  let score = 60
  if (lastCheckin) {
    if (lastCheckin.sleep_hours >= 8) score += 12
    else if (lastCheckin.sleep_hours >= 7) score += 6
    else if (lastCheckin.sleep_hours > 0 && lastCheckin.sleep_hours < 6) score -= 8
    if (lastCheckin.sleep_quality) score += (lastCheckin.sleep_quality - 3) * 10
    if (lastCheckin.body_feeling) score += (lastCheckin.body_feeling - 3) * 9
  } else {
    score = 50
  }
  score -= recentLoad * 7
  score = Math.max(0, Math.min(100, score))

  // Förklaringstext
  const parts = []
  if (!lastCheckin) {
    parts.push('ingen incheckning idag')
  } else {
    if (lastCheckin.sleep_hours) parts.push(`sömn ${lastCheckin.sleep_hours}h`)
    if (lastCheckin.sleep_quality) parts.push(`sömnkvalitet ${lastCheckin.sleep_quality}/5`)
    if (lastCheckin.body_feeling) parts.push(`kropp ${lastCheckin.body_feeling}/5`)
  }
  if (recentLoad > 0) parts.push(`${recentLoad} pass senaste 3 dagarna`)

  let level, icon
  if (score >= 70) {
    level = 'good'; icon = 'dumbbell'
  } else if (score >= 45) {
    level = 'ok'; icon = 'activity'
  } else {
    level = 'rest'; icon = 'bed'
  }

  card.className = `recovery-card ${level}`
  ring.className = `recovery-ring ${level}`
  ring.innerHTML = `<i data-lucide="${icon}"></i>`
  title.textContent = level === 'good' ? 'Återhämtad' : level === 'ok' ? 'Okej form' : 'Behöver vila'
  sub.textContent = `Score ${score}` + (parts.length ? ` · ${parts.join(' · ')}` : '')
}

function setPill(cardId, labelId, done, doneText, defaultText) {
  const card = document.getElementById(cardId)
  const label = document.getElementById(labelId)
  if (done) { card.classList.add('done'); label.textContent = doneText }
  else { card.classList.remove('done'); label.textContent = defaultText }
}

// ── Settings ──────────────────────────────────────────────
let settings = {
  commute_bike_km:           1.9,
  commute_bike_min:          6,
  commute_walk_km:           1.9,
  commute_walk_min:          18,
  commute_bike_kcal_per_min: 7.0,
  commute_walk_kcal_per_min: 4.5,
  commute_bike_start_hour:   7,
  commute_walk_start_hour:   8,
  strava_bike_name:          'merida',
  show_commute:              true
}

function applyCommuteVisibility() {
  const checked = document.getElementById('s-show_commute')?.checked ?? settings.show_commute
  const card = document.getElementById('commute-card')
  if (card) card.style.display = checked ? '' : 'none'
}

async function loadSettings() {
  const { data } = await db.from('user_settings').select('*').limit(1).maybeSingle()
  if (data) {
    Object.keys(settings).forEach(k => { if (data[k] != null) settings[k] = data[k] })
    fillSettingsForm()
  }
}

function fillSettingsForm() {
  Object.keys(settings).forEach(k => {
    const el = document.getElementById('s-' + k)
    if (!el) return
    if (el.type === 'checkbox') el.checked = !!settings[k]
    else el.value = settings[k]
  })
  applyCommuteVisibility()
}

async function saveSettings() {
  const updated = {
    commute_bike_km:           floatVal('s-commute_bike_km')           ?? settings.commute_bike_km,
    commute_bike_min:          intVal('s-commute_bike_min')            ?? settings.commute_bike_min,
    commute_walk_km:           floatVal('s-commute_walk_km')           ?? settings.commute_walk_km,
    commute_walk_min:          intVal('s-commute_walk_min')            ?? settings.commute_walk_min,
    commute_bike_kcal_per_min: floatVal('s-commute_bike_kcal_per_min') ?? settings.commute_bike_kcal_per_min,
    commute_walk_kcal_per_min: floatVal('s-commute_walk_kcal_per_min') ?? settings.commute_walk_kcal_per_min,
    commute_bike_start_hour:   intVal('s-commute_bike_start_hour')     ?? settings.commute_bike_start_hour,
    commute_walk_start_hour:   intVal('s-commute_walk_start_hour')     ?? settings.commute_walk_start_hour,
    strava_bike_name:          document.getElementById('s-strava_bike_name')?.value.trim() || settings.strava_bike_name,
    show_commute:              document.getElementById('s-show_commute')?.checked ?? settings.show_commute
  }
  const { data: existing } = await db.from('user_settings').select('id').limit(1).maybeSingle()
  let error
  if (existing) {
    ;({ error } = await db.from('user_settings').update(updated).eq('id', existing.id))
  } else {
    ;({ error } = await db.from('user_settings').insert({ ...updated, user_id: currentUser.id }))
  }
  if (error) return setStatus('settings-status', 'Fel: ' + error.message, true)
  Object.assign(settings, updated)
  setStatus('settings-status', 'Sparat!')
}

// ── Workouts ──────────────────────────────────────────────

async function logCommute(type) {
  const dbType = 'pendling-' + type
  const isBike = dbType === 'pendling-cykling'
  const km  = isBike ? settings.commute_bike_km  : settings.commute_walk_km
  const min = isBike ? settings.commute_bike_min : settings.commute_walk_min
  const kcalPerMin = isBike ? settings.commute_bike_kcal_per_min : settings.commute_walk_kcal_per_min
  const kcalEstimate = Math.round(kcalPerMin * min * 2)

  const { error, data: inserted } = await db.from('workouts').insert({
    user_id: currentUser.id,
    type: dbType, date: today,
    duration_minutes: min * 2,
    distance_km: Math.round(km * 2 * 10) / 10,
    calories: kcalEstimate,
    notes: '1 t/r',
    perceived_exertion: commuteRpe
  }).select('id').single()

  if (error) return setStatus('commute-status', 'Fel: ' + error.message, true)

  // Räkna totalt antal pass av denna typ idag (för visning)
  const { count: totalCount } = await db.from('workouts')
    .select('id', { count: 'exact', head: true })
    .eq('date', today).eq('type', dbType)

  const emoji = type === 'cykling' ? '🚴' : '🚶'
  setStatus('commute-status', `${emoji} Loggat! ${totalCount} t/r idag · ${kcalEstimate} kcal/tur`)

  const token = await getStravaToken()
  if (token) {
    try {
      await pushToStrava(token, inserted.id, dbType, totalCount, min * 2, Math.round(km * 2 * 10) / 10)
      setStatus('commute-status', `${emoji} Loggat & synkat! ${totalCount} t/r idag · ${kcalEstimate} kcal/tur`)
    } catch (e) {
      setStatus('commute-status', `${emoji} Loggat! ${totalCount} t/r idag · ${kcalEstimate} kcal/tur (Strava: ${e.message})`, true)
    }
  }

  loadCommuteCounts()
  loadWorkouts()
}

async function loadCommuteCounts() {
  const { data } = await db.from('workouts').select('type').eq('date', today).in('type', ['pendling-cykling', 'pendling-promenad'])
  const bikeCount = (data || []).filter(d => d.type === 'pendling-cykling').length
  const walkCount = (data || []).filter(d => d.type === 'pendling-promenad').length
  document.getElementById('commute-bike-count').textContent = `Idag: ${bikeCount} t/r`
  document.getElementById('commute-walk-count').textContent = `Idag: ${walkCount} t/r`
}

async function saveWorkout() {
  const duration = intVal('w-duration')
  if (!duration || duration < 1) return setStatus('w-status', 'Fyll i tid.', true)

  const { error } = await db.from('workouts').insert({
    user_id: currentUser.id,
    type: val('w-type'),
    date: val('w-date'),
    duration_minutes: duration,
    distance_km: floatVal('w-distance'),
    notes: val('w-notes') || null
  })

  if (error) return setStatus('w-status', 'Fel: ' + error.message, true)
  setStatus('w-status', 'Sparat!')
  document.getElementById('w-duration').value = ''
  document.getElementById('w-distance').value = ''
  document.getElementById('w-notes').value = ''
  loadWorkouts()
}

const _workoutCache = {}

async function loadWorkouts() {
  const { data } = await db.from('workouts').select('*').order('date', { ascending: false }).order('created_at', { ascending: false }).limit(15)
  const list = document.getElementById('workout-list')
  if (!data?.length) { list.innerHTML = '<div class="empty">Inga pass loggade ännu.</div>'; return }
  const icons = { simning: 'waves', löpning: 'footprints', cykling: 'bike', gym: 'dumbbell', annat: 'zap', 'pendling-cykling': 'bike', 'pendling-promenad': 'footprints' }
  data.forEach(w => { _workoutCache[w.id] = w })
  list.innerHTML = data.map(w => {
    const fromStrava = !!w.strava_activity_id
    return `
    <div class="item-card" style="cursor:pointer;" onclick="openEditWorkout('${w.id}')">
      <div class="item-top">
        <span class="item-title"><i data-lucide="${icons[w.type] || 'zap'}"></i> ${capitalize(w.type)}</span>
        <span style="display:flex;align-items:center;gap:6px;">
          ${fromStrava ? `<span style="font-size:0.68rem;color:var(--dim);letter-spacing:.02em;">Strava</span>` : ''}
          <span class="item-date">${fmtDate(w.date)}</span>
        </span>
      </div>
      <div class="item-meta">${w.duration_minutes} min${w.distance_km ? ' · ' + w.distance_km + ' km' : ''}${w.calories ? ' · ' + w.calories + ' kcal' : ''}</div>
      ${w.notes ? `<div class="item-note">${w.notes}</div>` : ''}
    </div>`
  }).join('')
  lucide.createIcons()
}

let _editWorkoutId = null

function openEditWorkout(id) {
  const w = _workoutCache[id]
  if (!w) return

  if (w.strava_activity_id) {
    setStatus('workout-status', 'Detta pass är loggat via Strava — redigera det där.', false)
    setTimeout(() => setStatus('workout-status', ''), 3000)
    return
  }

  _editWorkoutId = id
  document.getElementById('ew-type').value     = w.type || 'annat'
  document.getElementById('ew-date').value     = w.date || today
  document.getElementById('ew-duration').value = w.duration_minutes || ''
  document.getElementById('ew-distance').value = w.distance_km || ''
  document.getElementById('ew-notes').value    = w.notes || ''
  document.getElementById('edit-workout-overlay').classList.add('open')
}

function closeEditWorkout() {
  document.getElementById('edit-workout-overlay').classList.remove('open')
  _editWorkoutId = null
}

async function saveEditWorkout() {
  if (!_editWorkoutId) return
  const duration = parseInt(document.getElementById('ew-duration').value)
  if (!duration || duration < 1) { alert('Ange tid i minuter.'); return }
  const updates = {
    type:             document.getElementById('ew-type').value,
    date:             document.getElementById('ew-date').value,
    duration_minutes: duration,
    distance_km:      parseFloat(document.getElementById('ew-distance').value) || null,
    notes:            document.getElementById('ew-notes').value.trim() || null
  }
  const { error } = await db.from('workouts').update(updates).eq('id', _editWorkoutId)
  if (error) { alert('Kunde inte spara: ' + error.message); return }
  closeEditWorkout()
  loadWorkouts(); loadHome()
}

async function deleteWorkout() {
  if (!_editWorkoutId) return
  if (!confirm('Radera detta träningspass?')) return
  const { error } = await db.from('workouts').delete().eq('id', _editWorkoutId)
  if (error) { alert('Kunde inte radera: ' + error.message); return }
  closeEditWorkout()
  loadWorkouts(); loadHome()
}

// ── Meals ─────────────────────────────────────────────────
function setMealPortion(p) {
  mealPortion = p
  ;['S','M','L'].forEach(x => document.getElementById('portion-' + x)?.classList.toggle('active', x === p))
  onMealDescInput()
}

function suggestFromDesc(desc) {
  if (!desc || desc.length < 3) return null
  const d = desc.toLowerCase()
  let best = null, bestLen = 0
  for (const food of FOOD_DB) {
    for (const key of food.keys) {
      if (d.includes(key) && key.length > bestLen) { best = food; bestLen = key.length }
    }
  }
  if (!best) return null
  const mult = PORTION_MULT[mealPortion] || 1
  return { kcal: Math.round(best.kcal * mult / 10) * 10, stars: best.stars }
}

function onMealDescInput() {
  const desc = document.getElementById('m-desc')?.value || ''
  const suggestion = suggestFromDesc(desc)
  const label = document.getElementById('m-suggest-label')
  const calInput = document.getElementById('m-cal')
  if (suggestion) {
    if (!calInput._manualEdit) calInput.value = suggestion.kcal
    if (!document.getElementById('m-health-stars')._manualEdit) {
      healthScore = suggestion.stars
      updateStars('m-health-stars', suggestion.stars)
    }
    if (label) label.textContent = '✨ förslag baserat på beskrivningen'
  } else {
    if (label) label.textContent = desc.length > 3 ? 'Ingen matchning — fyll i manuellt' : ''
  }
}

function setHealthScore(n) {
  healthScore = n
  updateStars('m-health-stars', n)
  const el = document.getElementById('m-health-stars')
  if (el) el._manualEdit = true
}

async function saveMeal() {
  const desc = val('m-desc')
  if (!desc) return setStatus('m-status', 'Beskriv måltiden.', true)

  const { error } = await db.from('meals').insert({
    user_id: currentUser.id,
    date: val('m-date'),
    meal_type: val('m-type'),
    description: desc,
    health_score: healthScore || null,
    calories: intVal('m-cal'),
    comment: val('m-comment') || null
  })

  if (error) return setStatus('m-status', 'Fel: ' + error.message, true)
  setStatus('m-status', 'Sparat!')
  document.getElementById('m-desc').value = ''
  document.getElementById('m-cal').value = ''
  document.getElementById('m-comment').value = ''
  document.getElementById('m-suggest-label').textContent = ''
  const calInput = document.getElementById('m-cal')
  if (calInput) calInput._manualEdit = false
  const starsEl = document.getElementById('m-health-stars')
  if (starsEl) starsEl._manualEdit = false
  healthScore = 0
  updateStars('m-health-stars', 0)
  setMealPortion('M')
  loadMeals()
  updateCalToday()
  drawDeficitChart()
}

const _mealCache = {}

async function loadMeals() {
  const sevenAgo = new Date(); sevenAgo.setDate(sevenAgo.getDate() - 6)
  const { data } = await db.from('meals').select('*').gte('date', localDate(sevenAgo)).order('date', { ascending: false }).order('created_at', { ascending: false })
  const list = document.getElementById('meal-list')
  if (!data?.length) { list.innerHTML = '<div class="empty">Inga måltider loggade.</div>'; return }
  const typeIcons = { frukost: 'sunrise', lunch: 'sun', middag: 'moon', mellanmål: 'apple' }
  const byDate = {}
  data.forEach(m => { _mealCache[m.id] = m; if (!byDate[m.date]) byDate[m.date] = []; byDate[m.date].push(m) })
  const hasBreakfastToday = (byDate[today] || []).some(m => m.meal_type === 'frukost')
  const skipBtn = document.getElementById('skip-breakfast-btn')
  if (skipBtn) skipBtn.style.display = hasBreakfastToday ? 'none' : ''
  let html = ''
  for (const date of Object.keys(byDate).sort().reverse()) {
    const label = date === today ? 'Idag' : date === prevDay(today) ? 'Igår' : fmtDate(date)
    html += `<div class="date-header">${label}</div>`
    html += byDate[date].map(m => `
      <div class="item-card" style="cursor:pointer;" onclick="openEditMealById('${m.id}')">
        <div class="item-top">
          <span class="item-title"><i data-lucide="${typeIcons[m.meal_type] || 'utensils'}"></i> ${capitalize(m.meal_type || 'Måltid')}</span>
          ${m.health_score ? `<span class="health-badge hb-${m.health_score}">${m.health_score}★</span>` : '<span style="color:var(--dim);font-size:0.75rem;line-height:1;">✎ redigera</span>'}
        </div>
        <div class="item-meta">${m.description || '<em style="color:var(--dim)">ingen beskrivning</em>'} · ${m.calories != null ? m.calories + ' kcal' : '<span style="color:var(--dim)">+ kcal</span>'}</div>
        ${m.comment ? `<div class="item-note">${m.comment}</div>` : ''}
      </div>`).join('')
  }
  list.innerHTML = html
  lucide.createIcons()
}

async function skipBreakfast() {
  const btn = document.getElementById('skip-breakfast-btn')
  if (btn) btn.disabled = true
  const { error } = await db.from('meals').insert({
    user_id: currentUser.id,
    date: today, meal_type: 'frukost', description: 'Ingen frukost · fasta', calories: 0, health_score: 5
  })
  if (error) { alert('Kunde inte logga: ' + error.message); if (btn) btn.disabled = false; return }
  loadMeals(); updateCalToday()
}

function openEditMealById(id) {
  const m = _mealCache[id]
  if (!m) return
  openEditMeal(id, m.description, m.calories, m.health_score)
}

function calcTDEE() {
  if (!profile) return null
  const w = profile.start_weight
  const hours = profile.weekly_hours || 3
  if (!w) return null
  const multiplier = hours <= 2 ? 26 : hours <= 5 ? 29 : hours <= 8 ? 32 : 35
  return Math.round(w * multiplier)
}

function calcCalorieTarget() {
  const tdee = calcTDEE()
  if (!tdee || !profile?.start_weight || !profile?.target_weight || !profile?.goal_date) return tdee
  const weeks = Math.max(1, (new Date(profile.goal_date) - new Date()) / (7 * 86400000))
  const totalLoss = profile.start_weight - profile.target_weight
  const weeklyLoss = Math.min(1, Math.max(0, totalLoss / weeks))
  const dailyDeficit = Math.round((weeklyLoss * 7700) / 7)
  return Math.max(1200, tdee - dailyDeficit)
}

async function updateCalToday() {
  const [mealsRes, workoutsRes] = await Promise.all([
    db.from('meals').select('calories').eq('date', today),
    db.from('workouts').select('duration_minutes, type, calories').eq('date', today)
  ])
  if (!mealsRes.data) return

  const eaten = mealsRes.data.reduce((s, m) => s + (m.calories || 0), 0)
  const burned = (workoutsRes.data || []).reduce((s, w) => {
    return s + (w.calories || Math.round(w.duration_minutes * commuteKcalPerMin(w.type)))
  }, 0)

  const target = calcCalorieTarget()
  const card = document.getElementById('calorie-card')

  document.getElementById('cal-today').textContent = eaten
  card.style.display = 'block'

  if (target) {
    const effectiveTarget = target + (includeExercise ? burned : 0)
    const pct = Math.min(100, Math.round((eaten / effectiveTarget) * 100))
    const remaining = effectiveTarget - eaten
    document.getElementById('cal-target').textContent = effectiveTarget
    document.getElementById('cal-bar').style.width = pct + '%'
    document.getElementById('cal-bar').className = 'cal-budget-bar-fill' + (eaten > effectiveTarget ? ' over' : '')
    document.getElementById('cal-remaining-label').textContent = remaining >= 0 ? `${remaining} kcal kvar` : `${Math.abs(remaining)} kcal över`
    document.getElementById('cal-burned-label').textContent = (includeExercise && burned > 0) ? `🔥 +${burned} träning` : ''
  } else {
    document.getElementById('cal-target').textContent = '—'
    document.getElementById('cal-bar').style.width = '0%'
    document.getElementById('cal-remaining-label').textContent = 'Fyll i profil för kaloribudget'
    document.getElementById('cal-burned-label').textContent = ''
  }
}

// ── Weight ────────────────────────────────────────────────
async function saveWeight() {
  const kg = floatVal('wt-kg')
  if (!kg) return setStatus('wt-status', 'Ange vikt.', true)
  if (kg < 30 || kg > 150) return setStatus('wt-status', 'Vikt måste vara mellan 30–150 kg.', true)

  const { error } = await db.from('weight_logs').upsert({
    user_id: currentUser.id,
    date: val('wt-date'),
    weight_kg: kg
  }, { onConflict: 'date,user_id' })

  if (error) return setStatus('wt-status', 'Fel: ' + error.message, true)
  setStatus('wt-status', 'Sparat!')
  document.getElementById('wt-kg').value = ''
  loadWeights()
}

async function loadWeights() {
  const { data } = await db.from('weight_logs').select('*').order('date', { ascending: false }).limit(30)
  const list = document.getElementById('weight-list')

  if (!data?.length) { list.innerHTML = '<div class="empty">Ingen vikt loggad ännu.</div>'; return }

  document.getElementById('wt-kg').placeholder = data[0].weight_kg

  if (profile?.start_weight && profile?.target_weight) {
    const card = document.getElementById('weight-progress-card')
    card.style.display = 'block'
    const current = data[0].weight_kg
    const start = profile.start_weight
    const target = profile.target_weight
    const totalDiff = start - target
    const doneDiff = start - current
    const pct = totalDiff > 0 ? Math.max(0, Math.min(100, (doneDiff / totalDiff) * 100)) : 0

    document.getElementById('weight-bar').style.width = pct + '%'
    document.getElementById('wl-start').textContent = start + ' kg'
    document.getElementById('wl-current').textContent = current + ' kg nu'
    document.getElementById('wl-target').textContent = target + ' kg'

    drawWeightChart(data.slice().reverse().slice(-15))
  }

  list.innerHTML = data.map((w, i) => {
    const prev = data[i + 1]
    let arrow = ''
    if (prev) {
      const diff = Math.round((w.weight_kg - prev.weight_kg) * 10) / 10
      if (diff < 0) arrow = `<i data-lucide="trending-down" class="weight-arrow down"></i><span class="weight-diff down">${diff} kg</span>`
      else if (diff > 0) arrow = `<i data-lucide="trending-up" class="weight-arrow up"></i><span class="weight-diff up">+${diff} kg</span>`
      else arrow = `<i data-lucide="minus" class="weight-arrow flat"></i><span class="weight-diff flat">±0</span>`
    }
    return `
    <div class="item-card">
      <div class="item-top">
        <span class="item-title"><i data-lucide="scale"></i> ${w.weight_kg} kg ${arrow}</span>
        <span style="display:flex;align-items:center;gap:8px;">
          <span class="item-date">${fmtDate(w.date)}</span>
          <button onclick="event.stopPropagation();deleteWeight('${w.id}')" style="background:none;border:none;color:var(--dim);font-size:0.8rem;cursor:pointer;padding:2px 4px;" title="Radera">🗑</button>
        </span>
      </div>
    </div>`
  }).join('')
  lucide.createIcons()
}

async function deleteWeight(id) {
  if (!confirm('Radera denna vikloggning?')) return
  const { error } = await db.from('weight_logs').delete().eq('id', id)
  if (error) { alert('Kunde inte radera: ' + error.message); return }
  loadWeights(); loadWeightHomeCard()
}

function drawWeightChart(entries) {
  if (entries.length < 1) return
  const svg = document.getElementById('weight-chart')
  const W = 300, H = 100
  if (!entries.length) { svg.innerHTML = ''; return }

  const startW  = profile?.start_weight
  const targetW = profile?.target_weight
  const goalDate = profile?.goal_date

  // Datumbaserad X-axel
  const firstDate = new Date(entries[0].date + 'T00:00:00')
  const lastEntryDate = new Date(entries[entries.length - 1].date + 'T00:00:00')
  const goalD = goalDate ? new Date(goalDate + 'T00:00:00') : null
  const maxDate = goalD && goalD > lastEntryDate ? goalD : lastEntryDate
  const timeRange = Math.max(maxDate - firstDate, 1)
  const toX = dateStr => ((new Date(dateStr + 'T00:00:00') - firstDate) / timeRange) * W

  const allW = entries.map(e => e.weight_kg)
  if (startW)  allW.push(startW)
  if (targetW) allW.push(targetW)
  const minW = Math.min(...allW) - 1
  const maxW = Math.max(...allW) + 1
  const toY = w => (H - 4) - ((w - minW) / (maxW - minW)) * (H - 8) + 2

  const pts = entries.map(e => `${toX(e.date)},${toY(e.weight_kg)}`)

  // Planlinje: start_weight vid första datum → target_weight vid goal_date (gul streckad)
  let planLine = ''
  if (startW && targetW && goalDate) {
    planLine = `<line x1="0" y1="${toY(startW)}" x2="${W}" y2="${toY(targetW)}"
      stroke="#fbbf24" stroke-width="1.5" stroke-dasharray="6,4" opacity="0.55"/>`
  }

  // Prognoslinje: sista datapunkt → target (grön streckad)
  let progLine = ''
  if (targetW && goalDate && entries.length > 0) {
    const lastX = toX(entries[entries.length - 1].date)
    const lastY = toY(entries[entries.length - 1].weight_kg)
    progLine = `<line x1="${lastX}" y1="${lastY}" x2="${W}" y2="${toY(targetW)}"
      stroke="#4ade80" stroke-width="1.5" stroke-dasharray="5,4" opacity="0.7"/>`
  }

  svg.innerHTML = `
    ${planLine}
    ${progLine}
    <polyline points="${pts.join(' ')}" fill="none" stroke="#2563eb" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    ${entries.map(e => `<circle cx="${toX(e.date)}" cy="${toY(e.weight_kg)}" r="2.5" fill="#2563eb"/>`).join('')}
  `
}

function toggleExercise() {
  includeExercise = !includeExercise
  const sw = document.querySelector('.toggle-switch')
  if (sw) sw.classList.toggle('on', includeExercise)
  drawDeficitChart()
  updateCalToday()
}

async function drawDeficitChart() {
  const baseTarget = calcCalorieTarget()
  const card = document.getElementById('deficit-card')
  if (!baseTarget) { card.style.display = 'none'; return }

  const [mealsRes, workoutsRes] = await Promise.all([
    db.from('meals').select('date, calories').order('date'),
    db.from('workouts').select('date, duration_minutes, type').order('date')
  ])

  const meals = mealsRes.data || []
  const workouts = workoutsRes.data || []
  if (!meals.length) { card.style.display = 'none'; return }

  const eaten = {}, burned = {}
  meals.forEach(m => { eaten[m.date] = (eaten[m.date] || 0) + (m.calories || 0) })
  workouts.forEach(w => {
    const kcal = w.calories || Math.round(w.duration_minutes * commuteKcalPerMin(w.type))
    burned[w.date] = (burned[w.date] || 0) + kcal
  })

  const firstDate = meals[0].date
  const days = []
  let d = new Date(firstDate + 'T00:00:00')
  const todayD = new Date(today + 'T00:00:00')
  while (d <= todayD) { days.push(localDate(d)); d.setDate(d.getDate() + 1) }

  const deficits = days.map(day => {
    const e = eaten[day]
    if (e === undefined) return null
    const eff = baseTarget + (includeExercise ? (burned[day] || 0) : 0)
    return eff - e
  })

  const dataPoints = deficits.filter(d => d !== null)
  const todayDeficit = deficits[deficits.length - 1]
  const avg = dataPoints.length ? Math.round(dataPoints.reduce((s, v) => s + v, 0) / dataPoints.length) : 0

  let defStreak = 0
  for (let i = deficits.length - 1; i >= 0; i--) {
    if (deficits[i] !== null && deficits[i] > 0) defStreak++
    else if (deficits[i] !== null) break
  }

  const fmt = v => v === null ? '—' : (v >= 0 ? '+' : '') + v
  const color = v => v === null ? 'var(--muted)' : v >= 0 ? 'var(--green)' : 'var(--red)'

  document.getElementById('deficit-today').textContent = todayDeficit !== null ? fmt(todayDeficit) : '—'
  document.getElementById('deficit-today').style.color = color(todayDeficit)
  document.getElementById('deficit-avg').textContent = fmt(avg)
  document.getElementById('deficit-avg').style.color = color(avg)
  document.getElementById('deficit-streak').textContent = defStreak

  card.style.display = 'block'

  const sw = document.querySelector('.toggle-switch')
  if (sw) sw.classList.toggle('on', includeExercise)

  const W = 300, H = 80, padB = 4, padT = 8
  const chartH = H - padB - padT
  const midY = padT + chartH / 2
  const maxAbs = Math.max(200, ...dataPoints.map(Math.abs))
  const maxBars = Math.floor(W / 3)
  const visibleDays = days.slice(-maxBars)
  const visibleDeficits = deficits.slice(-maxBars)
  const vBarW = W / visibleDays.length

  const svg = document.getElementById('deficit-chart')
  const bars = visibleDays.map((day, i) => {
    const val = visibleDeficits[i]
    if (val === null) return ''
    const h = Math.max(2, Math.round((Math.abs(val) / maxAbs) * (chartH / 2)))
    const isPos = val >= 0
    const x = i * vBarW + 1
    const y = isPos ? midY : midY - h
    const isToday = day === today
    return `<rect x="${x}" y="${y}" width="${vBarW - 2}" height="${h}" rx="1.5"
      fill="${isPos ? 'var(--green)' : 'var(--red)'}" opacity="${isToday ? 1 : 0.65}"/>`
  }).join('')

  svg.innerHTML = `
    <line x1="0" y1="${midY}" x2="${W}" y2="${midY}" stroke="var(--border)" stroke-width="1"/>
    ${bars}
  `
}

async function drawWellbeingChart() {
  const fourteenAgo = new Date(); fourteenAgo.setDate(fourteenAgo.getDate() - 13)
  const since = localDate(fourteenAgo)
  const { data } = await db.from('checkins').select('date, sleep_quality, body_feeling, energy_level').gte('date', since).order('date')

  const card = document.getElementById('wellbeing-chart-card')
  if (!data?.length) { card.style.display = 'none'; return }
  card.style.display = 'block'

  const days = []
  for (let i = 13; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i)
    days.push(localDate(d))
  }

  const byDate = {}
  data.forEach(c => { byDate[c.date] = c })

  const W = 300, H = 100, pad = 8
  const chartW = W - pad * 2
  const chartH = H - pad * 2

  const toX = (i) => pad + (i / (days.length - 1)) * chartW
  const toY = (v) => pad + chartH - ((v - 1) / 4) * chartH

  const lines = [
    { key: 'sleep_quality', color: '#60a5fa' },
    { key: 'body_feeling',  color: '#4ade80' },
    { key: 'energy_level',  color: '#fbbf24' }
  ]

  const svg = document.getElementById('wellbeing-chart')
  svg.innerHTML = lines.map(({ key, color }) => {
    const pts = days.map((d, i) => byDate[d]?.[key] ? `${toX(i)},${toY(byDate[d][key])}` : null).filter(Boolean)
    if (pts.length < 2) return ''
    const dots = days.map((d, i) => {
      const v = byDate[d]?.[key]
      if (!v) return ''
      return `<circle cx="${toX(i)}" cy="${toY(v)}" r="2.5" fill="${color}"/>`
    }).join('')
    return `<polyline points="${pts.join(' ')}" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" opacity="0.9"/>${dots}`
  }).join('')
}

// ── Check-in ──────────────────────────────────────────────
function setCiMode(mode) {
  ciMode = mode
  document.getElementById('ci-morning-btn').classList.toggle('active', mode === 'morning')
  document.getElementById('ci-evening-btn').classList.toggle('active', mode === 'evening')
  document.getElementById('ci-morning-fields').style.display = mode === 'morning' ? 'block' : 'none'
  document.getElementById('ci-evening-fields').style.display = mode === 'evening' ? 'block' : 'none'
  document.getElementById('ci-card-title').textContent = mode === 'morning' ? 'Morgon-check-in' : 'Kväll-check-in'
}

function setSleepQuality(n) { sleepQuality = n; updateStars('ci-sleep-quality-stars', n) }
function setBodyFeeling(n) { bodyFeeling = n; updateStars('ci-body-feeling-stars', n) }
function setEnergy(n) { energyLevel = n; updateStars('ci-energy-stars', n) }
function setEveBody(n) { eveBodyFeeling = n; updateStars('ci-eve-body-stars', n) }

async function saveCheckin() {
  const date = val('ci-date')
  const { data: existing } = await db.from('checkins').select('id').eq('date', date).maybeSingle()

  let payload = { date }

  if (ciMode === 'morning') {
    payload.sleep_hours = floatVal('ci-sleep-hours')
    payload.sleep_quality = sleepQuality || null
    payload.body_feeling = bodyFeeling || null
    payload.morning_intention = val('ci-intention') || null
  } else {
    payload.energy_level = energyLevel || null
    payload.evening_body_feeling = eveBodyFeeling || null
    payload.evening_summary = val('ci-summary') || null
  }

  let error
  if (existing) {
    ;({ error } = await db.from('checkins').update(payload).eq('id', existing.id))
  } else {
    ;({ error } = await db.from('checkins').insert({ ...payload, user_id: currentUser.id }))
  }

  if (error) return setStatus('ci-status', 'Fel: ' + error.message, true)
  setStatus('ci-status', 'Sparat!')
  loadCheckins()
  drawWellbeingChart()
}

async function loadCheckinForm() {
  const { data } = await db.from('checkins').select('*').eq('date', today).maybeSingle()
  const note = document.getElementById('ci-existing-note')
  if (!data) { note.style.display = 'none'; return }
  note.style.display = 'block'

  if (data.sleep_hours != null) document.getElementById('ci-sleep-hours').value = data.sleep_hours
  if (data.sleep_quality)       setSleepQuality(data.sleep_quality)
  if (data.body_feeling)        setBodyFeeling(data.body_feeling)
  if (data.morning_intention)   document.getElementById('ci-intention').value = data.morning_intention

  if (data.energy_level)           setEnergy(data.energy_level)
  if (data.evening_body_feeling)   setEveBody(data.evening_body_feeling)
  if (data.evening_summary)        document.getElementById('ci-summary').value = data.evening_summary
}

async function loadCheckins() {
  const { data } = await db.from('checkins').select('*').order('date', { ascending: false }).limit(7)
  const list = document.getElementById('checkin-list')
  if (!data?.length) { list.innerHTML = '<div class="empty">Inga check-ins än.</div>'; return }
  list.innerHTML = data.map(c => {
    const parts = []
    if (c.sleep_hours != null) parts.push(`<i data-lucide="bed"></i> ${c.sleep_hours}h`)
    if (c.sleep_quality) parts.push(`Sömn ${stars(c.sleep_quality)}`)
    if (c.body_feeling) parts.push(`Kropp ${stars(c.body_feeling)}`)
    if (c.energy_level) parts.push(`Energi ${stars(c.energy_level)}`)
    return `<div class="item-card">
      <div class="item-top">
        <span class="item-title"><i data-lucide="moon"></i> Check-in</span>
        <span class="item-date">${fmtDate(c.date)}</span>
      </div>
      <div class="item-meta">${parts.join(' · ') || '—'}</div>
      ${c.morning_intention ? `<div class="item-note"><i data-lucide="sunrise"></i> ${c.morning_intention}</div>` : ''}
      ${c.evening_summary ? `<div class="item-note"><i data-lucide="moon"></i> ${c.evening_summary}</div>` : ''}
    </div>`
  }).join('')
  lucide.createIcons()
}

// ── Export ────────────────────────────────────────────────
async function exportContext() {
  const output = document.getElementById('export-output')
  const status = document.getElementById('export-status')
  status.textContent = 'Genererar...'
  status.className = 'status'

  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
  const since = sevenDaysAgo.toISOString().split('T')[0]

  const [workoutsRes, mealsRes, weightsRes, checkinsRes] = await Promise.all([
    db.from('workouts').select('*').gte('date', since).order('date'),
    db.from('meals').select('*').gte('date', since).order('date').order('created_at'),
    db.from('weight_logs').select('*').order('date', { ascending: false }).limit(10),
    db.from('checkins').select('*').gte('date', since).order('date')
  ])

  const p = profile || {}
  const latest = weightsRes.data?.[0]

  let text = `=== PERSONAL COACH KONTEXT ===\nDatum: ${today}\n\n`
  text += `PROFIL\nNamn: ${p.name || '—'}, ${p.age || '—'} år\nKonditionsnivå: ${p.fitness_level || '—'}\nTillgänglig träningstid: ${p.weekly_hours || '—'} timmar/vecka\n`
  if (p.injuries) text += `Skador/begränsningar: ${p.injuries}\n`
  if (p.motivation) text += `Motivation: ${p.motivation}\n`
  text += `\nMÅL\n${p.goal || '—'}\n`
  if (p.goal_date) {
    const days = Math.ceil((new Date(p.goal_date) - new Date()) / 86400000)
    text += `Måldatum: ${p.goal_date} (${days} dagar kvar)\n`
  }
  if (p.start_weight) text += `Vikt: Start ${p.start_weight} kg → Mål ${p.target_weight || '—'} kg → Nu ${latest?.weight_kg || '—'} kg\n`

  text += `\nTRÄNING (senaste 7 dagarna)\n`
  const workouts = workoutsRes.data || []
  if (workouts.length) {
    workouts.forEach(w => {
      text += `${w.date}: ${capitalize(w.type)} ${w.duration_minutes} min${w.distance_km ? ', ' + w.distance_km + ' km' : ''}${w.notes ? ' – ' + w.notes : ''}\n`
    })
  } else { text += `Inga träningspass loggade.\n` }

  text += `\nMAT (senaste 7 dagarna)\n`
  const meals = mealsRes.data || []
  if (meals.length) {
    meals.forEach(m => {
      text += `${m.date} ${capitalize(m.meal_type || 'Måltid')}: ${m.description}${m.health_score ? ' [betyg ' + m.health_score + '/5]' : ''}${m.calories ? ' ' + m.calories + ' kcal' : ''}${m.comment ? ' – ' + m.comment : ''}\n`
    })
  } else { text += `Inga måltider loggade.\n` }

  text += `\nVIKTUTVECKLING\n`
  const weights = weightsRes.data || []
  if (weights.length) {
    weights.slice(0, 7).reverse().forEach(w => { text += `${w.date}: ${w.weight_kg} kg\n` })
  } else { text += `Ingen vikt loggad.\n` }

  text += `\nCHECK-INS (senaste 7 dagarna)\n`
  const checkins = checkinsRes.data || []
  if (checkins.length) {
    checkins.forEach(c => {
      text += `${c.date}: Sömn ${c.sleep_hours || '—'}h (kvalitet ${c.sleep_quality || '—'}/5), kropp ${c.body_feeling || '—'}/5`
      if (c.morning_intention) text += `, intention: ${c.morning_intention}`
      if (c.energy_level) text += `, energi ${c.energy_level}/5`
      if (c.evening_summary) text += `, kväll: ${c.evening_summary}`
      text += '\n'
    })
  } else { text += `Inga check-ins loggade.\n` }

  output.textContent = text
  output.style.display = 'block'

  try {
    await navigator.clipboard.writeText(text)
    status.textContent = '✓ Kopierat till urklipp — klistra in i Claude!'
  } catch {
    status.textContent = 'Markera texten ovan och kopiera manuellt.'
  }
}

// ── Helpers ───────────────────────────────────────────────
function val(id) { return document.getElementById(id).value.trim() }
function intVal(id) { const v = parseInt(document.getElementById(id).value); return isNaN(v) ? null : v }
function floatVal(id) { const v = parseFloat(document.getElementById(id).value.replace(',', '.')); return isNaN(v) ? null : v }

const statusTimers = {}
function setStatus(id, msg, isError = false) {
  if (statusTimers[id]) { clearTimeout(statusTimers[id]); delete statusTimers[id] }
  const el = document.getElementById(id)
  el.textContent = msg
  el.className = 'status' + (isError ? ' error' : '')
  if (!isError) statusTimers[id] = setTimeout(() => { el.textContent = '' }, 3000)
}

function updateStars(containerId, n) {
  document.querySelectorAll('#' + containerId + ' button').forEach((btn, i) => {
    btn.classList.toggle('on', i < n)
  })
}

function localDate(d) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}

function capitalize(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : '' }

function fmtDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('sv-SE', { weekday: 'short', month: 'short', day: 'numeric' })
}

function stars(n) { return '★'.repeat(n) + '☆'.repeat(5 - n) }

function prevDay(dateStr) {
  const d = new Date(dateStr + 'T00:00:00')
  d.setDate(d.getDate() - 1)
  return localDate(d)
}

function getWeekStart() {
  const d = new Date()
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  d.setDate(diff)
  return localDate(d)
}

// ── Strava OAuth ──────────────────────────────────────────
function connectStrava() {
  const url = `https://www.strava.com/oauth/authorize?client_id=${STRAVA_CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(STRAVA_REDIRECT_URI)}&approval_prompt=force&scope=activity:read_all,activity:write,profile:read_all`
  window.location.href = url
}

async function handleStravaCallback() {
  const params = new URLSearchParams(window.location.search)
  const code = params.get('code')
  if (!code) return

  window.history.replaceState({}, '', window.location.pathname)

  const resp = await fetch('https://www.strava.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: STRAVA_CLIENT_ID,
      client_secret: STRAVA_CLIENT_SECRET,
      code,
      grant_type: 'authorization_code'
    })
  })
  const data = await resp.json()
  if (!data.access_token) { alert('Strava-koppling misslyckades: ' + (data.message || 'okänt fel')); return }

  let bikeGearId = null
  try {
    const athleteResp = await fetch('https://www.strava.com/api/v3/athlete', {
      headers: { 'Authorization': `Bearer ${data.access_token}` }
    })
    const athlete = await athleteResp.json()
    const bikeName = settings.strava_bike_name?.toLowerCase() || 'merida'
    const merida = (athlete.bikes || []).find(b => b.name?.toLowerCase().includes(bikeName))
    if (merida) bikeGearId = merida.id
  } catch(e) {}

  await db.from('strava_tokens').delete().eq('user_id', currentUser.id)
  await db.from('strava_tokens').insert({
    user_id: currentUser.id,
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expires_at: data.expires_at,
    athlete_id: data.athlete?.id,
    athlete_name: data.athlete ? `${data.athlete.firstname} ${data.athlete.lastname}` : null,
    bike_gear_id: bikeGearId
  })
}

async function getStravaToken() {
  const { data } = await db.from('strava_tokens').select('*').limit(1).maybeSingle()
  if (!data) return null

  if (data.expires_at < Math.floor(Date.now() / 1000) - 60) {
    const resp = await fetch('https://www.strava.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: STRAVA_CLIENT_ID,
        client_secret: STRAVA_CLIENT_SECRET,
        refresh_token: data.refresh_token,
        grant_type: 'refresh_token'
      })
    })
    const refreshed = await resp.json()
    if (!refreshed.access_token) return null
    await db.from('strava_tokens').update({
      access_token: refreshed.access_token,
      refresh_token: refreshed.refresh_token,
      expires_at: refreshed.expires_at
    }).eq('id', data.id)
    return refreshed.access_token
  }
  return data.access_token
}

async function loadStravaStatus() {
  const { data } = await db.from('strava_tokens').select('athlete_name').limit(1).maybeSingle()
  const el = document.getElementById('strava-status')
  const btn = document.getElementById('strava-btn')
  if (data) {
    el.textContent = `✓ Kopplad${data.athlete_name ? ' som ' + data.athlete_name : ''}`
    el.style.color = 'var(--green)'
    btn.textContent = 'Koppla om Strava'
  } else {
    el.textContent = 'Inte kopplat'
    el.style.color = 'var(--muted)'
    btn.textContent = '🔗 Koppla Strava'
  }
}

async function pushToStrava(token, workoutId, type, count, totalMin, totalKm) {
  const stravaType = type === 'pendling-cykling' ? 'Ride' : 'Walk'
  const name = type === 'pendling-cykling' ? `🚴 Pendling cykel` : `🚶 Pendling promenad`

  let bikeGearId = null
  if (type === 'pendling-cykling') {
    const { data: tokenData } = await db.from('strava_tokens').select('bike_gear_id').limit(1).maybeSingle()
    bikeGearId = tokenData?.bike_gear_id || null
  }

  const { data: otherCommutes } = await db.from('workouts')
    .select('id').eq('date', today).in('type', ['pendling-cykling', 'pendling-promenad']).neq('type', type)
  const isSecond = (otherCommutes || []).length > 0
  const baseHour = type === 'pendling-cykling' ? settings.commute_bike_start_hour : settings.commute_walk_start_hour
  const startHour = isSecond ? baseHour + 9 : baseHour
  const [y, m, d] = today.split('-').map(Number)
  const startDate = new Date(y, m - 1, d, startHour, 30, 0)

  const { data: existing } = await db.from('workouts').select('strava_activity_id').eq('id', workoutId).maybeSingle()
  const privacyBody = { commute: true, hide_from_home: true }
  const putBody = { name, description: `${count} t/r loggat via Personal Coach`, ...privacyBody }

  const doPut = async (activityId) => {
    const r = await fetch(`https://www.strava.com/api/v3/activities/${activityId}`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(putBody)
    })
    if (!r.ok) throw new Error(`PUT misslyckades (HTTP ${r.status}): ${await r.text()}`)
  }

  if (existing?.strava_activity_id) {
    await doPut(existing.strava_activity_id)
  } else {
    const postResp = await fetch('https://www.strava.com/api/v3/activities', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name, type: stravaType,
        start_date_local: startDate.toISOString(),
        elapsed_time: totalMin * 60,
        distance: totalKm * 1000,
        description: `${count} t/r loggat via Personal Coach`,
        commute: true, hide_from_home: true,
        ...(bikeGearId ? { gear_id: bikeGearId } : {})
      })
    })
    const rawText = await postResp.text()

    let activityId = null
    if (postResp.status === 409) {
      const dayStart = Math.floor(new Date(`${today}T00:00:00`).getTime() / 1000)
      const dayEnd   = dayStart + 86400
      const listResp = await fetch(`https://www.strava.com/api/v3/athlete/activities?after=${dayStart}&before=${dayEnd}&per_page=10`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (listResp.ok) {
        const acts = await listResp.json()
        const match = acts.find(a => a.type === stravaType || a.sport_type === stravaType)
        if (match) activityId = match.id
      }
      if (!activityId) throw new Error(`HTTP 409 — kunde inte hitta befintlig aktivitet på Strava`)
    } else {
      if (!postResp.ok) throw new Error(`HTTP ${postResp.status}: ${rawText}`)
      activityId = JSON.parse(rawText).id
    }

    if (activityId) {
      await db.from('workouts').update({ strava_activity_id: activityId }).eq('id', workoutId)
      const putResp = await fetch(`https://www.strava.com/api/v3/activities/${activityId}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(putBody)
      })
      if (!putResp.ok) {
        const putErr = await putResp.text()
        throw new Error(`Aktivitet skapad men privacy misslyckades (HTTP ${putResp.status}): ${putErr}`)
      }
    }
  }
}

async function syncFromStrava() {
  setStatus('strava-sync-status', 'Hämtar från Strava...')
  const token = await getStravaToken()
  if (!token) {
    setStatus('strava-sync-status', '⚠️ Koppla Strava i Profil-fliken först.', true)
    return
  }

  const { data: existingRows } = await db.from('workouts').select('strava_activity_id').not('strava_activity_id', 'is', null)
  const existingIds = new Set((existingRows || []).map(w => String(w.strava_activity_id)))

  const after = Math.floor((Date.now() - 14 * 24 * 60 * 60 * 1000) / 1000)
  let resp
  try {
    resp = await fetch(`https://www.strava.com/api/v3/athlete/activities?after=${after}&per_page=100`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
  } catch (e) {
    setStatus('strava-sync-status', '⚠️ Nätverksfel mot Strava.', true)
    return
  }

  if (!resp.ok) {
    if (resp.status === 401 || resp.status === 403) {
      setStatus('strava-sync-status', '⚠️ Saknar läsbehörighet — koppla om Strava i Profil-fliken.', true)
    } else {
      setStatus('strava-sync-status', `⚠️ Strava fel: ${resp.status}`, true)
    }
    return
  }

  const activities = await resp.json()
  const toImport = activities.filter(a => !existingIds.has(String(a.id)))

  if (!toImport.length) { setStatus('strava-sync-status', 'Inget nytt att hämta.'); return }

  const rows = toImport.map(a => ({
    user_id: currentUser.id,
    type: mapStravaType(a.sport_type || a.type),
    date: a.start_date_local.split('T')[0],
    duration_minutes: Math.round(a.elapsed_time / 60),
    distance_km: a.distance ? Math.round(a.distance / 100) / 10 : null,
    calories: a.calories > 0 ? a.calories : a.kilojoules > 0 ? Math.round(a.kilojoules * 0.239) : null,
    strava_activity_id: a.id,
    notes: a.name || null
  }))

  const { error } = await db.from('workouts').insert(rows)
  if (error) { setStatus('strava-sync-status', `⚠️ Fel: ${error.message}`, true); return }

  setStatus('strava-sync-status', `✓ Hämtade ${toImport.length} pass — uppdaterar kalorier...`)
  await fillMissingCalories(token)
  loadWorkouts()
}

async function fillMissingCalories(token) {
  const { data: missing } = await db.from('workouts')
    .select('id, strava_activity_id, type, duration_minutes')
    .not('strava_activity_id', 'is', null)
    .or('calories.is.null,calories.eq.0')

  if (!missing?.length) { setStatus('strava-sync-status', `✓ Synkat och kalorier uppdaterade`); return }

  let updated = 0
  for (const w of missing) {
    const resp = await fetch(`https://www.strava.com/api/v3/activities/${w.strava_activity_id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    if (!resp.ok) continue
    const detail = await resp.json()
    let kcal = detail.calories > 0 ? detail.calories
             : detail.kilojoules > 0 ? Math.round(detail.kilojoules * 0.239)
             : null
    if (!kcal && w.duration_minutes > 0) {
      kcal = Math.round(commuteKcalPerMin(w.type) * w.duration_minutes)
    }
    if (kcal) { await db.from('workouts').update({ calories: kcal }).eq('id', w.id); updated++ }
  }

  setStatus('strava-sync-status', `✓ Synkat · ${updated} pass fick kalorier`)
}

function mapStravaType(t) {
  const map = {
    Run: 'löpning', VirtualRun: 'löpning', TrailRun: 'löpning',
    Ride: 'cykling', VirtualRide: 'cykling', GravelRide: 'cykling',
    MountainBikeRide: 'cykling', EMountainBikeRide: 'cykling', EBikeRide: 'cykling',
    Swim: 'simning',
    WeightTraining: 'gym', Workout: 'gym', Crossfit: 'gym',
    HighIntensityIntervalTraining: 'gym',
  }
  return map[t] || 'annat'
}

// ── Målvikt-förslag ───────────────────────────────────────
function updateWeightSuggestions() {
  const startWeight = floatVal('p-start-weight')
  const goalDate = val('p-goal-date')
  const box = document.getElementById('weight-suggestions')
  const list = document.getElementById('weight-suggestion-list')

  if (!startWeight || !goalDate) { box.style.display = 'none'; return }

  const weeks = Math.max(1, Math.round((new Date(goalDate) - new Date()) / (7 * 86400000)))

  const tempos = [
    { label: 'Lugnt', kg: 0.25, desc: 'Hållbart och skonsamt, minimal risk för muskelmassa.' },
    { label: 'Lagom', kg: 0.5,  desc: 'Rekommenderad takt — god balans mellan tempo och hälsa.' },
    { label: 'Aggressivt', kg: 0.75, desc: 'Snabbt resultat men kräver disciplin och kan vara tufft.' },
  ]

  list.innerHTML = tempos.map(t => {
    const loss = Math.round(t.kg * weeks * 10) / 10
    const target = Math.round((startWeight - loss) * 10) / 10
    if (target < 40) return ''
    return `<button class="suggestion-btn" onclick="selectWeightSuggestion(${target}, this)">
      <div class="sug-title">${t.label} — ${target} kg <span style="color:var(--muted); font-weight:400">(−${loss} kg)</span></div>
      <div class="sug-detail">${t.kg} kg/vecka · ${weeks} veckor · ${t.desc}</div>
    </button>`
  }).join('')

  box.style.display = 'block'
}

function selectWeightSuggestion(target, btn) {
  document.getElementById('p-target-weight').value = target
  document.querySelectorAll('.suggestion-btn').forEach(b => b.classList.remove('selected'))
  btn.classList.add('selected')
}

// ── Edit-meal bottom sheet ────────────────────────────────
let _editMealId = null
let _editMealPortion = 'M'
let _editMealStars = 0

function openEditMeal(id, desc, calories, health_score) {
  _editMealId = id
  _editMealPortion = 'M'
  _editMealStars = health_score || 0

  document.getElementById('edit-meal-overlay').classList.add('open')
  document.getElementById('em-desc').value = desc || ''
  document.getElementById('em-desc')._manualEdit = false
  document.getElementById('em-cal').value = calories != null ? calories : ''
  document.getElementById('em-cal')._manualEdit = calories != null
  updateStars('em-health-stars', _editMealStars)
  document.getElementById('em-health-stars')._manualEdit = health_score > 0
  document.getElementById('em-suggest-label').textContent = ''

  setEditMealPortion('M')
  onEditMealDescInput()
}

function closeEditMeal() {
  document.getElementById('edit-meal-overlay').classList.remove('open')
  _editMealId = null
}

function setEditMealPortion(p) {
  _editMealPortion = p
  ;['S','M','L'].forEach(x => document.getElementById('em-portion-' + x)?.classList.toggle('active', x === p))
  onEditMealDescInput()
}

function onEditMealDescInput() {
  const desc = document.getElementById('em-desc')?.value || ''
  const sugg = suggestFromDescWithPortion(desc, _editMealPortion)
  const label = document.getElementById('em-suggest-label')
  const calInput = document.getElementById('em-cal')
  if (sugg) {
    if (!calInput._manualEdit) calInput.value = sugg.kcal
    if (!document.getElementById('em-health-stars')._manualEdit) {
      _editMealStars = sugg.stars
      updateStars('em-health-stars', sugg.stars)
    }
    if (label) label.textContent = '✨ förslag baserat på beskrivningen'
  } else {
    if (label) label.textContent = desc.length > 3 ? 'Ingen matchning — fyll i manuellt' : ''
  }
}

function suggestFromDescWithPortion(desc, portion) {
  if (!desc || desc.length < 3) return null
  const d = desc.toLowerCase()
  let best = null, bestLen = 0
  for (const food of FOOD_DB) {
    for (const key of food.keys) {
      if (d.includes(key) && key.length > bestLen) { best = food; bestLen = key.length }
    }
  }
  if (!best) return null
  const mult = PORTION_MULT[portion] || 1
  return { kcal: Math.round(best.kcal * mult / 10) * 10, stars: best.stars }
}

async function saveEditMeal() {
  if (!_editMealId) return
  const desc = document.getElementById('em-desc').value.trim()
  const kcal = parseInt(document.getElementById('em-cal').value)
  const visualStars = Array.from(document.querySelectorAll('#em-health-stars button')).filter(b => b.classList.contains('on')).length
  const starsToSave = visualStars || _editMealStars || null
  const updates = { calories: isNaN(kcal) ? null : kcal, health_score: starsToSave }
  if (desc) updates.description = desc
  const { error } = await db.from('meals').update(updates).eq('id', _editMealId)
  if (error) { alert('Kunde inte spara: ' + error.message); return }
  closeEditMeal()
  loadMeals(); updateCalToday()
}

async function deleteMeal() {
  if (!_editMealId) return
  if (!confirm('Radera denna måltid?')) return
  const { error } = await db.from('meals').delete().eq('id', _editMealId)
  if (error) { alert('Kunde inte radera: ' + error.message); return }
  closeEditMeal()
  loadMeals(); updateCalToday()
}

function setEditMealStars(n) {
  _editMealStars = n
  updateStars('em-health-stars', n)
  document.getElementById('em-health-stars')._manualEdit = true
}

// ── Steps (Health Connect) ────────────────────────────────
window.onHealthConnectData = function(data) {
  renderStepsCard(data)
  renderHealthConnectStatus(true)
}

function renderHealthConnectStatus(connected) {
  const card = document.getElementById('hc-settings-card')
  if (!card) return
  card.style.display = 'block'
  const label = document.getElementById('hc-status-label')
  const btn = document.getElementById('hc-connect-btn')
  const icon = document.getElementById('hc-connected-icon')
  if (connected) {
    label.textContent = 'Ansluten'
    label.style.color = 'var(--green)'
    btn.style.display = 'none'
    icon.style.display = 'inline-block'
  } else {
    label.textContent = 'Ej ansluten'
    label.style.color = 'var(--muted)'
    btn.style.display = 'inline-block'
    icon.style.display = 'none'
  }
  lucide.createIcons()
}

function requestHealthConnect() {
  if (window.AndroidBridge) window.AndroidBridge.requestPermissions()
}

function renderStepsCard(data) {
  const card = document.getElementById('steps-card')
  if (!card) return
  card.style.display = 'block'

  const today = data.today || 0
  const goal = 10000
  const pct = Math.min(100, Math.round(today / goal * 100))
  const offset = 264 - (pct / 100) * 264

  document.getElementById('steps-today-count').textContent = today.toLocaleString('sv-SE')
  document.getElementById('steps-pct-label').textContent = pct + '% av målet'
  document.getElementById('steps-bar-fill').style.width = pct + '%'
  document.getElementById('steps-ring-progress').setAttribute('stroke-dashoffset', offset)

  const weekData = data.week || {}
  const weekValues = Object.values(weekData)
  const avg = weekValues.length ? Math.round(weekValues.reduce((s, v) => s + v, 0) / weekValues.length) : 0
  document.getElementById('steps-avg').textContent = avg.toLocaleString('sv-SE')

  const days = ['Mån','Tis','Ons','Tor','Fre','Lör','Sön']
  const todayStr = localDate(new Date())
  const dates = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i); dates.push(localDate(d))
  }
  const maxVal = Math.max(...dates.map(d => weekData[d] || 0), 1)
  document.getElementById('steps-week-bars').innerHTML = dates.map(dateStr => {
    const steps = weekData[dateStr] || 0
    const h = Math.max(4, Math.round((steps / maxVal) * 36))
    const d = new Date(dateStr + 'T12:00:00')
    const dayName = days[d.getDay() === 0 ? 6 : d.getDay() - 1]
    const isToday = dateStr === todayStr
    return `<div class="steps-week-bar${isToday ? ' today' : ''}">
      <div class="steps-week-bar-fill" style="height:${h}px"></div>
      <span class="steps-week-bar-label">${dayName}</span>
    </div>`
  }).join('')
}

// ── Weekly Summary ────────────────────────────────────────
let _currentWeeklySummary = null

async function checkWeeklySummary() {
  const todayStr = localDate(new Date())
  const { data: rows } = await db.from('weekly_summaries')
    .select('week_end').order('week_end', { ascending: false }).limit(1)
  const last = rows?.[0]?.week_end ?? null
  if (!last) {
    // Ingen sammanställning ännu — spara startpunkt i localStorage som fallback
    const stored = localStorage.getItem('lastWeeklySummaryDate')
    if (!stored) { localStorage.setItem('lastWeeklySummaryDate', todayStr); return }
    const daysSince = Math.round((new Date(todayStr) - new Date(stored)) / 86400000)
    if (daysSince < 7) return
    const summary = await generateWeeklySummary(stored, todayStr)
    _currentWeeklySummary = summary
    showWeeklySummaryModal(summary)
    return
  }
  const daysSince = Math.round((new Date(todayStr) - new Date(last)) / 86400000)
  if (daysSince < 7) return
  const summary = await generateWeeklySummary(last, todayStr)
  _currentWeeklySummary = summary
  showWeeklySummaryModal(summary)
}

async function generateWeeklySummary(fromDate, toDate) {
  const [wRes, mRes, cRes, wtRes] = await Promise.all([
    db.from('workouts').select('*').gte('date', fromDate).lt('date', toDate),
    db.from('meals').select('date,calories').gte('date', fromDate).lt('date', toDate),
    db.from('checkins').select('date,sleep_hours,sleep_quality').gte('date', fromDate).lt('date', toDate),
    db.from('weight_logs').select('date,weight_kg').gte('date', fromDate).lt('date', toDate).order('date')
  ])
  const workouts = wRes.data || []
  const meals = mRes.data || []
  const checkins = cRes.data || []
  const weights = wtRes.data || []

  // Vikt
  const weightStart = weights[0]?.weight_kg ?? null
  const weightEnd = weights[weights.length - 1]?.weight_kg ?? null
  const weightDiff = (weightStart && weightEnd) ? Math.round((weightEnd - weightStart) * 10) / 10 : null

  // Träning
  const realWorkouts = workouts.filter(w => !w.type.startsWith('pendling'))
  const commuteWorkouts = workouts.filter(w => w.type.startsWith('pendling'))
  const totalMin = realWorkouts.reduce((s, w) => s + (w.duration_minutes || 0), 0)
  const totalKm = [...realWorkouts, ...commuteWorkouts].reduce((s, w) => s + (w.distance_km || 0), 0)
  const commuteKm = commuteWorkouts.reduce((s, w) => s + (w.distance_km || 0), 0)

  // Mat
  const mealDays = [...new Set(meals.map(m => m.date))]
  const totalCal = meals.reduce((s, m) => s + (m.calories || 0), 0)
  const avgCal = mealDays.length ? Math.round(totalCal / mealDays.length) : null

  // Sömn
  const sleepEntries = checkins.filter(c => c.sleep_hours > 0)
  const avgSleep = sleepEntries.length ? Math.round(sleepEntries.reduce((s, c) => s + c.sleep_hours, 0) / sleepEntries.length * 10) / 10 : null
  const avgQuality = sleepEntries.filter(c => c.sleep_quality).length
    ? Math.round(sleepEntries.filter(c => c.sleep_quality).reduce((s, c) => s + c.sleep_quality, 0) / sleepEntries.filter(c => c.sleep_quality).length * 10) / 10 : null

  // Kul detalj
  const highlights = []
  if (commuteKm > 0) highlights.push(`Du pendlade ${Math.round(commuteKm * 10) / 10} km den här veckan 🚴`)
  if (sleepEntries.length) {
    const best = sleepEntries.reduce((a, b) => a.sleep_hours > b.sleep_hours ? a : b)
    highlights.push(`Din bästa natt var ${best.sleep_hours}h sömn 😴`)
  }
  if (realWorkouts.length >= 4) highlights.push(`Starkt jobbat — ${realWorkouts.length} pass på en vecka! 💪`)
  if (weightDiff !== null && weightDiff < 0) highlights.push(`Du gick ner ${Math.abs(weightDiff)} kg den här veckan ⬇️`)
  if (mealDays.length >= 6) highlights.push(`Du loggade mat ${mealDays.length} av 7 dagar 🍽️`)
  const highlight = highlights[Math.floor(Math.random() * highlights.length)] || null

  // Veckoetikett
  const d1 = new Date(fromDate + 'T00:00:00')
  const d2 = new Date(toDate + 'T00:00:00')
  d2.setDate(d2.getDate() - 1)
  const fmt = d => d.toLocaleDateString('sv-SE', { day: 'numeric', month: 'short' })
  const weekLabel = `${fmt(d1)} – ${fmt(d2)}`

  return { fromDate, toDate, weekLabel, weightStart, weightEnd, weightDiff, workoutCount: realWorkouts.length, totalMin, totalKm: Math.round(totalKm * 10) / 10, avgCal, mealDaysLogged: mealDays.length, avgSleep, avgQuality, highlight }
}

function showWeeklySummaryModal(s) {
  const fmt = n => n != null ? n : '—'
  const diffColor = s.weightDiff < 0 ? 'var(--green)' : s.weightDiff > 0 ? 'var(--red)' : 'var(--muted)'
  const diffSign = s.weightDiff > 0 ? '+' : ''

  document.getElementById('ws-week-label').textContent = s.weekLabel
  document.getElementById('ws-title').textContent = 'Veckorapport'

  const h = n => Math.floor(n / 60) + 'h ' + (n % 60) + 'min'

  document.getElementById('ws-grid').innerHTML = `
    <div class="ws-card">
      <div class="ws-card-label"><i data-lucide="scale"></i> Vikt</div>
      <div class="ws-card-val">${s.weightEnd != null ? s.weightEnd + ' kg' : '—'}</div>
      ${s.weightDiff != null ? `<div class="ws-card-diff" style="color:${diffColor}">${diffSign}${s.weightDiff} kg</div>` : '<div class="ws-card-sub">Ej loggad</div>'}
      ${s.weightStart != null ? `<div class="ws-card-sub">${s.weightStart} → ${s.weightEnd} kg</div>` : ''}
    </div>
    <div class="ws-card">
      <div class="ws-card-label"><i data-lucide="dumbbell"></i> Träning</div>
      <div class="ws-card-val">${s.workoutCount} pass</div>
      <div class="ws-card-sub">${s.totalMin > 0 ? h(s.totalMin) : '—'}${s.totalKm > 0 ? ' · ' + s.totalKm + ' km' : ''}</div>
    </div>
    <div class="ws-card">
      <div class="ws-card-label"><i data-lucide="utensils"></i> Mat</div>
      <div class="ws-card-val">${s.avgCal != null ? s.avgCal + ' kcal' : '—'}</div>
      <div class="ws-card-sub">${s.avgCal != null ? 'snitt/dag · ' + s.mealDaysLogged + ' dagar' : 'Ej loggad'}</div>
    </div>
    <div class="ws-card">
      <div class="ws-card-label"><i data-lucide="moon"></i> Sömn</div>
      <div class="ws-card-val">${s.avgSleep != null ? s.avgSleep + 'h' : '—'}</div>
      <div class="ws-card-sub">${s.avgQuality != null ? '⭐ ' + s.avgQuality + '/5 snitt' : 'Ej loggad'}</div>
    </div>`

  const hlEl = document.getElementById('ws-highlight')
  if (s.highlight) { hlEl.textContent = s.highlight; hlEl.style.display = 'block' }
  else hlEl.style.display = 'none'

  document.getElementById('ws-export-status').textContent = ''
  document.getElementById('weekly-summary-modal').style.display = 'block'
  lucide.createIcons()
}

async function dismissWeeklySummary() {
  document.getElementById('weekly-summary-modal').style.display = 'none'
  if (!_currentWeeklySummary) return
  const s = _currentWeeklySummary
  localStorage.setItem('lastWeeklySummaryDate', s.toDate)
  await db.from('weekly_summaries').upsert({
    user_id: currentUser.id,
    week_start: s.fromDate,
    week_end: s.toDate,
    data: s
  }, { onConflict: 'user_id,week_start' })
  loadWeeklyReports()
}

function exportWeeklySummary() {
  const s = _currentWeeklySummary
  if (!s) return
  const h = n => Math.floor(n / 60) + 'h ' + (n % 60) + 'min'
  const sign = s.weightDiff > 0 ? '+' : ''
  const lines = [
    `Veckorapport ${s.weekLabel}`,
    '',
    s.weightEnd != null ? `⚖️ Vikt: ${s.weightStart} → ${s.weightEnd} kg (${sign}${s.weightDiff} kg)` : '⚖️ Vikt: ej loggad',
    s.workoutCount > 0 ? `🏋️ Träning: ${s.workoutCount} pass · ${h(s.totalMin)}${s.totalKm > 0 ? ' · ' + s.totalKm + ' km' : ''}` : '🏋️ Träning: inga pass',
    s.avgCal != null ? `🍽️ Mat: ${s.avgCal} kcal/dag snitt (${s.mealDaysLogged} dagar loggade)` : '🍽️ Mat: ej loggad',
    s.avgSleep != null ? `😴 Sömn: ${s.avgSleep}h snitt${s.avgQuality ? ' · ⭐ ' + s.avgQuality + '/5' : ''}` : '😴 Sömn: ej loggad',
    s.highlight ? `\n✨ ${s.highlight}` : ''
  ].filter(l => l !== undefined)
  navigator.clipboard.writeText(lines.join('\n'))
  document.getElementById('ws-export-status').textContent = '✓ Kopierat!'
}

let _weeklyReportsCache = []

async function loadWeeklyReports() {
  const card = document.getElementById('weekly-reports-card')
  const list = document.getElementById('weekly-reports-list')
  const { data: rows } = await db.from('weekly_summaries')
    .select('data').order('week_start', { ascending: false })
  const history = (rows || []).map(r => r.data)
  _weeklyReportsCache = history
  if (!history.length) { card.style.display = 'none'; return }
  card.style.display = 'block'
  list.innerHTML = history.map((s, i) => {
    const sign = s.weightDiff > 0 ? '+' : ''
    const meta = [
      s.workoutCount ? s.workoutCount + ' pass' : null,
      s.avgCal ? s.avgCal + ' kcal/dag' : null,
      s.weightDiff != null ? sign + s.weightDiff + ' kg' : null
    ].filter(Boolean).join(' · ')
    return `<div class="weekly-report-item" onclick="viewWeeklyReport(${i})">
      <div>
        <div class="wri-label" style="font-weight:600; font-size:0.9rem;">${s.weekLabel}</div>
        <div style="font-size:0.78rem; color:var(--muted); margin-top:2px;">${meta || '—'}</div>
      </div>
      <i data-lucide="chevron-right" style="width:16px;height:16px;color:var(--dim);"></i>
    </div>`
  }).join('')
  lucide.createIcons()
}

function viewWeeklyReport(index) {
  const s = _weeklyReportsCache[index]
  if (!s) return
  _currentWeeklySummary = s
  showWeeklySummaryModal(s)
}

// ── Auth ──────────────────────────────────────────────────
function showLogin() {
  document.getElementById('login-screen').style.display = 'flex'
  document.getElementById('app').style.display = 'none'
  const vEl = document.getElementById('login-version')
  if (vEl) vEl.textContent = APP_VERSION
}

function showApp() {
  document.getElementById('login-screen').style.display = 'none'
  document.getElementById('app').style.display = 'block'
  const el = document.getElementById('logged-in-as')
  if (el && currentUser) el.textContent = 'Inloggad som ' + currentUser.email
  init()
}

let _passwordLoginMode = false

function togglePasswordLogin(force) {
  _passwordLoginMode = force !== undefined ? force : !_passwordLoginMode
  document.getElementById('login-password-row').style.display = _passwordLoginMode ? 'block' : 'none'
  document.getElementById('login-toggle-pw').textContent = _passwordLoginMode ? 'Använd magic link istället' : 'Använd lösenord istället'
}

async function handleLogin() {
  const email = document.getElementById('login-email').value.trim()
  const statusEl = document.getElementById('login-status')
  if (!email) { statusEl.textContent = 'Ange en e-postadress.'; return }

  if (_passwordLoginMode) {
    const password = document.getElementById('login-password').value
    if (!password) { statusEl.textContent = 'Ange lösenord.'; return }
    statusEl.textContent = 'Loggar in...'
    const { error } = await db.auth.signInWithPassword({ email, password })
    if (error) { statusEl.textContent = 'Fel: ' + error.message; return }
  } else {
    statusEl.textContent = 'Skickar...'
    const { error } = await db.auth.signInWithOtp({ email, options: { emailRedirectTo: window.location.href } })
    if (error) { statusEl.textContent = 'Fel: ' + error.message; return }
    statusEl.textContent = '✓ Kolla din inbox! Klicka på länken i mejlet.'
  }
}

async function setNewPassword() {
  const password = document.getElementById('new-password').value
  const statusEl = document.getElementById('set-password-status')
  if (password.length < 6) { statusEl.textContent = 'Minst 6 tecken.'; return }
  const { error } = await db.auth.updateUser({ password })
  if (error) { statusEl.textContent = 'Fel: ' + error.message; return }
  statusEl.textContent = '✓ Lösenord sparat!'
  setTimeout(showApp, 1000)
}

async function signOut() {
  await db.auth.signOut()
}

async function startApp() {
  showLogin() // visa login direkt som default

  db.auth.onAuthStateChange((event, session) => {
    currentUser = session?.user ?? null
    if (event === 'PASSWORD_RECOVERY') {
      document.getElementById('login-screen').style.display = 'none'
      document.getElementById('app').style.display = 'none'
      document.getElementById('set-password-screen').style.display = 'flex'
    } else if (currentUser) {
      showApp()
    } else {
      showLogin()
    }
  })

  try { await db.auth.getSession() } catch(e) {}
}

// ── Boot ──────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('p-goal-date').addEventListener('change', updateWeightSuggestions)

  document.querySelectorAll('input, select, textarea').forEach(el => {
    el.addEventListener('focus', () => {
      setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'center' }), 300)
    })
  })
})

startApp()
