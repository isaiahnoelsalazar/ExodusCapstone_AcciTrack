class EasyHTTPRequest {
    constructor (url, method){
        this.url = url;
        this.method = method;
        this.request = new XMLHttpRequest();
    }
    execute (userFunction){
        this.request.open(this.method, this.url, true);
        this.request.onreadystatechange = userFunction;
        this.request.send();
    }
}

const separator_string = "[sprtr_str]";
let badgeNumber = "-1";

function checkSession(){
    try {
        let requestSession = new XMLHttpRequest();
        requestSession.open("GET", "/session", true);
        requestSession.onreadystatechange = function (){
            if (requestSession.status == 200 && requestSession.readyState == 4){
                let response = requestSession.responseText;
                if (response == "Not logged in."){
                    window.location.href = "login";
                } else {
                    badgeNumber = response.split(separator_string)[1];
                }
            }
        }
        requestSession.send();
    } catch (e){
    }
}

checkSession();

const hour = new Date().getHours();
document.getElementById("greeting").textContent = `${hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening"}`;

function updateClock() {
    const now = new Date().toLocaleString("en-PH", { timeZone: "Asia/Manila" });
    const formatted = new Date(now).toLocaleDateString("en-PH", {
        weekday: "long", month: "long", day: "numeric", year: "numeric",
        hour: "numeric", minute: "numeric", hour12: true
    }).replace(",", " •");
    document.getElementById("datetime").textContent = formatted;
}

updateClock();
setInterval(updateClock, 1000);

const accidentIcons = {
    "Minor Traffic Accident":                { icon: "fa-car-burst",        color: "#3b82f6" },
    "Reckless Driving":                      { icon: "fa-gauge-high",       color: "#f97316" },
    "DUI / DWI":                             { icon: "fa-wine-bottle",      color: "#ec4899" },
    "Hit & Run":                             { icon: "fa-person-running",   color: "#8b55cf6" },
    "Multi-Vehicle Pileup":                  { icon: "fa-car-crash",        color: "#dc2626" },
    "Reckless Imprudence Resulting in Homicide": { icon: "fa-skull-crossbones", color: "#991b1b" }
};

const accidentTypes = [
    { type: "Minor Traffic Accident",          icon: "fa-solid fa-car-burst",           color: "blue" },
    { type: "Reckless Driving",               icon: "fa-solid fa-gauge-high",          color: "#f97316" },
    { type: "DUI / DWI",                      icon: "fa-solid fa-wine-bottle",         color: "green" },
    { type: "Hit & Run",                      icon: "fa-solid fa-person-running",      color: "brown" },
    { type: "Multi-Vehicle Pileup",           icon: "fa-solid fa-car-crash",           color: "red" },
    { type: "Reckless Imprudence Resulting in Homicide", icon: "fa-solid fa-skull-crossbones", color: "black" }
];

let currentVideoURL = "";
let reportsToday = 0;
let reportsYesterday = 0;
let yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);

tabClick(0);
refreshTasks();
refreshReports();

function tabClick(index){
    let sections = document.getElementsByClassName('main');
    let tabs = document.querySelectorAll('nav button');
    for (let a = 0; a < sections.length; a++){
        if (a != index){
            tabs[a].classList.remove("active");
            sections[a].style.display = "none";
        } else {
            tabs[a].classList.add("active");
            sections[a].style.display = "block";
        }
    }
    if (index != 0){
        document.getElementById("top-header").style.display = "none";
    } else {
        document.getElementById("top-header").style.display = "flex";
    }
}

function openTaskModal(){
    document.getElementById("taskModal").style.display = "flex";
}

function closeTaskModal(){
    document.getElementById("taskModal").style.display = "none";
}

function addTask(){
    if (!document.getElementById("taskTitle").value) {
        alert("Please enter a task title!");
        return;
    }
    try {
        let executed = false;
        let request = new EasyHTTPRequest(`/add-task?title=${document.getElementById("taskTitle").value.trim()}&description=${document.getElementById("taskDesc").value.trim()}&priority=${document.getElementById("taskPriority").value || "low"}`, "POST");
        request.execute(() => {
            if (!executed){
                if (request.request.response == "Success"){
                    refreshTasks();
                    document.getElementById("taskTitle").value = "";
                    document.getElementById("taskDesc").value = "";
                    document.getElementById("taskModal").style.display = "none";
                    executed = true;
                }
            }
        });
    } catch (e){
    }
}

function refreshTasks(){
    try {
        let executed = false;
        let request = new EasyHTTPRequest("/get-tasks", "POST");
        request.execute(() => {
            if (!executed){
                let split = request.request.response.substring(1, request.request.response.length - 1).split("), ");
                document.getElementById("taskList").innerHTML = "";
                let task_counter = 0;
                for (let a = 0; a < split.length; a++){
                    let title = split[a].split(", ")[0].substring(2, split[a].split(", ")[0].length - 1);
                    let desc = split[a].split(", ")[1].substring(1, split[a].split(", ")[1].length - 1);
                    let priority = split[a].split(", ")[2].substring(1, split[a].split(", ")[2].length - 1);
                    const taskHTML = `
                        <div class="task-item ${priority}" id="task-${a}">
                            <i class="fa-solid fa-circle-dot"></i>
                            <div class="task-content">
                                <strong>${title}</strong>
                                <small>${desc || "No details added"}</small>
                            </div>
                            ${priority === "high" ? '<span class="task-badge">URGENT</span>' : ""}
                            <button class="delete-task-btn" title="Delete task" onclick="deleteTask('task-${a}')">
                                <i class="fa-solid fa-xmark"></i>
                            </button>
                        </div>
                    `;
                    document.getElementById("taskList").insertAdjacentHTML("afterbegin", taskHTML);
                    task_counter++;
                }
                document.getElementById("taskCount").textContent = task_counter;
                executed = true;
            }
        });
    } catch (e){
    }
}

function logout(){
    window.location.href = "logout";
}

function deleteTask(id){
    // add sql
    document.getElementById("taskList").removeChild(document.getElementById(id));
}

function openReportModal(){
    document.getElementById("reportModal1").classList.add("active");
    document.getElementById("reportDateTime").value = new Date().toLocaleString('en-PH', {
        dateStyle: 'medium', timeStyle: 'medium'
    });
    document.getElementById("videoDropArea")?.addEventListener("click", () => 
        document.getElementById("videoUpload").click()
    );
    document.getElementById("videoUpload")?.addEventListener("change", function(e) {
        const file = e.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            currentVideoURL = url;
            document.getElementById("videoPreview").innerHTML = `
                <video controls style="width:100%;max-height:300px;border-radius:12px;margin-top:12px;">
                    <source src="${url}" type="${file.type}">
                </video>
                <p style="margin:8px 0 0;color:#475569;"><strong>${file.name}</strong> (${(file.size/1024/1024).toFixed(2)} MB)</p>`;
        }
    });
}

function closeReportModal(){
    document.getElementById("reportModal1").classList.remove("active");
    document.getElementById("videoPreview").innerHTML = "";
    document.getElementById("videoUpload").value = "";
    currentVideoURL = null;
}

function addReport(){
    if (!document.getElementById("location").value || !document.getElementById("accidentType").value) {
        alert("Please fill in location and accident type");
        return;
    }
    try {
        const caseNum = document.getElementById("accidentType").value.substring(0,3).toUpperCase() + "-" + new Date().getFullYear() + "-" + String(Math.floor(Math.random()*9999)+1000).padStart(4, '0');
        let executed = false;
        let request = new EasyHTTPRequest(`/add-report?caseNum=${caseNum}&officer=${document.getElementById("officerName").value.trim()}&datetime=${document.getElementById("reportDateTime").value.trim()}&location=${document.getElementById("location").value.trim()}&type=${document.getElementById("accidentType").value.trim()}&status=pending&video=${currentVideoURL || "none"}`, "POST");
        request.execute(() => {
            if (!executed){
                if (request.request.response == "Success"){
                    alert(`Report ${caseNum} submitted successfully!`);
                    closeReportModal();

                    const data = document.createElement("div");

                    data.dataset.casenumber = caseNum;
                    data.dataset.officer = document.getElementById("officerName").value.trim();
                    data.dataset.datetime = document.getElementById("reportDateTime").value.trim();
                    data.dataset.location = document.getElementById("location").value.trim();
                    data.dataset.type = document.getElementById("accidentType").value.trim();
                    data.dataset.status = "pending";
                    data.dataset.video = currentVideoURL || "none";

                    addNotification(data.dataset);
                    refreshReports();

                    document.getElementById("location").value = "";
                    document.getElementById("accidentType").value = "";
                    executed = true;
                }
            }
        });
    } catch (e){
    }
}

function getTimeDifference(start, end) {
    let diff = Math.abs(end - start);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    diff -= days * (1000 * 60 * 60 * 24);
    const hours = Math.floor(diff / (1000 * 60 * 60));
    diff -= hours * (1000 * 60 * 60);
    const mins = Math.floor(diff / (1000 * 60));
    diff -= mins * (1000 * 60);
    const seconds = Math.floor(diff / 1000);
    return `${days}d ${hours}h ${mins}m ${seconds}s`;
}

function refreshReports(){
    try {
        let executed = false;
        let request = new EasyHTTPRequest("/admin-get-reports", "POST");
        request.execute(() => {
            if (!executed){
                let split = request.request.response.substring(1, request.request.response.length - 1).split("), ");
                document.getElementById("reportList").innerHTML = "";
                document.getElementById("reportNotifications").innerHTML = "";
                for (let a = 0; a < split.length; a++){
                    let value_split = split[a].split("', ");
                    let case_num = value_split[0].substring(2);
                    let submitting_officer = value_split[1].substring(1);
                    let submitting_datetime = value_split[2].substring(1);
                    let location = value_split[3].substring(1);
                    let type = value_split[4].substring(1);
                    let status = value_split[5].substring(1);
                    let video = value_split[6].substring(1);
                    let reviewing_officer = value_split[7].substring(1);
                    let reviewing_datetime = value_split[8].substring(1);
                    let reviewing_reason = value_split[9].substring(1);
                    let realdatetime = value_split[12].substring(1, a == split.length - 1 ? value_split[12].length - 2 : value_split[12].length - 1);

                    const iconInfo = accidentIcons[type] || accidentIcons["Minor Traffic Accident"];
                    const newRow = document.createElement("div");
                    newRow.className = "report-row pending";
                    newRow.style.animation = "slideIn 0.5s ease";
                    newRow.innerHTML = `
                        <i class="fa-solid ${iconInfo.icon}" style="color:${iconInfo.color};"></i>
                        <div class="report-details">
                            <strong>${type}</strong>
                            <p>${submitting_officer} • ${submitting_datetime} • ${location}</p>
                        </div>
                        <span class="status" style="background:#fef3c7;color:#92400e;">PENDING REVIEW</span>
                    `;
                    newRow.dataset.casenumber = case_num;
                    newRow.dataset.submitting_officer = submitting_officer;
                    newRow.dataset.submitting_datetime = submitting_datetime;
                    newRow.dataset.location = location;
                    newRow.dataset.type = type;
                    newRow.dataset.status = status;
                    newRow.dataset.video = video;
                    newRow.dataset.reviewing_officer = reviewing_officer;
                    newRow.dataset.reviewing_datetime = reviewing_datetime;
                    newRow.dataset.reviewing_reason = reviewing_reason;
                    newRow.dataset.realdatetime = realdatetime;

                    newRow.onclick = () => openReportDetailModal(newRow.dataset);

                    document.getElementById("reportList").insertBefore(newRow, document.getElementById("reportList").firstChild);

                    if (new Date(submitting_datetime).toLocaleString('en-PH', {dateStyle: 'medium'}) == new Date().toLocaleString('en-PH', {dateStyle: 'medium'})){
                        reportsToday += 1;
                    }
                    if (new Date(submitting_datetime).toLocaleString('en-PH', {dateStyle: 'medium'}) == yesterday.toLocaleString('en-PH', {dateStyle: 'medium'})){
                        reportsYesterday += 1;
                    }

                    const accident = accidentTypes.find(a => a.type === type) || accidentTypes[0];

                    const card = document.createElement("div");
                    card.className = `report-card ${status}`;
                    card.style.cursor = "pointer";

                    card.innerHTML = `
                        <div class="report-icon ${status}">
                            <i class="${accident.icon}" style="color: ${accident.color};"></i>
                        </div>
                        <div class="report-content">
                            <h3>${type}</h3>
                            <p><strong>Officer:</strong> ${submitting_officer} • <strong>Location:</strong> ${location}</p>
                            ${reviewing_reason ? `<small>Reason: ${reviewing_reason}</small>` : ""}
                        </div>
                        <div class="report-meta">
                            <div class="status-badge ${status}">
                                <i class="fa-solid ${status === 'pending' ? 'fa-clock' : status === 'approved' ? 'fa-check-circle' : 'fa-times-circle'}"></i>
                                ${status.toUpperCase()}
                            </div>
                            <div class="time-ago">${getTimeDifference(new Date(realdatetime), new Date())} ago</div>
                        </div>
                    `;

                    card.dataset.casenumber = case_num;
                    card.dataset.submitting_officer = submitting_officer;
                    card.dataset.submitting_datetime = submitting_datetime;
                    card.dataset.location = location;
                    card.dataset.type = type;
                    card.dataset.status = status;
                    card.dataset.video = video;
                    card.dataset.reviewing_officer = reviewing_officer;
                    card.dataset.reviewing_datetime = reviewing_datetime;
                    card.dataset.reviewing_reason = reviewing_reason;
                    card.dataset.realdatetime = realdatetime;

                    card.onclick = () => openNotificationModal(card.dataset);

                    document.getElementById("reportNotifications").insertBefore(card, document.getElementById("reportNotifications").firstChild);
                }
                document.getElementById("reportsTodayh3").innerHTML = reportsToday;
                document.getElementById("reportsComparedFromYesterday").innerHTML = `+${(reportsToday - reportsYesterday)} from yesterday`;
                executed = true;
            }
        });
    } catch (e){
    }
}

function openReportDetailModal(data){
    document.getElementById("detailModal").classList.add("active");

    const header = document.getElementById("detailModel-header");
    header.innerHTML = `
    <h2 id="modalReportTitle" style="margin:0; font-size:24px; color:#0f172a; font-weight:700;">${data.type} – ${data.location}</h2>
    <button type="button" onclick="closeReportDetailModal()" style="position:absolute; top:16px; right:24px; all:unset; cursor:pointer; font-size:32px; color:#64748b; width:44px; height:44px; border-radius:50%; display:flex; align-items:center; justify-content:center; transition:0.2s;"
                            onmouseover="this.style.background='#e2e8f0'; this.style.color='#1e293b'"
                            onmouseout="this.style.background='transparent'; this.style.color='#64748b'">
                        ×
                    </button>
    `;

    const video = document.getElementById("detailModal-evidenceVideo");
    video.innerHTML = `<source src="${data.video}" type="video/mp4">`;

    const infoGrid = document.getElementById("detailModal-info-grid");
    infoGrid.innerHTML = `
    <div class="info-item"><strong>Report ID</strong><p id="modalReportId">${data.casenumber}</p></div>
    <div class="info-item"><strong>Officer</strong><p id="modalOfficer">${data.submitting_officer}</p></div>
    <div class="info-item"><strong>Accident Date</strong><p id="modalDate">${data.submitting_datetime}</p></div>
    <div class="info-item"><strong>Location</strong><p id="modalLocation">${data.location}</p></div>
    <div class="info-item"><strong>Type</strong><p id="modalType">${data.type}</p></div>
    <div class="info-item"><strong>Submitted</strong><p id="modalDateAgo">${getTimeDifference(new Date(data.realdatetime), new Date())} ago</p></div>
    `;

    const req = document.getElementById("btn-req");
    const deny = document.getElementById("btn-deny");
    const approve = document.getElementById("btn-approve");
    const resubmit = document.getElementById("btn-resubmit");
    req.onclick = () => {
        openRequestChanges(data);
    };
    deny.onclick = () => {
        openDenyModal(data);
    };
    approve.onclick = () => {
        openApproveModal(data);
    };
}

function openApproveModal(data){
    document.getElementById('approveId').textContent = data.casenumber;
    document.getElementById('approveTitle').textContent = data.type + " - " + data.location;
    document.getElementById('approveOfficer').textContent = data.submitting_officer;
    document.getElementById('approveDate').textContent = getTimeDifference(new Date(data.realdatetime), new Date()) + " ago";
    document.getElementById('approveType').textContent = data.type;
    document.getElementById('approveIncidentDate').textContent = data.submitting_datetime;
    document.getElementById('approveNote').value = '';
    document.getElementById('approveModal').style.display = 'flex';
}

function openDenyModal(data){
    document.getElementById('denyId').textContent = data.casenumber;
    document.getElementById('denyTitle').textContent = data.type + " - " + data.location;
    document.getElementById('denyOfficer').textContent = data.submitting_officer;
    document.getElementById('denyDate').textContent = getTimeDifference(new Date(data.realdatetime), new Date()) + " ago";
    document.getElementById('denyType').textContent = data.type;
    document.getElementById('denyIncidentDate').textContent = data.submitting_datetime;
    document.getElementById('denyNote').value = '';
    document.getElementById('denyModal').style.display = 'flex';
}

function openRequestChanges(data){
    document.getElementById('reqId').textContent = data.casenumber;
    document.getElementById('reqTitle').textContent = data.type + " - " + data.location;
    document.getElementById('reqOfficer').textContent = data.submitting_officer;
    document.getElementById('reqDate').textContent = getTimeDifference(new Date(data.realdatetime), new Date()) + " ago";
    document.getElementById('reqType').textContent = data.type;
    document.getElementById('reqIncidentDate').textContent = data.submitting_datetime;
    document.getElementById('reqNote').value = '';
    document.getElementById('requestChangesModal').style.display = 'flex';
}

function closeReportDetailModal(){
    document.getElementById("detailModal").classList.remove("active");
}

function closeApproveModal(){
    document.getElementById("approveModal").style.display = 'none';
}

function closeDenyModal(){
    document.getElementById("denyModal").style.display = 'none';
}

function closeReqModal(){
    document.getElementById("requestChangesModal").style.display = 'none';
}

const animStyle = document.createElement('style');
animStyle.textContent = `
    @keyframes slideIn { from { opacity:0; transform:translateY(-20px); } to { opacity:1; transform:translateY(0); } }
    .status-pending, .status-approved { display:flex; align-items:center; gap:16px; padding:16px; border-radius:12px; }
    .status-pending { background:#fffbeb; border:1px solid #fcd34d; }
    .status-approved { background:#f0fdf4; border:1px solid #86efac; }
    .detail-grid { display:grid; grid-template-columns:1fr 1fr; gap:20px; margin:24px 0; font-size:15px; }
    .detail-grid p { margin:6px 0 0; color:#475569; }
`;
document.head.appendChild(animStyle);

function openNotificationModal(data) {
    const modal = document.getElementById("notificationModal");

    const video = document.getElementById("notificationModal-incidentVideo");
    const modalOfficer = document.getElementById("notificationModal-modalOfficer");
    const modalLocation = document.getElementById("notificationModal-modalLocation");
    const modalType = document.getElementById("notificationModal-modalType");
    const modalDateTime = document.getElementById("notificationModal-modalDateTime");

    video.innerHTML = `<source src="${data.video}" type="video/mp4">`;
    modalOfficer.innerHTML = `${data.submitting_officer}`;
    modalLocation.innerHTML = `${data.location}`;
    modalType.innerHTML = `${data.type}`;
    modalDateTime.innerHTML = `${data.submitting_datetime}`;

    modal.classList.add("show");
}

function closeNotificationModal(){
    document.getElementById("notificationModal").classList.remove("show");
}

document.querySelectorAll('.tab-button').forEach(button => {
    button.addEventListener('click', () => {
        const tab = button.dataset.tab;
        document.querySelectorAll('.tab-button').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        button.classList.add('active');
        document.getElementById(tab).classList.add('active');
    });
});