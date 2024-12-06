import CharactersService from "./lib/characters.service.js";

export async function buildListing (element) {
  renderLoadingState(element);

  const characters = await fetchCharacterData();
  renderCharacterCards(element, characters);
  initializeCardInteractions(element);
}

function renderLoadingState (element) {
  const loadingCards = Array.from({ length: 5 }, createLoadingCard).join('');
  element.innerHTML = `${loadingCards}`;
}

function createLoadingCard () {
  return `
    <li class="card player-card loading" role="listitem" aria-label="Loading character card">
      <div class="card__container">
        <div class="card__select-indicator" aria-hidden="true">
          <span>SELECT</span>
        </div>
        <div class="card__front__body">
          <div class="card__title-container">
            <h2 class="card__title loading-placeholder" aria-label="Loading character name"></h2>
          </div>
          <ul class="card__stats" role="list" aria-label="Character statistics">
            <li class="card__stat" role="listitem">
              <span class="card__stat__label">Height</span>
              <span class="card__stat__value loading-placeholder" aria-label="Loading height value"></span>
            </li>
            <li class="card__stat" role="listitem">
              <span class="card__stat__label">Mass</span>
              <span class="card__stat__value loading-placeholder" aria-label="Loading mass value"></span>
            </li>
            <li class="card__stat" role="listitem">
              <span class="card__stat__label">Species</span>
              <span class="card__stat__value loading-placeholder" aria-label="Loading species value"></span>
            </li>
            <li class="card__stat" role="listitem">
              <span class="card__stat__label">Gender</span>
              <span class="card__stat__value loading-placeholder" aria-label="Loading gender value"></span>
            </li>
            <li class="card__stat" role="listitem">
              <span class="card__stat__label">Birth Year</span>
              <span class="card__stat__value loading-placeholder" aria-label="Loading birth year value"></span>
            </li>
          </ul>
        </div>
        <div class="card__image-container loading-placeholder" aria-label="Loading character image">
        </div>
      </div>
    </li>
  `;
}

async function fetchCharacterData () {
  const characters = await CharactersService.getCharacters();

  // Sort to put Darth Vader first
  return characters.sort((a, b) => {
    if (a.name === "Darth Vader") return -1;
    if (b.name === "Darth Vader") return 1;
    return 0;
  });
}

function renderCharacterCards (element, characters) {
  element.innerHTML = characters.map(createCharacterCard).join('');
}

function createCharacterCard (character) {
  return `
    <li class="card player-card" 
        role="listitem" 
        aria-label="${character.name}"
        tabindex="0">
      <div class="card__container">
        <div class="card__select-indicator" aria-hidden="true">
          <span>SELECT</span>
        </div>
        <div class="card__front__body">
          <div class="card__title-container">
            <h2 class="card__title" id="${character.name.toLowerCase()}-title">${character.name}</h2>
          </div>
          <ul class="card__stats" role="list" aria-labelledby="${character.name.toLowerCase()}-title" aria-label="Character statistics">
              <li class="card__stat" role="listitem" aria-label="Height">
                <span class="card__stat__label">Height</span>
                <span class="card__stat__value" aria-label="Height: ${character.height}">${character.height}</span>
              </li>
              <li class="card__stat" role="listitem" aria-label="Mass">
                <span class="card__stat__label">Mass</span>
                <span class="card__stat__value" aria-label="Mass: ${character.mass}">${character.mass}</span>
              </li>
              <li class="card__stat" role="listitem" aria-label="Species">
                <span class="card__stat__label">Species</span>
                <span class="card__stat__value" aria-label="Species: Unknown">Unknown</span>
              </li>
              <li class="card__stat" role="listitem" aria-label="Gender">
                <span class="card__stat__label">Gender</span>
                <span class="card__stat__value" aria-label="Gender: Unknown">Unknown</span>
              </li>
              <li class="card__stat" role="listitem" aria-label="Birth Year">
                <span class="card__stat__label">Birth Year</span>
                <span class="card__stat__value" aria-label="Birth Year: ${character.birthYear}">${character.birthYear}</span>
              </li>
            </ul>
        </div>
        <div class="card__image-container">
          <img src="/${character.image}" 
               class="card__image" 
               alt="${character.name} character portrait" 
               width="100%" 
               height="auto" />
        </div>
      </div>
    </li>
    `;
}

function initializeCardInteractions (listing) {
  const cards = listing.querySelectorAll('.player-card');

  listing.setAttribute('role', 'listbox');
  listing.setAttribute('aria-label', 'Character Selection');

  // Initialize first card
  cards[0].classList.add('highlighted');
  cards[0].setAttribute('aria-selected', 'false');
  listing.scrollLeft = 0;

  // Add event listeners
  initializeScrollHandler(listing, cards);
  initializeKeyboardNavigation(listing);
  initializeCardClickHandlers(cards);

  // Set initial focus management
  cards.forEach(card => {
    card.setAttribute('role', 'option');
    card.setAttribute('aria-selected', 'false');

    // Add focus event listener to each card
    card.addEventListener('focus', () => {
      card.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });

      // Update highlighted state
      listing.querySelectorAll('.highlighted').forEach(el => el.classList.remove('highlighted'));
      card.classList.add('highlighted');
    });
  });
}

/**
 * Scroll handler to highlight the closest card to the center of the listing
 * @param {HTMLElement} listing 
 * @param {HTMLElement[]} cards 
 */
function initializeScrollHandler (listing, cards) {
  listing.addEventListener('scroll', () => {
    const centerX = listing.offsetLeft + listing.clientWidth / 2;
    updateHighlightedCard(cards, centerX);
  });
}

/**
 * Update the highlighted card based on the scroll position
 * @param {HTMLElement[]} cards 
 * @param {number} centerX 
 */
function updateHighlightedCard (cards, centerX) {
  let closestCard = null;
  let closestDistance = Infinity;

  cards.forEach(card => {
    const cardRect = card.getBoundingClientRect();
    const cardCenterX = cardRect.left + cardRect.width / 2;
    const distance = Math.abs(centerX - cardCenterX);

    if (distance < closestDistance) {
      closestDistance = distance;
      closestCard = card;
    }
    card.classList.remove('highlighted');
  });

  if (closestCard) {
    closestCard.classList.add('highlighted');
  }
}

/**
 * Keyboard navigation handler
 * @param {HTMLElement} listing 
 */
function initializeKeyboardNavigation (listing) {
  document.addEventListener('keydown', (event) => {
    const highlightedCard = listing.querySelector('.highlighted');
    if (!highlightedCard) return;

    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowLeft':
        handleArrowNavigation(event.key, highlightedCard);
        break;
      case 'Enter':
      case ' ': // Space key
        event.preventDefault(); // Prevent page scroll on space
        highlightedCard.click();
        break;
    }
  });

  // Add focus handling
  listing.addEventListener('focusin', (event) => {
    const card = event.target.closest('.player-card');
    if (card) {
      card.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });

      // Update highlighted state
      listing.querySelectorAll('.highlighted').forEach(el => el.classList.remove('highlighted'));
      card.classList.add('highlighted');
    }
  });
}

/**
 * Handle arrow navigation
 * @param {string} key 
 * @param {HTMLElement} highlightedCard 
 */
function handleArrowNavigation (key, highlightedCard) {
  const nextCard = key === 'ArrowRight'
    ? highlightedCard.nextElementSibling
    : highlightedCard.previousElementSibling;

  if (nextCard) {
    nextCard.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });

    // Update highlighted state and focus
    highlightedCard.classList.remove('highlighted');
    nextCard.classList.add('highlighted');
    nextCard.focus();
  }
}

/**
 * Initialize click handlers for the cards
 * @param {HTMLElement[]} cards 
 */
function initializeCardClickHandlers (cards) {
  cards.forEach(card => {
    card.addEventListener('click', () => handleCardClick(card));
  });
}

/**
 * Handle card click
 * @param {HTMLElement} card 
 */
function handleCardClick (card) {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (card.classList.contains('highlighted')) {
    toggleCardSelection(card);
  }

  card.scrollIntoView({
    behavior: prefersReducedMotion ? 'auto' : 'smooth',
    block: 'nearest',
    inline: 'center'
  });
}

/**
 * Toggle card selection
 * @param {HTMLElement} card 
 */
function updateCardSelectIndicator (card, text) {
  card.querySelector('.card__select-indicator span').textContent = text;
}

function setCardSelectedState (card, isSelected) {
  if (isSelected) {
    card.classList.add('selected');
  } else {
    card.classList.remove('selected');
  }
  card.setAttribute('aria-selected', isSelected.toString());
}

function toggleOpponentCard (shouldFlip) {
  const opponentCard = document.querySelector('.opponent-card');
  if (shouldFlip) {
    opponentCard.classList.add('flipped');
  } else {
    opponentCard.classList.remove('flipped');
  }
}

function deselectCurrentCard () {
  const selectedCard = document.querySelector('.selected');
  if (selectedCard) {
    setCardSelectedState(selectedCard, false);
    updateCardSelectIndicator(selectedCard, 'SELECT');
  }
}

function toggleCardSelection (card) {
  if (card.classList.contains('selected')) {
    setCardSelectedState(card, false);
    updateCardSelectIndicator(card, 'SELECT');
    toggleOpponentCard(false);
  } else {
    deselectCurrentCard();
    setCardSelectedState(card, true);
    updateCardSelectIndicator(card, 'SELECTED');
    toggleOpponentCard(true);
  }
}
