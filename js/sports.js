import { loadPageData } from './loader.js';

const $ = (id) => document.querySelector(`#sports-${id}`);

const elements = {
    eyebrow: $('eyebrow'),
    title: $('title'),
    description: $('description'),
    league: $('league'),
    kickoff: $('kickoff'),
    homeBadge: $('home-badge'),
    homeName: $('home-name'),
    awayBadge: $('away-badge'),
    awayName: $('away-name'),
    options: $('options'),
    hint: $('hint'),
    legal: $('legal'),
    modal: $('modal'),
    modalKicker: $('modal-kicker'),
    modalTitle: $('modal-title'),
    modalPrize: $('modal-prize'),
    modalDescription: $('modal-description'),
    modalClose: $('modal-close'),
    modalButton: $('modal-button'),
    bonusValue: $('bonus-value'),
};

const STORAGE_KEY = 'sports-prediction';
const LOCKED_HINT = 'Your prediction has been locked!';
const CLAIM_URL = 'https://www.365scores.com/he?prize=';

let sportsConfig;
let selectedPick = null;
let currentVariant = 'A';

const readSaved = () => {
    try {
        return JSON.parse(sessionStorage.getItem(STORAGE_KEY));
    } catch {
        try {
            sessionStorage.removeItem(STORAGE_KEY);
        } catch {}
        return null;
    }
};

const savePrediction = (option) => {
    try {
        sessionStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({ pickId: option.id, variant: currentVariant })
        );
    } catch {}
};

const clearSaved = () => {
    try {
        sessionStorage.removeItem(STORAGE_KEY);
    } catch {}
};

const getVariant = (defaultVariant = 'A') => {
    const variant = new URLSearchParams(location.search).get('variant');
    return variant === 'A' || variant === 'B' ? variant : defaultVariant;
};

const findOption = (id) =>
    sportsConfig.match.options.find((option) => option.id === id);

const renderTeam = (badge, nameEl, team) => {
    if (!team) return;

    badge.textContent = team.short;
    badge.style.setProperty('--team-color', team.color);
    badge.style.setProperty('--team-text-color', team.textColor);
    nameEl.textContent = team.name;
};

const renderOptions = () => {
    const fragment = document.createDocumentFragment();

    for (const option of sportsConfig.match.options) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'sports__option';
        button.dataset.pickId = option.id;

        const name = document.createElement('span');
        name.className = 'sports__option-name';
        name.textContent = option.name;

        const odds = document.createElement('span');
        odds.className = 'sports__option-odds';
        odds.textContent = option.odds.toFixed(2);

        button.append(name, odds);
        fragment.append(button);
    }

    elements.options.replaceChildren(fragment);
};

const renderMatch = () => {
    const { league, kickoff, options } = sportsConfig.match;

    elements.league.textContent = league;
    elements.kickoff.textContent = kickoff;

    renderTeam(
        elements.homeBadge,
        elements.homeName,
        options.find(({ id }) => id === 'home')
    );
    renderTeam(
        elements.awayBadge,
        elements.awayName,
        options.find(({ id }) => id === 'away')
    );

    renderOptions();
};

const renderPage = () => {
    const { brand, headlines, subline, siteLegal, modal } = sportsConfig;

    elements.eyebrow.textContent = brand;
    elements.title.textContent = headlines[currentVariant];
    elements.description.textContent = subline;
    elements.legal.textContent = siteLegal;
    elements.bonusValue.textContent = modal.prize;

    renderMatch();
};

const renderModal = (option) => {
    const { modal, stake, currency } = sportsConfig;
    const odds = option.odds.toFixed(2);

    const values = {
        pick: option.name,
        odds,
        currency,
        stake,
        return: `${currency}${(stake * option.odds).toFixed(2)}`,
    };

    elements.modalKicker.textContent = modal.kicker;
    elements.modalTitle.textContent = modal.title;
    elements.modalPrize.textContent = modal.prize;
    elements.modalDescription.textContent = modal.text.replace(
        /\{(\w+)\}/g,
        (match, key) => (key in values ? values[key] : match)
    );
    elements.modalButton.textContent = modal.claimLabel;

    elements.modal.classList.add('is-open');
};

const lockPick = (option) => {
    selectedPick = option;

    for (const button of elements.options.children) {
        const isSelected = button.dataset.pickId === option.id;

        button.disabled = !isSelected;
        button.classList.toggle('is-selected', isSelected);
        button.classList.toggle('is-disabled', !isSelected);
    }

    elements.hint.textContent = LOCKED_HINT;
};

const handlePick = (event) => {
    const button = event.target.closest('.sports__option');
    const option = button && findOption(button.dataset.pickId);

    if (!option) return;

    if (selectedPick) {
        if (selectedPick.id === option.id) renderModal(option);
        return;
    }

    lockPick(option);
    savePrediction(option);
    renderModal(option);
};

const restorePrediction = () => {
    const saved = readSaved();

    if (!saved) return;

    const option = findOption(saved.pickId);

    if (option) {
        lockPick(option);
    } else {
        clearSaved();
    }
};

const closeModal = () => elements.modal.classList.remove('is-open');

const handleClaim = () => {
    if (!selectedPick) return;

    elements.modalButton.disabled = true;
    elements.modalButton.textContent = sportsConfig.modal.claimingLabel;

    location.href = `${CLAIM_URL}${selectedPick.id}`;
};

const init = async () => {
    try {
        const config = await loadPageData('./data/config.json');

        sportsConfig = { ...config.sports, siteLegal: config.site.legal };
        currentVariant = getVariant(config.site.defaultVariant);

        renderPage();
        restorePrediction();

        elements.options.addEventListener('click', handlePick);
        elements.modalClose.addEventListener('click', closeModal);
        elements.modalButton.addEventListener('click', handleClaim);
        elements.modal
            .querySelector('.modal__overlay')
            .addEventListener('click', closeModal);
    } catch (error) {
        console.error('Failed to initialize Sports page:', error);
    }
};

init();
