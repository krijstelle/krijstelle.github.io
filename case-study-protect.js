const PASSWORD = 'massivepotato'; // Change this to update the password
const STORAGE_KEY_PREFIX = 'cs-unlock:';

document.addEventListener('DOMContentLoaded', () => {
  const overlay = document.getElementById('password-overlay');
  const content = document.getElementById('case-study-content');
  const form = document.getElementById('password-form');
  const input = document.getElementById('password-input');
  const error = document.getElementById('password-error');

  if (!overlay || !content || !form || !input || !error) return;

  const key = STORAGE_KEY_PREFIX + window.location.pathname;

  const unlock = () => {
    overlay.style.display = 'none';
    content.removeAttribute('hidden');
    // Prev/next case studies and the footer sit outside the main content
    document.querySelectorAll('.case-study-after').forEach((el) => el.removeAttribute('hidden'));
  };

  // Auto-unlock if this page was already unlocked in this session
  try {
    const unlocked = sessionStorage.getItem(key);
    if (unlocked === 'true') {
      unlock();
      return;
    }
  } catch (e) {
    // If sessionStorage is blocked, just fall back to manual entry
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const value = input.value.trim();
    if (!value) return;

    if (value === PASSWORD) {
      try {
        sessionStorage.setItem(key, 'true');
      } catch (e) {
        // Ignore storage errors
      }
      unlock();
    } else {
      error.textContent = 'Incorrect password. Please try again.';
      input.value = '';
      input.focus();
    }
  });

  // Focus the input when the overlay is visible
  setTimeout(() => {
    input.focus();
  }, 50);
});

