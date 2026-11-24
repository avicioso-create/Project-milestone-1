 // Bmyptla - shared JavaScript for every page
// Each feature first checks that its elements exist on the page,
// so this one file can be loaded on index.html, about.html and workout.html.

// ===== 1. DOM INTERACTION: show / hide workout details (workout.html) =====
function setupWorkoutToggles() {
  const toggleButtons = document.querySelectorAll(".details-toggle");

  toggleButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const panelId = button.getAttribute("aria-controls");
      const detailsPanel = document.querySelector("#" + panelId);
      const isOpen = button.getAttribute("aria-expanded") === "true";

      // Flip the state: open -> closed, closed -> open
      button.setAttribute("aria-expanded", String(!isOpen));
      detailsPanel.hidden = isOpen;
      button.textContent = isOpen ? "Show Routine" : "Hide Routine";
    });
  });
}

// ===== 2. FORM VALIDATION: contact form (about.html) =====
function setupContactForm() {
  const form = document.querySelector("#contactForm");
  if (!form) return;

  const summary = document.querySelector("#form-errors");
  const success = document.querySelector("#form-success");

  const nameInput = document.querySelector("#name");
  const emailInput = document.querySelector("#email");
  const messageInput = document.querySelector("#message");
  const firstGoal = document.querySelector("#goal-strength");
  const goalRadios = form.querySelectorAll('input[name="goal"]');

  const nameError = document.querySelector("#name-error");
  const emailError = document.querySelector("#email-error");
  const goalError = document.querySelector("#goal-error");
  const messageError = document.querySelector("#message-error");

  // Show an error: red border (aria-invalid) + message text
  function showError(input, errorElement, message) {
    if (input) input.setAttribute("aria-invalid", "true");
    errorElement.textContent = message;
    errorElement.hidden = false;
  }

  // Remove an error
  function clearError(input, errorElement) {
    if (input) input.removeAttribute("aria-invalid");
    errorElement.textContent = "";
    errorElement.hidden = true;
  }

  // Check every required field and return a list of problems
  function validate() {
    const errors = [];

    clearError(nameInput, nameError);
    if (nameInput.value.trim() === "") {
      showError(nameInput, nameError, "Please enter your full name.");
      errors.push({ field: nameInput, text: "Full name is required." });
    }

    clearError(emailInput, emailError);
    if (emailInput.value.trim() === "") {
      showError(emailInput, emailError, "Please enter your email.");
      errors.push({ field: emailInput, text: "Email is required." });
    } else if (!emailInput.validity.valid) {
      showError(emailInput, emailError, "Enter a valid email, like name@email.com.");
      errors.push({ field: emailInput, text: "Email format is not valid." });
    }

    clearError(null, goalError);
    const goalChecked = form.querySelector('input[name="goal"]:checked');
    if (!goalChecked) {
      showError(null, goalError, "Please choose your main goal.");
      errors.push({ field: firstGoal, text: "Main goal is required." });
    }

    clearError(messageInput, messageError);
    if (messageInput.value.trim() === "") {
      showError(messageInput, messageError, "Please write a message.");
      errors.push({ field: messageInput, text: "Message is required." });
    }

    return errors;
  }

  // Build the error summary at the top of the form (links jump to each field)
  function showSummary(errors) {
    summary.innerHTML = "";

    const heading = document.createElement("p");
    const headingText = document.createElement("strong");
    headingText.textContent = errors.length === 1
      ? "There is 1 error in the form:"
      : "There are " + errors.length + " errors in the form:";
    heading.appendChild(headingText);

    const errorList = document.createElement("ul");
    errors.forEach(function (error) {
      const listItem = document.createElement("li");
      const link = document.createElement("a");
      link.href = "#" + error.field.id;
      link.textContent = error.text;
      link.addEventListener("click", function (event) {
        event.preventDefault();
        error.field.focus();
      });
      listItem.appendChild(link);
      errorList.appendChild(listItem);
    });

    summary.appendChild(heading);
    summary.appendChild(errorList);
    summary.hidden = false;
  }

  // When the user clicks "Send Message" (or presses Enter)
  form.addEventListener("submit", function (event) {
    event.preventDefault(); // stop the page from reloading
    success.hidden = true;

    const errors = validate();

    if (errors.length > 0) {
      showSummary(errors);
      errors[0].field.focus(); // move keyboard focus to the first problem
      return;
    }

    summary.hidden = true;
    summary.innerHTML = "";
    form.reset();
    success.textContent = "Thank you! We will contact you within 24 hours.";
    success.hidden = false;
  });

  // Remove each error as soon as the user fixes that field
  nameInput.addEventListener("input", function () {
    if (nameInput.value.trim() !== "") clearError(nameInput, nameError);
  });

  emailInput.addEventListener("input", function () {
    if (emailInput.value.trim() !== "" && emailInput.validity.valid) {
      clearError(emailInput, emailError);
    }
  });

  messageInput.addEventListener("input", function () {
    if (messageInput.value.trim() !== "") clearError(messageInput, messageError);
  });

  goalRadios.forEach(function (radio) {
    radio.addEventListener("change", function () {
      clearError(null, goalError);
    });
  });
}

// ===== 3. API FETCH (bonus): live Los Angeles weather (index.html) =====
// Free API from Open-Meteo, no key needed.
function setupWeather() {
  const weatherStatus = document.querySelector("#weather-status");
  const refreshButton = document.querySelector("#weather-refresh");
  if (!weatherStatus || !refreshButton) return;

  const weatherUrl =
    "https://api.open-meteo.com/v1/forecast" +
    "?latitude=34.05&longitude=-118.24" +
    "&current=temperature_2m,weather_code,wind_speed_10m" +
    "&temperature_unit=fahrenheit&wind_speed_unit=mph" +
    "&timezone=America%2FLos_Angeles";

  // Turn the weather code number into words
  function describeSky(code) {
    if (code === 0) return "clear sky";
    if (code <= 3) return "partly cloudy";
    if (code === 45 || code === 48) return "foggy";
    if (code >= 51 && code <= 57) return "light drizzle";
    if (code >= 61 && code <= 67) return "rain";
    if (code >= 71 && code <= 77) return "snow";
    if (code >= 80 && code <= 82) return "rain showers";
    if (code >= 95) return "thunderstorms";
    return "mixed weather";
  }

  // A coach's tip based on the weather
  function trainingTip(temperature, code) {
    if (code >= 51) return "Stay inside today: perfect day for the 2 Dumbbell Workout.";
    if (temperature >= 90) return "It's hot: train early and drink plenty of water.";
    if (temperature <= 50) return "It's cold: warm up longer before you start.";
    return "Great day to take your calisthenics to the park.";
  }

  async function loadWeather() {
    weatherStatus.textContent = "Loading today's weather...";

    try {
      const response = await fetch(weatherUrl);
      if (!response.ok) {
        throw new Error("Weather server answered with status " + response.status);
      }

      const data = await response.json();
      const temperature = Math.round(data.current.temperature_2m);
      const wind = Math.round(data.current.wind_speed_10m);
      const sky = describeSky(data.current.weather_code);

      weatherStatus.textContent =
        "Los Angeles right now: " + temperature + "°F, " + sky +
        ", wind " + wind + " mph. " + trainingTip(temperature, data.current.weather_code);
    } catch (error) {
      // Network problem, server down, or bad data: tell the user in the page
      weatherStatus.textContent =
        "Sorry, we could not load the weather right now. Please press Try Again.";
      refreshButton.textContent = "Try Again";
    }
  }

  refreshButton.addEventListener("click", function () {
    refreshButton.textContent = "Refresh Weather";
    loadWeather();
  });

  loadWeather();
}

// Start everything (script uses "defer", so the page is already loaded)
setupWorkoutToggles();
setupContactForm();
setupWeather();
