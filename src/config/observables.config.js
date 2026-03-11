/**
 * @fileoverview Observables formatifs par séance et régulations associées.
 *
 * Source directe : tableaux « Évaluation formative — Récapitulatif des observables »
 * présents dans chacune des 6 fiches de préparation.
 *
 * Total : 35 observables (S1:6 + S2:4 + S3:4 + S4:7 + S5:7 + S6:7).
 * Note : le SRS v1.0 indiquait 32 par erreur de comptage — corrigé ici.
 *
 * ⚠ Les libellés des observables et des régulations sont issus des fiches.
 *    Ne pas modifier sans référence à la fiche source.
 */

/**
 * @typedef {Object} Observable
 * @property {string} id         - Identifiant unique (ex. "S1-OBS-01")
 * @property {string} seance     - Numéro de séance ("S1"–"S6")
 * @property {string} phase      - Phase source dans la fiche
 * @property {string} libelle    - Comportement observable — libellé de la fiche
 * @property {string} regulation - Régulation si non atteint — issue de la fiche
 */

/** @type {Observable[]} */
export const OBSERVABLES = [

  // ── SÉANCE 1 — Source : fiche S1, tableau Évaluation formative ─────────────
  {
    id: 'S1-OBS-01', seance: 'S1', phase: 'Phase 3',
    libelle: 'Parts perceptiblement égales sur la forme',
    regulation: 'Fournir le gabarit ; proposer la validation par superposition. Valoriser l\'intention même si approximatif.',
  },
  {
    id: 'S1-OBS-02', seance: 'S1', phase: 'Phase 3',
    libelle: 'Une seule part coloriée',
    regulation: 'Rappel systématique : « UNE seule part pour montrer la fraction. »',
  },
  {
    id: 'S1-OBS-03', seance: 'S1', phase: 'Phase 3',
    libelle: 'Justification verbale produite : « C\'est un quart parce que… »',
    regulation: 'Étayage : « Montre-moi le tout. Combien de parts au total ? »',
  },
  {
    id: 'S1-OBS-04', seance: 'S1', phase: 'Phase 3',
    libelle: 'Nom de la fraction correct (lettres)',
    regulation: 'Renvoyer à l\'affichage collectif des traces de la séquence 1.',
  },
  {
    id: 'S1-OBS-05', seance: 'S1', phase: 'Phase 3–4',
    libelle: 'Relation 1/8 < 1/4 du même tout identifiée',
    regulation: 'Faire pointer physiquement les parts coloriées : « Laquelle prend plus de place ? »',
  },
  {
    id: 'S1-OBS-06', seance: 'S1', phase: 'Phase 3–4',
    libelle: 'Association carte-image / carte-lettres réussie',
    regulation: 'Renvoyer aux traces de séquence 1 visibles dans la classe.',
  },

  // ── SÉANCE 2 — Source : fiche S2, tableau Évaluation formative ─────────────
  {
    id: 'S2-OBS-01', seance: 'S2', phase: 'Session 1',
    libelle: 'Toutes les paires constituées correctement — cartes visibles',
    regulation: 'Pointer la carte-image : « Combien de parts coloriées ? Combien de parts au total ? »',
  },
  {
    id: 'S2-OBS-02', seance: 'S2', phase: 'Session 2',
    libelle: 'Au moins 3/4 des paires retrouvées au premier essai — cartes cachées',
    regulation: 'Ne pas intervenir immédiatement ; noter pour le suivi. Indicateur de consolidation mémorielle.',
  },
  {
    id: 'S2-OBS-03', seance: 'S2', phase: 'Sessions 1–2',
    libelle: 'Justification verbale du choix de deux cartes produite',
    regulation: 'Reformuler : « Le tout est partagé en ___ parts égales. J\'en prends ___. »',
  },
  {
    id: 'S2-OBS-04', seance: 'S2', phase: 'Session 3',
    libelle: 'Identification et correction d\'au moins une erreur (autocorrectif)',
    regulation: 'Vérification guidée carte par carte si aucune erreur identifiée malgré des paires fausses.',
  },

  // ── SÉANCE 3 — Source : fiche S3, indicateurs de réussite et différenciation
  // ⚠ La fiche S3 ne présente pas de tableau d'observables structuré identique
  //   aux autres fiches. Les 4 observables ci-dessous sont extraits fidèlement
  //   des indicateurs de réussite et de la section obstacles de la fiche S3.
  {
    id: 'S3-OBS-01', seance: 'S3', phase: 'Phase 3a',
    libelle: 'Disque partagé en 3 parts égales et une part coloriée',
    regulation: 'Fournir le gabarit (angle 120°). Rappel : « UNE seule part coloriée. »',
  },
  {
    id: 'S3-OBS-02', seance: 'S3', phase: 'Phase 3b',
    libelle: 'Hexagone partagé en 6 triangles égaux et un triangle colorié',
    regulation: 'Montrer la décomposition en 6 triangles prédécoupés au tableau. Faire superposer.',
  },
  {
    id: 'S3-OBS-03', seance: 'S3', phase: 'Phase 3',
    libelle: 'Nom de la fraction correct : « un tiers » ou « un sixième »',
    regulation: 'Renvoyer à l\'affichage collectif. Compter les parts avec l\'élève.',
  },
  {
    id: 'S3-OBS-04', seance: 'S3', phase: 'Phase 3b–4',
    libelle: 'Relation 1/3 = 2 sixièmes identifiée sur l\'hexagone',
    regulation: 'Superposer physiquement 1 tiers et 2 sixièmes. Reformuler : « 1 tiers = 2 sixièmes ».',
  },

  // ── SÉANCE 4 — Source : fiche S4, tableau Évaluation formative ─────────────
  {
    id: 'S4-OBS-01', seance: 'S4', phase: 'Phase 3a',
    libelle: '5 (ou 10) parts perceptiblement égales sur la bande',
    regulation: 'Fournir le gabarit ; montrer la stratégie règle + division. Valoriser l\'intention même si approximatif.',
  },
  {
    id: 'S4-OBS-02', seance: 'S4', phase: 'Phase 3a–3b',
    libelle: 'Nom de la fraction écrit en lettres sous la bande',
    regulation: 'Renvoyer à l\'affichage des séances précédentes ou au tableau collectif.',
  },
  {
    id: 'S4-OBS-03', seance: 'S4', phase: 'Phase 3a–3b',
    libelle: 'Justification verbale : « C\'est un dixième parce que la bande est partagée en 10 parts égales »',
    regulation: 'Étayage : « Montre-moi le tout. Combien de parts au total ? »',
  },
  {
    id: 'S4-OBS-04', seance: 'S4', phase: 'Phase 3a',
    libelle: 'Stratégie 5→10 par repliage identifiée et mobilisée',
    regulation: 'Valoriser lors de la mise en commun ; montrer la stratégie aux élèves qui n\'y ont pas pensé.',
  },
  {
    id: 'S4-OBS-05', seance: 'S4', phase: 'Phase 3b',
    libelle: '7 lignes présentes et complètes sur la bande-répertoire',
    regulation: 'Guidage pas à pas renforcé ; fournir une bande pré-tracée si nécessaire.',
  },
  {
    id: 'S4-OBS-06', seance: 'S4', phase: 'Phase 3b–4',
    libelle: 'Fraction la plus grande et la plus petite identifiées sur la bande',
    regulation: 'Faire pointer les parts coloriées : « Laquelle prend plus de place ? »',
  },
  {
    id: 'S4-OBS-07', seance: 'S4', phase: 'Phase 4',
    libelle: 'Formulation de la règle : « Plus de parts → parts plus petites »',
    regulation: 'Reformuler : « Si tu partages une pizza en 10, chaque part est grande ou petite ? »',
  },

  // ── SÉANCE 5 — Source : fiche S5, tableau Évaluation formative ─────────────
  {
    id: 'S5-OBS-01', seance: 'S5', phase: 'Phase 3a–3b',
    libelle: 'Chiffre du bas = nombre de parts du tout (position correcte)',
    regulation: 'Rappeler : « Le nombre de parts va toujours EN BAS. » Montrer le contre-exemple 6/1.',
  },
  {
    id: 'S5-OBS-02', seance: 'S5', phase: 'Phase 3b',
    libelle: 'Chiffre du haut = 1 pour toutes les cartes fabriquées',
    regulation: 'Poser : « Combien de parts tu prends ? » → 1. Donc en haut c\'est 1.',
  },
  {
    id: 'S5-OBS-03', seance: 'S5', phase: 'Phase 3b',
    libelle: 'Trait de fraction présent et horizontal',
    regulation: 'Montrer à nouveau le modelage. Rappeler : « Sans le trait, ce n\'est pas une fraction. »',
  },
  {
    id: 'S5-OBS-04', seance: 'S5', phase: 'Phase 3b',
    libelle: '1/10 écrit avec le 10 entier en bas (non 1/1 puis 0 séparé)',
    regulation: '« 10, c\'est un seul nombre. Il va tout entier en dessous du trait. »',
  },
  {
    id: 'S5-OBS-05', seance: 'S5', phase: 'Phase 3b',
    libelle: 'Triplet correctement constitué (image + lettres + chiffres)',
    regulation: 'Faire pointer chaque carte : « Tu peux me lire cette carte ? »',
  },
  {
    id: 'S5-OBS-06', seance: 'S5', phase: 'Phase 3b–4',
    libelle: 'Lecture à voix haute correcte : 1/8 → « un huitième »',
    regulation: 'Revenir au répertoire : « Lis le chiffre du bas. 8 → huitième. »',
  },
  {
    id: 'S5-OBS-07', seance: 'S5', phase: 'Phase 4',
    libelle: 'Identification d\'une erreur de position dans un triplet (mise en commun)',
    regulation: 'Pointer le chiffre du bas : « Combien de parts a le tout ici ? »',
  },

  // ── SÉANCE 6 — Source : fiche S6, tableau Évaluation formative ─────────────
  {
    id: 'S6-OBS-01', seance: 'S6', phase: 'Session A',
    libelle: '7 triplets constitués correctement (session A)',
    regulation: 'Pointer la carte-chiffres, demander de lire à voix haute → trouver l\'image correspondante.',
  },
  {
    id: 'S6-OBS-02', seance: 'S6', phase: 'Sessions A–C',
    libelle: 'Justification verbale complète produite (toutes sessions)',
    regulation: '« Le tout est partagé en ___ parts égales. J\'en prends ___. C\'est ___ ».',
  },
  {
    id: 'S6-OBS-03', seance: 'S6', phase: 'Sessions A–B',
    libelle: 'Lecture correcte des écritures en chiffres (1/10 en particulier)',
    regulation: '« Lis le chiffre du bas. C\'est 10. Comment ça se dit ? »',
  },
  {
    id: 'S6-OBS-04', seance: 'S6', phase: 'Sessions A–B',
    libelle: 'Aucune confusion 1/n ↔ n/1 sur les cartes-chiffres',
    regulation: 'Contre-exemple immédiat : « Le grand nombre va toujours en bas. »',
  },
  {
    id: 'S6-OBS-05', seance: 'S6', phase: 'Session B',
    libelle: 'Mémorisation d\'au moins 3 positions après le 1er tour (session B)',
    regulation: 'Ne pas réguler immédiatement — noter pour le suivi. Indicateur de consolidation mémorielle.',
  },
  {
    id: 'S6-OBS-06', seance: 'S6', phase: 'Session C',
    libelle: 'Auto-identification et auto-correction d\'au moins 1 erreur (session C)',
    regulation: 'Si aucune erreur identifiée malgré des triplets faux : vérification guidée carte par carte.',
  },
  {
    id: 'S6-OBS-07', seance: 'S6', phase: 'Session C',
    libelle: 'Auto-évaluation cohérente avec les performances observées',
    regulation: 'Si sur-évaluation : pointer une erreur observée. « Tu as eu du mal avec 1/10 — tu veux revoir ? »',
  },
];

/**
 * Retourne les observables d'une séance donnée.
 * @param {string} seance - Ex. "S1", "S4"
 * @returns {Observable[]}
 */
export function getObservablesParSeance(seance) {
  return OBSERVABLES.filter((o) => o.seance === seance);
}

/**
 * Retourne un observable par son identifiant.
 * @param {string} id - Ex. "S5-OBS-01"
 * @returns {Observable|undefined}
 */
export function getObservableById(id) {
  return OBSERVABLES.find((o) => o.id === id);
}

/**
 * Métadonnées des 6 séances — issues des en-têtes des fiches de préparation.
 *
 * @typedef {Object} Seance
 * @property {string}   id          - "S1"–"S6"
 * @property {string}   titre       - Titre de la séance (en-tête fiche)
 * @property {string}   duree       - Durée (ex. "55 min", "3 × 15 min")
 * @property {'bloc'|'distribué'} format - Format de la séance
 * @property {string[]} fractionsIds - Fractions ciblées (ids)
 * @property {string}   artefact    - Artefact pédagogique central
 */

/** @type {Seance[]} */
export const SEANCES = [
  {
    id: 'S1',
    titre: 'Représenter des fractions unitaires',
    duree: '55 min',
    format: 'bloc',
    fractionsIds: ['1-2', '1-4', '1-8'],
    artefact: 'Fabrication de cartes image + cartes-lettres (paires)',
  },
  {
    id: 'S2',
    titre: 'Interpréter et nommer les fractions 1/2, 1/4, 1/8',
    duree: '3 × 15 min',
    format: 'distribué',
    fractionsIds: ['1-2', '1-4', '1-8'],
    artefact: 'Jeux d\'appariement et memory (paires)',
  },
  {
    id: 'S3',
    titre: 'Interpréter, représenter et nommer un tiers et un sixième',
    duree: '45 min',
    format: 'bloc',
    fractionsIds: ['1-3', '1-6'],
    artefact: 'Disques et hexagones ; relation 1/3 = 2 × 1/6',
  },
  {
    id: 'S4',
    titre: 'Interpréter, représenter et nommer 1/5 et 1/10 — Répertoire complet',
    duree: '45 min',
    format: 'bloc',
    fractionsIds: ['1-5', '1-10'],
    artefact: 'Bande-répertoire des 7 fractions unitaires',
  },
  {
    id: 'S5',
    titre: 'Lire et écrire les fractions unitaires « en chiffres »',
    duree: '55 min',
    format: 'bloc',
    fractionsIds: ['1-2', '1-3', '1-4', '1-5', '1-6', '1-8', '1-10'],
    artefact: 'Fabrication cartes-chiffres ; triplets représentationnels',
  },
  {
    id: 'S6',
    titre: 'Jeux avec les triplets de cartes et bilan de séquence',
    duree: '3 × 15 min',
    format: 'distribué',
    fractionsIds: ['1-2', '1-3', '1-4', '1-5', '1-6', '1-8', '1-10'],
    artefact: 'Memory triplets + bilan de séquence',
  },
];
