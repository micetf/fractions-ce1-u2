/**
 * @fileoverview Hook useModelageS3 — logique du modelage pour la séance 3.
 *
 * Fractions S3 : 1/3 (un tiers) et 1/6 (un sixième).
 * Formes S3 : disque, hexagone, rectangle (fiche S3, matériel).
 *
 * Spécificité S3 — le contra-exemple est prescrit par la fiche :
 *   « Contre-exemple explicite : montrer un disque partagé en 3 parts
 *   INÉGALES. Ce contre-exemple est fondamental. »
 *   → Le contrôle de l'affichage du contre-exemple est géré ici.
 *
 * Les textes du modelage sont adaptés du script prescrit fiche S3
 * (phase ② « Modelage — un tiers d'un disque »).
 */

import { useState, useCallback, useMemo } from "react";

// ── Constantes ────────────────────────────────────────────────────────────────

/** Étapes du modelage (identiques à S1). */
export const ETAPE = {
    TOUT: "tout",
    PARTAGE: "partage",
    COLORIE: "colorie",
};

/** Fractions du répertoire S3 (source : fiche S3, objectifs). */
export const FRACTIONS_S3 = [
    { id: "1-3", denominateur: 3, nomLettres: "un tiers" },
    { id: "1-6", denominateur: 6, nomLettres: "un sixième" },
];

/**
 * Formes disponibles en S3 (fiche S3, matériel).
 * @type {Array<{ id: string, label: string }>}
 */
export const FORMES_S3 = [
    { id: "disque", label: "Disque" },
    { id: "hexagone", label: "Hexagone" },
    { id: "rectangle", label: "Rectangle" },
];

/** Noms des formes avec article (pour les textes du modelage). */
const NOM_FORME = {
    disque: "le disque",
    hexagone: "l'hexagone",
    rectangle: "le rectangle",
};

/** Ordre des étapes. */
const ORDRE_ETAPES = [ETAPE.TOUT, ETAPE.PARTAGE, ETAPE.COLORIE];

// ── Textes du modelage ────────────────────────────────────────────────────────

/**
 * Texte spécifique à l'étape PARTAGE pour l'hexagone.
 * Fiche S3, phase ② : l'obstacle du tiers doit être explicitement nommé.
 * @param {number} denominateur
 * @param {string} formeId
 * @returns {string}
 */
function textePartage(denominateur, formeId) {
    if (formeId === "disque") {
        if (denominateur === 3) {
            return "Je ne peux pas simplement plier en 3 comme je pliais en 2 ou en 4. J'utilise un gabarit d'angle de 120° pour tracer 3 secteurs égaux.";
        }
        return `Je partage le disque en ${denominateur} secteurs égaux.`;
    }
    if (formeId === "hexagone") {
        if (denominateur === 3) {
            return "L'hexagone se compose naturellement de 6 triangles identiques. Je groupe ces triangles 2 par 2 pour obtenir 3 parts égales.";
        }
        return "L'hexagone se compose de 6 triangles équilatéraux identiques. Chaque triangle est un sixième.";
    }
    // rectangle
    return `Je partage le rectangle en ${denominateur} bandes égales.`;
}

/**
 * Génère les textes de pensée à voix haute pour chaque étape.
 * Adapté du script prescrit fiche S3, phase ②.
 *
 * @param {object} fraction  - { denominateur, nomLettres }
 * @param {string} formeId
 * @returns {Record<string, { titre: string, texte: string, question?: string, reponseAttendue?: string }>}
 */
export function texteModelageS3(fraction, formeId) {
    const forme = NOM_FORME[formeId] ?? "la forme";
    const { denominateur, nomLettres } = fraction;

    return {
        [ETAPE.TOUT]: {
            titre: "Le tout",
            texte: `Voici ${forme}. C'est notre TOUT. La fraction ${nomLettres} sera toujours interprétée par rapport à lui.`,
        },
        [ETAPE.PARTAGE]: {
            titre: `Je partage en ${denominateur} parts égales`,
            texte: textePartage(denominateur, formeId),
            question: `En combien de parts ai-je partagé ${forme} ?`,
        },
        [ETAPE.COLORIE]: {
            titre: "Je colorie une seule part",
            texte: `Je colorie UNE seule des ${denominateur} parts. J'ai représenté ${nomLettres} de ${forme}.`,
            question: `Pourquoi est-ce ${nomLettres} ?`,
            reponseAttendue: `C'est ${nomLettres} parce que ${forme} est partagé en ${denominateur} parts égales et j'en ai colorié une.`,
        },
    };
}

// ── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Hook de logique du modelage S3.
 *
 * @returns {{
 *   fractionIndex:       number,
 *   formeIndex:          number,
 *   etape:               string,
 *   fraction:            object,
 *   forme:               object,
 *   textes:              object,
 *   contreExempleVisible:boolean,
 *   peutReculer:         boolean,
 *   peutAvancer:         boolean,
 *   setFractionIndex:    (i: number) => void,
 *   setFormeIndex:       (i: number) => void,
 *   setEtape:            (e: string) => void,
 *   avancer:             () => void,
 *   reculer:             () => void,
 *   toggleContreExemple: () => void,
 *   reinitialiser:       () => void,
 * }}
 */
export function useModelageS3() {
    const [fractionIndex, setFractionIndex] = useState(0); // défaut : 1/3
    const [formeIndex, setFormeIndex] = useState(0); // défaut : disque
    const [etapeIndex, setEtapeIndex] = useState(0); // défaut : TOUT
    const [contreExempleVisible, setContreExempleVisible] = useState(false);

    const fraction = FRACTIONS_S3[fractionIndex];
    const forme = FORMES_S3[formeIndex];
    const etape = ORDRE_ETAPES[etapeIndex];

    const textes = useMemo(
        () => texteModelageS3(fraction, forme.id),
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

    /** Changer de fraction repart à l'étape TOUT et masque le contre-exemple. */
    const changerFraction = useCallback((i) => {
        setFractionIndex(i);
        setEtapeIndex(0);
        setContreExempleVisible(false);
    }, []);

    /** Changer de forme repart à l'étape TOUT et masque le contre-exemple. */
    const changerForme = useCallback((i) => {
        setFormeIndex(i);
        setEtapeIndex(0);
        setContreExempleVisible(false);
    }, []);

    const toggleContreExemple = useCallback(() => {
        setContreExempleVisible((v) => !v);
    }, []);

    const reinitialiser = useCallback(() => {
        setEtapeIndex(0);
        setContreExempleVisible(false);
    }, []);

    return {
        fractionIndex,
        formeIndex,
        etape,
        fraction,
        forme,
        textes,
        contreExempleVisible,
        peutReculer: etapeIndex > 0,
        peutAvancer: etapeIndex < ORDRE_ETAPES.length - 1,
        setFractionIndex: changerFraction,
        setFormeIndex: changerForme,
        setEtape,
        avancer,
        reculer,
        toggleContreExemple,
        reinitialiser,
    };
}
