/**
 * @fileoverview SyntheseBilan — vue synthétique post-séquence pour l'enseignant.
 *
 * Affiche pour chaque élève :
 *   - Le statut de saisie (complet / partiel)
 *   - L'identification automatique des élèves nécessitant un accompagnement
 *     avant S3 (PAS_ENCORE sur items 3, 4 ou 6)
 *   - L'identification des tuteurs potentiels (OUI sur tous les items)
 *
 * Source : RF-M4-08 (SRS) — fiche S6, « Décisions pédagogiques post-séquence 2 ».
 *
 * @module SyntheseBilan
 */

import PropTypes from "prop-types";
import {
    ITEMS_AUTOEVAL,
    NIVEAUX,
    LIBELLES_NIVEAUX,
} from "../../config/autoeval.config";

/** Pastille de niveau (cellule du tableau de synthèse). */
function PastilleNiveau({ niveau }) {
    if (niveau === null || niveau === undefined) {
        return (
            <span
                className="inline-block w-5 h-5 rounded-full bg-slate-100
        border border-slate-200"
                title="Non renseigné"
            />
        );
    }
    const classes = {
        [NIVEAUX.OUI]: "bg-emerald-400 text-white",
        [NIVEAUX.EN_COURS]: "bg-amber-400 text-white",
        [NIVEAUX.PAS_ENCORE]: "bg-rose-400 text-white",
    };
    const symboles = {
        [NIVEAUX.OUI]: "✓",
        [NIVEAUX.EN_COURS]: "~",
        [NIVEAUX.PAS_ENCORE]: "✗",
    };
    return (
        <span
            className={`inline-flex items-center justify-center w-5 h-5 rounded-full
        text-xs font-bold ${classes[niveau]}`}
            title={LIBELLES_NIVEAUX[niveau]}
        >
            {symboles[niveau]}
        </span>
    );
}

PastilleNiveau.propTypes = {
    niveau: PropTypes.string,
};

// ── Composant principal ───────────────────────────────────────────────────────

/**
 * @param {Object}   props
 * @param {Array}    props.syntheses          - Tableau de SyntheseEleve (hook useBilanS6)
 * @param {Object}   props.resultats          - Record<eleveId, Record<itemId, NIVEAUX|null>>
 * @param {Function} props.onSelectionnerEleve - (id: string) => void — pour aller saisir
 */
export default function SyntheseBilan({
    syntheses,
    resultats,
    onSelectionnerEleve,
}) {
    if (syntheses.length === 0) {
        return (
            <p className="text-sm text-slate-400 italic text-center py-8">
                Ajoutez des élèves dans le panneau gauche pour afficher la
                synthèse.
            </p>
        );
    }

    const elevesAccompagnement = syntheses.filter(
        (s) => s.necessiteAccompagnement
    );
    const elevesTuteurs = syntheses.filter((s) => s.tuteurPotentiel);

    return (
        <div className="space-y-6">
            {/* ── Compteurs décisionnels ── */}
            <div className="grid grid-cols-2 gap-3">
                <div
                    className={[
                        "rounded-xl border p-3 text-center",
                        elevesAccompagnement.length > 0
                            ? "bg-amber-50 border-amber-200"
                            : "bg-slate-50 border-slate-200",
                    ].join(" ")}
                >
                    <p className="text-2xl font-bold text-amber-600">
                        {elevesAccompagnement.length}
                    </p>
                    <p className="text-xs text-slate-600 mt-1 leading-snug">
                        élève{elevesAccompagnement.length > 1 ? "s" : ""}{" "}
                        nécessitant un accompagnement avant S3
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                        (PAS_ENCORE sur items 3, 4 ou 6)
                    </p>
                </div>
                <div
                    className={[
                        "rounded-xl border p-3 text-center",
                        elevesTuteurs.length > 0
                            ? "bg-emerald-50 border-emerald-200"
                            : "bg-slate-50 border-slate-200",
                    ].join(" ")}
                >
                    <p className="text-2xl font-bold text-emerald-600">
                        {elevesTuteurs.length}
                    </p>
                    <p className="text-xs text-slate-600 mt-1 leading-snug">
                        tuteur{elevesTuteurs.length > 1 ? "s" : ""} potentiel
                        {elevesTuteurs.length > 1 ? "s" : ""} en S3
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                        (OUI sur les 6 items)
                    </p>
                </div>
            </div>

            {/* ── Tableau de synthèse ── */}
            <div className="overflow-x-auto">
                <table className="w-full text-xs border-collapse">
                    <thead>
                        <tr className="bg-slate-100">
                            <th
                                className="text-left px-3 py-2 font-semibold text-slate-600
                rounded-tl-lg border-b border-slate-200"
                            >
                                Élève
                            </th>
                            {ITEMS_AUTOEVAL.map((item) => (
                                <th
                                    key={item.id}
                                    className={[
                                        "px-2 py-2 text-center font-semibold border-b border-slate-200",
                                        item.critereVersS3
                                            ? "text-amber-700 bg-amber-100"
                                            : "text-slate-500",
                                    ].join(" ")}
                                    title={item.libelle}
                                >
                                    {item.numero}
                                    {item.critereVersS3 && (
                                        <span className="ml-0.5 text-amber-500">
                                            *
                                        </span>
                                    )}
                                </th>
                            ))}
                            <th
                                className="px-2 py-2 text-center font-semibold text-slate-500
                border-b border-slate-200 rounded-tr-lg"
                            >
                                Statut
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {syntheses.map(
                            ({
                                eleve,
                                necessiteAccompagnement,
                                tuteurPotentiel,
                                saisieComplete,
                            }) => {
                                const res = resultats[eleve.id] ?? {};
                                return (
                                    <tr
                                        key={eleve.id}
                                        onClick={() =>
                                            onSelectionnerEleve(eleve.id)
                                        }
                                        className={[
                                            "border-b border-slate-100 cursor-pointer transition-colors",
                                            necessiteAccompagnement
                                                ? "hover:bg-amber-50"
                                                : tuteurPotentiel
                                                  ? "hover:bg-emerald-50"
                                                  : "hover:bg-slate-50",
                                        ].join(" ")}
                                        title="Cliquer pour saisir / modifier"
                                    >
                                        <td className="px-3 py-2">
                                            <span className="font-medium text-slate-700">
                                                {eleve.prenom}
                                            </span>
                                            {necessiteAccompagnement && (
                                                <span
                                                    className="ml-1 text-xs text-amber-600"
                                                    title="Accompagnement avant S3"
                                                >
                                                    ⚠
                                                </span>
                                            )}
                                            {tuteurPotentiel && (
                                                <span
                                                    className="ml-1 text-xs text-emerald-600"
                                                    title="Tuteur potentiel S3"
                                                >
                                                    ★
                                                </span>
                                            )}
                                        </td>
                                        {ITEMS_AUTOEVAL.map((item) => (
                                            <td
                                                key={item.id}
                                                className="px-2 py-2 text-center"
                                            >
                                                <PastilleNiveau
                                                    niveau={
                                                        res[item.id] ?? null
                                                    }
                                                />
                                            </td>
                                        ))}
                                        <td className="px-2 py-2 text-center">
                                            {saisieComplete ? (
                                                <span className="text-emerald-600 font-semibold">
                                                    ✓
                                                </span>
                                            ) : (
                                                <span className="text-slate-300">
                                                    …
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            }
                        )}
                    </tbody>
                </table>
            </div>

            {/* ── Légende ── */}
            <div className="flex flex-wrap gap-3 text-xs text-slate-500">
                <span>Légende colonnes :</span>
                <span className="font-semibold text-amber-700">
                    * = item critère vers S3
                </span>
                <span className="text-slate-400">|</span>
                <span>⚠ = accompagnement</span>
                <span>★ = tuteur potentiel</span>
                <span className="text-slate-400">|</span>
                <span>Cliquer sur un élève pour modifier sa saisie.</span>
            </div>
        </div>
    );
}

SyntheseBilan.propTypes = {
    syntheses: PropTypes.arrayOf(
        PropTypes.shape({
            eleve: PropTypes.shape({
                id: PropTypes.string.isRequired,
                prenom: PropTypes.string.isRequired,
            }).isRequired,
            necessiteAccompagnement: PropTypes.bool.isRequired,
            tuteurPotentiel: PropTypes.bool.isRequired,
            saisieComplete: PropTypes.bool.isRequired,
        })
    ).isRequired,
    resultats: PropTypes.object.isRequired,
    onSelectionnerEleve: PropTypes.func.isRequired,
};
