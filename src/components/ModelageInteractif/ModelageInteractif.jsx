/**
 * @fileoverview ModelageInteractif — conteneur du module M1.
 *
 * Dispatche vers le modelage de chaque séance (S1, S3, S4, S5).
 * Sélecteur de séance et bouton plein écran communs à toutes les vues.
 *
 * Sources : RF-M1-01 à RF-M1-04, RNF-02 (SRS)
 */

import { useState, useRef } from "react";
import PropTypes from "prop-types";
import { useFullscreen } from "../../hooks/useFullscreen";
import ModelageS1 from "./ModelageS1";
import ModelageS3 from "./ModelageS3";
import ModelageS4 from "./ModelageS4";
import ModelageS5 from "./ModelageS5";

/**
 * Séances disponibles dans le module M1.
 * S2 et S6 n'ont pas de composante modelage (SRS, RF-M1-02).
 *
 * @type {Array<{ id: string, label: string, fractions: string }>}
 */
const SEANCES_M1 = [
    { id: "S1", label: "Séance 1", fractions: "1/2, 1/4, 1/8" },
    { id: "S3", label: "Séance 3", fractions: "1/3, 1/6" },
    { id: "S4", label: "Séance 4", fractions: "1/5, 1/10" },
    { id: "S5", label: "Séance 5", fractions: "Répertoire complet" },
];

/**
 * Bouton de bascule plein écran.
 *
 * @param {Object}   props
 * @param {boolean}  props.estPleinEcran
 * @param {Function} props.onClick
 */
function BoutonPleinEcran({ estPleinEcran, onClick }) {
    return (
        <button
            type="button"
            onClick={onClick}
            title={
                estPleinEcran
                    ? "Quitter le plein écran"
                    : "Mode projection (plein écran)"
            }
            aria-label={
                estPleinEcran
                    ? "Quitter le plein écran"
                    : "Mode projection plein écran"
            }
            className={[
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold",
                "transition-colors border",
                estPleinEcran
                    ? "bg-slate-800 text-white border-slate-700 hover:bg-slate-700"
                    : "bg-white text-slate-600 border-slate-300 hover:bg-slate-50",
            ].join(" ")}
        >
            <span aria-hidden="true">⛶</span>
            {estPleinEcran ? "Quitter" : "Projection"}
        </button>
    );
}

BoutonPleinEcran.propTypes = {
    estPleinEcran: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired,
};

// ─────────────────────────────────────────────────────────────────────────────

/**
 * Module M1 — Modelage interactif.
 *
 * @returns {JSX.Element}
 */
export default function ModelageInteractif() {
    const [seanceActive, setSeanceActive] = useState("S1");

    const containerRef = useRef(null);
    const { estPleinEcran, basculerPleinEcran } = useFullscreen(containerRef);
    const modeProjection = estPleinEcran;

    return (
        <div
            ref={containerRef}
            className={[
                "space-y-4",
                modeProjection ? "bg-white p-8 min-h-screen overflow-auto" : "",
            ].join(" ")}
        >
            {/* ── Barre de contrôles ── */}
            <div className="flex flex-wrap items-center justify-between gap-3">
                {/* Sélecteur de séance */}
                <div className="flex flex-wrap gap-2">
                    {SEANCES_M1.map((s) => (
                        <button
                            key={s.id}
                            type="button"
                            onClick={() => setSeanceActive(s.id)}
                            className={[
                                "px-3 py-2 rounded-xl text-sm font-semibold transition-colors",
                                seanceActive === s.id
                                    ? "bg-blue-600 text-white shadow-sm"
                                    : "bg-slate-100 text-slate-600 hover:bg-slate-200",
                            ].join(" ")}
                        >
                            <span>{s.label}</span>
                            <span className="ml-1.5 text-xs font-normal opacity-70">
                                {s.fractions}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Bouton plein écran RF-M1-01 */}
                <BoutonPleinEcran
                    estPleinEcran={modeProjection}
                    onClick={basculerPleinEcran}
                />
            </div>

            {/* ── Contenu de la séance ── */}
            {seanceActive === "S1" && (
                <ModelageS1 modeProjection={modeProjection} />
            )}
            {seanceActive === "S3" && (
                <ModelageS3 modeProjection={modeProjection} />
            )}
            {seanceActive === "S4" && (
                <ModelageS4 modeProjection={modeProjection} />
            )}
            {seanceActive === "S5" && (
                <ModelageS5 modeProjection={modeProjection} />
            )}
        </div>
    );
}
