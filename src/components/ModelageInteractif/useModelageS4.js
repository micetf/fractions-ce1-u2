/**
 * @fileoverview Hook useModelageS4 — logique du modelage pour la séance 4.
 *
 * Fractions S4 : 1/5 (un cinquième) et 1/10 (un dixième).
 * Forme exclusive S4 : bande rectangulaire (fiche S4, matériel).
 *
 * Relation clé prescrite par la fiche S4, phase ② :
 *   « Je prends ma bande qui a déjà 5 parts. Je replie chaque cinquième
 *   en deux. Que se passe-t-il ? Combien de parts est-ce que j'obtiens ?
 *   … 10 ! Donc un dixième de la bande, c'est la moitié d'un cinquième
 *   du même tout. »
 *   ✓ Un dixième = la moitié d'un cinquième. Comme un sixième était la
 *   moitié d'un tiers. Le principe est le même.
 *
 * L'ordre de construction de la bande-répertoire est prescrit
 * (fiche S4, phase ③b) :
 *   1/2 → 1/4 → 1/8 → 1/3 → 1/6 → 1/5 → 1/10
 */

import { useState, useCallback, useMemo } from "react";

// ── Constantes ────────────────────────────────────────────────────────────────

/** Étapes du modelage. */
export const ETAPE = {
    TOUT: "tout",
    PARTAGE: "partage",
    COLORIE: "colorie",
};

/** Fractions S4 (source : fiche S4, objectifs). */
export const FRACTIONS_S4 = [
    { id: "1-5", denominateur: 5, nomLettres: "un cinquième" },
    { id: "1-10", denominateur: 10, nomLettres: "un dixième" },
];

/**
 * Ordre de construction de la bande-répertoire.
 * Source : fiche S4, phase ③b — ordre prescrit mot pour mot.
 * @type {Array<{ id: string, denominateur: number, nomLettres: string, seance: string }>}
 */
export const ORDRE_REPERTOIRE = [
    { id: "1-2", denominateur: 2, nomLettres: "un demi", seance: "S1" },
    { id: "1-4", denominateur: 4, nomLettres: "un quart", seance: "S1" },
    { id: "1-8", denominateur: 8, nomLettres: "un huitième", seance: "S1" },
    { id: "1-3", denominateur: 3, nomLettres: "un tiers", seance: "S3" },
    { id: "1-6", denominateur: 6, nomLettres: "un sixième", seance: "S3" },
    { id: "1-5", denominateur: 5, nomLettres: "un cinquième", seance: "S4" },
    { id: "1-10", denominateur: 10, nomLettres: "un dixième", seance: "S4" },
];

/** Ordre des étapes. */
const ORDRE_ETAPES = [ETAPE.TOUT, ETAPE.PARTAGE, ETAPE.COLORIE];

/** Nom de la forme unique S4. */
const FORME_S4 = { id: "rectangle", label: "Bande" };

// ── Textes du modelage ────────────────────────────────────────────────────────

/**
 * Textes de pensée à voix haute pour chaque étape.
 * Adaptés du script prescrit fiche S4, phase ② (modelage bande).
 *
 * @param {{ denominateur: number, nomLettres: string }} fraction
 * @returns {Record<string, { titre: string, texte: string, question?: string, reponseAttendue?: string }>}
 */
export function texteModelageS4(fraction) {
    const { denominateur, nomLettres } = fraction;

    const textePartage =
        denominateur === 5
            ? "Je ne peux pas simplement plier en deux — 5 n'est pas un nombre pair. Je tâtonne : je replie un bout estimé à un cinquième, puis je compare et j'ajuste. Je peux aussi utiliser une règle : je mesure la longueur totale, je divise par 5, je trace les repères."
            : "Je prends ma bande qui a déjà 5 parts égales. Je replie chaque cinquième en deux. Comptez avec moi : 2, 4, 6, 8, 10 — j'obtiens 10 parts. Un dixième, c'est la moitié d'un cinquième du même tout. Comme un sixième était la moitié d'un tiers.";

    return {
        [ETAPE.TOUT]: {
            titre: "La bande — le tout",
            texte: "Voici la bande. C'est notre TOUT. Chaque fraction que nous allons représenter sera interprétée par rapport à cette bande entière.",
        },
        [ETAPE.PARTAGE]: {
            titre: `Je partage en ${denominateur} parts égales`,
            texte: textePartage,
            question: `En combien de parts ai-je partagé la bande ?`,
        },
        [ETAPE.COLORIE]: {
            titre: "Je colorie une seule part",
            texte: `Je colorie UNE seule des ${denominateur} parts. J'ai représenté ${nomLettres} de la bande.`,
            question: `Pourquoi est-ce ${nomLettres} ?`,
            reponseAttendue: `C'est ${nomLettres} parce que la bande est partagée en ${denominateur} parts égales et j'en ai colorié une.`,
        },
    };
}

// ── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Hook de logique du modelage S4.
 *
 * @returns {{
 *   fractionIndex:    number,
 *   etape:            string,
 *   fraction:         object,
 *   forme:            object,
 *   textes:           object,
 *   peutReculer:      boolean,
 *   peutAvancer:      boolean,
 *   setFractionIndex: (i: number) => void,
 *   setEtape:         (e: string) => void,
 *   avancer:          () => void,
 *   reculer:          () => void,
 *   reinitialiser:    () => void,
 * }}
 */
export function useModelageS4() {
    const [fractionIndex, setFractionIndexRaw] = useState(0); // défaut : 1/5
    const [etapeIndex, setEtapeIndex] = useState(0); // défaut : TOUT

    const fraction = FRACTIONS_S4[fractionIndex];
    const etape = ORDRE_ETAPES[etapeIndex];
    const textes = useMemo(() => texteModelageS4(fraction), [fraction]);

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

    /** Changer de fraction repart à l'étape TOUT. */
    const setFractionIndex = useCallback((i) => {
        setFractionIndexRaw(i);
        setEtapeIndex(0);
    }, []);

    const reinitialiser = useCallback(() => setEtapeIndex(0), []);

    return {
        fractionIndex,
        etape,
        fraction,
        forme: FORME_S4,
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
