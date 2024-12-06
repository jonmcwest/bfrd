import './style.css';
import starWarsLogo from '/logo.png';
import { buildListing } from './src/listing.js';

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('#app').innerHTML = `
    <div class="bg"></div>

    <div class="main">
      <div class="title-container">
        <a href="https://www.starwars.com" target="_blank">
          <img src="${starWarsLogo}" class="logo" alt="Star Wars logo" />
        </a>
        <h2 class="title">TOP TRUMPS</h2>
      </div>
      <div class="play-area">
        <div class="opponent-container">
          ${opponentCard()}
        </div>
        <div class="player-container">
          <h2 class="player-message">SELECT A CARD TO PLAY</h2>
          <ul class="listing" id="listing" aria-label="Available Character Cards"></ul>
        </div>
      </div>
    </div>
  `;

  // Initialize the listing after the DOM is ready
  buildListing(document.querySelector('#listing'));
});

function opponentCard () {
  return `
    <div class="opponent-card-container">
      <div class="card opponent-card">
          <div class="card__back">
            <img src="/question-mark.svg" class="question-mark" alt="Question mark" />
            <p class="message">Opponent has selected a card</p>
          </div>
          <div class="card__front">
            <div class="card__title-container">
              <h2 class="card__title">Luke Skywalker</h2>
            </div>
            <div class="card__image-container">
              <img src="/luke-skywalker.png" class="card__image" alt="luke skywalker" width="100%" height="auto" />
            </div>
        </div>
      </div>
    </div>
  `;
}
