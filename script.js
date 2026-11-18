
"use strict";

// =====================================
// 1. 고양이 정보 - 이 부분을 수정하세요!
// =====================================

const CONFIG = {
  catName: "Yangmal Kim",
  catIntro: "갑자기 돌변할 수 있으니 물리지 않도록 주의할 것",

  // 실제 돌봄 시작일로 변경하세요.
  startDate: "2026-11-20",

  guide: [
    {
      title: "🍚 사료",
      description: "싱크대 하부 수납장에 있는 습식사료 한 팩을 급여하기.",
      image: "images/food.png"

    },
    {
      title: "💧 물",
      description: "수도꼭지가 잘 잠겼는 지 확인하기"
    },
    {
      title: "🪏 양말이 화장실",
      description: "잠시 모래를 녹인 뒤 변기 레버를 3초간 누르기"
    },
    {
      title: "🦎 도마뱀들 물 뿌려주기",
      description: "물뿌리개로 테라리움 전체에 충분히 뿌려주기",
      image: "images/lizard.jpg"
    },
    {
      title: "🚪 주의사항",
      description: "중문을 닫아 김양말의 가출 막기"
    }
  ],

  contacts: [
    {
      name: "보호자",
      phone: ""
    },
    {
      name: "동물병원",
      phone: ""
    }
  ]
};

// =====================================
// 2. 체크리스트 항목
// =====================================

const TASKS = [
  {
    id: "food",
    icon: "🍚",
    title: "사료 챙기기",
    description: "부엌 바닥에 있는 기존 그릇은 한번 씻어주세요."
  },
  {
    id: "water",
    icon: "💧",
    title: "물 교체하기",
    description: "거실의 하나, 양말룸의 하나 총 두 군데의 물그릇을 갈아주세요."
  },
  {
    id: "litter",
    icon: "🪏",
    title: "양말이 화장실 청소",
    description: "모래 속에 숨어있는 감자와 맛동산을 캐내어 변기에 버려주세요."
  },
  {
    id: "health",
    icon: "🐱",
    title: "놀아주기",
    description: "만져줄 때 물리지 않도록 주의하세요. 더 놀아주고 싶다면 냉장고 최하단의 간식을 던져주며 놀아주세요."
  },
  {
  id: "photo",
  icon: "📸",
  title: "양말이 사진 보내주기",
  description: "양말 인증샷을 얀에게 보내주세요."
},
{
  id: "lizard",
  icon: "🦎",
  title: "도마뱀들 물 뿌려주기",
  description: "도마뱀 테라리움 두 곳에 물을 뿌려주세요."
}
];

// =====================================
// 3. 저장된 데이터 불러오기
// =====================================

const STORAGE_KEY = "cat-care-v1";

function loadData() {
  try {
    const saved = JSON.parse(
      localStorage.getItem(STORAGE_KEY)
    );

    if (saved && typeof saved === "object") {
      return {
        checks: saved.checks || {},
        notes: saved.notes || {}
      };
    }
  } catch (error) {
    console.warn("저장 데이터를 읽지 못했습니다.", error);
  }

  return { checks: {}, notes: {} };
}

let data = loadData();
let currentDay = 0;

function saveData() {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(data)
    );
  } catch (error) {
    console.error("저장에 실패했습니다.", error);
  }
}

// =====================================
// 4. 날짜 계산
// =====================================

function getDayDate(dayIndex) {
  const [year, month, day] = CONFIG.startDate
    .split("-")
    .map(Number);

  const date = new Date(year, month - 1, day);
  date.setDate(date.getDate() + dayIndex);

  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long"
  });
}

// =====================================
// 5. 체크리스트 표시
// =====================================

function renderTasks() {
  const list = document.getElementById("taskList");
  list.replaceChildren();

  TASKS.forEach(task => {
    const key = `${currentDay}-${task.id}`;
    const checked = Boolean(data.checks[key]);

    const label = document.createElement("label");
    label.className = checked ? "task done" : "task";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = checked;

    checkbox.addEventListener("change", () => {
      data.checks[key] = checkbox.checked;
      saveData();
      renderTasks();
    });

    const icon = document.createElement("span");
    icon.className = "task-icon";
    icon.textContent = task.icon;

    const content = document.createElement("span");
    content.className = "task-content";

    const title = document.createElement("span");
    title.className = "task-title";
    title.textContent = task.title;

    const description = document.createElement("span");
    description.className = "task-description";
    description.textContent = task.description;

    content.append(title, description);
    label.append(checkbox, icon, content);
    list.appendChild(label);
  });

  updateProgress();
}

// =====================================
// 6. 진행률 계산
// =====================================

function updateProgress() {
  const completed = TASKS.filter(task => {
    return data.checks[`${currentDay}-${task.id}`];
  }).length;

  const percent = Math.round(
    completed / TASKS.length * 100
  );

  document.getElementById("progressText")
    .textContent = `${percent}%`;

  document.getElementById("progressFill")
    .style.width = `${percent}%`;

  document.getElementById("progressCount")
    .textContent = `${completed}/${TASKS.length}개 완료`;

  document.getElementById("completeMessage")
    .hidden = completed !== TASKS.length;
}

// =====================================
// 7. 날짜 변경
// =====================================

function changeDay(dayIndex) {
  currentDay = dayIndex;

document.querySelector("#completeMessage strong").innerHTML =
  dayIndex === 1 ? "코보스 획득!" : "김양말<br>모시기 완료";


  document.querySelectorAll(".day").forEach(button => {
    const active = Number(button.dataset.day) === dayIndex;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });

  document.getElementById("dayTitle")
    .textContent = `${dayIndex + 1}일 차`;

  document.getElementById("dayDate")
    .textContent = getDayDate(dayIndex);

 

  renderTasks();
}

// =====================================
// 8. 돌봄 가이드 표시
// =====================================

 function renderGuide() {
  const list = document.getElementById("guideList");
  list.replaceChildren();

  CONFIG.guide.forEach(item => {
    const box = document.createElement("div");
    box.className = "guide-item";

    const title = document.createElement("strong");
    title.textContent = item.title;

    const description = document.createElement("p");
    description.textContent = item.description;

    box.append(title, description);

    if (item.image) {
      const image = document.createElement("img");

      image.src = item.image;
      image.alt = `${item.title} 보관 위치`;

      image.style.width = "100%";
      image.style.maxWidth = "400px";
      image.style.height = "auto";
      image.style.borderRadius = "12px";
      image.style.marginTop = "12px";
      image.style.display = "block";

      box.appendChild(image);
    }

    list.appendChild(box);
  });
}


// =====================================
// 9. 비상 연락처 표시
// =====================================

function renderContacts() {
  const list = document.getElementById("contactList");
  list.replaceChildren();

  CONFIG.contacts.forEach(contact => {
    const phone = contact.phone.trim();

    if (!phone) {
      const item = document.createElement("div");
      item.className = "contact disabled";
      item.textContent = `${contact.name}: 연락처 미등록`;
      list.appendChild(item);
      return;
    }

    const link = document.createElement("a");
    link.className = "contact";
    link.href = `tel:${phone.replace(/[^+\d]/g, "")}`;
    link.textContent = `📞 ${contact.name} 전화하기`;

    list.appendChild(link);
  });
}

// =====================================
// 10. 앱 시작
// =====================================

function init() {
  document.getElementById("catName")
    .textContent = CONFIG.catName;

  document.getElementById("catIntro")
    .textContent = CONFIG.catIntro;

  document.querySelectorAll(".day").forEach(button => {
    button.addEventListener("click", () => {
      changeDay(Number(button.dataset.day));
    });
  });

  

  renderGuide();
  changeDay(0);
}

init();
