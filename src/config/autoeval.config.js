/**
 * @fileoverview Grille d'auto-évaluation du bilan de séquence (S6, session C).
 *
 * Source directe : fiche S6, section « Bilan de séquence — Grille d'auto-évaluation ».
 * Libellés reproduits fidèlement depuis la fiche.
 *
 * Utilisé par le module M4 (RF-M4-06 à RF-M4-09).
 *
 * ⚠ Items 3, 4 et 6 sont des critères de décision vers la séquence 3.
 *    Source : fiche S6, « Décisions pédagogiques post-séquence 2 ».
 */

/**
 * Niveaux de l'échelle d'auto-évaluation.
 * Source : fiche S6 — libellés et pictogrammes exacts.
 * @readonly
 * @enum {string}
 */
export const NIVEAUX = {
  PAS_ENCORE: 'pas_encore', // « Pas encore 😟 »
  EN_COURS:   'en_cours',   // « En cours 😐 »
  OUI:        'oui',        // « Oui ! 😊 »
};

/**
 * Libellés affichables pour chaque niveau (source : fiche S6).
 * @type {Record<string, string>}
 */
export const LIBELLES_NIVEAUX = {
  [NIVEAUX.PAS_ENCORE]: 'Pas encore 😟',
  [NIVEAUX.EN_COURS]:   'En cours 😐',
  [NIVEAUX.OUI]:        'Oui ! 😊',
};

/**
 * @typedef {Object} ItemAutoEval
 * @property {string}  id            - Identifiant (ex. "AE-01")
 * @property {number}  numero        - Numéro d'item (1–6)
 * @property {string}  libelle       - Libellé exact de la fiche S6
 * @property {boolean} critereVersS3 - Critère de décision vers S3 (fiche S6)
 */

/** @type {ItemAutoEval[]} */
export const ITEMS_AUTOEVAL = [
  {
    id: 'AE-01', numero: 1,
    libelle: 'Je peux partager une forme en parts égales et colorier une part pour montrer une fraction.',
    critereVersS3: false,
  },
  {
    id: 'AE-02', numero: 2,
    libelle: 'Je peux nommer une fraction en regardant une image : « un tiers parce que… »',
    critereVersS3: false,
  },
  {
    id: 'AE-03', numero: 3,
    libelle: 'Je connais les 7 fractions du CE1 : 1/2, 1/3, 1/4, 1/5, 1/6, 1/8, 1/10.',
    // Source fiche S6 : « les élèves qui ont coché "Pas encore" sur les lignes 3, 4 ou 6
    // → nécessitent un accompagnement avant la S3 »
    critereVersS3: true,
  },
  {
    id: 'AE-04', numero: 4,
    libelle: 'Je sais écrire une fraction en chiffres (ex. : 1/4) et expliquer le chiffre du haut et du bas.',
    critereVersS3: true,
  },
  {
    id: 'AE-05', numero: 5,
    libelle: 'Je sais que plus le chiffre du bas est grand, plus la fraction est petite.',
    critereVersS3: false,
  },
  {
    id: 'AE-06', numero: 6,
    libelle: 'Je peux passer d\'une carte-image à une carte-lettres à une carte-chiffres pour la même fraction.',
    critereVersS3: true,
  },
];

/**
 * Identifiants des items critères pour la décision vers S3.
 * Source : fiche S6 — items 3, 4 et 6.
 * @type {string[]}
 */
export const ITEMS_CRITERES_VERS_S3 = ITEMS_AUTOEVAL
  .filter((item) => item.critereVersS3)
  .map((item) => item.id);

/**
 * Calcule le seuil d'élèves en difficulté déclenchant l'alerte collective.
 *
 * ⚠ Hypothèse de conception (H-01 du SRS) : la fiche S6 mentionne
 *    « majorité de la classe » sans préciser de seuil numérique.
 *    On retient 50 % arrondi au supérieur — à valider avec l'enseignant.
 *
 * @param {number} totalEleves - Effectif de la classe
 * @returns {number}
 */
export function seuilAlerteCollective(totalEleves) {
  return Math.ceil(totalEleves / 2);
}

/**
 * Fractions concernées par l'alerte collective (fiche S6).
 * Source : « majorité de la classe hésite sur 1/5 et 1/10 »
 * @type {string[]}
 */
export const FRACTIONS_ALERTE_COLLECTIVE = ['1-5', '1-10'];

/**
 * Message d'alerte à afficher à l'enseignant.
 * Formulation issue de la fiche S6.
 * @type {string}
 */
export const MESSAGE_ALERTE_S6 =
  'Prévoir rappel de 5 min en entrée de S3 (confusion collective sur 1/5 et 1/10 détectée).';
