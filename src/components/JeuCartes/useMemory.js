/**
 * @fileoverview Hook useMemory — logique du jeu de memory (session B).
 *
 * Implémente les règles de la Session 2 de la fiche S2 :
 *   « À votre tour, vous retournez deux cartes. Si c'est une paire,
 *   vous la gardez. Mais attention : pour avoir le droit de garder la
 *   paire, vous devez expliquer pourquoi c'est une paire.
 *   Si vous n'expliquez pas, la paire revient face cachée. »
 *
 * Différence fondamentale avec useJeuPaires (session A) :
 *   - Les cartes partent face cachée ('cachee')
 *   - Retournement progressif (max 2 cartes simultanément)
 *   - Une paire valide déclenche une modale de justification verbale
 *   - Si l'élève n'a pas justifié → la paire revient face cachée (règle fiche S2)
 *   - Une paire invalide → retour automatique face cachée après délai
 *
 * États des cartes :
 *   'cachee'    — face cachée, cliquable
 *   'retournee' — face visible, non-cliquable (en attente de validation)
 *   'correcte'  — paire validée, face visible, non-cliquable
 */

import { useState, useCallback, useMemo } from "react";
import { PROFIL } from "../../config/jeu.config";
import { genererCartes, etatsInitiaux } from "./jeu.utils";

/** Délai (ms) avant que les cartes incorrectes reviennent face cachée. */
const DELAI_RETOUR_MS = 1000;

/**
 * @typedef {import('./jeu.utils').CarteJeu} CarteJeu
 */

/**
 * @typedef {Object} PairePotentielle
 * @property {string} id1        - Id de la première carte retournée
 * @property {string} id2        - Id de la deuxième carte retournée
 * @property {string} fractionId - fractionId commun (paire valide confirmée)
 */

/**
 * Hook de logique du jeu de memory — session B.
 *
 * @param {{ profil?: string }} [options]
 * @returns {{
 *   cartes:               CarteJeu[],
 *   etats:                Record<string, 'cachee'|'retournee'|'correcte'>,
 *   selection:            string[],
 *   pairePotentielle:     PairePotentielle|null,
 *   pairesOk:             number,
 *   essais:               number,
 *   dernierResultat:      'correct'|'incorrect'|'sansjustification'|null,
 *   fractionValidee:      string|null,
 *   termine:              boolean,
 *   totalPaires:          number,
 *   selectionnerCarte:    (id: string) => void,
 *   confirmerJustification: () => void,
 *   annulerJustification:  () => void,
 *   reinitialiser:         () => void,
 * }}
 */
export function useMemory({ profil = PROFIL.STANDARD } = {}) {
    const cartesInitiales = useMemo(() => genererCartes(profil), [profil]);

    const [cartes] = useState(cartesInitiales);
    const [etats, setEtats] = useState(() =>
        etatsInitiaux(cartesInitiales, "cachee")
    );
    const [selection, setSelection] = useState([]);

    /**
     * Paire potentiellement valide en attente de justification verbale.
     * null si aucune paire en attente.
     */
    const [pairePotentielle, setPairePotentielle] = useState(null);

    const [pairesOk, setPairesOk] = useState(0);
    const [essais, setEssais] = useState(0);

    /**
     * Verrou : empêche tout clic supplémentaire pendant une animation ou
     * quand la modale de justification est ouverte.
     */
    const [verrou, setVerrou] = useState(false);

    const [dernierResultat, setDernierResultat] = useState(null);
    const [fractionValidee, setFractionValidee] = useState(null);

    const totalPaires = cartes.length / 2;
    const termine = pairesOk === totalPaires;

    /**
     * Retourne une carte.
     * - 1re carte : passe en 'retournee', ajoutée à selection.
     * - 2e carte  :
     *   → paire valide   : ouvre la modale de justification (verrou activé)
     *   → paire invalide : retour 'cachee' après DELAI_RETOUR_MS
     */
    const selectionnerCarte = useCallback(
        (carteId) => {
            if (verrou) return;
            if (etats[carteId] !== "cachee") return;
            if (selection.includes(carteId)) return;

            if (selection.length === 0) {
                setSelection([carteId]);
                setEtats((prev) => ({ ...prev, [carteId]: "retournee" }));
                return;
            }

            // Deuxième carte
            const [id1] = selection;
            const carte1 = cartes.find((c) => c.id === id1);
            const carte2 = cartes.find((c) => c.id === carteId);

            if (!carte1 || !carte2) return;

            // Retourner la 2e carte et vider la sélection avant validation
            setEtats((prev) => ({ ...prev, [carteId]: "retournee" }));
            setSelection([]);
            setVerrou(true);
            setEssais((n) => n + 1);

            const estValide =
                carte1.fractionId === carte2.fractionId &&
                carte1.type !== carte2.type;

            if (estValide) {
                // Paire valide → ouvrir la modale de justification
                // Le verrou reste actif jusqu'à décision dans la modale
                setPairePotentielle({
                    id1,
                    id2: carteId,
                    fractionId: carte1.fractionId,
                });
                setDernierResultat(null);
                setFractionValidee(null);
            } else {
                // Paire invalide → feedback d'erreur + retour 'cachee'
                setDernierResultat("incorrect");
                setFractionValidee(null);

                setTimeout(() => {
                    setEtats((prev) => {
                        const s = { ...prev };
                        if (s[id1] === "retournee") s[id1] = "cachee";
                        if (s[carteId] === "retournee") s[carteId] = "cachee";
                        return s;
                    });
                    setVerrou(false);
                }, DELAI_RETOUR_MS);
            }
        },
        [verrou, etats, selection, cartes]
    );

    /**
     * L'élève confirme avoir formulé sa justification verbale.
     * La paire est validée et les cartes passent en 'correcte'.
     *
     * Source fiche S2 : « pour avoir le droit de garder la paire,
     * vous devez expliquer pourquoi c'est une paire. »
     */
    const confirmerJustification = useCallback(() => {
        if (!pairePotentielle) return;
        const { id1, id2, fractionId } = pairePotentielle;

        setEtats((prev) => ({ ...prev, [id1]: "correcte", [id2]: "correcte" }));
        setPairesOk((n) => n + 1);
        setDernierResultat("correct");
        setFractionValidee(fractionId);
        setPairePotentielle(null);
        setVerrou(false);
    }, [pairePotentielle]);

    /**
     * L'élève n'a pas encore formulé sa justification verbale.
     * La paire revient face cachée — même si elle était correcte.
     *
     * Source fiche S2 (règle exacte) :
     * « Si vous n'expliquez pas, la paire revient face cachée. »
     */
    const annulerJustification = useCallback(() => {
        if (!pairePotentielle) return;
        const { id1, id2 } = pairePotentielle;

        setEtats((prev) => ({ ...prev, [id1]: "cachee", [id2]: "cachee" }));
        setDernierResultat("sansjustification");
        setFractionValidee(null);
        setPairePotentielle(null);
        setVerrou(false);
    }, [pairePotentielle]);

    /** Réinitialise le jeu — à appeler via changement de key sur le composant. */
    const reinitialiser = useCallback(() => {
        const nouvellesCartes = genererCartes(profil);
        setEtats(etatsInitiaux(nouvellesCartes, "cachee"));
        setSelection([]);
        setPairePotentielle(null);
        setPairesOk(0);
        setEssais(0);
        setVerrou(false);
        setDernierResultat(null);
        setFractionValidee(null);
    }, [profil]);

    return {
        cartes,
        etats,
        selection,
        pairePotentielle,
        pairesOk,
        essais,
        dernierResultat,
        fractionValidee,
        termine,
        totalPaires,
        selectionnerCarte,
        confirmerJustification,
        annulerJustification,
        reinitialiser,
    };
}
