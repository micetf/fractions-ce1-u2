/**
 * @fileoverview Hook useObservablesFormatifs — observables formatifs S1–S6.
 *
 * Gère :
 *   - La liste des élèves (déléguée à useClasse — RF-M4-01)
 *   - La saisie ✓ / ✗ / --- par observable × élève (RF-M4-03)
 *   - Le calcul de la vue synthétique par séance (RF-M4-05)
 *   - L'exposition des régulations associées aux valeurs ✗ (RF-M4-04)
 *
 * Sources :
 *   - RF-M4-01 à RF-M4-05 (SRS, section 4.5.1)
 *   - observables.config.js (OBSERVABLES, getObservablesParSeance, SEANCES)
 *
 * Persistance :
 *   - Liste d'élèves  : "fractions-ce1.eleves"        → useClasse
 *   - Saisies obs.    : "fractions-ce1.observables"   → useLocalStorage
 *
 * Correction sprint 13b (bug "pas d'élève ajouté") :
 *   ajouterEleve et supprimerEleve sont désormais exposés par ce hook.
 *   ObservablesFormatifs ne doit PAS appeler useClasse() directement :
 *   deux instances distinctes de useClasse créeraient deux useState séparés
 *   partageant le même localStorage mais ne se synchronisant pas entre eux.
 *   Ce hook est la source unique de vérité pour la liste des élèves dans M4.
 *
 * Structure de "fractions-ce1.observables" :
 *   {
 *     [seanceId: string]: {          // ex. "S1"
 *       [obsId: string]: {           // ex. "S1-OBS-01"
 *         [eleveId: string]: string  // "ATTEINT" | "NON_ATTEINT" | "NON_OBSERVE"
 *       }
 *     }
 *   }
 *
 * @module hooks/useObservablesFormatifs
 */

import { useCallback } from "react";
import { useClasse } from "../../hooks/useClasse";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { getObservablesParSeance } from "../../config/observables.config";

/** Clé localStorage des saisies d'observables formatifs. */
export const CLE_OBSERVABLES = "fractions-ce1.observables";

/**
 * Valeurs possibles pour la saisie d'un observable.
 * RF-M4-03 : ✓ (atteint) / ✗ (non atteint) / --- (non observé).
 *
 * @readonly
 * @enum {string}
 */
export const VALEURS = {
    ATTEINT: "ATTEINT",
    NON_ATTEINT: "NON_ATTEINT",
    NON_OBSERVE: "NON_OBSERVE",
};

/**
 * Libellés et signes affichés pour chaque valeur de saisie.
 * @type {Record<string, { signe: string, label: string, classes: string }>}
 */
export const VALEURS_UI = {
    [VALEURS.ATTEINT]: {
        signe: "✓",
        label: "Atteint",
        classes: "bg-emerald-50 text-emerald-700 border-emerald-300",
    },
    [VALEURS.NON_ATTEINT]: {
        signe: "✗",
        label: "Non atteint",
        classes: "bg-red-50 text-red-700 border-red-300",
    },
    [VALEURS.NON_OBSERVE]: {
        signe: "—",
        label: "Non observé",
        classes: "bg-slate-50 text-slate-500 border-slate-200",
    },
};

/**
 * @typedef {Object} SyntheseObservable
 * @property {import('../../config/observables.config').Observable} observable
 * @property {number} nbAtteint     - Nombre d'élèves avec ATTEINT
 * @property {number} nbNonAtteint  - Nombre d'élèves avec NON_ATTEINT
 * @property {number} nbNonObserve  - Nombre d'élèves avec NON_OBSERVE ou non saisi
 */

/**
 * Hook de logique des observables formatifs S1–S6.
 *
 * @returns {{
 *   eleves:               import('../../hooks/useClasse').Eleve[],
 *   ajouterEleve:         (prenom: string) => void,
 *   supprimerEleve:       (id: string) => void,
 *   saisies:              Record<string, Record<string, Record<string, string>>>,
 *   getSaisie:            (seanceId: string, obsId: string, eleveId: string) => string|null,
 *   setSaisie:            (seanceId: string, obsId: string, eleveId: string, valeur: string|null) => void,
 *   getSynthese:          (seanceId: string) => SyntheseObservable[],
 *   getCompletionSeance:  (seanceId: string) => 'non_commence'|'en_cours'|'complet',
 *   reinitialiserSaisies: () => void,
 * }}
 */
export function useObservablesFormatifs() {
    // Instance unique de useClasse pour ce hook.
    // ObservablesFormatifs consomme ajouterEleve/supprimerEleve depuis ici —
    // ne pas appeler useClasse() directement dans le composant.
    const { eleves, ajouterEleve, supprimerEleve } = useClasse();

    const [saisies, setSaisies] = useLocalStorage(CLE_OBSERVABLES, {});

    /**
     * Lit la valeur saisie pour un triplet (séance, observable, élève).
     *
     * @param {string} seanceId - ex. "S3"
     * @param {string} obsId    - ex. "S3-OBS-02"
     * @param {string} eleveId  - ex. "eleve-4"
     * @returns {string|null} Valeur de VALEURS ou null si non saisi
     */
    const getSaisie = useCallback(
        (seanceId, obsId, eleveId) =>
            saisies?.[seanceId]?.[obsId]?.[eleveId] ?? null,
        [saisies]
    );

    /**
     * Enregistre (ou efface) la valeur saisie pour un triplet.
     * Passer null efface la saisie.
     *
     * @param {string}      seanceId
     * @param {string}      obsId
     * @param {string}      eleveId
     * @param {string|null} valeur
     */
    const setSaisie = useCallback(
        (seanceId, obsId, eleveId, valeur) => {
            setSaisies((prev) => {
                const seance = prev[seanceId] ?? {};
                const obs = seance[obsId] ?? {};

                if (valeur === null) {
                    const { [eleveId]: _, ...obsReste } = obs;
                    return {
                        ...prev,
                        [seanceId]: { ...seance, [obsId]: obsReste },
                    };
                }

                return {
                    ...prev,
                    [seanceId]: {
                        ...seance,
                        [obsId]: { ...obs, [eleveId]: valeur },
                    },
                };
            });
        },
        [setSaisies]
    );

    /**
     * Calcule la vue synthétique d'une séance (RF-M4-05).
     * Pour chaque observable : nombre d'élèves dans chaque catégorie.
     *
     * @param {string} seanceId
     * @returns {SyntheseObservable[]}
     */
    const getSynthese = useCallback(
        (seanceId) => {
            const observables = getObservablesParSeance(seanceId);
            return observables.map((obs) => {
                let nbAtteint = 0;
                let nbNonAtteint = 0;
                let nbNonObserve = 0;

                eleves.forEach((eleve) => {
                    const v = saisies?.[seanceId]?.[obs.id]?.[eleve.id] ?? null;
                    if (v === VALEURS.ATTEINT) nbAtteint++;
                    else if (v === VALEURS.NON_ATTEINT) nbNonAtteint++;
                    else nbNonObserve++;
                });

                return {
                    observable: obs,
                    nbAtteint,
                    nbNonAtteint,
                    nbNonObserve,
                };
            });
        },
        [eleves, saisies]
    );

    /**
     * Calcule l'état de complétion des observables d'une séance.
     * Utilisé par RF-M0-03 (tableau de bord) pour l'indicateur visuel.
     *
     * Règle :
     *   - "non_commence" : aucune saisie pour cette séance
     *   - "complet"      : tous les élèves × tous les observables renseignés
     *   - "en_cours"     : au moins une saisie, mais pas toutes
     *
     * @param {string} seanceId
     * @returns {'non_commence'|'en_cours'|'complet'}
     */
    const getCompletionSeance = useCallback(
        (seanceId) => {
            if (eleves.length === 0) return "non_commence";

            const observables = getObservablesParSeance(seanceId);
            if (observables.length === 0) return "non_commence";

            const total = observables.length * eleves.length;
            let renseignes = 0;

            observables.forEach((obs) => {
                eleves.forEach((eleve) => {
                    if (saisies?.[seanceId]?.[obs.id]?.[eleve.id] != null) {
                        renseignes++;
                    }
                });
            });

            if (renseignes === 0) return "non_commence";
            if (renseignes === total) return "complet";
            return "en_cours";
        },
        [eleves, saisies]
    );

    /**
     * Réinitialise toutes les saisies d'observables (toutes séances).
     *
     * ⚠ Action destructive. Ne touche pas la liste des élèves (partagée).
     */
    const reinitialiserSaisies = useCallback(() => {
        setSaisies({});
    }, [setSaisies]);

    return {
        eleves,
        ajouterEleve,
        supprimerEleve,
        saisies,
        getSaisie,
        setSaisie,
        getSynthese,
        getCompletionSeance,
        reinitialiserSaisies,
    };
}
