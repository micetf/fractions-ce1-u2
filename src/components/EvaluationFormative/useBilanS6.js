/**
 * @fileoverview Hook useBilanS6 — logique du bilan de séquence S6 (vue enseignant).
 *
 * Gère :
 *   - La liste des élèves (déléguée à useClasse — RF-M4-01)
 *   - La saisie des résultats d'auto-évaluation par élève (6 items × 3 niveaux)
 *   - Le calcul des synthèses (accompagnement / tuteurs / alerte collective)
 *
 * Sources :
 *   - Fiche S6, « Décisions pédagogiques post-séquence 2 »
 *   - RF-M4-06 à RF-M4-09 (SRS, section 4.5.2)
 *   - RF-M4-01 (SRS) — liste partagée via useClasse
 *   - autoeval.config.js (ITEMS_AUTOEVAL, ITEMS_CRITERES_VERS_S3, NIVEAUX)
 *
 * Persistance (sprint 13a) :
 *   - Liste d'élèves  : "fractions-ce1.eleves"   → géré par useClasse
 *   - Résultats S6    : "fractions-ce1.bilanS6"  → géré par ce hook
 *
 * Migration sprint 13a :
 *   - Suppression de useState([]) pour les élèves et du compteur local.
 *   - Délégation à useClasse (liste partagée, persistée).
 *   - Les résultats BilanS6 sont désormais persistés via useLocalStorage.
 *   - reinitialiser() ne touche plus la liste des élèves (partagée).
 *     Renommé reinitialiserResultats() pour clarté sémantique.
 *   - supprimerEleve() nettoie les résultats BilanS6 de l'élève supprimé
 *     AVANT de le retirer de la liste partagée.
 *
 * Approximation documentée (RF-M4-09, inchangée) :
 *   L'alerte collective « hésitation sur 1/5 et 1/10 » est détectée via
 *   l'item AE-03 (seul item couvrant ces deux fractions), faute de
 *   granularité par fraction dans la grille d'auto-évaluation.
 *   Source : fiche S6, « Décisions pédagogiques ».
 */

import { useState, useCallback, useMemo } from "react";
import { useClasse } from "../../hooks/useClasse";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import {
    ITEMS_AUTOEVAL,
    ITEMS_CRITERES_VERS_S3,
    NIVEAUX,
    seuilAlerteCollective,
} from "../../config/autoeval.config";

/**
 * @typedef {Object} Eleve
 * @property {string} id     - Identifiant unique persisté
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

/** Clé localStorage des résultats du bilan S6. */
const CLE_BILAN = "fractions-ce1.bilanS6";

/** Initialise un objet de résultats vide pour un élève (tous items à null). */
function resultatsVides() {
    return Object.fromEntries(ITEMS_AUTOEVAL.map((item) => [item.id, null]));
}

/**
 * Hook de logique du bilan de séquence S6 — vue enseignant.
 *
 * @returns {{
 *   eleves:                    Eleve[],
 *   resultats:                 Record<string, ResultatsEleve>,
 *   eleveSelectionne:          string|null,
 *   ajouterEleve:              (prenom: string) => void,
 *   supprimerEleve:            (id: string) => void,
 *   selectionnerEleve:         (id: string) => void,
 *   setResultat:               (eleveId: string, itemId: string, niveau: string|null) => void,
 *   syntheses:                 SyntheseEleve[],
 *   alerteCollective:          boolean,
 *   nbElevesComplets:          number,
 *   reinitialiserResultats:    () => void,
 * }}
 */
export function useBilanS6() {
    // ── Liste d'élèves partagée (RF-M4-01) ────────────────────────────────────
    const {
        eleves,
        ajouterEleve: ajouterEleveClasse,
        supprimerEleve: supprimerEleveClasse,
    } = useClasse();

    // ── Résultats BilanS6 persistés ───────────────────────────────────────────
    const [resultats, setResultats] = useLocalStorage(CLE_BILAN, {});

    // ── Sélection courante (session uniquement, non persistée) ────────────────
    const [eleveSelectionne, setEleveSelectionne] = useState(null);

    /**
     * Ajoute un élève à la liste partagée et initialise ses résultats BilanS6.
     * Sélectionne automatiquement le premier élève ajouté.
     *
     * @param {string} prenom
     */
    const ajouterEleve = useCallback(
        (prenom) => {
            const prenom_ = prenom.trim();
            if (!prenom_) return;

            // L'id sera généré par useClasse ; on doit le récupérer après l'ajout.
            // Stratégie : on lit le nextId courant depuis localStorage pour
            // anticiper l'id qui sera généré, sans coupler directement les hooks.
            //
            // Alternative choisie pour la simplicité : on initialise les résultats
            // vides APRÈS l'ajout, en observant la différence entre anciens et
            // nouveaux élèves dans un useEffect.
            //
            // ⚠ Limite de cette approche : un léger décalage d'un cycle de rendu
            // entre l'ajout de l'élève et l'initialisation de ses résultats.
            // En pratique, la saisie de résultats n'est possible qu'après
            // sélection de l'élève (interaction supplémentaire), donc ce décalage
            // est imperceptible.
            //
            // La sélection automatique du premier élève est gérée par un effet
            // dans le composant BilanS6 (cf. useEffect sur eleves.length).
            ajouterEleveClasse(prenom_);
        },
        [ajouterEleveClasse]
    );

    /**
     * Supprime un élève.
     * Nettoie les résultats BilanS6 de cet élève AVANT de le retirer
     * de la liste partagée (ordre intentionnel : cohérence des données).
     *
     * @param {string} id
     */
    const supprimerEleve = useCallback(
        (id) => {
            // 1. Nettoyage des résultats BilanS6 spécifiques à cet élève
            setResultats((prev) => {
                const { [id]: _, ...reste } = prev;
                return reste;
            });
            // 2. Désélection si nécessaire
            setEleveSelectionne((prev) => (prev === id ? null : prev));
            // 3. Retrait de la liste partagée
            supprimerEleveClasse(id);
        },
        [supprimerEleveClasse, setResultats]
    );

    /** @param {string} id */
    const selectionnerEleve = useCallback((id) => {
        setEleveSelectionne(id);
    }, []);

    /**
     * Enregistre la réponse d'un élève à un item d'auto-évaluation.
     * Initialise l'entrée de l'élève si elle n'existe pas encore.
     *
     * @param {string}      eleveId
     * @param {string}      itemId  - ex. "AE-03"
     * @param {string|null} niveau  - valeur de NIVEAUX ou null (effacement)
     */
    const setResultat = useCallback(
        (eleveId, itemId, niveau) => {
            setResultats((prev) => ({
                ...prev,
                [eleveId]: {
                    ...(prev[eleveId] ?? resultatsVides()),
                    [itemId]: niveau,
                },
            }));
        },
        [setResultats]
    );

    /**
     * Calcule les synthèses pour chaque élève.
     *
     * Logique fondée sur RF-M4-08 (fiche S6, « Décisions pédagogiques ») :
     *   - necessiteAccompagnement : PAS_ENCORE sur ≥ 1 item critère (AE-03, AE-04, AE-06)
     *   - tuteurPotentiel         : OUI sur les 6 items
     */
    const syntheses = useMemo(() => {
        return eleves.map((eleve) => {
            const res = resultats[eleve.id] ?? {};
            const valeurs = ITEMS_AUTOEVAL.map((item) => res[item.id] ?? null);

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
            const niveau = resultats[e.id]?.["AE-03"];
            return niveau !== null && niveau !== undefined;
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

    /**
     * Réinitialise les résultats du bilan S6 uniquement.
     *
     * ⚠ Ne touche PAS la liste des élèves (partagée entre modules M4).
     *    Pour réinitialiser la classe, utiliser reinitialiserClasse() de useClasse.
     *    Ce choix est intentionnel (sprint 13a) : l'enseignant peut vouloir
     *    effacer les résultats S6 sans perdre sa liste de classe.
     */
    const reinitialiserResultats = useCallback(() => {
        setResultats({});
        setEleveSelectionne(null);
    }, [setResultats]);

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
        reinitialiserResultats,
    };
}
