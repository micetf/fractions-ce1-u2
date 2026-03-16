/**
 * @fileoverview ModelageInteractif — conteneur du module M1.
 *
 * Dispatche vers le modelage de chaque séance.
 * Sélecteur de séance commun à toutes les vues de M1.
 *
 * Séances du module M1 :
 *   S1 : 1/2, 1/4, 1/8 — carré, rectangle, disque, éventail — sprint 5 ✅
 *   S3 : 1/3, 1/6 — disques, hexagones                       — sprint 6 ✅
 *   S4 : 1/5, 1/10 — bande-répertoire                        — sprint 7 ✅
 *   S5 : répertoire complet — triplets représentationnels     — sprint 8 ✅
 *
 * Sprint RNF-02 :
 *   Ajout du mode plein écran (RF-M1-01, RNF-02).
 *   - useRef sur le conteneur + useFullscreen (Fullscreen API).
 *   - Bouton bascule plein écran / normal.
 *   - En plein écran : fond blanc, modeProjection={true} transmis aux sous-composants
 *     pour agrandir les SVG (lisibilité à 4 m sur TBI 1280×800 — RNF-02).
 */

import { useState, useRef } from "react";
import PropTypes from "prop-types";
import { useFullscreen } from "../../hooks/useFullscreen";
import ModelageS1 from "./ModelageS1";
import ModelageS3 from "./ModelageS3";
import ModelageS4 from "./ModelageS4";
import ModelageS5 from "./ModelageS5";

/** @type {Array<{ id: string, label: string, fractions: string, implemente: boolean }>} */
const SEANCES_M1 = [
    {
        id: "S1",
        label: "Séance 1",
        fractions: "1/2, 1/4, 1/8",
        implemente: true,
    },
    { id: "S3", label: "Séance 3", fractions: "1/3, 1/6", implemente: true },
    { id: "S4", label: "Séance 4", fractions: "1/5, 1/10", implemente: true },
    {
        id: "S5",
        label: "Séance 5",
        fractions: "Répertoire complet",
        implemente: true,
    },
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
            <span aria-hidden="true">{estPleinEcran ? "⛶" : "⛶"}</span>
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

    // Ref sur le conteneur — transmise à useFullscreen pour requestFullscreen()
    const containerRef = useRef(null);
    const { estPleinEcran, basculerPleinEcran } = useFullscreen(containerRef);

    /**
     * En plein écran, modeProjection=true est transmis aux sous-composants.
     * Chaque sous-composant agrandit ses SVG (taille doublée environ)
     * pour assurer la lisibilité à 4 m sur TBI 1280×800 (RNF-02).
     */
    const modeProjection = estPleinEcran;

    const seance = SEANCES_M1.find((s) => s.id === seanceActive);

    return (
        <div
            ref={containerRef}
            className={[
                "space-y-4",
                // En plein écran : fond blanc, padding confortable, overflow géré
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
                            disabled={!s.implemente}
                            title={!s.implemente ? `Non disponible` : undefined}
                            className={[
                                "px-3 py-2 rounded-xl text-sm font-semibold transition-colors",
                                seanceActive === s.id && s.implemente
                                    ? "bg-blue-600 text-white shadow-sm"
                                    : s.implemente
                                      ? "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                      : "bg-slate-50 text-slate-300 cursor-not-allowed",
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
            {seance?.implemente ? (
                seanceActive === "S1" ? (
                    <ModelageS1 modeProjection={modeProjection} />
                ) : seanceActive === "S3" ? (
                    <ModelageS3 modeProjection={modeProjection} />
                ) : seanceActive === "S4" ? (
                    <ModelageS4 modeProjection={modeProjection} />
                ) : seanceActive === "S5" ? (
                    <ModelageS5 modeProjection={modeProjection} />
                ) : null
            ) : null}
        </div>
    );
}
