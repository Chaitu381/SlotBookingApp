// ===== Chronos Slot Booking Engine =====
// Pure Vanilla JavaScript — no frameworks

(function () {
  "use strict";

  const STORAGE_KEY = "chronos_slots";

  // ===== Slot Data Generation =====
  function generateSlots() {
    const slots = [];
    const times = [
      "09:00 AM", "10:00 AM", "11:00 AM",
      "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM"
    ];
    const today = new Date();
    const dates = [0, 1, 2].map((offset) => {
      const d = new Date(today.getTime() + offset * 86400000);
      return d.toISOString().split("T")[0];
    });

    dates.forEach((date) => {
      times.forEach((time, i) => {
        slots.push({
          id: "SLOT-" + date.replace(/-/g, "") + "-" + i,
          date: date,
          time: time,
          status: "available"
        });
      });
    });

    return slots;
  }

  // ===== Persistence =====
  function loadSlots() {
    try {
      var stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) { /* ignore */ }
    return generateSlots();
  }

  function saveSlots() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(slots));
  }

  // ===== State =====
  var slots = loadSlots();
  var activeSection = "home";

  // ===== DOM References =====
  var $navBtns = document.querySelectorAll(".nav-btn");
  var $sections = {
    home: document.getElementById("section-home"),
    available: document.getElementById("section-available"),
    booked: document.getElementById("section-booked")
  };
  var $statTotal = document.getElementById("stat-total");
  var $statAvailable = document.getElementById("stat-available");
  var $statBooked = document.getElementById("stat-booked");
  var $availableGrid = document.getElementById("available-grid");
  var $availableEmpty = document.getElementById("available-empty");
  var $bookedGrid = document.getElementById("booked-grid");
  var $bookedEmpty = document.getElementById("booked-empty");
  var $filterDate = document.getElementById("filter-date");
  var $filterSearch = document.getElementById("filter-search");
  var $bookedBadge = document.getElementById("booked-badge");
  var $toast = document.getElementById("toast");

  // ===== Toast =====
  var toastTimer = null;
  function showToast(message) {
    $toast.textContent = message;
    $toast.classList.remove("hidden");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      $toast.classList.add("hidden");
    }, 2500);
  }

  // ===== Navigation =====
  function navigate(section) {
    activeSection = section;

    $navBtns.forEach(function (btn) {
      btn.classList.toggle("active", btn.dataset.section === section);
    });

    Object.keys($sections).forEach(function (key) {
      $sections[key].classList.toggle("hidden", key !== section);
      if (key === section) {
        $sections[key].classList.remove("fade-in");
        // Force reflow for animation restart
        void $sections[key].offsetWidth;
        $sections[key].classList.add("fade-in");
      }
    });

    render();
  }

  $navBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      navigate(btn.dataset.section);
    });
  });

  // ===== Date Formatting =====
  function formatDate(dateStr) {
    var d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric"
    });
  }

  // ===== Card Creation =====
  function createSlotCard(slot, type) {
    var card = document.createElement("div");
    card.className = "slot-card";

    var dot = document.createElement("span");
    dot.className = "slot-dot " + slot.status;

    var idEl = document.createElement("span");
    idEl.className = "slot-id";
    idEl.textContent = slot.id;

    var timeEl = document.createElement("div");
    timeEl.className = "slot-time";
    timeEl.textContent = slot.time;

    var dateEl = document.createElement("div");
    dateEl.className = "slot-date";
    dateEl.textContent = formatDate(slot.date);

    var btn = document.createElement("button");

    if (type === "book") {
      btn.className = "btn-book";
      btn.textContent = "Book Now";
      btn.addEventListener("click", function () {
        bookSlot(slot.id);
      });
    } else {
      btn.className = "btn-cancel";
      btn.textContent = "Cancel Booking";
      btn.addEventListener("click", function () {
        cancelSlot(slot.id);
      });
    }

    card.appendChild(dot);
    card.appendChild(idEl);
    card.appendChild(timeEl);
    card.appendChild(dateEl);
    card.appendChild(btn);

    return card;
  }

  // ===== Actions =====
  function bookSlot(id) {
    for (var i = 0; i < slots.length; i++) {
      if (slots[i].id === id && slots[i].status === "available") {
        slots[i].status = "booked";
        break;
      }
    }
    saveSlots();
    render();
    showToast("✓ Booking Confirmed");
  }

  function cancelSlot(id) {
    for (var i = 0; i < slots.length; i++) {
      if (slots[i].id === id) {
        slots[i].status = "available";
        break;
      }
    }
    saveSlots();
    render();
    showToast("✓ Booking Cancelled");
  }

  // ===== Render =====
  function render() {
    var total = slots.length;
    var available = slots.filter(function (s) { return s.status === "available"; });
    var booked = slots.filter(function (s) { return s.status === "booked"; });

    // Stats
    $statTotal.textContent = total;
    $statAvailable.textContent = available.length;
    $statBooked.textContent = booked.length;

    // Badge
    if (booked.length > 0) {
      $bookedBadge.textContent = booked.length;
      $bookedBadge.classList.remove("hidden");
    } else {
      $bookedBadge.classList.add("hidden");
    }

    // Available grid
    var dateVal = $filterDate.value;
    var searchVal = $filterSearch.value.toLowerCase();

    var filtered = available.filter(function (s) {
      if (dateVal && s.date !== dateVal) return false;
      if (searchVal) {
        return s.id.toLowerCase().indexOf(searchVal) !== -1 ||
               s.time.toLowerCase().indexOf(searchVal) !== -1;
      }
      return true;
    });

    $availableGrid.innerHTML = "";
    if (filtered.length > 0) {
      $availableEmpty.classList.add("hidden");
      filtered.forEach(function (slot) {
        $availableGrid.appendChild(createSlotCard(slot, "book"));
      });
    } else {
      $availableEmpty.classList.remove("hidden");
    }

    // Booked grid
    $bookedGrid.innerHTML = "";
    if (booked.length > 0) {
      $bookedEmpty.classList.add("hidden");
      booked.forEach(function (slot) {
        $bookedGrid.appendChild(createSlotCard(slot, "cancel"));
      });
    } else {
      $bookedEmpty.classList.remove("hidden");
    }
  }

  // ===== Filter Events =====
  $filterDate.addEventListener("change", render);
  $filterSearch.addEventListener("input", render);

  // ===== Init =====
  render();
})();
