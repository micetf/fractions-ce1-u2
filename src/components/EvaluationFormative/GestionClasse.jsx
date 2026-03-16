/**
 * @fileoverview GestionClasse — panneau de gestion de la liste des élèves.
 *
 * Permet à l'enseignant de saisir les prénoms des élèves dont il veut
 * enregistrer les données (observables ou auto-évaluation).
 *
 * Source : RF-M4-01 (SRS) — « L'enseignant peut saisir une liste d'élèves
 * (classe virtuelle). Cette liste est réutilisée pour toutes les séances. »
 *
 * Correction sprint 13b :
 *   - onReinitialiser est optionnel ; le bouton est masqué si la prop est absente.
 *   - Le bouton d'ajout est remplacé par une icône « + » compacte (taille fixe)
 *     pour ne pas comprimer l'input dans le panneau 280 px.
 */

import { useState } from "react";
import PropTypes from "prop-types";

/**
 * @param {Object}      props
 * @param {Array}       props.eleves              - Liste d'élèves actuels
 * @param {string|null} props.eleveSelectionne    - Id de l'élève sélectionné
 * @param {Function}    props.onAjouter           - (prenom: string) => void
 * @param {Function}    props.onSupprimer         - (id: string) => void
 * @param {Function}    props.onSelectionner      - (id: string) => void
 * @param {Function}    [props.onReinitialiser]   - () => void — optionnel
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
                    Saisissez les prénoms des élèves.
                </p>
            </div>

            {/* ── Saisie d'un prénom ── */}
            <div className="flex gap-1.5">
                <input
                    type="text"
                    value={saisie}
                    onChange={(e) => setSaisie(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Prénom…"
                    maxLength={40}
                    className="flex-1 min-w-0 px-3 py-2 text-sm border border-slate-300
                        rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400
                        focus:border-transparent placeholder:text-slate-300"
                    aria-label="Saisir le prénom d'un élève"
                />
                <button
                    type="button"
                    onClick={handleAjouter}
                    disabled={!saisie.trim()}
                    aria-label="Ajouter l'élève"
                    className={[
                        "shrink-0 w-9 h-9 rounded-lg text-lg font-bold leading-none",
                        "flex items-center justify-center transition-colors",
                        saisie.trim()
                            ? "bg-blue-600 text-white hover:bg-blue-700"
                            : "bg-slate-100 text-slate-300 cursor-not-allowed",
                    ].join(" ")}
                >
                    +
                </button>
            </div>

            {/* ── Liste des élèves ── */}
            {eleves.length === 0 ? (
                <p
                    className="text-xs text-slate-400 text-center py-4 border
                    border-dashed border-slate-200 rounded-lg"
                >
                    Aucun élève dans la liste.
                </p>
            ) : (
                <ul className="space-y-1 max-h-64 overflow-y-auto">
                    {eleves.map((eleve) => (
                        <li
                            key={eleve.id}
                            className={[
                                "flex items-center justify-between gap-2 px-3 py-2",
                                "rounded-lg border text-sm cursor-pointer transition-colors",
                                "select-none",
                                eleveSelectionne === eleve.id
                                    ? "bg-blue-50 border-blue-300 text-blue-800"
                                    : "bg-white border-slate-200 text-slate-700 hover:border-blue-200",
                            ].join(" ")}
                            onClick={() => onSelectionner(eleve.id)}
                        >
                            <span className="font-medium truncate">
                                {eleve.prenom}
                            </span>
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onSupprimer(eleve.id);
                                }}
                                className="shrink-0 text-slate-300 hover:text-red-400
                                    transition-colors text-base leading-none"
                                aria-label={`Supprimer ${eleve.prenom}`}
                            >
                                ×
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            {/* ── Réinitialiser — rendu uniquement si la prop est fournie ── */}
            {onReinitialiser && eleves.length > 0 && (
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
    onReinitialiser: PropTypes.func,
};

GestionClasse.defaultProps = {
    eleveSelectionne: null,
    onReinitialiser: undefined,
};
