/**
 * @fileoverview ModelageInteractif — conteneur du module M1.
 *
 * Dispatche vers le modelage de chaque séance.
 * Sélecteur de séance commun à toutes les vues de M1.
 *
 * Séances du module M1 :
 *   S1 : 1/2, 1/4, 1/8 — carré, rectangle, disque, éventail — sprint 5 ✅
 *   S3 : 1/3, 1/6 — disques, hexagones                       — sprint 6
 *   S4 : 1/5, 1/10 — bande-répertoire                        — sprint 7
 *   S5 : répertoire complet — triplets représentationnels     — sprint 8
 */

import { useState } from "react";
import ModelageS1 from "./ModelageS1";

/** @type {Array<{ id: string, label: string, fractions: string, sprint: string, implemente: boolean }>} */
const SEANCES_M1 = [
    {
        id: "S1",
        label: "Séance 1",
        fractions: "1/2, 1/4, 1/8",
        sprint: "5",
        implemente: true,
    },
    {
        id: "S3",
        label: "Séance 3",
        fractions: "1/3, 1/6",
        sprint: "6",
        implemente: false,
    },
    {
        id: "S4",
        label: "Séance 4",
        fractions: "1/5, 1/10",
        sprint: "7",
        implemente: false,
    },
    {
        id: "S5",
        label: "Séance 5",
        fractions: "Répertoire complet",
        sprint: "8",
        implemente: false,
    },
];

/**
 * Stub pour les séances non encore implémentées.
 * @param {{ seance: object }} props
 */
function StubSeance({ seance }) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[40vh] gap-3 text-center p-8">
            <span className="text-4xl font-mono font-bold text-slate-200 select-none">
                {seance.id}
            </span>
            <p className="text-slate-500 font-medium">
                {seance.label} — {seance.fractions}
            </p>
            <span className="text-xs bg-slate-100 text-slate-400 px-3 py-1 rounded-full">
                Sprint {seance.sprint}
            </span>
        </div>
    );
}

/**
 * Module M1 — Modelage interactif.
 * @returns {JSX.Element}
 */
export default function ModelageInteractif() {
    const [seanceActive, setSeanceActive] = useState("S1");
    const seance = SEANCES_M1.find((s) => s.id === seanceActive);

    return (
        <div className="space-y-4">
            {/* ── Sélecteur de séance ── */}
            <div className="flex flex-wrap gap-2">
                {SEANCES_M1.map((s) => (
                    <button
                        key={s.id}
                        onClick={() => setSeanceActive(s.id)}
                        disabled={!s.implemente}
                        title={!s.implemente ? `Sprint ${s.sprint}` : undefined}
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

            {/* ── Contenu de la séance ── */}
            {seance?.implemente ? (
                seanceActive === "S1" ? (
                    <ModelageS1 />
                ) : (
                    <StubSeance seance={seance} />
                )
            ) : (
                <StubSeance seance={seance} />
            )}
        </div>
    );
}
