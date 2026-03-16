/**
 * @fileoverview Hook useFullscreen — gestion du mode plein écran navigateur.
 *
 * Encapsule la Fullscreen API (W3C) pour un élément React via une ref.
 * Utilisé par ModelageInteractif (M1) pour RF-M1-01 et RNF-02.
 *
 * Source : RF-M1-01 (SRS) — « Le module dispose d'un mode plein écran
 * adapté à la projection (fond blanc, éléments grands et contrastés). »
 * Source : RNF-02 (SRS) — « Le module M1 est lisible à une distance
 * d'au moins 4 mètres lorsqu'il est projeté sur un TBI standard. »
 *
 * Note ESLint (react-hooks/set-state-in-effect) :
 *   Le setState dans ce hook est appelé à l'intérieur d'un callback
 *   d'événement externe (fullscreenchange), pas dans le corps synchrone
 *   de l'effet. C'est le pattern correct documenté par React pour la
 *   synchronisation avec un système externe.
 *   Ref : https://react.dev/learn/synchronizing-with-effects
 *
 * Compatibilité : Fullscreen API standard (Chrome, Firefox, Edge, Safari 16.4+).
 * Aucun préfixe vendor requis pour les navigateurs de moins de 2 ans (RNF-06).
 *
 * @module hooks/useFullscreen
 */

import { useState, useCallback, useEffect } from "react";

/**
 * Hook de gestion du plein écran navigateur.
 *
 * @param {React.RefObject<HTMLElement>} ref
 *   Ref vers l'élément à afficher en plein écran.
 *   L'élément doit être monté avant tout appel à entrerPleinEcran().
 *
 * @returns {{
 *   estPleinEcran:       boolean,
 *   entrerPleinEcran:    () => Promise<void>,
 *   quitterPleinEcran:   () => Promise<void>,
 *   basculerPleinEcran:  () => Promise<void>,
 * }}
 */
export function useFullscreen(ref) {
    const [estPleinEcran, setEstPleinEcran] = useState(false);

    /**
     * Synchronisation avec l'état réel du navigateur.
     *
     * L'événement "fullscreenchange" est un système externe : c'est le
     * navigateur qui notifie React (ex. : l'utilisateur appuie sur Échap).
     * setState est appelé dans le callback — usage correct de useEffect.
     */
    useEffect(() => {
        function handleChange() {
            setEstPleinEcran(!!document.fullscreenElement);
        }
        document.addEventListener("fullscreenchange", handleChange);
        return () => {
            document.removeEventListener("fullscreenchange", handleChange);
        };
    }, []);

    /**
     * Passe l'élément référencé en plein écran.
     * Silencieux si le navigateur bloque (ex. : appel hors gesture utilisateur).
     */
    const entrerPleinEcran = useCallback(async () => {
        if (!ref.current) return;
        try {
            await ref.current.requestFullscreen();
        } catch (err) {
            console.error("useFullscreen : requestFullscreen échoué", err);
        }
    }, [ref]);

    /**
     * Quitte le plein écran.
     * Silencieux si aucun plein écran n'est actif.
     */
    const quitterPleinEcran = useCallback(async () => {
        if (!document.fullscreenElement) return;
        try {
            await document.exitFullscreen();
        } catch (err) {
            console.error("useFullscreen : exitFullscreen échoué", err);
        }
    }, []);

    /**
     * Bascule entre plein écran et mode normal.
     */
    const basculerPleinEcran = useCallback(async () => {
        if (document.fullscreenElement) {
            await document
                .exitFullscreen()
                .catch((err) =>
                    console.error("useFullscreen : exitFullscreen échoué", err)
                );
        } else {
            if (!ref.current) return;
            await ref.current
                .requestFullscreen()
                .catch((err) =>
                    console.error(
                        "useFullscreen : requestFullscreen échoué",
                        err
                    )
                );
        }
    }, [ref]);

    return {
        estPleinEcran,
        entrerPleinEcran,
        quitterPleinEcran,
        basculerPleinEcran,
    };
}
