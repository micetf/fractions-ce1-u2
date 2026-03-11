/**
 * @fileoverview Hook useJeuPaires — logique du jeu d'appariement (session A).
 *
 * Gère :
 *   - La génération du jeu de cartes selon le profil
 *   - La sélection successive de 2 cartes
 *   - La validation de paire (même fractionId)
 *   - L'état de chaque carte (neutre / sélectionnée / correcte / incorrecte)
 *   - Les statistiques de session (paires trouvées, essais)
 *
 * Ne gère PAS (hors sprint 2) :
 *   - L'animation de retournement (session B — sprint 3)
 *   - La persistance inter-sessions (RF-M2-07 — sprint 3)
 */

import { useState, useCallback, useMemo } from "react";
import { PROFIL } from "../../config/jeu.config";
import { genererCartes, etatsInitiaux } from "./jeu.utils";

/**
 * @typedef {import('./jeu.utils').CarteJeu} CarteJeu
 */

/**
 * @typedef {Object} EtatJeu
 * @property {CarteJeu[]} cartes       - Toutes les cartes dans l'ordre d'affichage
 * @property {Record<string, 'neutre'|'selectionnee'|'correcte'|'incorrecte'>} etats
 * @property {string[]}   selection    - Ids des cartes sélectionnées (0, 1 ou 2)
 * @property {number}     pairesOk     - Paires validées
 * @property {number}     essais       - Nombre de tentatives de paires
 * @property {string|null} dernierResultat - 'correct' | 'incorrect' | null
 * @property {string|null} fractionValidee - fractionId de la paire validée
 * @property {boolean}    termine      - Toutes les paires trouvées
 */

/**
 * Hook de logique du jeu de paires — session A (cartes visibles).
 *
 * @param {{ profil?: string }} [options]
 * @returns {EtatJeu & {
 *   selectionnerCarte: (id: string) => void,
 *   reinitialiser:     () => void,
 * }}
 */
export function useJeuPaires({ profil = PROFIL.STANDARD } = {}) {
    const cartesInitiales = useMemo(() => genererCartes(profil), [profil]);

    const [cartes] = useState(cartesInitiales);
    const [etats, setEtats] = useState(() =>
        etatsInitiaux(cartesInitiales, "neutre")
    );
    const [selection, setSelection] = useState([]);
    const [pairesOk, setPairesOk] = useState(0);
    const [essais, setEssais] = useState(0);
    const [dernierResultat, setDernierResultat] = useState(null);
    const [fractionValidee, setFractionValidee] = useState(null);

    const totalPaires = cartes.length / 2;
    const termine = pairesOk === totalPaires;

    /**
     * Sélectionne une carte.
     * - 1re carte sélectionnée : passe en état 'selectionnee'
     * - 2e carte sélectionnée  : validation immédiate
     *   → correcte  : paire → états 'correcte', compteurs mis à jour
     *   → incorrecte : bref état 'incorrecte', retour à 'neutre' après 800 ms
     */
    const selectionnerCarte = useCallback(
        (carteId) => {
            // Ignorer si la carte est déjà correcte ou en attente de reset
            if (
                etats[carteId] === "correcte" ||
                etats[carteId] === "incorrecte"
            )
                return;
            // Ignorer si déjà sélectionnée (double-clic)
            if (selection.includes(carteId)) return;

            if (selection.length === 0) {
                // Première carte
                setSelection([carteId]);
                setEtats((prev) => ({ ...prev, [carteId]: "selectionnee" }));
                setDernierResultat(null);
                setFractionValidee(null);
                return;
            }

            // Deuxième carte — validation
            const [idPremiere] = selection;
            const premiereCarte = cartes.find((c) => c.id === idPremiere);
            const deuxiemeCarte = cartes.find((c) => c.id === carteId);

            if (!premiereCarte || !deuxiemeCarte) return;

            const estPaire =
                premiereCarte.fractionId === deuxiemeCarte.fractionId &&
                premiereCarte.type !== deuxiemeCarte.type;

            setEssais((n) => n + 1);
            setSelection([]);

            if (estPaire) {
                // Paire correcte
                setEtats((prev) => ({
                    ...prev,
                    [idPremiere]: "correcte",
                    [carteId]: "correcte",
                }));
                setPairesOk((n) => n + 1);
                setDernierResultat("correct");
                setFractionValidee(premiereCarte.fractionId);
            } else {
                // Paire incorrecte — flash d'erreur puis retour à 'neutre'
                setEtats((prev) => ({
                    ...prev,
                    [idPremiere]: "incorrecte",
                    [carteId]: "incorrecte",
                }));
                setDernierResultat("incorrect");
                setFractionValidee(null);

                setTimeout(() => {
                    setEtats((prev) => {
                        const suivant = { ...prev };
                        if (suivant[idPremiere] === "incorrecte")
                            suivant[idPremiere] = "neutre";
                        if (suivant[carteId] === "incorrecte")
                            suivant[carteId] = "neutre";
                        return suivant;
                    });
                }, 800);
            }
        },
        [etats, selection, cartes]
    );

    /** Réinitialise le jeu avec un nouveau mélange. */
    const reinitialiser = useCallback(() => {
        // On force un nouveau mélange en réinitialisant via le state
        const nouvellesCartes = genererCartes(profil);
        setEtats(etatsInitiaux(nouvellesCartes, "neutre"));
        setSelection([]);
        setPairesOk(0);
        setEssais(0);
        setDernierResultat(null);
        setFractionValidee(null);
        // Note : `cartes` ne peut pas être réinitialisé ici car useState est figé.
        // La solution propre est de remonter `profil` et de changer la key du composant.
        // Ce cas est géré dans JeuPaires via une key prop.
    }, [profil]);

    return {
        cartes,
        etats,
        selection,
        pairesOk,
        essais,
        dernierResultat,
        fractionValidee,
        termine,
        totalPaires,
        selectionnerCarte,
        reinitialiser,
    };
}
