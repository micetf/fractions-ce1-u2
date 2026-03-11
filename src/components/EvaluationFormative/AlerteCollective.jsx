/**
 * @fileoverview AlerteCollective — bandeau d'alerte collective pour l'enseignant.
 *
 * Affiché quand une majorité d'élèves hésite sur les items liés à 1/5 et 1/10.
 *
 * Source : RF-M4-09 (SRS) — fiche S6, « Décisions pédagogiques post-séquence 2 ».
 * Formulation exacte : « Prévoir rappel de 5 min en entrée de S3 ».
 *
 * ⚠ Approximation documentée : la détection repose sur l'item AE-03
 *   (« Je connais les 7 fractions du CE1 ») et non sur une granularité
 *   par fraction individuelle, non disponible dans la grille d'auto-évaluation.
 *   Voir useBilanS6.js, section alerteCollective.
 */

import PropTypes from "prop-types";
import { MESSAGE_ALERTE_S6 } from "../../config/autoeval.config";

/**
 * @param {Object}  props
 * @param {boolean} props.visible - Afficher ou masquer le bandeau
 */
export default function AlerteCollective({ visible }) {
    if (!visible) return null;

    return (
        <div
            role="alert"
            className="flex items-start gap-3 bg-amber-50 border border-amber-300
        rounded-xl px-4 py-3 shadow-sm"
        >
            <span className="text-xl shrink-0 mt-0.5" aria-hidden="true">
                ⚠️
            </span>
            <div className="space-y-0.5">
                <p className="text-sm font-semibold text-amber-800">
                    Alerte collective — fractions 1/5 et 1/10
                </p>
                <p className="text-sm text-amber-700">{MESSAGE_ALERTE_S6}</p>
                <p className="text-xs text-amber-500 mt-1">
                    Détecté via l'item 3 de la grille (connaissance des 7
                    fractions du CE1). Source : fiche S6, décisions pédagogiques
                    post-séquence 2.
                </p>
            </div>
        </div>
    );
}

AlerteCollective.propTypes = {
    visible: PropTypes.bool.isRequired,
};
