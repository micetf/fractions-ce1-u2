/**
 * @fileoverview Hook useJeuTriplets — logique du jeu d'appariement triplets (S6, session A).
 *
 * Identique à useJeuPaires mais sélection de 3 cartes (au lieu de 2).
 * Un triplet est valide si les 3 cartes sélectionnées ont le même fractionId.
 *
 * Source : fiche S6, session A —
 *   « À votre tour, retournez 3 cartes. Si c'est un triplet valide,
 *   vous devez le justifier avant de le garder. »
 *
 * Différences avec useJeuPaires :
 *   - N = 3 cartes par groupe
 *   - Pas de carte "un"
 *   - genererCartesTriplets au lieu de genererCartes
 *   - Justification obligatoire déclenchée par tripletPotentiel (comme useMemory)
 */

import { useState, useCallback, useMemo } from "react";
import { PROFIL } from "../../config/jeu.config";
import { genererCartesTriplets, etatsInitiaux } from "./jeu.utils";

/** Délai (ms) avant retour à 'neutre' après un triplet incorrect. */
const DELAI_RETOUR_MS = 1000;

/**
 * @typedef {Object} TripletPotentiel
 * @property {string[]} ids        - Les 3 ids de cartes
 * @property {string}   fractionId - fractionId commun (triplet valide)
 */

/**
 * Hook de logique du jeu de triplets — session A (cartes visibles).
 *
 * @param {{ profil?: string }} [options]
 * @returns {{
 *   cartes:              import('./jeu.utils').CarteJeu[],
 *   etats:               Record<string, string>,
 *   selection:           string[],
 *   tripletsOk:          number,
 *   essais:              number,
 *   tripletPotentiel:    TripletPotentiel|null,
 *   dernierResultat:     'correct'|'incorrect'|'sansjustification'|null,
 *   fractionValidee:     string|null,
 *   termine:             boolean,
 *   totalTriplets:       number,
 *   selectionnerCarte:   (id: string) => void,
 *   confirmerJustification: () => void,
 *   annulerJustification:   () => void,
 *   reinitialiser:       () => void,
 * }}
 */
export function useJeuTriplets({ profil = PROFIL.STANDARD } = {}) {
    const cartesInitiales = useMemo(
        () => genererCartesTriplets(profil),
        [profil]
    );

    const [cartes] = useState(cartesInitiales);
    const [etats, setEtats] = useState(() =>
        etatsInitiaux(cartesInitiales, "neutre")
    );
    const [selection, setSelection] = useState([]);
    const [tripletPotentiel, setTripletPotentiel] = useState(null);
    const [tripletsOk, setTripletsOk] = useState(0);
    const [essais, setEssais] = useState(0);
    const [dernierResultat, setDernierResultat] = useState(null);
    const [fractionValidee, setFractionValidee] = useState(null);

    const totalTriplets = cartes.length / 3;
    const termine = tripletsOk === totalTriplets;

    const selectionnerCarte = useCallback(
        (carteId) => {
            if (
                etats[carteId] === "correcte" ||
                etats[carteId] === "incorrecte"
            )
                return;
            if (selection.includes(carteId)) return;
            if (tripletPotentiel) return; // Justification en attente

            const nouvelleSelection = [...selection, carteId];

            if (nouvelleSelection.length < 3) {
                setSelection(nouvelleSelection);
                setEtats((prev) => ({ ...prev, [carteId]: "selectionnee" }));
                setDernierResultat(null);
                setFractionValidee(null);
                return;
            }

            // 3e carte — évaluation
            const [id1, id2] = selection;
            const c1 = cartes.find((c) => c.id === id1);
            const c2 = cartes.find((c) => c.id === id2);
            const c3 = cartes.find((c) => c.id === carteId);

            setEtats((prev) => ({ ...prev, [carteId]: "selectionnee" }));
            setEssais((n) => n + 1);

            const estTriplet =
                c1?.fractionId === c2?.fractionId &&
                c2?.fractionId === c3?.fractionId;

            if (estTriplet) {
                // Triplet valide → déclenche la modale de justification
                setTripletPotentiel({
                    ids: [id1, id2, carteId],
                    fractionId: c1.fractionId,
                });
                setSelection([]);
            } else {
                // Triplet invalide
                setEtats((prev) => ({
                    ...prev,
                    [id1]: "incorrecte",
                    [id2]: "incorrecte",
                    [carteId]: "incorrecte",
                }));
                setDernierResultat("incorrect");
                setSelection([]);
                setTimeout(() => {
                    setEtats((prev) => ({
                        ...prev,
                        [id1]: "neutre",
                        [id2]: "neutre",
                        [carteId]: "neutre",
                    }));
                }, DELAI_RETOUR_MS);
            }
        },
        [cartes, etats, selection, tripletPotentiel]
    );

    /** L'élève a justifié → triplet validé. */
    const confirmerJustification = useCallback(() => {
        if (!tripletPotentiel) return;
        const { ids, fractionId } = tripletPotentiel;
        setEtats((prev) => {
            const maj = { ...prev };
            ids.forEach((id) => {
                maj[id] = "correcte";
            });
            return maj;
        });
        setTripletsOk((n) => n + 1);
        setDernierResultat("correct");
        setFractionValidee(fractionId);
        setTripletPotentiel(null);
    }, [tripletPotentiel]);

    /** L'élève n'a pas justifié → triplet remis à zéro. */
    const annulerJustification = useCallback(() => {
        if (!tripletPotentiel) return;
        const { ids } = tripletPotentiel;
        setEtats((prev) => {
            const maj = { ...prev };
            ids.forEach((id) => {
                maj[id] = "neutre";
            });
            return maj;
        });
        setDernierResultat("sansjustification");
        setTripletPotentiel(null);
    }, [tripletPotentiel]);

    const reinitialiser = useCallback(() => {
        setEtats(etatsInitiaux(cartes, "neutre"));
        setSelection([]);
        setTripletPotentiel(null);
        setTripletsOk(0);
        setEssais(0);
        setDernierResultat(null);
        setFractionValidee(null);
    }, [cartes]);

    return {
        cartes,
        etats,
        selection,
        tripletPotentiel,
        tripletsOk,
        essais,
        dernierResultat,
        fractionValidee,
        termine,
        totalTriplets,
        selectionnerCarte,
        confirmerJustification,
        annulerJustification,
        reinitialiser,
    };
}
