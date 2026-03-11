/**
 * @fileoverview Hook useMemoryTriplets — logique du memory triplets (S6, session B).
 *
 * Adapté de useMemory (session B paires) pour N=3 cartes par groupe.
 *
 * Source : fiche S6, session B —
 *   « Le joueur qui commence retourne 3 cartes. Si c'est un triplet valide,
 *   il doit le justifier — 'ce sont un huitième parce que...' — avant de le
 *   garder. Sans justification, les 3 cartes sont remises face cachée, même
 *   si le triplet est correct. »
 *
 * États des cartes :
 *   'cachee'    — face cachée, cliquable
 *   'retournee' — face visible (en cours de sélection)
 *   'correcte'  — triplet validé, face visible, non-cliquable
 */

import { useState, useCallback, useMemo } from "react";
import { PROFIL } from "../../config/jeu.config";
import { genererCartesTriplets, etatsInitiaux } from "./jeu.utils";

const DELAI_RETOUR_MS = 1200;

/**
 * @typedef {Object} TripletPotentielMemory
 * @property {string[]} ids        - Les 3 ids retournés
 * @property {string}   fractionId - fractionId commun (valide)
 */

/**
 * Hook de logique du memory triplets — session B.
 *
 * @param {{ profil?: string }} [options]
 * @returns {{
 *   cartes:              import('./jeu.utils').CarteJeu[],
 *   etats:               Record<string, string>,
 *   selection:           string[],
 *   tripletPotentiel:    TripletPotentielMemory|null,
 *   tripletsOk:          number,
 *   essais:              number,
 *   dernierResultat:     'correct'|'incorrect'|'sansjustification'|null,
 *   fractionValidee:     string|null,
 *   termine:             boolean,
 *   totalTriplets:       number,
 *   retournerCarte:      (id: string) => void,
 *   confirmerJustification: () => void,
 *   annulerJustification:   () => void,
 *   reinitialiser:       () => void,
 * }}
 */
export function useMemoryTriplets({ profil = PROFIL.STANDARD } = {}) {
    const cartesInitiales = useMemo(
        () => genererCartesTriplets(profil),
        [profil]
    );

    const [cartes] = useState(cartesInitiales);
    const [etats, setEtats] = useState(() =>
        etatsInitiaux(cartesInitiales, "cachee")
    );
    const [selection, setSelection] = useState([]);
    const [tripletPotentiel, setTripletPotentiel] = useState(null);
    const [tripletsOk, setTripletsOk] = useState(0);
    const [essais, setEssais] = useState(0);
    const [dernierResultat, setDernierResultat] = useState(null);
    const [fractionValidee, setFractionValidee] = useState(null);

    const totalTriplets = cartes.length / 3;
    const termine = tripletsOk === totalTriplets;

    const retournerCarte = useCallback(
        (carteId) => {
            if (etats[carteId] !== "cachee") return;
            if (selection.length >= 3) return;
            if (tripletPotentiel) return;

            const nouvelleSelection = [...selection, carteId];
            setEtats((prev) => ({ ...prev, [carteId]: "retournee" }));

            if (nouvelleSelection.length < 3) {
                setSelection(nouvelleSelection);
                return;
            }

            // 3e carte retournée — évaluation
            const [id1, id2] = selection;
            const c1 = cartes.find((c) => c.id === id1);
            const c2 = cartes.find((c) => c.id === id2);
            const c3 = cartes.find((c) => c.id === carteId);

            setEssais((n) => n + 1);
            setSelection([]);

            const estTriplet =
                c1?.fractionId === c2?.fractionId &&
                c2?.fractionId === c3?.fractionId;

            if (estTriplet) {
                setTripletPotentiel({
                    ids: [id1, id2, carteId],
                    fractionId: c1.fractionId,
                });
            } else {
                setDernierResultat("incorrect");
                setTimeout(() => {
                    setEtats((prev) => ({
                        ...prev,
                        [id1]: "cachee",
                        [id2]: "cachee",
                        [carteId]: "cachee",
                    }));
                }, DELAI_RETOUR_MS);
            }
        },
        [cartes, etats, selection, tripletPotentiel]
    );

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

    const annulerJustification = useCallback(() => {
        if (!tripletPotentiel) return;
        const { ids } = tripletPotentiel;
        // Remettre face cachée
        setTimeout(() => {
            setEtats((prev) => {
                const maj = { ...prev };
                ids.forEach((id) => {
                    maj[id] = "cachee";
                });
                return maj;
            });
        }, DELAI_RETOUR_MS);
        setDernierResultat("sansjustification");
        setTripletPotentiel(null);
    }, [tripletPotentiel]);

    const reinitialiser = useCallback(() => {
        setEtats(etatsInitiaux(cartes, "cachee"));
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
        retournerCarte,
        confirmerJustification,
        annulerJustification,
        reinitialiser,
    };
}
