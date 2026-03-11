/**
 * @fileoverview useModelageS5 — logique du modelage pour la séance 5.
 *
 * S5 introduit l'écriture fractionnaire en chiffres (1/2, 1/4...) comme
 * troisième représentation (fiche S5 : « moment-événement »).
 *
 * Le flux du modelage est différent des séances précédentes :
 * il ne porte pas sur une forme géométrique mais sur la structure
 * de l'écriture fractionnaire elle-même.
 *
 * Étapes prescrites (fiche S5, phase ② modelage décomposé) :
 *   BAS      → chiffre du bas (nombre de parts du tout)
 *   TRAIT    → + trait de fraction
 *   COMPLET  → + chiffre du haut (= 1 pour toutes les fractions unitaires)
 *
 * Fractions du modelage prescrit (fiche S5, phase ②) :
 *   1/4 d'abord (exemple principal), puis 1/8 (plus rapide, élèves participent).
 *   Vérification formative ardoise : 1/3 puis 1/10.
 *
 * ⚠️ Terminologie CE1 imposée (fiche S5, note terminologique) :
 *   « chiffre du haut » et « chiffre du bas ».
 *   Pas de « numérateur » ni « dénominateur ».
 */

import { useState, useCallback, useMemo } from "react";

// ── Constantes ────────────────────────────────────────────────────────────────

/**
 * Étapes du modelage S5.
 * Source : fiche S5, phase ② — décomposition en 3 temps séquencés.
 */
export const ETAPE_S5 = {
    BAS: "bas",
    TRAIT: "trait",
    COMPLET: "complet",
};

/** Ordre des étapes (pour navigation). */
const ORDRE_ETAPES = [ETAPE_S5.BAS, ETAPE_S5.TRAIT, ETAPE_S5.COMPLET];

/**
 * Toutes les fractions unitaires du répertoire CE1 (source : fiche S5, objectifs).
 * @type {Array<{ id: string, denominateur: number, nomLettres: string }>}
 */
export const FRACTIONS_S5 = [
    { id: "1-2", denominateur: 2, nomLettres: "un demi" },
    { id: "1-3", denominateur: 3, nomLettres: "un tiers" },
    { id: "1-4", denominateur: 4, nomLettres: "un quart" },
    { id: "1-5", denominateur: 5, nomLettres: "un cinquième" },
    { id: "1-6", denominateur: 6, nomLettres: "un sixième" },
    { id: "1-8", denominateur: 8, nomLettres: "un huitième" },
    { id: "1-10", denominateur: 10, nomLettres: "un dixième" },
];

/**
 * Index de la fraction de modelage prescrite (1/4 — fiche S5, phase ②).
 * L'enseignant commence par 1/4, puis passe à 1/8.
 */
export const INDEX_MODELAGE_INITIAL = 2; // 1/4 dans FRACTIONS_S5

// ── Textes du modelage ────────────────────────────────────────────────────────

/**
 * Textes de pensée à voix haute pour chaque étape.
 * Adaptés du script prescrit fiche S5, phase ② (modelage décomposé).
 *
 * @param {{ denominateur: number, nomLettres: string }} fraction
 * @returns {Record<string, { titre: string, texte: string, question?: string, reponseAttendue?: string }>}
 */
export function texteModelageS5(fraction) {
    const { denominateur, nomLettres } = fraction;

    return {
        [ETAPE_S5.BAS]: {
            titre: "Le chiffre du bas",
            texte: `Je veux écrire « ${nomLettres} » en chiffres. Je me souviens : pour ${nomLettres}, le tout est partagé en combien de parts égales ? ${denominateur}. C'est le nombre le plus important — il me dit combien de parts il y a en tout. Je l'écris EN BAS.`,
            question: `En combien de parts est partagé le tout pour « ${nomLettres} » ?`,
        },
        [ETAPE_S5.TRAIT]: {
            titre: "Le trait de fraction",
            texte: `Maintenant je trace le trait de fraction — c'est la barre horizontale. Elle sépare le chiffre du haut du chiffre du bas.`,
        },
        [ETAPE_S5.COMPLET]: {
            titre: "Le chiffre du haut",
            texte: `En haut, je mets le nombre de parts que je prends. Pour « ${nomLettres} », j'en prends combien ? Une seule. Donc j'écris « 1 » en haut. Voilà : 1/${denominateur}. Cette écriture se lit « ${nomLettres} ».`,
            question: `Combien de parts prend-on pour « ${nomLettres} » ?`,
            reponseAttendue: `1/${denominateur} se lit « ${nomLettres} ». Le ${denominateur} dit qu'il y a ${denominateur} parts égales. Le 1 dit qu'on en prend une.`,
        },
    };
}

// ── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Hook de logique du modelage S5.
 *
 * @returns {{
 *   fractionIndex:      number,
 *   etape:              string,
 *   fraction:           object,
 *   textes:             object,
 *   peutReculer:        boolean,
 *   peutAvancer:        boolean,
 *   setFractionIndex:   (i: number) => void,
 *   setEtape:           (e: string) => void,
 *   avancer:            () => void,
 *   reculer:            () => void,
 *   reinitialiser:      () => void,
 * }}
 */
export function useModelageS5() {
    const [fractionIndex, setFractionIndexRaw] = useState(
        INDEX_MODELAGE_INITIAL
    );
    const [etapeIndex, setEtapeIndex] = useState(0);

    const fraction = FRACTIONS_S5[fractionIndex];
    const etape = ORDRE_ETAPES[etapeIndex];
    const textes = useMemo(() => texteModelageS5(fraction), [fraction]);

    const avancer = useCallback(() => {
        setEtapeIndex((i) => Math.min(i + 1, ORDRE_ETAPES.length - 1));
    }, []);

    const reculer = useCallback(() => {
        setEtapeIndex((i) => Math.max(i - 1, 0));
    }, []);

    const setEtape = useCallback((e) => {
        const idx = ORDRE_ETAPES.indexOf(e);
        if (idx !== -1) setEtapeIndex(idx);
    }, []);

    /** Changer de fraction repart à l'étape BAS. */
    const setFractionIndex = useCallback((i) => {
        setFractionIndexRaw(i);
        setEtapeIndex(0);
    }, []);

    const reinitialiser = useCallback(() => setEtapeIndex(0), []);

    return {
        fractionIndex,
        etape,
        fraction,
        textes,
        peutReculer: etapeIndex > 0,
        peutAvancer: etapeIndex < ORDRE_ETAPES.length - 1,
        setFractionIndex,
        setEtape,
        avancer,
        reculer,
        reinitialiser,
    };
}
