const loginDiv = document.getElementById('login');
const appDiv = document.getElementById('app');
const loginForm = document.getElementById('login-form');
const logoutBtn = document.getElementById('logout');
const serviceForm = document.getElementById('service-form');
const servicesList = document.getElementById('services-list');
const calendarDiv = document.getElementById('calendar');
const previewDiv = document.getElementById('preview');

let services = JSON.parse(localStorage.getItem('services') || '[]');

function showApp() {
    loginDiv.classList.add('hidden');
    appDiv.classList.remove('hidden');
    renderServices();
    renderCalendar();
}

function checkLogin() {
    const user = localStorage.getItem('user');
    if (user) {
        showApp();
    }
}

loginForm.addEventListener('submit', e => {
    e.preventDefault();
    localStorage.setItem('user', document.getElementById('username').value);
    showApp();
});

logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('user');
    location.reload();
});

serviceForm.addEventListener('submit', e => {
    e.preventDefault();
    const photos = Array.from(document.getElementById('service-photo').files).map(file => {
        return URL.createObjectURL(file);
    });
    const service = {
        id: Date.now(),
        name: document.getElementById('service-name').value,
        area: document.getElementById('service-area').value,
        date: document.getElementById('service-date').value,
        desc: document.getElementById('service-desc').value,
        photos
    };
    services.push(service);
    localStorage.setItem('services', JSON.stringify(services));
    serviceForm.reset();
    previewDiv.innerHTML = '';
    renderServices();
    renderCalendar();
});

function renderServices() {
    servicesList.innerHTML = '';
    services.forEach(s => {
        const li = document.createElement('li');
        li.textContent = `${s.date} - ${s.name} (${s.area})`;
        const pdfBtn = document.createElement('button');
        pdfBtn.textContent = 'PDF';
        pdfBtn.addEventListener('click', () => generatePDF(s));
        li.appendChild(pdfBtn);
        servicesList.appendChild(li);
    });
}

function renderCalendar() {
    calendarDiv.innerHTML = '';
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) {
        const empty = document.createElement('div');
        calendarDiv.appendChild(empty);
    }

    for (let d = 1; d <= daysInMonth; d++) {
        const dayDiv = document.createElement('div');
        const num = document.createElement('div');
        num.textContent = d;
        num.classList.add('day-number');
        dayDiv.appendChild(num);
        const dateStr = `${year}-${String(month + 1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
        services.filter(s => s.date === dateStr).forEach(s => {
            const p = document.createElement('p');
            p.textContent = s.name;
            dayDiv.appendChild(p);
        });
        calendarDiv.appendChild(dayDiv);
    }
}

function generatePDF(service) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.text(`Servicio: ${service.name}`, 10, 10);
    doc.text(`Área: ${service.area}`, 10, 20);
    doc.text(`Fecha: ${service.date}`, 10, 30);
    doc.text(`Descripción: ${service.desc}`, 10, 40);
    doc.save(`servicio-${service.id}.pdf`);
}

checkLogin();

document.getElementById('service-photo').addEventListener('change', e => {
    previewDiv.innerHTML = '';
    Array.from(e.target.files).forEach(file => {
        const img = document.createElement('img');
        img.src = URL.createObjectURL(file);
        img.style.width = '80px';
        img.style.marginRight = '5px';
        previewDiv.appendChild(img);
    });
});

