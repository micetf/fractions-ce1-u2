/**
 * @fileoverview ModuleM4 — conteneur du module M4, deux onglets.
 *
 * Expose les deux volets du module M4 :
 *   - Onglet « Observables S1–S6 » : RF-M4-01 à RF-M4-05 (sprint 13b)
 *   - Onglet « Bilan S6 »          : RF-M4-06 à RF-M4-09 (sprint 11)
 *
 * Les deux onglets partagent la même liste d'élèves (useClasse — RF-M4-01).
 *
 * Ce composant remplace le <BilanS6 /> branché directement dans App.jsx.
 * App.jsx rend désormais <ModuleM4 /> pour la vue EVALUATION.
 *
 * @module components/EvaluationFormative/ModuleM4
 */

import { useState } from "react";
import ObservablesFormatifs from "./ObservablesFormatifs";
import BilanS6 from "./BilanS6";

/** @type {('observables'|'bilan')} */
const ONGLETS = { OBSERVABLES: "observables", BILAN: "bilan" };

/**
 * Conteneur du module M4.
 *
 * @returns {JSX.Element}
 */
export default function ModuleM4() {
    const [onglet, setOnglet] = useState(ONGLETS.OBSERVABLES);

    return (
        <div className="space-y-4">
            {/* ── Sélecteur de volet M4 ── */}
            <div className="flex gap-2 bg-slate-100 rounded-xl p-1 w-fit">
                {[
                    { id: ONGLETS.OBSERVABLES, label: "Observables S1–S6" },
                    { id: ONGLETS.BILAN, label: "Bilan S6" },
                ].map(({ id, label }) => (
                    <button
                        key={id}
                        type="button"
                        onClick={() => setOnglet(id)}
                        className={[
                            "px-4 py-2 rounded-lg text-sm font-semibold transition-colors",
                            onglet === id
                                ? "bg-white text-slate-800 shadow-sm"
                                : "text-slate-500 hover:text-slate-700",
                        ].join(" ")}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {/* ── Corps ── */}
            {onglet === ONGLETS.OBSERVABLES ? (
                <ObservablesFormatifs />
            ) : (
                <BilanS6 />
            )}
        </div>
    );
}
