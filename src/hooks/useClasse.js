/**
 * @fileoverview Hook useClasse — gestion et persistance de la liste d'élèves.
 *
 * Source : RF-M4-01 (SRS) — « L'enseignant peut saisir une liste d'élèves
 * (classe virtuelle). Cette liste est réutilisée pour toutes les séances. »
 *
 * Ce hook est l'unique source de vérité pour la liste des élèves.
 * Il est consommé par :
 *   - useBilanS6        (sprint 11, migré en sprint 13a)
 *   - useObservablesFormatifs (sprint 13b)
 *
 * Clé localStorage : "fractions-ce1.eleves"
 * Structure persistée : { eleves: Eleve[], nextId: number }
 *   - nextId est persisté pour garantir l'unicité des identifiants après
 *     rechargement (évite les collisions si des élèves ont été supprimés).
 *
 * Décision de conception (sprint 13a) :
 *   La suppression d'un élève retire son entrée de la liste partagée.
 *   Chaque module consommateur (BilanS6, ObservablesFormatifs) est
 *   responsable du nettoyage de ses propres données pour cet élève.
 *   Ce hook n'orchestre pas ce nettoyage : il expose seulement les primitives
 *   de gestion de la liste.
 *
 * @module hooks/useClasse
 */

import { useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";

/** @typedef {{ id: string, prenom: string }} Eleve */

/**
 * Valeur initiale persistée — classe vide, compteur à zéro.
 * @type {{ eleves: Eleve[], nextId: number }}
 */
const ETAT_INITIAL = { eleves: [], nextId: 0 };

/** Clé localStorage partagée par tous les modules M4. */
export const CLE_CLASSE = "fractions-ce1.eleves";

/**
 * Hook de gestion de la classe virtuelle (liste d'élèves persistée).
 *
 * @returns {{
 *   eleves:          Eleve[],
 *   ajouterEleve:    (prenom: string) => void,
 *   supprimerEleve:  (id: string) => void,
 *   reinitialiserClasse: () => void,
 * }}
 */
export function useClasse() {
    const [etat, setEtat] = useLocalStorage(CLE_CLASSE, ETAT_INITIAL);

    /**
     * Ajoute un élève à la classe.
     * L'identifiant est généré depuis nextId pour garantir l'unicité
     * entre sessions (même après suppression d'élèves et rechargement).
     *
     * @param {string} prenom - Prénom saisi par l'enseignant (déjà trimé)
     */
    const ajouterEleve = useCallback(
        (prenom) => {
            const prenom_ = prenom.trim();
            if (!prenom_) return;
            setEtat((prev) => ({
                eleves: [
                    ...prev.eleves,
                    { id: `eleve-${prev.nextId}`, prenom: prenom_ },
                ],
                nextId: prev.nextId + 1,
            }));
        },
        [setEtat]
    );

    /**
     * Supprime un élève de la liste partagée.
     *
     * ⚠ Les données associées à cet élève dans BilanS6 et ObservablesFormatifs
     * doivent être nettoyées par les hooks consommateurs respectifs.
     * Ce hook ne notifie pas les consommateurs : chacun observe `eleves`
     * et ajuste son propre état en conséquence (cf. useBilanS6, sprint 13a).
     *
     * @param {string} id - Identifiant de l'élève à supprimer
     */
    const supprimerEleve = useCallback(
        (id) => {
            setEtat((prev) => ({
                ...prev,
                eleves: prev.eleves.filter((e) => e.id !== id),
            }));
        },
        [setEtat]
    );

    /**
     * Réinitialise la liste complète de la classe.
     *
     * ⚠ Action destructive : efface la liste partagée pour TOUS les modules M4.
     * À n'appeler que depuis un point d'entrée UI explicite avec confirmation.
     * nextId est remis à 0 car toutes les données associées sont également
     * effacées.
     */
    const reinitialiserClasse = useCallback(() => {
        setEtat(ETAT_INITIAL);
    }, [setEtat]);

    return {
        eleves: etat.eleves,
        ajouterEleve,
        supprimerEleve,
        reinitialiserClasse,
    };
}
