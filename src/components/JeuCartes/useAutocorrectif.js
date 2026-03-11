/**
 * @fileoverview Hook useAutocorrectif — logique de la session C (autocorrectif).
 *
 * Implémente la mécanique de la fiche S2, section « Jeu autocorrectif recto-verso » :
 *
 *   « Prenez les cartes, face image visible. Dans votre tête ou sur
 *   l'ardoise, trouvez le nom de la fraction. Quand vous êtes prêts,
 *   retournez la carte pour vérifier. Si vous vous êtes trompé,
 *   regardez bien pourquoi — comptez les parts. »
 *
 *   « Ne pas intervenir immédiatement : laisser le temps à
 *   l'auto-régulation de s'exercer (3 passages minimum) »
 *
 * Différence avec sessions A et B :
 *   - Pas de paires — chaque carte est traitée individuellement
 *   - La carte commence face IMAGE (pas face cachée)
 *   - Le retournement révèle le NOM EN LETTRES (verso)
 *   - L'élève auto-évalue (j'avais bon / je m'étais trompé)
 *   - 3 passes sur l'ensemble des cartes sont requises avant la trace écrite
 *   - Tracking individuel par carte : nb de réussites / nb de passages
 *
 * Cartes utilisées : uniquement les cartes-images (une par fraction).
 * Source : fiche S2 matériel — « cartes avec l'image au recto et le nom
 * écrit en lettres au verso ».
 * La carte "un" est exclue de la trace écrite (fiche S2 — contenu trace).
 * Elle reste incluse dans l'autocorrectif (profil standard).
 */

import { useState, useCallback, useMemo } from "react";
import { getFractionById } from "../../config/fractions.config";
import { PROFILS_PAIRES, PROFIL, CARTE_UN } from "../../config/jeu.config";

/** Nombre de passes minimum avant d'autoriser le passage à la trace écrite. */
export const PASSES_MINIMUM = 3;

/**
 * @typedef {Object} CarteAutocorr
 * @property {string} id           - Ex. "1-4_autocorr"
 * @property {string} fractionId   - Ex. "1-4" ou "un"
 * @property {string} nomLettres   - Nom à deviner (verso)
 * @property {number} denominateur - Pour le rendu SVG (recto)
 */

/**
 * @typedef {Object} StatsCarte
 * @property {number} passages  - Nombre de fois que cette carte a été présentée
 * @property {number} reussites - Nombre de fois que l'élève avait bon avant retournement
 */

/**
 * Construit la liste des cartes-images à partir du profil.
 * Une seule carte par fraction (uniquement le recto = image).
 *
 * @param {string} profil
 * @returns {CarteAutocorr[]}
 */
function genererCartesAutocorr(profil) {
    const config = PROFILS_PAIRES[profil] ?? PROFILS_PAIRES[PROFIL.STANDARD];
    const cartes = [];

    for (const fractionId of config.fractionsIds) {
        const fraction = getFractionById(fractionId);
        if (!fraction) continue;
        cartes.push({
            id: `${fractionId}_autocorr`,
            fractionId,
            nomLettres: fraction.nomLettres,
            denominateur: fraction.denominateur,
        });
    }

    // Carte "un" si profil standard
    if (config.avecCarteUn) {
        cartes.push({
            id: "un_autocorr",
            fractionId: CARTE_UN.id,
            nomLettres: CARTE_UN.nomLettres,
            denominateur: CARTE_UN.denominateur,
        });
    }

    return cartes;
}

/**
 * Mélange Fisher-Yates (in-place).
 * @template T
 * @param {T[]} arr
 * @returns {T[]}
 */
function melanger(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

/**
 * Hook de logique de l'autocorrectif — session C.
 *
 * @param {{ profil?: string }} [options]
 * @returns {{
 *   cartes:           CarteAutocorr[],
 *   carteCourante:    CarteAutocorr|null,
 *   indexCourant:     number,
 *   totalCartes:      number,
 *   passe:            number,
 *   retournee:        boolean,
 *   stats:            Record<string, StatsCarte>,
 *   passesRequises:   number,
 *   passeComplete:    boolean,
 *   peutPasserTrace:  boolean,
 *   retourner:        () => void,
 *   evaluer:          (avaitBon: boolean) => void,
 *   reinitialiser:    () => void,
 * }}
 */
export function useAutocorrectif({ profil = PROFIL.STANDARD } = {}) {
    const cartesBase = useMemo(() => genererCartesAutocorr(profil), [profil]);

    // File de cartes à traiter dans cette passe (mélangées)
    const [file, setFile] = useState(() => melanger(cartesBase));
    const [indexCourant, setIndex] = useState(0);
    const [retournee, setRetournee] = useState(false);
    const [passe, setPasse] = useState(1);

    // Stats par carte : { passages, reussites }
    const [stats, setStats] = useState(() =>
        Object.fromEntries(
            cartesBase.map((c) => [c.id, { passages: 0, reussites: 0 }])
        )
    );

    const carteCourante = file[indexCourant] ?? null;
    const totalCartes = cartesBase.length;
    const passeComplete = indexCourant >= totalCartes;
    const peutPasserTrace =
        passe > PASSES_MINIMUM || (passe === PASSES_MINIMUM && passeComplete);

    /**
     * Retourne la carte courante — révèle le nom en lettres.
     * Incrémente le compteur de passages pour cette carte.
     */
    const retourner = useCallback(() => {
        if (retournee || !carteCourante) return;
        setRetournee(true);
        setStats((prev) => ({
            ...prev,
            [carteCourante.id]: {
                ...prev[carteCourante.id],
                passages: prev[carteCourante.id].passages + 1,
            },
        }));
    }, [retournee, carteCourante]);

    /**
     * L'élève s'auto-évalue après retournement.
     * @param {boolean} avaitBon - true si l'élève avait deviné correctement
     */
    const evaluer = useCallback(
        (avaitBon) => {
            if (!retournee || !carteCourante) return;

            if (avaitBon) {
                setStats((prev) => ({
                    ...prev,
                    [carteCourante.id]: {
                        ...prev[carteCourante.id],
                        reussites: prev[carteCourante.id].reussites + 1,
                    },
                }));
            }

            const nextIndex = indexCourant + 1;

            if (nextIndex >= totalCartes) {
                // Fin de cette passe
                setPasse((p) => p + 1);
                setFile(melanger(cartesBase));
                setIndex(0);
            } else {
                setIndex(nextIndex);
            }

            setRetournee(false);
        },
        [retournee, carteCourante, indexCourant, totalCartes, cartesBase]
    );

    /** Réinitialise complètement la session. */
    const reinitialiser = useCallback(() => {
        setFile(melanger(cartesBase));
        setIndex(0);
        setRetournee(false);
        setPasse(1);
        setStats(
            Object.fromEntries(
                cartesBase.map((c) => [c.id, { passages: 0, reussites: 0 }])
            )
        );
    }, [cartesBase]);

    return {
        cartes: cartesBase,
        carteCourante,
        indexCourant,
        totalCartes,
        passe,
        retournee,
        stats,
        passesRequises: PASSES_MINIMUM,
        passeComplete,
        peutPasserTrace,
        retourner,
        evaluer,
        reinitialiser,
    };
}
