/**
 * @fileoverview Utilitaires partagés du jeu de cartes M2.
 *
 * Ce fichier contient les fonctions de génération et de mélange des cartes,
 * partagées entre useJeuPaires (session A) et useMemory (session B).
 *
 * Extraction justifiée : genererCartes était dupliquée dans useJeuPaires.
 * Tout changement de règle de composition du jeu ne doit être fait qu'ici.
 */

import { getFractionById } from "../../config/fractions.config";
import {
    TYPE_CARTE,
    PROFILS_PAIRES,
    PROFILS_TRIPLETS,
    PROFIL,
    CARTE_UN,
} from "../../config/jeu.config";

/**
 * @typedef {Object} CarteJeu
 * @property {string}  id           - Identifiant unique dans le jeu (ex. "1-4_image")
 * @property {string}  fractionId   - Clé de paire (ex. "1-4", ou "un")
 * @property {'image'|'lettres'} type
 * @property {string}  nomLettres   - Nom affiché
 * @property {number}  denominateur - Pour le rendu SVG
 */

/**
 * Génère la liste de CarteJeu pour un profil donné.
 * Les cartes sont mélangées (Fisher-Yates).
 *
 * Composition du jeu selon le profil :
 *   - STANDARD  : 4 paires (1/2, 1/4, 1/8 + "un") = 8 cartes
 *   - DIFFICULTE: 3 paires (1/2, 1/4, 1/8) = 6 cartes
 *   - AVANCE    : non implémenté (voir jeu.config.js)
 *
 * Source : fiche S2, section matériel et différenciation.
 *
 * @param {string} [profil] - Valeur de PROFIL (défaut : STANDARD)
 * @returns {CarteJeu[]}
 */
export function genererCartes(profil = PROFIL.STANDARD) {
    const config = PROFILS_PAIRES[profil] ?? PROFILS_PAIRES[PROFIL.STANDARD];
    const cartes = [];

    // Fractions du profil
    for (const fractionId of config.fractionsIds) {
        const fraction = getFractionById(fractionId);
        if (!fraction) continue;

        cartes.push({
            id: `${fractionId}_image`,
            fractionId,
            type: TYPE_CARTE.IMAGE,
            nomLettres: fraction.nomLettres,
            denominateur: fraction.denominateur,
        });
        cartes.push({
            id: `${fractionId}_lettres`,
            fractionId,
            type: TYPE_CARTE.LETTRES,
            nomLettres: fraction.nomLettres,
            denominateur: fraction.denominateur,
        });
    }

    // Carte "un" (le tout) — si activée dans ce profil
    if (config.avecCarteUn) {
        cartes.push({
            id: "un_image",
            fractionId: CARTE_UN.id,
            type: TYPE_CARTE.IMAGE,
            nomLettres: CARTE_UN.nomLettres,
            denominateur: CARTE_UN.denominateur,
        });
        cartes.push({
            id: "un_lettres",
            fractionId: CARTE_UN.id,
            type: TYPE_CARTE.LETTRES,
            nomLettres: CARTE_UN.nomLettres,
            denominateur: CARTE_UN.denominateur,
        });
    }

    // Mélange Fisher-Yates
    for (let i = cartes.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cartes[i], cartes[j]] = [cartes[j], cartes[i]];
    }

    return cartes;
}

/**
 * Construit l'état initial d'un jeu — toutes les cartes dans l'état fourni.
 * @param {CarteJeu[]} cartes
 * @param {string}     etatInitial - Ex. 'neutre' (session A) ou 'cachee' (session B)
 * @returns {Record<string, string>}
 */
export function etatsInitiaux(cartes, etatInitial) {
    return Object.fromEntries(cartes.map((c) => [c.id, etatInitial]));
}

/**
 * Génère la liste de CarteJeu pour le mode triplets (S6).
 * Trois cartes par fraction : image + lettres + chiffres.
 * Pas de carte "un" — elle n'appartient pas au répertoire S6.
 * Les cartes sont mélangées (Fisher-Yates).
 *
 * Composition selon le profil :
 *   - STANDARD   : 7 fractions × 3 = 21 cartes
 *   - DIFFICULTE : 3 fractions × 3 = 9 cartes
 *
 * Source : fiche S6, matériel et différenciation.
 *
 * @param {string} [profil] - Valeur de PROFIL (défaut : STANDARD)
 * @returns {CarteJeu[]}
 */
export function genererCartesTriplets(profil = PROFIL.STANDARD) {
    const config =
        PROFILS_TRIPLETS[profil] ?? PROFILS_TRIPLETS[PROFIL.STANDARD];
    const cartes = [];

    for (const fractionId of config.fractionsIds) {
        const fraction = getFractionById(fractionId);
        if (!fraction) continue;

        cartes.push({
            id: `${fractionId}_image`,
            fractionId,
            type: TYPE_CARTE.IMAGE,
            nomLettres: fraction.nomLettres,
            denominateur: fraction.denominateur,
            chiffres: fraction.chiffres,
        });
        cartes.push({
            id: `${fractionId}_lettres`,
            fractionId,
            type: TYPE_CARTE.LETTRES,
            nomLettres: fraction.nomLettres,
            denominateur: fraction.denominateur,
            chiffres: fraction.chiffres,
        });
        cartes.push({
            id: `${fractionId}_chiffres`,
            fractionId,
            type: TYPE_CARTE.CHIFFRES,
            nomLettres: fraction.nomLettres,
            denominateur: fraction.denominateur,
            chiffres: fraction.chiffres,
        });
    }

    // Mélange Fisher-Yates
    for (let i = cartes.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cartes[i], cartes[j]] = [cartes[j], cartes[i]];
    }

    return cartes;
}
