/**
 * @fileoverview Données de référence du répertoire des fractions unitaires CE1.
 *
 * Source : Annexe A du SRS, fondée sur :
 *  - Les 6 fiches de préparation (Fiche_Prep_Fractions_CE1_S1 à S6)
 *  - Programme cycle 2, BOENJS 31/10/2024
 *  - Document d'accompagnement Eduscol CE1 Maths 2025
 *
 * Répertoire CE1 : 7 fractions unitaires dont le dénominateur appartient
 * à {2, 3, 4, 5, 6, 8, 10}.
 *
 * ⚠ Source de vérité pédagogique — ne pas modifier sans référence documentaire.
 */

/**
 * @typedef {Object} Fraction
 * @property {string}   id            - Identifiant unique (ex. "1-2")
 * @property {number}   numerateur    - Numérateur (toujours 1 — fractions unitaires)
 * @property {number}   denominateur  - Dénominateur
 * @property {string}   chiffres      - Notation fractionnaire (ex. "1/2")
 * @property {string}   nomLettres    - Nom en lettres — source : fiche S1, liste matériel
 * @property {string[]} formesSupport - Formes géométriques mobilisées — source : fiches S1, S3, S4
 * @property {number}   seanceIntro   - Séance d'introduction dans la séquence
 */

/** @type {Fraction[]} */
export const FRACTIONS = [
  {
    id: '1-2',
    numerateur: 1,
    denominateur: 2,
    chiffres: '1/2',
    nomLettres: 'un demi',
    formesSupport: ['carre', 'rectangle', 'disque', 'demi-disque'],
    seanceIntro: 1,
  },
  {
    id: '1-3',
    numerateur: 1,
    denominateur: 3,
    chiffres: '1/3',
    nomLettres: 'un tiers',
    // Source fiche S3 : « disque, hexagone régulier, rectangle »
    formesSupport: ['disque', 'hexagone', 'rectangle'],
    seanceIntro: 3,
  },
  {
    id: '1-4',
    numerateur: 1,
    denominateur: 4,
    chiffres: '1/4',
    nomLettres: 'un quart',
    formesSupport: ['carre', 'rectangle', 'disque'],
    seanceIntro: 1,
  },
  {
    id: '1-5',
    numerateur: 1,
    denominateur: 5,
    chiffres: '1/5',
    nomLettres: 'un cinquième',
    // Source fiche S4 : « bande rectangulaire »
    formesSupport: ['bande'],
    seanceIntro: 4,
  },
  {
    id: '1-6',
    numerateur: 1,
    denominateur: 6,
    chiffres: '1/6',
    nomLettres: 'un sixième',
    // Source fiche S3 : l'hexagone est la figure-pivot
    // 1 triangle sur 6 = 1/6 ; 1/3 = 2 triangles = 2 sixièmes
    formesSupport: ['hexagone'],
    seanceIntro: 3,
  },
  {
    id: '1-8',
    numerateur: 1,
    denominateur: 8,
    chiffres: '1/8',
    nomLettres: 'un huitième',
    formesSupport: ['carre', 'rectangle', 'disque'],
    seanceIntro: 1,
  },
  {
    id: '1-10',
    numerateur: 1,
    denominateur: 10,
    chiffres: '1/10',
    nomLettres: 'un dixième',
    // Source fiche S4 : bande partagée en 10 via repliage de la bande en 5
    formesSupport: ['bande'],
    seanceIntro: 4,
  },
];

/**
 * Retourne une fraction par son identifiant.
 * @param {string} id - Ex. "1-4"
 * @returns {Fraction|undefined}
 */
export function getFractionById(id) {
  return FRACTIONS.find((f) => f.id === id);
}

/**
 * Retourne les fractions introduites jusqu'à une séance donnée (incluse).
 * Utilisé par la bande-répertoire pour le déverrouillage progressif (M3, RF-M3-02).
 * @param {number} seance - Numéro de séance (1–6)
 * @returns {Fraction[]}
 */
export function getFractionsDisponibles(seance) {
  return FRACTIONS.filter((f) => f.seanceIntro <= seance);
}

/**
 * Fractions du jeu de cartes en mode paires (S2).
 * Source : fiche S2 — les cartes fabriquées en S1 portent sur 1/2, 1/4, 1/8.
 * @type {string[]}
 */
export const FRACTIONS_PAIRES_S2 = ['1-2', '1-4', '1-8'];

/**
 * Profil de différenciation « en difficulté » pour le jeu de triplets (S6).
 * Source : fiche S6, Différenciation :
 * « enveloppe réduite : 9 cartes (3 triplets : 1/2, 1/4, 1/8) »
 * @type {string[]}
 */
export const FRACTIONS_PROFIL_DIFFICULTE = ['1-2', '1-4', '1-8'];
