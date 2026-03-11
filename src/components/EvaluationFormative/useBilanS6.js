/**
 * @fileoverview Hook useBilanS6 — logique du bilan de séquence S6 (vue enseignant).
 *
 * Gère :
 *   - La liste des élèves de la classe
 *   - La saisie des résultats d'auto-évaluation par élève (6 items × 3 niveaux)
 *   - Le calcul des synthèses (accompagnement / tuteurs / alerte collective)
 *
 * Sources :
 *   - Fiche S6, « Décisions pédagogiques post-séquence 2 »
 *   - RF-M4-06 à RF-M4-09 (SRS, section 4.5.2)
 *   - autoeval.config.js (ITEMS_AUTOEVAL, ITEMS_CRITERES_VERS_S3, NIVEAUX)
 *
 * Persistance : aucune (état React en mémoire).
 * RF-M4-01 (liste d'élèves persistante) est traité en sprint 12.
 */

import { useState, useCallback, useMemo } from "react";
import {
    ITEMS_AUTOEVAL,
    ITEMS_CRITERES_VERS_S3,
    NIVEAUX,
    seuilAlerteCollective,
} from "../../config/autoeval.config";

/**
 * @typedef {Object} Eleve
 * @property {string} id     - Identifiant unique (généré à l'ajout)
 * @property {string} prenom - Prénom saisi par l'enseignant
 */

/**
 * @typedef {Record<string, string|null>} ResultatsEleve
 * Clés = itemId (ex. "AE-01"), valeurs = NIVEAUX ou null (non saisi)
 */

/**
 * @typedef {Object} SyntheseEleve
 * @property {Eleve}  eleve
 * @property {boolean} necessiteAccompagnement - PAS_ENCORE sur au moins 1 item critère
 * @property {boolean} tuteurPotentiel         - OUI sur tous les 6 items
 * @property {boolean} saisieComplete          - Tous les items renseignés
 */

/** Initialise un objet de résultats vide pour un élève (tous items à null). */
function resultatsVides() {
    return Object.fromEntries(ITEMS_AUTOEVAL.map((item) => [item.id, null]));
}

/**
 * Hook de logique du bilan de séquence S6 — vue enseignant.
 *
 * @returns {{
 *   eleves:                Eleve[],
 *   resultats:             Record<string, ResultatsEleve>,
 *   eleveSelectionnee:     string|null,
 *   ajouterEleve:          (prenom: string) => void,
 *   supprimerEleve:        (id: string) => void,
 *   selectionnerEleve:     (id: string) => void,
 *   setResultat:           (eleveId: string, itemId: string, niveau: string|null) => void,
 *   syntheses:             SyntheseEleve[],
 *   alerteCollective:      boolean,
 *   nbElevesComplets:      number,
 *   reinitialiser:         () => void,
 * }}
 */
export function useBilanS6() {
    const [eleves, setEleves] = useState([]);
    const [resultats, setResultats] = useState({});
    const [eleveSelectionne, setEleveSelectionne] = useState(null);
    const [compteur, setCompteur] = useState(0);

    /** Ajoute un élève. Génère un id stable (compteur incrémental). */
    const ajouterEleve = useCallback(
        (prenom) => {
            const prenom_ = prenom.trim();
            if (!prenom_) return;

            const id = `eleve-${compteur}`;
            setCompteur((n) => n + 1);
            setEleves((prev) => [...prev, { id, prenom: prenom_ }]);
            setResultats((prev) => ({ ...prev, [id]: resultatsVides() }));
            // Sélectionner automatiquement le premier élève ajouté
            setEleveSelectionne((prev) => prev ?? id);
        },
        [compteur]
    );

    /** Supprime un élève et ses résultats. */
    const supprimerEleve = useCallback((id) => {
        setEleves((prev) => prev.filter((e) => e.id !== id));
        setResultats((prev) => {
            const { [id]: _, ...reste } = prev;
            return reste;
        });
        setEleveSelectionne((prev) => (prev === id ? null : prev));
    }, []);

    /** Sélectionne un élève pour la saisie. */
    const selectionnerEleve = useCallback((id) => {
        setEleveSelectionne(id);
    }, []);

    /**
     * Enregistre la réponse d'un élève à un item.
     * @param {string}      eleveId - id de l'élève
     * @param {string}      itemId  - ex. "AE-03"
     * @param {string|null} niveau  - valeur de NIVEAUX ou null (effacement)
     */
    const setResultat = useCallback((eleveId, itemId, niveau) => {
        setResultats((prev) => ({
            ...prev,
            [eleveId]: { ...prev[eleveId], [itemId]: niveau },
        }));
    }, []);

    /**
     * Calcule les synthèses pour chaque élève dont la saisie est au moins partielle.
     *
     * Logique fondée sur RF-M4-08 (fiche S6, « Décisions pédagogiques ») :
     *   - necessiteAccompagnement : PAS_ENCORE sur au moins 1 des items critères (AE-03, AE-04, AE-06)
     *   - tuteurPotentiel         : OUI sur les 6 items
     */
    const syntheses = useMemo(() => {
        return eleves.map((eleve) => {
            const res = resultats[eleve.id] ?? {};
            const valeurs = Object.values(res);

            const saisieComplete =
                valeurs.length === ITEMS_AUTOEVAL.length &&
                valeurs.every((v) => v !== null);

            const necessiteAccompagnement = ITEMS_CRITERES_VERS_S3.some(
                (itemId) => res[itemId] === NIVEAUX.PAS_ENCORE
            );

            const tuteurPotentiel =
                saisieComplete &&
                ITEMS_AUTOEVAL.every((item) => res[item.id] === NIVEAUX.OUI);

            return {
                eleve,
                necessiteAccompagnement,
                tuteurPotentiel,
                saisieComplete,
            };
        });
    }, [eleves, resultats]);

    /**
     * Alerte collective — RF-M4-09.
     *
     * ⚠ Approximation documentée : les items de la grille d'auto-éval n'ont pas
     * de granularité par fraction. "Hésitation sur 1/5 et 1/10" est détecté via
     * l'item AE-03 ("Je connais les 7 fractions du CE1") qui est le seul item
     * couvrant ces deux fractions. Si une majorité d'élèves a PAS_ENCORE ou
     * EN_COURS sur AE-03, l'alerte est déclenchée.
     * Source approximation : fiche S6, « Décisions pédagogiques ».
     */
    const alerteCollective = useMemo(() => {
        const elevesAvecSaisie = eleves.filter((e) => {
            const res = resultats[e.id] ?? {};
            return res["AE-03"] !== null && res["AE-03"] !== undefined;
        });
        if (elevesAvecSaisie.length === 0) return false;

        const nbHesitants = elevesAvecSaisie.filter((e) => {
            const niveau = resultats[e.id]?.["AE-03"];
            return niveau === NIVEAUX.PAS_ENCORE || niveau === NIVEAUX.EN_COURS;
        }).length;

        return nbHesitants >= seuilAlerteCollective(elevesAvecSaisie.length);
    }, [eleves, resultats]);

    const nbElevesComplets = useMemo(
        () => syntheses.filter((s) => s.saisieComplete).length,
        [syntheses]
    );

    const reinitialiser = useCallback(() => {
        setEleves([]);
        setResultats({});
        setEleveSelectionne(null);
        setCompteur(0);
    }, []);

    return {
        eleves,
        resultats,
        eleveSelectionne,
        ajouterEleve,
        supprimerEleve,
        selectionnerEleve,
        setResultat,
        syntheses,
        alerteCollective,
        nbElevesComplets,
        reinitialiser,
    };
}
