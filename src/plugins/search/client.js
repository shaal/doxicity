// Append the search panel to the body
(() => {
  const siteSearch = document.createElement('div');
  siteSearch.classList.add('site-search');
  siteSearch.innerHTML = `
    <div class="site-search__overlay"></div>
    <div id="site-search-panel" class="site-search__panel">
      <header class="site-search__header">
        <div role="combobox" aria-expanded="true" aria-owns="site-search-listbox" aria-haspopup="listbox" id="site-search-combobox" class="site-search__input-wrapper">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"></path>
          </svg>
          <input
            id="site-search-input"
            class="site-search__input"
            type="search"
            placeholder="Search"
            autocomplete="off"
            autocorrect="off"
            autocapitalize="off"
            enterkeyhint="go"
            spellcheck="false"
            maxlength="100"
            aria-autocomplete="list"
            aria-controls="site-search-listbox"
            aria-activedescendant
          >
          <button type="button" class="site-search__clear-button" aria-label="Clear entry" tabindex="-1" hidden>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle-fill" viewBox="0 0 16 16">
              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"></path>
            </svg>
          </button>
        </div>
      </header>
      <div class="site-search__body">
        <ul
          id="site-search-listbox"
          class="site-search__results"
          role="listbox"
          aria-label="Search"
        ></ul>
        <div class="site-search__empty">No matching pages</div>
      </div>
      <footer class="site-search__footer">
        <small><kbd>↑</kbd> <kbd>↓</kbd> Navigate</small>
        <small><kbd>↲</kbd> Select</small>
        <small><kbd>Esc</kbd> Close</small>
      </footer>
    </div>
  `;

  const overlay = siteSearch.querySelector('.site-search__overlay');
  const panel = siteSearch.querySelector('.site-search__panel');
  const input = siteSearch.querySelector('.site-search__input');
  const clearButton = siteSearch.querySelector('.site-search__clear-button');
  const results = siteSearch.querySelector('.site-search__results');
  const animationDuration = 150;
  const searchDebounce = 200;
  let isShowing = false;
  let searchTimeout;
  let searchIndex;
  let map;

  // Load search data
  fetch('SEARCH_INDEX_URL')
    .then(res => res.json())
    .then(data => {
      // eslint-disable-next-line no-undef
      searchIndex = lunr.Index.load(data.searchIndex);
      map = data.map;
    });

  async function show() {
    isShowing = true;
    document.body.append(siteSearch);
    document.body.classList.add('site-search-visible');
    clearButton.hidden = true;
    requestAnimationFrame(() => input.focus());
    updateResults();

    await Promise.all([
      panel.animate(
        [
          { opacity: 0, transform: 'scale(.9)' },
          { opacity: 1, transform: 'scale(1)' }
        ],
        { duration: animationDuration }
      ).finished,
      overlay.animate([{ opacity: 0 }, { opacity: 1 }], { duration: animationDuration }).finished
    ]);

    document.addEventListener('mousedown', handleDocumentMouseDown);
    document.addEventListener('keydown', handleDocumentKeyDown);
    document.addEventListener('focusin', handleDocumentFocusIn);
  }

  async function hide() {
    isShowing = false;
    document.body.classList.remove('site-search-visible');

    await Promise.all([
      panel.animate(
        [
          { opacity: 1, transform: 'scale(1)' },
          { opacity: 0, transform: 'scale(.9)' }
        ],
        { duration: animationDuration }
      ).finished,
      overlay.animate([{ opacity: 1 }, { opacity: 0 }], { duration: animationDuration }).finished
    ]);

    siteSearch.remove();
    input.value = '';
    updateResults();

    document.removeEventListener('mousedown', handleDocumentMouseDown);
    document.removeEventListener('keydown', handleDocumentKeyDown);
    document.removeEventListener('focusin', handleDocumentFocusIn);
  }

  function handleInput() {
    clearButton.hidden = input.value === '';

    // Debounce search queries
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => updateResults(input.value), searchDebounce);
  }

  function handleClear() {
    clearButton.hidden = true;
    input.value = '';
    input.focus();
    updateResults();
  }

  function handleDocumentFocusIn(event) {
    // Close when focus leaves the panel
    if (event.target.closest('.site-search__panel') !== panel) {
      hide();
    }
  }

  function handleDocumentMouseDown(event) {
    // Close when clicking outside of the panel
    if (event.target.closest('.site-search__overlay') === overlay) {
      hide();
    }
  }

  function handleDocumentKeyDown(event) {
    // Close when pressing escape
    if (event.key === 'Escape') {
      event.preventDefault();
      hide();
      return;
    }

    // Handle keyboard selections
    if (['ArrowDown', 'ArrowUp', 'Home', 'End', 'Enter'].includes(event.key)) {
      event.preventDefault();

      const currentEl = results.querySelector('[data-selected="true"]');
      const items = [...results.querySelectorAll('li')];
      const index = items.indexOf(currentEl);
      let nextEl;

      if (items.length === 0) {
        return;
      }

      switch (event.key) {
        case 'ArrowUp':
          nextEl = items[Math.max(0, index - 1)];
          break;
        case 'ArrowDown':
          nextEl = items[Math.min(items.length - 1, index + 1)];
          break;
        case 'Home':
          nextEl = items[0];
          break;
        case 'End':
          nextEl = items[items.length - 1];
          break;
        case 'Enter':
          currentEl?.querySelector('a')?.click();
          break;
      }

      // Update the selected item
      items.forEach(item => {
        if (item === nextEl) {
          input.setAttribute('aria-activedescendant', item.id);
          item.setAttribute('data-selected', 'true');
          nextEl.scrollIntoView({ block: 'nearest' });
        } else {
          item.setAttribute('data-selected', 'false');
        }
      });
    }
  }

  async function updateResults(query = '') {
    try {
      await searchIndex;

      const hasQuery = query.length > 0;
      const searchTokens = query
        .split(' ')
        .map((term, index, arr) => `${term}${index === arr.length - 1 ? `* ${term}~1` : '~1'}`)
        .join(' ');
      const matches = hasQuery ? searchIndex.search(`${query} ${searchTokens}`) : [];
      const hasResults = hasQuery && matches.length > 0;

      siteSearch.classList.toggle('site-search--has-results', hasQuery && hasResults);
      siteSearch.classList.toggle('site-search--no-results', hasQuery && !hasResults);

      input.setAttribute('aria-activedescendant', '');
      results.innerHTML = '';

      matches.forEach((match, index) => {
        const page = map[match.ref];
        const li = document.createElement('li');
        const a = document.createElement('a');
        const displayTitle = page.title ?? '';
        const displayDescription = page.description ?? '';
        const displayUrl = page.url.replace(/^\//, '');

        li.classList.add('site-search__result');
        li.setAttribute('role', 'option');
        li.setAttribute('id', `search-result-item-${match.ref}`);
        li.setAttribute('data-selected', index === 0 ? 'true' : 'false');

        a.href = page.url;
        a.innerHTML = `
          <div class="site-search__result-icon" aria-hidden="true">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-file-text" viewBox="0 0 16 16">
              <path d="M5 4a.5.5 0 0 0 0 1h6a.5.5 0 0 0 0-1H5zm-.5 2.5A.5.5 0 0 1 5 6h6a.5.5 0 0 1 0 1H5a.5.5 0 0 1-.5-.5zM5 8a.5.5 0 0 0 0 1h6a.5.5 0 0 0 0-1H5zm0 2a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1H5z"></path>
              <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2zm10-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1z"></path>
            </svg>
          </div>
          <div class="site-search__result__details">
            <div class="site-search__result-title"></div>
            <div class="site-search__result-description"></div>
            <div class="site-search__result-url"></div>
          </div>
        `;
        a.querySelector('.site-search__result-title').textContent = displayTitle;
        a.querySelector('.site-search__result-description').textContent = displayDescription;
        a.querySelector('.site-search__result-url').textContent = displayUrl;

        li.appendChild(a);
        results.appendChild(li);
      });
    } catch {
      // Ignore query errors as the user types
    }
  }

  // Show the search panel when clicking on data-plugin="search"
  document.addEventListener('click', event => {
    const searchButton = event.target.closest('[data-plugin="search"]');
    if (searchButton) {
      show();
    }
  });

  // Show the search panel when slash is pressed outside of a form element
  document.addEventListener('keydown', event => {
    if (
      !isShowing &&
      event.key === '/' &&
      !event.composedPath().some(el => ['input', 'textarea'].includes(el?.tagName?.toLowerCase()))
    ) {
      event.preventDefault();
      show();
    }
  });

  input.addEventListener('input', handleInput);
  clearButton.addEventListener('click', handleClear);

  // Close when a result is selected
  results.addEventListener('click', event => {
    if (event.target.closest('a')) {
      hide();
    }
  });
})();
