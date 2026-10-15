/* Riverbend Yoga Studio - Touchstone 4 JavaScript
   1. Class Finder (services.html): filters class cards by experience and goal,
      and lets a visitor save a favorite class.
   2. Request form validation (events.html): checks fields before submitting
      and shows messages next to each field.
   3. Browser storage (localStorage): remembers the saved class, the last
      finder choices, and the visitor's contact details. */

/* ---------- Data ---------- */

// Array of class objects used by the Class Finder.
const yogaClasses = [
  {
    id: "gentle",
    name: "Gentle Flow",
    levels: ["new", "some"],
    goals: ["relax", "gentle"],
    times: ["Monday 9:00 AM", "Saturday 9:00 AM"]
  },
  {
    id: "vinyasa",
    name: "Vinyasa",
    levels: ["some", "regular"],
    goals: ["strength"],
    times: ["Monday 6:00 PM"]
  },
  {
    id: "restorative",
    name: "Restorative",
    levels: ["new", "some", "regular"],
    goals: ["relax", "gentle"],
    times: ["Friday 6:30 PM"]
  },
  {
    id: "chair",
    name: "Chair Yoga",
    levels: ["new", "some", "regular"],
    goals: ["gentle"],
    times: ["Thursday 10:30 AM"]
  },
  {
    id: "express",
    name: "Lunchtime Express Flow",
    levels: ["new", "some", "regular"],
    goals: ["quick", "strength"],
    times: ["Wednesday 12:15 PM"]
  }
];

// Object that holds the names of every localStorage key in one place.
const storageKeys = {
  savedClass: "riverbend-saved-class",
  finderChoices: "riverbend-finder-choices",
  contactDetails: "riverbend-contact-details"
};

// Object of readable labels for the finder choices.
const goalLabels = {
  all: "any goal",
  relax: "relaxing and de-stressing",
  strength: "building strength",
  gentle: "being easy on the joints",
  quick: "fitting a short break"
};

const levelLabels = {
  any: "any experience level",
  new: "people brand new to yoga",
  some: "people with some experience",
  regular: "people who practice regularly"
};

/* ---------- Storage helpers ---------- */

// Read a value from localStorage and turn it back into an object or string.
function loadFromStorage(key) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    return null;
  }
}

// Save any value to localStorage as JSON text.
function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    // Storage can be blocked in private browsing; the page still works.
  }
}

function findClassById(classId) {
  return yogaClasses.find(function (yogaClass) {
    return yogaClass.id === classId;
  });
}

/* ---------- Class Finder (services.html) ---------- */

// Return the classes that match the chosen level and goal.
function getMatchingClasses(level, goal) {
  return yogaClasses.filter(function (yogaClass) {
    const levelMatches = level === "any" || yogaClass.levels.includes(level);
    const goalMatches = goal === "all" || yogaClass.goals.includes(goal);
    return levelMatches && goalMatches;
  });
}

// Show or hide each class card and update the status message.
function updateClassCards(level, goal) {
  const matches = getMatchingClasses(level, goal);
  const matchIds = matches.map(function (yogaClass) {
    return yogaClass.id;
  });

  document.querySelectorAll("article[data-class]").forEach(function (card) {
    const isMatch = matchIds.includes(card.dataset.class);
    card.hidden = !isMatch;
    card.classList.toggle("is-match", isMatch && (level !== "any" || goal !== "all"));
  });

  const status = document.getElementById("finder-status");
  if (matches.length === 0) {
    status.textContent = "No classes match that combination yet. Try a different goal, or ask us about a private session.";
  } else {
    const names = matches.map(function (yogaClass) {
      return yogaClass.name;
    });
    const word = matches.length === 1 ? "class matches" : "classes match";
    status.textContent = matches.length + " " + word + " " + goalLabels[goal] + " for " + levelLabels[level] + ": " + names.join(", ") + ".";
  }
}

// Mark the pressed goal button so the user can see their choice.
function setActiveGoalButton(goal) {
  document.querySelectorAll(".goal-button").forEach(function (button) {
    button.setAttribute("aria-pressed", String(button.dataset.goal === goal));
  });
}

// Read the current choices, update the cards, and remember the choices.
function applyFinderChoices(level, goal) {
  setActiveGoalButton(goal);
  updateClassCards(level, goal);
  saveToStorage(storageKeys.finderChoices, { level: level, goal: goal });
}

// Add a "Save as my class" button and schedule line to every class card.
function addSaveButtons() {
  document.querySelectorAll("article[data-class]").forEach(function (card) {
    const yogaClass = findClassById(card.dataset.class);
    if (!yogaClass) {
      return;
    }

    const times = document.createElement("p");
    times.className = "class-times";
    times.textContent = "Meets: " + yogaClass.times.join(" and ");
    card.appendChild(times);

    const button = document.createElement("button");
    button.type = "button";
    button.className = "save-class-button";
    button.dataset.classId = yogaClass.id;
    button.textContent = "Save as my class";
    button.addEventListener("click", function () {
      saveFavoriteClass(yogaClass.id);
    });
    card.appendChild(button);
  });
}

// Save the chosen class and refresh what the page shows.
function saveFavoriteClass(classId) {
  saveToStorage(storageKeys.savedClass, classId);
  showSavedClass(classId);
}

// Highlight the saved card and show a message linking to the request form.
function showSavedClass(classId) {
  const yogaClass = findClassById(classId);
  const message = document.getElementById("saved-class");

  document.querySelectorAll("article[data-class]").forEach(function (card) {
    const isSaved = card.dataset.class === classId;
    const button = card.querySelector(".save-class-button");
    card.classList.toggle("is-saved", isSaved);
    if (button) {
      button.textContent = isSaved ? "✓ Saved as my class" : "Save as my class";
      button.setAttribute("aria-pressed", String(isSaved));
    }
  });

  if (!yogaClass || !message) {
    return;
  }

  message.innerHTML = "";
  message.append("Your saved class: ");
  const strong = document.createElement("strong");
  strong.textContent = yogaClass.name;
  message.append(strong, " (" + yogaClass.times.join(" and ") + "). ");
  const link = document.createElement("a");
  link.href = "events.html#request-form";
  link.textContent = "Request a spot";
  message.append(link, " and we will fill in this class for you.");
  message.hidden = false;
}

// Connect the finder controls and restore anything saved earlier.
function initClassFinder() {
  const levelSelect = document.getElementById("level-filter");
  if (!levelSelect) {
    return;
  }

  addSaveButtons();

  const savedChoices = loadFromStorage(storageKeys.finderChoices) || { level: "any", goal: "all" };
  let currentGoal = goalLabels[savedChoices.goal] ? savedChoices.goal : "all";
  levelSelect.value = levelLabels[savedChoices.level] ? savedChoices.level : "any";

  levelSelect.addEventListener("change", function () {
    applyFinderChoices(levelSelect.value, currentGoal);
  });

  document.querySelectorAll(".goal-button").forEach(function (button) {
    button.addEventListener("click", function () {
      currentGoal = button.dataset.goal;
      applyFinderChoices(levelSelect.value, currentGoal);
    });
  });

  applyFinderChoices(levelSelect.value, currentGoal);

  const savedClass = loadFromStorage(storageKeys.savedClass);
  if (savedClass) {
    showSavedClass(savedClass);
  }
}

/* ---------- Form validation (events.html) ---------- */

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const phonePattern = /^\d{3}-\d{3}-\d{4}$/;
const namePattern = /^[A-Za-z][A-Za-z .'-]*$/;

// Each rule checks one field and returns an error message, or "" if valid.
const validationRules = {
  name: function (form) {
    const value = form.elements.name.value.trim();
    if (value === "") {
      return "Please enter your full name.";
    }
    if (value.length < 2) {
      return "Your name must be at least 2 characters long.";
    }
    if (!namePattern.test(value)) {
      return "Your name can only use letters, spaces, apostrophes, periods, and hyphens.";
    }
    return "";
  },
  email: function (form) {
    const value = form.elements.email.value.trim();
    if (value === "") {
      return "Please enter your email address.";
    }
    if (!emailPattern.test(value)) {
      return "Please enter a valid email address, like name@example.com.";
    }
    return "";
  },
  phone: function (form) {
    const value = form.elements.phone.value.trim();
    if (value !== "" && !phonePattern.test(value)) {
      return "Please use the format 225-555-0142, or leave this field blank.";
    }
    return "";
  },
  interest: function (form) {
    if (form.elements.interest.value === "") {
      return "Please choose the class or event you are interested in.";
    }
    return "";
  },
  experience: function (form) {
    if (!form.querySelector('input[name="experience"]:checked')) {
      return "Please choose your experience level.";
    }
    return "";
  },
  "contact-method": function (form) {
    if (!form.querySelector('input[name="contact-method"]:checked')) {
      return "Please choose how you would like us to contact you.";
    }
    return "";
  },
  message: function (form) {
    const length = form.elements.message.value.trim().length;
    if (length === 0) {
      return "Please tell us a little about your questions or goals.";
    }
    if (length < 10) {
      return "Your message must be at least 10 characters (you have " + length + ").";
    }
    if (length > 500) {
      return "Your message must be 500 characters or fewer.";
    }
    return "";
  }
};

// Show or clear the error message next to one field.
function showFieldError(form, fieldName, message) {
  const errorElement = document.getElementById(fieldName + "-error");
  const inputs = form.querySelectorAll('[name="' + fieldName + '"]');

  if (errorElement) {
    errorElement.textContent = message;
  }
  inputs.forEach(function (input) {
    if (message) {
      input.setAttribute("aria-invalid", "true");
      input.setAttribute("aria-describedby", fieldName + "-error");
    } else {
      input.removeAttribute("aria-invalid");
    }
  });
}

// Run one rule and show its result. Returns true when the field is valid.
function validateField(form, fieldName) {
  const message = validationRules[fieldName](form);
  showFieldError(form, fieldName, message);
  return message === "";
}

// Check every field and return the names of the fields with errors.
function validateForm(form) {
  return Object.keys(validationRules).filter(function (fieldName) {
    return !validateField(form, fieldName);
  });
}

// Keep the character counter under the message box up to date.
function updateCharacterCount(form) {
  const counter = document.getElementById("message-count");
  if (counter) {
    counter.textContent = form.elements.message.value.length + " / 500 characters";
  }
}

// Fill in the class saved on the Classes page and any remembered contact details.
function prefillForm(form) {
  const savedClass = loadFromStorage(storageKeys.savedClass);
  const yogaClass = findClassById(savedClass);
  const note = document.getElementById("interest-note");
  if (yogaClass && form.elements.interest.value === "") {
    form.elements.interest.value = yogaClass.id;
    note.textContent = "We filled in " + yogaClass.name + ", the class you saved on the Classes and Pricing page. You can change it.";
    note.hidden = false;
  }

  const details = loadFromStorage(storageKeys.contactDetails);
  if (details) {
    form.elements.name.value = details.name || "";
    form.elements.email.value = details.email || "";
    form.elements.phone.value = details.phone || "";
  }
}

// Handle the submit button: stop invalid submissions, confirm valid ones.
function handleFormSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const status = document.getElementById("form-status");
  const invalidFields = validateForm(form);

  if (invalidFields.length > 0) {
    status.textContent = "Please fix the " + invalidFields.length + " highlighted " + (invalidFields.length === 1 ? "field" : "fields") + " and try again.";
    status.className = "form-status is-error";
    const firstInvalid = form.querySelector('[name="' + invalidFields[0] + '"]');
    firstInvalid.focus();
    return;
  }

  saveToStorage(storageKeys.contactDetails, {
    name: form.elements.name.value.trim(),
    email: form.elements.email.value.trim(),
    phone: form.elements.phone.value.trim()
  });
  saveToStorage(storageKeys.savedClass, form.elements.interest.value);

  const firstName = form.elements.name.value.trim().split(" ")[0];
  const choice = form.elements.interest.options[form.elements.interest.selectedIndex].text;
  status.textContent = "Thank you, " + firstName + "! Your request for " + choice + " was received. We will contact you within two business days.";
  status.className = "form-status is-success";
}

// Connect validation to the request form.
function initRequestForm() {
  const form = document.getElementById("request-spot-form");
  if (!form) {
    return;
  }

  prefillForm(form);
  updateCharacterCount(form);

  // Re-check a field as soon as the user fixes it, without clearing anything.
  // Text fields are re-checked while typing only after they have an error, so
  // a message never appears (and moves the button) just because a field lost focus.
  Object.keys(validationRules).forEach(function (fieldName) {
    form.querySelectorAll('[name="' + fieldName + '"]').forEach(function (input) {
      if (input.tagName === "SELECT" || input.type === "radio") {
        input.addEventListener("change", function () {
          validateField(form, fieldName);
        });
      }
      input.addEventListener("input", function () {
        if (input.getAttribute("aria-invalid") === "true") {
          validateField(form, fieldName);
        }
      });
    });
  });

  form.elements.message.addEventListener("input", function () {
    updateCharacterCount(form);
  });

  form.addEventListener("submit", handleFormSubmit);
}

/* ---------- Start ---------- */

document.addEventListener("DOMContentLoaded", function () {
  initClassFinder();
  initRequestForm();
});
