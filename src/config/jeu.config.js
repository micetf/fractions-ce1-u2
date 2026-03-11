/**
 * @fileoverview Configuration du jeu de cartes M2 — paires (S2) et triplets (S6).
 *
 * Sources :
 *   - Fiche S2 — matériel, déroulement, différenciation
 *   - Fiche S6 — mode triplets, profils
 *
 * Correction SRS : le SRS v1.0 indiquait « 14 cartes » pour le mode paires.
 * La fiche S2 établit clairement 4 paires/élève = 8 cartes.
 * Le chiffre 14 était erroné (7 fractions × 2, calculé sur le répertoire complet).
 *
 * ⚠ Ne pas modifier les libellés de feedback sans référence aux fiches S2 / S6.
 */

// ── Types de cartes ───────────────────────────────────────────────────────────

/**
 * Types de cartes du jeu.
 * Chaque fraction dispose de 2 types en S2 (image + lettres)
 * et 3 types en S6 (image + lettres + chiffres).
 * @readonly
 * @enum {string}
 */
export const TYPE_CARTE = {
    IMAGE: "image", // Représentation géométrique (FormeImage)
    LETTRES: "lettres", // Nom en lettres (ex. "un quart")
    CHIFFRES: "chiffres", // Écriture fractionnaire (ex. "1/4") — sprint 10
};

// ── Carte spéciale "un" (le tout) ────────────────────────────────────────────

/**
 * Identifiant de la carte "un" (le tout, entier 1).
 * Source : fiche S2 matériel —
 * « Cartes-lettres : "un demi", "un quart", "un huitième", "un" »
 * Cette carte représente la forme entière non divisée,
 * utilisée comme référence pédagogique du "tout".
 * Ce n'est pas une fraction du répertoire CE1 — elle est gérée séparément.
 * @type {string}
 */
export const CARTE_ID_UN = "un";

/**
 * Données de la carte "un" (le tout).
 * @type {{ id: string, nomLettres: string, denominateur: number }}
 */
export const CARTE_UN = {
    id: CARTE_ID_UN,
    nomLettres: "un",
    denominateur: 1, // Pas de division — forme entière coloriée
};

// ── Profils de jeu ────────────────────────────────────────────────────────────

/**
 * Profils de différenciation pour le jeu de paires (S2).
 * @readonly
 * @enum {string}
 */
export const PROFIL = {
    DIFFICULTE: "difficulte",
    STANDARD: "standard",
    AVANCE: "avance",
};

/**
 * Configuration des profils pour le mode paires (S2).
 *
 * - STANDARD  : 4 paires (1/2, 1/4, 1/8, "un") — source : fiche S2, matériel
 * - DIFFICULTE: 3 paires (1/2, 1/4, 1/8, sans la carte "un")
 *               Source : fiche S2, différenciation —
 *               « réduire à 3 paires (1/2, 1/4, 1/8 seulement, sans la carte "un") »
 * - AVANCE    : 8 paires (jeu de 2 élèves combiné, formes différentes)
 *               Source : fiche S2, différenciation —
 *               « mélanger 2 jeux (8 paires) ; inventer une règle d'aide »
 *               ⚠ Ce profil n'est pas implémenté en sprint 2 — laissé pour sprint 10.
 *
 * @type {Record<string, { label: string, fractionsIds: string[], avecCarteUn: boolean, implemente: boolean }>}
 */
export const PROFILS_PAIRES = {
    [PROFIL.DIFFICULTE]: {
        label: "En difficulté",
        fractionsIds: ["1-2", "1-4", "1-8"],
        avecCarteUn: false,
        implemente: true,
    },
    [PROFIL.STANDARD]: {
        label: "Standard",
        fractionsIds: ["1-2", "1-4", "1-8"],
        avecCarteUn: true,
        implemente: true,
    },
    [PROFIL.AVANCE]: {
        label: "Rapide / Avance",
        fractionsIds: ["1-2", "1-4", "1-8"],
        avecCarteUn: true,
        // 8 paires = 2 jeux combinés avec formes différentes — sprint 10
        implemente: false,
    },
};

// ── Sessions ─────────────────────────────────────────────────────────────────

/**
 * Sessions du jeu de paires (S2).
 * @readonly
 * @enum {string}
 */
export const SESSION = {
    A: "A", // Cartes visibles (appariement)         — sprint 2
    B: "B", // Cartes retournées (memory)            — sprint 3
    C: "C", // Autocorrectif + trace écrite          — sprint 4
};

/**
 * Libellés et descriptions des sessions.
 * Source : fiche S2, déroulement.
 * @type {Record<string, { label: string, description: string, etayage: string }>}
 */
export const SESSIONS_CONFIG = {
    [SESSION.A]: {
        label: "Session 1 — Appariement",
        description:
            "Toutes les cartes sont visibles. Associe chaque carte-image à sa carte-mot.",
        etayage: "Fort — toutes les informations disponibles",
    },
    [SESSION.B]: {
        label: "Session 2 — Memory",
        description:
            "Les cartes sont retournées. Mémorise les positions pour former les paires.",
        etayage: "Moyen — mémoire sollicitée",
    },
    [SESSION.C]: {
        label: "Session 3 — Autocorrectif",
        description:
            "Nomme la fraction, retourne la carte pour vérifier. Corrige tes erreurs.",
        etayage: "Faible — autonomie et métacognition",
    },
};

// ── Feedback ─────────────────────────────────────────────────────────────────

/**
 * Formule de feedback CORRECT (scaffold pédagogique).
 * Source : fiche S2, section « Lancement — modélisation express » :
 * « Ces deux cartes vont ensemble parce que... je vois une forme partagée
 * en [N] parts égales et une seule part est coloriée. C'est bien [un quart]. »
 * Reformulée en structure scaffold pour l'élève.
 *
 * @param {string} nomLettres   - Ex. "un quart"
 * @param {number} denominateur - Nombre de parts (ex. 4)
 * @returns {string}
 */
export function feedbackCorrect(nomLettres, denominateur) {
    if (denominateur === 1) {
        return `Bravo ! C'est "un" — la forme entière, sans aucune division.`;
    }
    return (
        `Bravo ! Le tout est partagé en ${denominateur} parts égales. ` +
        `J'en prends une. C'est ${nomLettres} !`
    );
}

/**
 * Message de feedback INCORRECT.
 * Source : fiche S2, rôle de l'enseignant —
 * « Combien de parts vois-tu ici ? Laquelle est coloriée ? »
 * @type {string}
 */
export const FEEDBACK_INCORRECT =
    "Pas tout à fait… Combien de parts vois-tu sur cette image ?";

/**
 * Invite de justification verbale.
 * Source : fiche S2 — « Explique-moi pourquoi tu as mis ces deux-là ensemble »
 * @type {string}
 */
export const INVITE_JUSTIFICATION =
    "Pourquoi ces deux cartes vont-elles ensemble ?";

// ── Mode de jeu ───────────────────────────────────────────────────────────────

/**
 * Modes du jeu de cartes.
 * @readonly
 * @enum {string}
 */
export const MODE_JEU = {
    PAIRES: "paires", // S2 — image + lettres, 3 fractions
    TRIPLETS: "triplets", // S6 — image + lettres + chiffres, 7 fractions
};

// ── Profils de jeu — triplets S6 ─────────────────────────────────────────────

/**
 * Configuration des profils pour le mode triplets (S6).
 *
 * - STANDARD   : 7 fractions × 3 types = 21 cartes — source : fiche S6, matériel
 * - DIFFICULTE : 3 fractions (1/2, 1/4, 1/8) × 3 types = 9 cartes
 *                Source : fiche S6, différenciation —
 *                « enveloppe réduite : 9 cartes (3 triplets : 1/2, 1/4, 1/8) »
 *
 * Note : le profil AVANCE de S6 est une règle de jeu différente
 * (retourner d'abord la carte-chiffres) — même jeu de 21 cartes.
 * On ne crée pas de profil distinct pour cela.
 *
 * @type {Record<string, { label: string, fractionsIds: string[] }>}
 */
export const PROFILS_TRIPLETS = {
    [PROFIL.STANDARD]: {
        label: "Standard — 7 fractions (21 cartes)",
        fractionsIds: ["1-2", "1-3", "1-4", "1-5", "1-6", "1-8", "1-10"],
    },
    [PROFIL.DIFFICULTE]: {
        label: "En difficulté — 3 fractions (9 cartes)",
        fractionsIds: ["1-2", "1-4", "1-8"],
    },
};

// ── Feedback triplets ─────────────────────────────────────────────────────────

/**
 * Formule de feedback CORRECT pour un triplet.
 * Adaptée de la formulation prescrite fiche S6, session A :
 * « Ces trois cartes vont ensemble parce que c'est toutes la même fraction :
 * un huitième. L'image montre une forme partagée en 8 parts égales avec une
 * part coloriée. La carte-lettres dit 'un huitième'. La carte-chiffres écrit 1/8. »
 *
 * @param {string} nomLettres    - Ex. «un huitième»
 * @param {number} denominateur  - Ex. 8
 * @param {string} chiffres      - Ex. «1/8»
 * @returns {string}
 */
export function feedbackCorrectTriplet(nomLettres, denominateur, chiffres) {
    return (
        `Bravo ! Le tout est partagé en ${denominateur} parts égales. ` +
        `J'en prends une. C'est « ${nomLettres} », qu'on écrit ${chiffres}.`
    );
}

/**
 * Invite de justification verbale pour les triplets.
 * Source : fiche S6, session A.
 * @type {string}
 */
export const INVITE_JUSTIFICATION_TRIPLET =
    "Explique ce triplet. Pourquoi ces trois cartes vont-elles ensemble ?";
