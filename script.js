const signupForm = document.getElementById("signup-form");
const nameField = document.getElementById("subscriber-name");
const emailField = document.getElementById("subscriber-email");
const submitButton = document.getElementById("submit-button");
const feedback = document.getElementById("form-feedback");
const formSuccess = document.getElementById("form-success");
const signupFields = document.querySelector(".signup-fields");
const signupNote = document.querySelector(".signup-note");
const currentYear = document.getElementById("current-year");
const nextField = document.getElementById("form-next");
const urlField = document.getElementById("form-url");
const replyToField = document.getElementById("form-replyto");

const SUCCESS_PARAM = "subscribed";
const isWebContext = window.location.protocol === "http:" || window.location.protocol === "https:";

if (currentYear) {
  currentYear.textContent = String(new Date().getFullYear());
}

const pageUrl = new URL(window.location.href);
pageUrl.searchParams.delete(SUCCESS_PARAM);

const successUrl = new URL(pageUrl.toString());
successUrl.searchParams.set(SUCCESS_PARAM, "1");

if (nextField) {
  nextField.value = isWebContext ? successUrl.toString() : "";
}

if (urlField) {
  urlField.value = isWebContext ? pageUrl.toString() : "";
}

const hideFeedback = () => {
  if (!feedback) return;
  feedback.textContent = "";
  feedback.classList.add("hidden");
  feedback.classList.remove("is-success", "is-error");
};

const setFeedback = (message, type) => {
  if (!feedback) return;
  feedback.textContent = message;
  feedback.classList.remove("hidden", "is-success", "is-error");
  if (type === "success") {
    feedback.classList.add("is-success");
  } else if (type === "error") {
    feedback.classList.add("is-error");
  }
};

const showSuccessState = () => {
  if (!signupForm) return;
  signupForm.classList.add("is-complete");
  signupFields?.classList.add("hidden");
  signupNote?.classList.add("hidden");
  hideFeedback();
  formSuccess?.classList.remove("hidden");
};

const showSuccessFromRedirect = () => {
  const params = new URLSearchParams(window.location.search);
  if (!params.has(SUCCESS_PARAM)) return;
  showSuccessState();
  params.delete(SUCCESS_PARAM);
  const cleanQuery = params.toString();
  const cleanUrl = `${window.location.pathname}${cleanQuery ? `?${cleanQuery}` : ""}${window.location.hash}`;
  window.history.replaceState({}, document.title, cleanUrl);
};

showSuccessFromRedirect();

if (!isWebContext) {
  setFeedback(
    "Preview mode: this page is opened as a local HTML file. The mailing-list form will work after you publish the site or run it through a local web server.",
    "success"
  );
}

if (replyToField && emailField) {
  replyToField.value = emailField.value.trim();
  emailField.addEventListener("input", () => {
    replyToField.value = emailField.value.trim();
  });
}

if (signupForm) {
  signupForm.addEventListener("submit", (event) => {
    hideFeedback();

    const trimmedName = nameField?.value.trim() || "";
    const trimmedEmail = emailField?.value.trim() || "";

    if (nameField) nameField.value = trimmedName;
    if (emailField) emailField.value = trimmedEmail;
    if (replyToField) replyToField.value = trimmedEmail;

    if (!signupForm.checkValidity()) {
      event.preventDefault();
      emailField?.focus();
      setFeedback("Please enter a valid email address.", "error");
      return;
    }

    if (!isWebContext) {
      event.preventDefault();
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = "Join the list";
      }
      setFeedback(
        "Local preview mode detected. Form submissions only work from a live website or a local web server. After deployment, the form will submit normally and return here with the success message.",
        "success"
      );
      return;
    }

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Submitting...";
    }
  });
}
