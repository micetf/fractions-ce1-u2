/**
 * @fileoverview Composant BandeRepertoire — répertoire des 7 fractions unitaires CE1.
 *
 * Artefact de référence central de la séquence, construit progressivement
 * de S4 à S6 (RF-M3-01 à RF-M3-05).
 *
 * Comportement selon seanceDebloquee :
 *   ≤ 0  → aucune fraction visible
 *   1–2  → 3 fractions visibles : 1/2, 1/4, 1/8 (introduites en S1)
 *   3    → 5 fractions : + 1/3, 1/6 (introduites en S3)
 *   4    → 7 fractions complètes, sans colonne « chiffres »
 *   ≥ 5  → 7 fractions + colonne « chiffres » (ajout documenté en fiche S5 :
 *           « Mise à jour du répertoire »)
 *
 * La règle de comparaison (affichée en pied de tableau) est issue de la
 * fiche S4, section institutionnalisation :
 * « Plus le nombre de parts est grand, plus la fraction est petite. »
 *
 * @module BandeRepertoire
 */

import PropTypes from "prop-types";
import { FRACTIONS } from "../../config/fractions.config";
import FractionLigne from "../FractionLigne";

/**
 * Bande-répertoire interactive des fractions unitaires CE1.
 *
 * @param {Object}  props
 * @param {number}  props.seanceDebloquee  - Dernière séance conduite (1–6).
 *                                          Détermine quelles fractions sont visibles
 *                                          et si la colonne « chiffres » est affichée.
 * @param {boolean} [props.modeProjection] - Si true : taille et contrastes augmentés
 *                                          pour la projection TBI (RF-M1-01, RF-M3-05).
 * @returns {JSX.Element}
 */
export default function BandeRepertoire({
    seanceDebloquee,
    modeProjection = false,
}) {
    // La colonne « chiffres » est visible uniquement à partir de S5.
    // Source : fiche S5, section « Mise à jour du répertoire ».
    const afficherChiffres = seanceDebloquee >= 5;

    return (
        <div
            className={`w-full ${modeProjection ? "scale-110 origin-top" : ""}`}
        >
            {/* ── En-tête ─────────────────────────────────────────────────────── */}
            <div className="flex items-center justify-between mb-3 px-1">
                <h2
                    className={`font-bold text-slate-700 ${modeProjection ? "text-xl" : "text-base"}`}
                >
                    Répertoire des fractions
                </h2>
                <span className="text-xs text-slate-400 font-mono bg-slate-100 px-2 py-0.5 rounded">
                    S{seanceDebloquee}
                </span>
            </div>

            {/* ── Tableau ─────────────────────────────────────────────────────── */}
            <div className="overflow-x-auto rounded-lg border border-slate-200 shadow-sm">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-slate-700 text-white text-left">
                            <th
                                className={`py-2 px-3 text-center font-medium ${modeProjection ? "text-base" : "text-xs"} uppercase tracking-wide`}
                            >
                                Séance
                            </th>
                            <th
                                className={`py-2 px-4 font-medium ${modeProjection ? "text-base" : "text-xs"} uppercase tracking-wide`}
                            >
                                Nom en lettres
                            </th>
                            <th
                                className={`py-2 px-4 font-medium ${modeProjection ? "text-base" : "text-xs"} uppercase tracking-wide`}
                            >
                                {/* Colonne image — libellé de la fiche S4 */}
                                Image (bande)
                            </th>
                            {afficherChiffres && (
                                <th
                                    className={`py-2 px-4 text-center font-medium ${modeProjection ? "text-base" : "text-xs"} uppercase tracking-wide`}
                                >
                                    En chiffres
                                </th>
                            )}
                        </tr>
                    </thead>

                    <tbody className="bg-white">
                        {FRACTIONS.map((fraction) => (
                            <FractionLigne
                                key={fraction.id}
                                fraction={fraction}
                                visible={
                                    fraction.seanceIntro <= seanceDebloquee
                                }
                                afficherChiffres={afficherChiffres}
                            />
                        ))}
                    </tbody>
                </table>
            </div>

            {/* ── Règle de comparaison ────────────────────────────────────────── */}
            {/* Affichée dès que les 7 fractions sont visibles (S4+).             */}
            {/* Formulation exacte de la fiche S4, section institutionnalisation. */}
            {seanceDebloquee >= 4 && (
                <p
                    className={`mt-3 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg
          text-amber-800 ${modeProjection ? "text-base" : "text-sm"}`}
                >
                    <span className="font-semibold">Règle : </span>
                    Plus le nombre de parts est grand, plus la fraction est
                    petite.
                </p>
            )}
        </div>
    );
}

BandeRepertoire.propTypes = {
    seanceDebloquee: PropTypes.number.isRequired,
    modeProjection: PropTypes.bool,
};
