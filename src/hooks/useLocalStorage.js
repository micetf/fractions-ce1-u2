/**
 * @fileoverview Hook useLocalStorage — persistance générique via localStorage.
 *
 * Fournit une API identique à useState mais synchronisée avec localStorage.
 * Utilisé par useClasse et useObservablesFormatifs (sprint 13b).
 *
 * Comportement en cas d'erreur (quota dépassé, mode privé restrictif, etc.) :
 *   - La valeur reste en mémoire React (pas de plantage).
 *   - L'erreur est tracée en console avec la clé concernée.
 *
 * Contrainte : ne pas stocker de données sensibles ; cette application
 * n'implémente aucun chiffrement côté client (H-01 / H-04 du SRS).
 *
 * @module hooks/useLocalStorage
 */

import { useState, useCallback } from "react";

/**
 * Hook de persistance localStorage.
 *
 * @template T
 * @param {string} cle           - Clé localStorage (ex. "fractions-ce1.eleves")
 * @param {T}      valeurInitiale - Valeur utilisée si la clé est absente ou illisible
 * @returns {[T, (valeur: T | ((prev: T) => T)) => void]}
 *   Tuple [valeurCourante, setter] — même signature que useState.
 */
export function useLocalStorage(cle, valeurInitiale) {
    /**
     * Initialisation paresseuse : lecture unique au montage.
     * Si la clé n'existe pas ou si JSON.parse échoue, on utilise valeurInitiale.
     */
    const [valeur, setValeurEtat] = useState(() => {
        try {
            const item = window.localStorage.getItem(cle);
            return item !== null ? JSON.parse(item) : valeurInitiale;
        } catch (err) {
            console.error(
                `useLocalStorage : échec de lecture de la clé "${cle}"`,
                err
            );
            return valeurInitiale;
        }
    });

    /**
     * Setter synchronisé : met à jour l'état React ET localStorage.
     * Accepte une valeur directe ou une fonction updater (comme useState).
     *
     * @param {T | ((prev: T) => T)} nouvelleValeur
     */
    const definir = useCallback(
        (nouvelleValeur) => {
            setValeurEtat((prev) => {
                const valeurCalculee =
                    typeof nouvelleValeur === "function"
                        ? nouvelleValeur(prev)
                        : nouvelleValeur;
                try {
                    window.localStorage.setItem(
                        cle,
                        JSON.stringify(valeurCalculee)
                    );
                } catch (err) {
                    console.error(
                        `useLocalStorage : échec d'écriture de la clé "${cle}"`,
                        err
                    );
                }
                return valeurCalculee;
            });
        },
        [cle]
    );

    return [valeur, definir];
}
