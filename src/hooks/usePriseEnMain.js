/**
 * @fileoverview usePriseEnMain — gestion de l'état de la modale de prise en main.
 *
 * La modale s'affiche automatiquement à la première visite.
 * Elle peut être rouverte à tout moment via le bouton « ? » de la navbar.
 *
 * Clé localStorage : "fractions-ce1.priseEnMainVue"
 * Valeur : true si l'enseignant a déjà fermé la modale au moins une fois.
 *
 * @module hooks/usePriseEnMain
 */

import { useState, useCallback } from "react";

const CLE = "fractions-ce1.priseEnMainVue";

/**
 * Hook de gestion de la modale de prise en main.
 *
 * @returns {{
 *   visible:  boolean,
 *   ouvrir:   () => void,
 *   fermer:   () => void,
 * }}
 */
export function usePriseEnMain() {
    const dejaVue = () => {
        try {
            return localStorage.getItem(CLE) === "true";
        } catch {
            return false;
        }
    };

    // Visible d'emblée si c'est la première visite
    const [visible, setVisible] = useState(() => !dejaVue());

    const fermer = useCallback(() => {
        setVisible(false);
        try {
            localStorage.setItem(CLE, "true");
        } catch {
            // Silencieux — la modale ne réapparaît simplement pas
        }
    }, []);

    const ouvrir = useCallback(() => {
        setVisible(true);
    }, []);

    return { visible, ouvrir, fermer };
}
