/**
 * @fileoverview Hook useModelageS1 — logique du modelage pour la séance 1.
 *
 * Gère la navigation dans les 3 étapes de la pensée à voix haute
 * (fiche S1, phase ② « Lancement — Explicitation objectif + Modelage ») :
 *
 *   TOUT    → PARTAGE → COLORIE
 *   "Voici le tout"  "Je partage"  "Je colorie une part"
 *
 * Fiche S1, script enseignant pour « un quart » :
 *   « Je voudrais représenter la fraction 'un quart'. Je me pose la
 *   question : un quart, ça veut dire combien de parts égales ? [pause]
 *   Oui, quatre ! Donc je dois partager mon carré en quatre parts
 *   égales. [...] Je colorie UNE seule des parties. J'ai colorié
 *   un quart du carré. »
 *
 * Ce hook généralise ce script aux fractions et formes de S1.
 * Les textes sont adaptés du script prescrit — non reproduits mot pour mot
 * sauf pour « un quart du carré » (modèle de référence de la fiche).
 */

import { useState, useCallback, useMemo } from "react";

// ── Constantes ────────────────────────────────────────────────────────────────

/** Étapes du modelage. */
export const ETAPE = {
    TOUT: "tout",
    PARTAGE: "partage",
    COLORIE: "colorie",
};

/** Fractions du répertoire S1 (source : fiche S1, matériel). */
export const FRACTIONS_S1 = [
    { id: "1-2", denominateur: 2, nomLettres: "un demi" },
    { id: "1-4", denominateur: 4, nomLettres: "un quart" },
    { id: "1-8", denominateur: 8, nomLettres: "un huitième" },
];

/**
 * Formes disponibles en S1 (fiche S1, matériel).
 * @type {Array<{ id: string, label: string }>}
 */
export const FORMES_S1 = [
    { id: "carre", label: "Carré" },
    { id: "rectangle", label: "Rectangle" },
    { id: "disque", label: "Disque" },
    { id: "eventail", label: "Éventail" },
];

/** Noms des formes avec article (pour les textes du modelage). */
const NOM_FORME = {
    carre: { avec: "le carré", de: "du carré" },
    rectangle: { avec: "le rectangle", de: "du rectangle" },
    disque: { avec: "le disque", de: "du disque" },
    eventail: { avec: "l'éventail", de: "de l'éventail" },
};

/** Ordre des étapes. */
const ORDRE_ETAPES = [ETAPE.TOUT, ETAPE.PARTAGE, ETAPE.COLORIE];

// ── Textes du modelage ────────────────────────────────────────────────────────

/**
 * Génère les textes de pensée à voix haute pour chaque étape.
 * Adapté du script prescrit fiche S1 (modèle de référence : « un quart »).
 *
 * @param {object} fraction  - { denominateur, nomLettres }
 * @param {string} formeId   - 'carre' | 'rectangle' | 'disque' | 'eventail'
 * @returns {Record<string, { titre: string, texte: string, question?: string }>}
 */
export function texteModelage(fraction, formeId) {
    const { avec: forme, de: deForme } = NOM_FORME[formeId] ?? {
        avec: "la forme",
        de: "de la forme",
    };
    const { denominateur, nomLettres } = fraction;

    return {
        [ETAPE.TOUT]: {
            titre: "Le tout",
            texte: `Voici ${forme}. C'est notre TOUT. C'est lui qu'on va partager.`,
        },
        [ETAPE.PARTAGE]: {
            titre: `Je partage en ${denominateur} parts`,
            texte: `Je veux représenter ${nomLettres}. Je partage ${forme} en ${denominateur} parts égales.`,
            question: `En combien de parts ai-je partagé ${forme} ?`,
        },
        [ETAPE.COLORIE]: {
            titre: "Je colorie une seule part",
            texte: `Je colorie UNE seule des parties. J'ai colorié ${nomLettres} ${deForme}.`,
            //                                                                  ^^^^^^^^
            question: `Pourquoi est-ce ${nomLettres} ?`,
            reponseAttendue: `C'est ${nomLettres} parce que ${forme} est partagé en ${denominateur} parts égales et j'en ai colorié une.`,
        },
    };
}

// ── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Hook de logique du modelage S1.
 *
 * @returns {{
 *   fractionIndex: number,
 *   formeIndex:    number,
 *   etape:         string,
 *   fraction:      object,
 *   forme:         object,
 *   textes:        object,
 *   peutReculer:   boolean,
 *   peutAvancer:   boolean,
 *   setFractionIndex: (i: number) => void,
 *   setFormeIndex:    (i: number) => void,
 *   setEtape:         (e: string) => void,
 *   avancer:          () => void,
 *   reculer:          () => void,
 *   reinitialiser:    () => void,
 * }}
 */
export function useModelageS1() {
    const [fractionIndex, setFractionIndex] = useState(1); // défaut : 1/4
    const [formeIndex, setFormeIndex] = useState(0); // défaut : carré
    const [etapeIndex, setEtapeIndex] = useState(0); // défaut : TOUT

    const fraction = FRACTIONS_S1[fractionIndex];
    const forme = FORMES_S1[formeIndex];
    const etape = ORDRE_ETAPES[etapeIndex];

    const textes = useMemo(
        () => texteModelage(fraction, forme.id),
        [fraction, forme.id]
    );

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
    const changerFraction = useCallback((i) => {
        setFractionIndex(i);
        setEtapeIndex(0);
    }, []);

    /** Changer de forme repart à l'étape TOUT. */
    const changerForme = useCallback((i) => {
        setFormeIndex(i);
        setEtapeIndex(0);
    }, []);

    const reinitialiser = useCallback(() => {
        setEtapeIndex(0);
    }, []);

    return {
        fractionIndex,
        formeIndex,
        etape,
        fraction,
        forme,
        textes,
        peutReculer: etapeIndex > 0,
        peutAvancer: etapeIndex < ORDRE_ETAPES.length - 1,
        setFractionIndex: changerFraction,
        setFormeIndex: changerForme,
        setEtape,
        avancer,
        reculer,
        reinitialiser,
    };
}
