/**
 * @fileoverview GestionClasse — panneau de gestion de la liste des élèves.
 *
 * Permet à l'enseignant de saisir les prénoms des élèves dont il veut
 * enregistrer l'auto-évaluation du bilan de séquence.
 *
 * Source : RF-M4-01 (SRS) — « L'enseignant peut saisir une liste d'élèves
 * (classe virtuelle). Cette liste est réutilisée pour toutes les séances. »
 *
 * Note : RF-M4-01 est pleinement traité en sprint 12 (persistance inter-séances).
 * Ce composant assure la saisie en mémoire pour le bilan S6.
 */

import { useState } from "react";
import PropTypes from "prop-types";

/**
 * @param {Object}   props
 * @param {Array}    props.eleves             - Liste d'élèves actuels
 * @param {string|null} props.eleveSelectionne - Id de l'élève sélectionné
 * @param {Function} props.onAjouter          - (prenom: string) => void
 * @param {Function} props.onSupprimer        - (id: string) => void
 * @param {Function} props.onSelectionner     - (id: string) => void
 * @param {Function} props.onReinitialiser    - () => void
 */
export default function GestionClasse({
    eleves,
    eleveSelectionne,
    onAjouter,
    onSupprimer,
    onSelectionner,
    onReinitialiser,
}) {
    const [saisie, setSaisie] = useState("");

    function handleAjouter() {
        if (!saisie.trim()) return;
        onAjouter(saisie.trim());
        setSaisie("");
    }

    function handleKeyDown(e) {
        if (e.key === "Enter") handleAjouter();
    }

    return (
        <div className="space-y-4">
            {/* ── Titre ── */}
            <div>
                <h3 className="font-semibold text-slate-700 text-sm">
                    Liste de la classe
                </h3>
                <p className="text-xs text-slate-400">
                    Saisissez les prénoms des élèves pour enregistrer leurs
                    auto-évaluations.
                </p>
            </div>

            {/* ── Saisie d'un prénom ── */}
            <div className="flex gap-2">
                <input
                    type="text"
                    value={saisie}
                    onChange={(e) => setSaisie(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Prénom de l'élève…"
                    maxLength={40}
                    className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-lg
            focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent
            placeholder:text-slate-300"
                    aria-label="Saisir le prénom d'un élève"
                />
                <button
                    type="button"
                    onClick={handleAjouter}
                    disabled={!saisie.trim()}
                    className={[
                        "px-3 py-2 rounded-lg text-sm font-semibold transition-colors",
                        saisie.trim()
                            ? "bg-blue-600 text-white hover:bg-blue-700"
                            : "bg-slate-100 text-slate-300 cursor-not-allowed",
                    ].join(" ")}
                    aria-label="Ajouter l'élève"
                >
                    + Ajouter
                </button>
            </div>

            {/* ── Liste des élèves ── */}
            {eleves.length === 0 ? (
                <p className="text-xs text-slate-400 italic text-center py-4">
                    Aucun élève — ajoutez les prénoms ci-dessus.
                </p>
            ) : (
                <ul className="space-y-1 max-h-64 overflow-y-auto">
                    {eleves.map((eleve) => (
                        <li
                            key={eleve.id}
                            className={[
                                "flex items-center justify-between gap-2 px-3 py-2 rounded-lg",
                                "border text-sm cursor-pointer transition-colors select-none",
                                eleveSelectionne === eleve.id
                                    ? "bg-blue-50 border-blue-300 text-blue-800"
                                    : "bg-white border-slate-200 text-slate-700 hover:border-blue-200",
                            ].join(" ")}
                            onClick={() => onSelectionner(eleve.id)}
                        >
                            <span className="font-medium">{eleve.prenom}</span>
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onSupprimer(eleve.id);
                                }}
                                className="text-slate-300 hover:text-red-400 transition-colors text-base
                  leading-none"
                                aria-label={`Supprimer ${eleve.prenom}`}
                            >
                                ×
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            {/* ── Réinitialiser ── */}
            {eleves.length > 0 && (
                <button
                    type="button"
                    onClick={onReinitialiser}
                    className="w-full py-2 text-xs text-slate-400 hover:text-red-500
            border border-dashed border-slate-200 hover:border-red-300
            rounded-lg transition-colors"
                >
                    Réinitialiser toute la saisie
                </button>
            )}
        </div>
    );
}

GestionClasse.propTypes = {
    eleves: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            prenom: PropTypes.string.isRequired,
        })
    ).isRequired,
    eleveSelectionne: PropTypes.string,
    onAjouter: PropTypes.func.isRequired,
    onSupprimer: PropTypes.func.isRequired,
    onSelectionner: PropTypes.func.isRequired,
    onReinitialiser: PropTypes.func.isRequired,
};
