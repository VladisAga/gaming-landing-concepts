import { loadPageData } from './loader.js';

const $ = (selector) => document.querySelector(selector);

const spinButton = $('.hero__button');
const wheelSegments = $('.wheel__segments');
const headline = $('.hero__title');
const description = $('.hero__description');

const modal = $('#prize-modal');
const modalKicker = $('.modal__kicker');
const modalTitle = $('.modal__title');
const modalPrize = $('.modal__prize');
const modalDescription = $('.modal__description');
const modalButton = $('.modal__button');
const modalClose = $('.modal__close');
const modalOverlay = $('.modal__overlay');

const STORAGE_KEY = 'luckyspin-played';
const CLAIM_URL = 'https://www.365scores.com/he?prize=';
const BULB_COUNT = 18;

const variant =
    new URLSearchParams(location.search).get('variant') === 'B' ? 'B' : 'A';

let casinoConfig;
let isSpinning = false;
let currentAngle = 0;
let savedPrize = null;

const readSavedId = () => {
    try {
        return sessionStorage.getItem(STORAGE_KEY);
    } catch {
        return null;
    }
};

const writeSavedId = (id) => {
    try {
        id === null
            ? sessionStorage.removeItem(STORAGE_KEY)
            : sessionStorage.setItem(STORAGE_KEY, id);
    } catch {}
};

const isModalOpen = () => modal.classList.contains('is-open');

const setModalOpen = (open) => {
    modal.classList.toggle('is-open', open);
    modal.setAttribute('aria-hidden', String(!open));
};

const openPrizeModal = (prize) => {
    if (isModalOpen()) return;

    const { kicker, title, claimLabel } = casinoConfig.modal;

    modalKicker.textContent = kicker;
    modalTitle.textContent = title;
    modalPrize.textContent = prize.label;
    modalDescription.textContent = prize.description;
    modalButton.textContent = claimLabel;
    modalButton.href = `${CLAIM_URL}${prize.id}`;

    setModalOpen(true);
};

const closePrizeModal = () => setModalOpen(false);

const renderPage = () => {
    headline.textContent = casinoConfig.headlines[variant];
    description.textContent = casinoConfig.subline;
    spinButton.textContent = casinoConfig.spinLabel;
};

const renderWheel = () => {
    const { prizes } = casinoConfig;
    const sectorAngle = 360 / prizes.length;
    const fragment = document.createDocumentFragment();

    const gradient = prizes
        .map(
            ({ color }, i) =>
                `${color} ${i * sectorAngle}deg ${(i + 1) * sectorAngle}deg`
        )
        .join(', ');

    wheelSegments.style.background = `conic-gradient(${gradient})`;

    prizes.forEach((prize, i) => {
        const label = document.createElement('span');

        label.className = 'wheel__label';
        label.textContent = prize.short;
        label.style.color = prize.textColor;
        label.style.setProperty('--angle', `${(i + 0.5) * sectorAngle}deg`);

        fragment.append(label);
    });

    for (let i = 0; i < BULB_COUNT; i++) {
        const bulb = document.createElement('span');
        const angle = (i / BULB_COUNT) * Math.PI * 2;

        bulb.className = 'wheel__bulb';
        bulb.style.left = `${50 + Math.cos(angle) * 50}%`;
        bulb.style.top = `${50 + Math.sin(angle) * 50}%`;
        bulb.style.animationDelay = `${i * 0.08}s`;

        fragment.append(bulb);
    }

    wheelSegments.replaceChildren(fragment);
};

const getRandomPrize = (prizes) => {
    let random =
        Math.random() * prizes.reduce((sum, { weight }) => sum + weight, 0);

    for (const prize of prizes) {
        random -= prize.weight;
        if (random < 0) return prize;
    }

    return prizes[prizes.length - 1];
};

const resetSpinButton = () => {
    isSpinning = false;
    spinButton.disabled = false;
    spinButton.textContent = casinoConfig.spinLabel;
};

const spinWheel = () => {
    if (isSpinning || savedPrize || !casinoConfig) return;

    const { prizes, winningPrizeId, extraTurns, spinDurationMs } = casinoConfig;

    if (!prizes?.length) {
        console.error('No prizes configured');
        return;
    }

    const winningPrize = winningPrizeId
        ? prizes.find(({ id }) => id === winningPrizeId)
        : getRandomPrize(prizes);

    if (!winningPrize) {
        console.error('Winning prize not found');
        return;
    }

    isSpinning = true;
    spinButton.disabled = true;
    spinButton.textContent = casinoConfig.spinningLabel;

    savedPrize = winningPrize;
    writeSavedId(winningPrize.id);

    const sectorAngle = 360 / prizes.length;
    const targetInSector =
        prizes.indexOf(winningPrize) * sectorAngle +
        sectorAngle * (0.15 + Math.random() * 0.7);
    const targetAngle = (360 - targetInSector) % 360;
    const normalizedAngle = ((currentAngle % 360) + 360) % 360;
    const rotation = (targetAngle - normalizedAngle + 360) % 360;

    currentAngle += extraTurns * 360 + rotation;

    wheelSegments.style.transitionDuration = `${spinDurationMs}ms`;
    wheelSegments.style.transform = `rotate(${currentAngle}deg)`;

    wheelSegments.addEventListener(
        'transitionend',
        (event) => {
            if (event.propertyName !== 'transform') return;

            isSpinning = false;
            spinButton.disabled = false;
            spinButton.textContent = casinoConfig.modal.claimLabel;

            openPrizeModal(winningPrize);
        },
        { once: true }
    );
};

const showLoadError = () => {
    headline.textContent = 'Something went wrong';
    spinButton.disabled = true;

    const loaderText = $('.loader__text');

    if (!loaderText) return;

    loaderText.textContent = 'Failed to load. Please refresh the page.';
    $('.loader').classList.remove('is-hidden');
};

const init = async () => {
    spinButton.disabled = true;

    try {
        casinoConfig = (await loadPageData('./data/config.json')).casino;

        renderPage();
        renderWheel();

        const savedId = readSavedId();

        if (savedId) {
            savedPrize = casinoConfig.prizes.find(({ id }) => id === savedId) ?? null;

            if (savedPrize) {
                spinButton.textContent = casinoConfig.modal.claimLabel;
            } else {
                writeSavedId(null);
            }
        }

        spinButton.disabled = false;
    } catch (error) {
        console.error('Initialization error:', error);
        showLoadError();
    }
};

spinButton.addEventListener('click', () => {
    if (savedPrize) {
        openPrizeModal(savedPrize);
    } else {
        spinWheel();
    }
});

modalClose.addEventListener('click', closePrizeModal);
modalOverlay.addEventListener('click', closePrizeModal);

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && isModalOpen()) closePrizeModal();
});

init();
