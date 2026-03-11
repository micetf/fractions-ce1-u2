/**
 * @fileoverview Hook useAutocorrectifTriplets — logique session C S6.
 *
 * La session C de S6 est différente de la session C de S2 sur deux points :
 *
 *   1. Constitution des triplets (7 min) : même logique que session A —
 *      l'élève sélectionne 3 cartes sans feedback immédiat ; les triplets
 *      sont stockés côté. Fiche S6 : « Posez-le de côté — sans vérifier encore. »
 *
 *   2. Vérification avec la bande-répertoire (2 min) : la bande-répertoire
 *      devient accessible. Les triplets sont validés. L'élève peut identifier
 *      ses erreurs. Fiche S6 : « Seulement à la fin, vous pouvez ouvrir votre
 *      bande-répertoire pour vérifier. »
 *
 *   3. Bilan de séquence (5 min) : grille d'auto-évaluation ITEMS_AUTOEVAL.
 *
 * Pas de carte "un" — répertoire complet des 7 fractions unitaires.
 *
 * @see autoeval.config.js
 */

import { useState, useCallback, useMemo } from "react";
import { PROFIL } from "../../config/jeu.config";
import { ITEMS_AUTOEVAL, NIVEAUX } from "../../config/autoeval.config";
import { genererCartesTriplets, etatsInitiaux } from "./jeu.utils";

/**
 * Phases de la session C S6.
 * @readonly
 * @enum {string}
 */
export const PHASE_C = {
    CONSTITUTION: "constitution", // Sélection silencieuse des triplets
    VERIFICATION: "verification", // Vérification avec bande-répertoire
    BILAN: "bilan", // Grille d'auto-évaluation
};

/**
 * @typedef {Object} TripletConstitue
 * @property {string[]} ids        - Les 3 ids de cartes
 * @property {string}   fractionId - fractionId supposé (peut être erroné)
 * @property {boolean|null} correct - null avant vérification, bool après
 */

/**
 * Hook de logique de la session C triplets.
 *
 * @param {{ profil?: string }} [options]
 * @returns {{
 *   cartes:             import('./jeu.utils').CarteJeu[],
 *   etats:              Record<string, string>,
 *   selection:          string[],
 *   tripletsConstitues: TripletConstitue[],
 *   phase:              string,
 *   autoEval:           Record<string, string>,
 *   totalTriplets:      number,
 *   selectionnerCarte:  (id: string) => void,
 *   passerVerification: () => void,
 *   passerBilan:        () => void,
 *   setAutoEval:        (itemId: string, niveau: string) => void,
 *   reinitialiser:      () => void,
 * }}
 */
export function useAutocorrectifTriplets({ profil = PROFIL.STANDARD } = {}) {
    const cartesInitiales = useMemo(
        () => genererCartesTriplets(profil),
        [profil]
    );

    const [cartes] = useState(cartesInitiales);
    const [etats, setEtats] = useState(() =>
        etatsInitiaux(cartesInitiales, "neutre")
    );
    const [selection, setSelection] = useState([]);
    const [tripletsConstitues, setTripletsConstitues] = useState([]);
    const [phase, setPhase] = useState(PHASE_C.CONSTITUTION);
    const [autoEval, setAutoEvalState] = useState(() =>
        Object.fromEntries(ITEMS_AUTOEVAL.map((item) => [item.id, null]))
    );

    const totalTriplets = cartes.length / 3;

    /**
     * Sélection de 3 cartes en phase CONSTITUTION.
     * Pas de feedback immédiat — le triplet est stocké côté.
     * Source : fiche S6 — « posez-le de côté — sans vérifier encore ».
     */
    const selectionnerCarte = useCallback(
        (carteId) => {
            if (phase !== PHASE_C.CONSTITUTION) return;
            if (etats[carteId] === "correcte") return;
            if (selection.includes(carteId)) return;

            const nouvelleSelection = [...selection, carteId];
            setEtats((prev) => ({ ...prev, [carteId]: "selectionnee" }));

            if (nouvelleSelection.length < 3) {
                setSelection(nouvelleSelection);
                return;
            }

            // 3e carte — stocker le triplet sans valider
            const [id1, id2] = selection;
            const c1 = cartes.find((c) => c.id === id1);

            // On enregistre le fractionId de la 1re carte comme hypothèse
            const triplet = {
                ids: [id1, id2, carteId],
                fractionId: c1?.fractionId ?? null,
                correct: null, // Sera déterminé à la vérification
            };

            setTripletsConstitues((prev) => [...prev, triplet]);

            // Marquer les 3 cartes comme "correcte" (visuellement rangées)
            setEtats((prev) => ({
                ...prev,
                [id1]: "correcte",
                [id2]: "correcte",
                [carteId]: "correcte",
            }));
            setSelection([]);
        },
        [cartes, etats, phase, selection]
    );

    /**
     * Passer à la phase VERIFICATION.
     * Valide chaque triplet : les 3 cartes ont-elles le même fractionId ?
     * Source : fiche S6 — « ouvrez votre bande-répertoire pour vérifier ».
     */
    const passerVerification = useCallback(() => {
        setTripletsConstitues((prev) =>
            prev.map((triplet) => {
                const [id1, id2, id3] = triplet.ids;
                const c1 = cartes.find((c) => c.id === id1);
                const c2 = cartes.find((c) => c.id === id2);
                const c3 = cartes.find((c) => c.id === id3);
                const correct =
                    c1?.fractionId === c2?.fractionId &&
                    c2?.fractionId === c3?.fractionId;
                return { ...triplet, correct };
            })
        );
        setPhase(PHASE_C.VERIFICATION);
    }, [cartes]);

    const passerBilan = useCallback(() => setPhase(PHASE_C.BILAN), []);

    /**
     * Enregistrer la réponse de l'élève à un item d'auto-évaluation.
     * @param {string} itemId  - ex. "AE-01"
     * @param {string} niveau  - valeur de NIVEAUX
     */
    const setAutoEval = useCallback((itemId, niveau) => {
        setAutoEvalState((prev) => ({ ...prev, [itemId]: niveau }));
    }, []);

    const reinitialiser = useCallback(() => {
        setEtats(etatsInitiaux(cartes, "neutre"));
        setSelection([]);
        setTripletsConstitues([]);
        setPhase(PHASE_C.CONSTITUTION);
        setAutoEvalState(
            Object.fromEntries(ITEMS_AUTOEVAL.map((item) => [item.id, null]))
        );
    }, [cartes]);

    return {
        cartes,
        etats,
        selection,
        tripletsConstitues,
        phase,
        autoEval,
        totalTriplets,
        selectionnerCarte,
        passerVerification,
        passerBilan,
        setAutoEval,
        reinitialiser,
    };
}
