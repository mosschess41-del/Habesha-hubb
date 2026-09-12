// ==========================================
// DATA (all fictional — nature photos from Picsum used as placeholder avatars,
// no real people, no payment, no verification)
// ==========================================

function img(seed, w = 300, h = 300) {
    return `https://picsum.photos/seed/${seed}/${w}/${h}`;
}

const models = [
    { id: 1, name: "Selam",   age: 23, city: "Addis Ababa", km: 2.4,  plan: "Free",    bio: "Coffee enthusiast and weekend hiker. Always up for a good chat.", img: img("mountain1") },
    { id: 2, name: "Hana",    age: 26, city: "Hawassa",      km: 5.1,  plan: "Premium", bio: "Lake mornings and long walks. Loves music and photography.", img: img("lake2") },
    { id: 3, name: "Meron",   age: 21, city: "Bahir Dar",    km: 8.7,  plan: "Free",    bio: "Studying design, obsessed with sunsets and good playlists.", img: img("forest3") },
    { id: 4, name: "Tigist",  age: 28, city: "Adama",        km: 1.2,  plan: "Premium", bio: "Runs a small bakery. Dog mom. Big fan of road trips.", img: img("desert4") },
    { id: 5, name: "Ruth",    age: 24, city: "Mekelle",      km: 12.3, plan: "Free",    bio: "Nurse by day, painter by night. Loves the highlands.", img: img("valley5") },
    { id: 6, name: "Betty",   age: 29, city: "Dire Dawa",    km: 6.6,  plan: "Free",    bio: "Into hiking, spicy food, and terrible puns.", img: img("canyon6") },
    { id: 7, name: "Sara",    age: 22, city: "Gondar",       km: 3.9,  plan: "Premium", bio: "History nerd exploring castles on weekends.", img: img("meadow7") },
    { id: 8, name: "Yordanos",age: 27, city: "Jimma",        km: 9.4,  plan: "Free",    bio: "Coffee farm roots. Loves rainy season and reading.", img: img("glacier8") },
    { id: 9, name: "Kalkidan",age: 25, city: "Bishoftu",     km: 4.0,  plan: "Premium", bio: "Lake town girl. Cycling, yoga, and good conversations.", img: img("dune9") },
    { id: 10,name: "Nardos",  age: 20, city: "Addis Ababa",  km: 0.8,  plan: "Free",    bio: "First-year student. Loves cats and city walks.", img: img("river10") }
];

const groupNames = [
    "Coffee Lovers Addis", "Football Fans ET", "Travel Ethiopia", "Book Club Habesha",
    "Music Makers", "Foodies Hub", "Tech Talk ET", "Art & Design",
    "Fitness Squad", "Movie Buffs"
];

function buildGroupMessages(seedBase) {
    const lines = [
        "Good morning everyone! ☀️", "Anyone up for a meetup this weekend?",
        "Just tried a new spot downtown, highly recommend!", "Haha that's hilarious 😂",
        "Does anyone have recommendations for a good place nearby?", "Count me in!",
        "What time works for everyone?", "This group is so wholesome, love it here.",
        "Sharing a pic from earlier 👇", "That looks amazing!",
        "Can someone send the address?", "I'll be a bit late, save me a seat 😅",
        "Thanks for organizing this!", "Who else is coming on Saturday?",
        "This made my day, thank you!", "Sending a photo from the trip 📸",
        "Let's plan the next one already!", "Great turnout today everyone!",
        "I'm free after 6pm if anyone wants to hang out.", "See you all soon!"
    ];
    const msgs = [];
    for (let i = 0; i < 20; i++) {
        if (i === 6 || i === 13 || i === 17) {
            msgs.push({ type: i % 2 === 0 ? "received" : "sent", kind: "image", img: img(seedBase + "-photo" + i, 300, 200) });
        } else {
            msgs.push({ type: i % 2 === 0 ? "received" : "sent", kind: "text", text: lines[i % lines.length] });
        }
    }
    return msgs;
}

const groups = groupNames.map((name, i) => ({
    id: i + 1,
    name: name,
    members: `${(Math.random() * 5 + 0.5).toFixed(1)}k Members`,
    img: img("group" + (i + 1)),
    messages: i < 3 ? buildGroupMessages("g" + (i + 1)) : []
}));

const staticVideos = Array.from({ length: 10 }, (_, i) => ({
    title: "Video", sub: `${Math.floor(Math.random() * 20 + 1)}K Views`, img: img("clip" + i)
}));

const staticStreams = Array.from({ length: 8 }, (_, i) => ({
    title: "Live", sub: `${Math.floor(Math.random() * 90 + 5)} Watching`, img: img("stream" + i)
}));

const simulatedReplies = [
    "Hey! How's your day going? 😊",
    "That's really interesting, tell me more!",
    "Haha, no way!",
    "I was just thinking about that too.",
    "Sounds like a plan!",
    "Sorry, got a bit busy earlier. What's up?",
    "That made me smile 🙂",
    "Same here, honestly.",
    "Let's talk more about this later?",
    "Thanks for sharing that with me!"
];
let replyIndex = 0;

// ==========================================
// STATE
// ==========================================
let activeChatContext = null; // { type: 'model'|'group', data, log: [] }

// ==========================================
// GRID RENDERING
// ==========================================
function switchCategory(category, btn) {
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderGrid(category);
}

function renderGrid(category) {
    const grid = document.getElementById('contentGrid');
    grid.innerHTML = '';
    grid.classList.toggle('grid-2col', category === 'streams');

    if (category === 'models') {
        models.forEach(m => {
            const card = document.createElement('div');
            card.className = 'card-model';
            card.onclick = () => openModelSheet(m);
            card.innerHTML = `
                <img src="${m.img}" alt="${m.name}">
                <div class="name">${m.name}</div>
                <div class="sub">${m.city}</div>
            `;
            grid.appendChild(card);
        });
    } else if (category === 'groups') {
        groups.forEach(g => {
            const card = document.createElement('div');
            card.className = 'card-group';
            card.onclick = () => openGroupChat(g);
            card.innerHTML = `
                <img src="${g.img}" alt="${g.name}">
                <div>
                    <div class="title">${g.name}</div>
                    <div class="sub">${g.members}</div>
                </div>
            `;
            grid.appendChild(card);
        });
    } else if (category === 'videos') {
        staticVideos.forEach(v => {
            const card = document.createElement('div');
            card.className = 'card-static';
            card.innerHTML = `
                <img src="${v.img}" alt="video">
                <div class="info">
                    <div class="title">${v.title}</div>
                    <div class="sub">${v.sub}</div>
                    <span class="badge">Preview only</span>
                </div>
            `;
            grid.appendChild(card);
        });
    } else if (category === 'streams') {
        staticStreams.forEach(s => {
            const card = document.createElement('div');
            card.className = 'card-static';
            card.innerHTML = `
                <img src="${s.img}" alt="live">
                <div class="info">
                    <div class="title">${s.title}</div>
                    <div class="sub">${s.sub}</div>
                    <span class="badge">Preview only</span>
                </div>
            `;
            grid.appendChild(card);
        });
    }
}

// ==========================================
// MODEL PROFILE SHEET
// ==========================================
function openModelSheet(model) {
    const sheet = document.getElementById('detailSheet');
    const planClass = model.plan === 'Free' ? 'plan-free' : 'plan-premium';
    sheet.innerHTML = `
        <div class="sheet-handle" onclick="closeSheet()"></div>
        <img src="${model.img}" class="sheet-avatar" alt="${model.name}">
        <div class="sheet-name">${model.name}</div>
        <div class="sheet-meta"><i class="fa-solid fa-location-dot"></i> ${model.city}</div>
        <div class="info-row"><span>Age</span><span>${model.age}</span></div>
        <div class="info-row"><span>City</span><span>${model.city}</span></div>
        <div class="info-row"><span>Plan</span><span class="${planClass}">${model.plan}</span></div>
        <div class="info-row"><span>Distance from you</span><span>${model.km} km</span></div>
        <div class="sheet-bio">${model.bio}</div>
        <button class="sheet-btn" onclick="openModelChat(${model.id})"><i class="fa-solid fa-comments"></i> Chat</button>
    `;
    sheet.classList.add('open');
}

function closeSheet() {
    document.getElementById('detailSheet').classList.remove('open');
}

// ==========================================
// CHAT OVERLAY (shared by model chat + group chat)
// ==========================================
function renderChatMessages() {
    const container = document.getElementById('chatOverlayMessages');
    container.innerHTML = '';
    if (activeChatContext.log.length === 0) {
        container.innerHTML = `<div class="msg-empty">No messages yet. Say hi!</div>`;
        return;
    }
    activeChatContext.log.forEach(m => {
        const bubble = document.createElement('div');
        if (m.kind === 'image') {
            bubble.className = `msg image-msg ${m.type}`;
            bubble.innerHTML = `<img src="${m.img}" alt="shared photo">`;
        } else {
            bubble.className = `msg ${m.type}`;
            bubble.innerText = m.text;
        }
        container.appendChild(bubble);
    });
    container.scrollTop = container.scrollHeight;
}

function openChatOverlay(name, avatar) {
    const header = document.getElementById('chatOverlayHeader');
    header.innerHTML = `
        <i class="fa-solid fa-chevron-left back" onclick="closeChatOverlay()"></i>
        <img src="${avatar}" alt="${name}">
        <div>
            <div class="name">${name}</div>
            <div class="status">Active now</div>
        </div>
    `;
    renderChatMessages();
    document.getElementById('chatOverlay').classList.add('open');
}

function closeChatOverlay() {
    document.getElementById('chatOverlay').classList.remove('open');
    activeChatContext = null;
}

function openModelChat(modelId) {
    const model = models.find(m => m.id === modelId);
    closeSheet();
    activeChatContext = { type: 'model', data: model, log: [] };
    openChatOverlay(model.name, model.img);
}

function openGroupChat(group) {
    activeChatContext = { type: 'group', data: group, log: group.messages.slice() };
    openChatOverlay(group.name, group.img);
}

function sendChatMessage(e) {
    e.preventDefault();
    const input = document.getElementById('chatOverlayInput');
    const text = input.value.trim();
    if (!text || !activeChatContext) return;

    activeChatContext.log.push({ type: 'sent', kind: 'text', text });
    input.value = '';
    renderChatMessages();

    setTimeout(() => {
        const reply = simulatedReplies[replyIndex % simulatedReplies.length];
        replyIndex++;
        activeChatContext.log.push({ type: 'received', kind: 'text', text: reply });
        renderChatMessages();
    }, 700);
}

// ==========================================
// INIT
// ==========================================
window.addEventListener('DOMContentLoaded', () => {
    renderGrid('models');
});
