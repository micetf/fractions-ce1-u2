/**
 * @fileoverview Composant racine — navigation par useState.
 *
 * Sprint 11 : M4 BilanS6 remplace le placeholder EvaluationFormative.
 * Sprint 2–10 : M2 JeuCartes (sessions A/B/C paires + triplets).
 * Sprint 1, 9 : M3 BandeRepertoire interactive.
 * Sprint 5–8 : M1 ModelageInteractif (S1, S3, S4, S5).
 * M0 : placeholder (sprint 13).
 */

import { useState } from "react";
import PropTypes from "prop-types";
import { VUES, NAV_CONFIG, VUE_INITIALE } from "./config/navigation.config";
import { BandeRepertoire } from "./components/BandeRepertoire";
import { JeuCartes } from "./components/JeuCartes";
import { TableauDeBord } from "./components/placeholders";
import { ModelageInteractif } from "./components/ModelageInteractif";
import { BilanS6 } from "./components/EvaluationFormative";

// ── Vues disponibles ──────────────────────────────────────────────────────────

/**
 * Vue M3 — Bande-répertoire avec sélecteur de séance et bascule mode.
 *
 * Mode enseignant : sélecteur de séance visible (contrôle RF-M3-03).
 * Mode élève      : lecture seule, sans contrôles (RF-M3-04 —
 *                   accessible en session C de S6).
 *
 * @param {Object} props
 * @param {number} props.seanceDebloquee
 * @param {(n: number) => void} props.onChangerSeance
 */
function VueBandeRepertoire({ seanceDebloquee, onChangerSeance }) {
    const [modeEleve, setModeEleve] = useState(false);

    return (
        <div className="max-w-2xl mx-auto p-6 space-y-4">
            {/* Bascule mode enseignant / élève */}
            <div className="flex items-center justify-between gap-3 p-3 bg-slate-100 rounded-lg flex-wrap">
                <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-600 font-medium">
                        Mode :
                    </span>
                    <button
                        onClick={() => setModeEleve(false)}
                        className={[
                            "px-3 py-1 rounded text-sm font-semibold transition-colors",
                            !modeEleve
                                ? "bg-slate-700 text-white"
                                : "bg-white text-slate-500 hover:bg-slate-200",
                        ].join(" ")}
                    >
                        Enseignant
                    </button>
                    <button
                        onClick={() => setModeEleve(true)}
                        className={[
                            "px-3 py-1 rounded text-sm font-semibold transition-colors",
                            modeEleve
                                ? "bg-slate-700 text-white"
                                : "bg-white text-slate-500 hover:bg-slate-200",
                        ].join(" ")}
                    >
                        Élève (S6-C)
                    </button>
                </div>

                {/* Contrôle de séance — masqué en mode élève (RF-M3-04) */}
                {!modeEleve && (
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500 font-medium shrink-0">
                            Séance débloquée :
                        </span>
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5, 6].map((n) => (
                                <button
                                    key={n}
                                    onClick={() => onChangerSeance(n)}
                                    className={[
                                        "w-8 h-8 rounded text-sm font-semibold transition-colors",
                                        seanceDebloquee === n
                                            ? "bg-slate-700 text-white"
                                            : "bg-white text-slate-500 hover:bg-slate-200",
                                    ].join(" ")}
                                >
                                    {n}
                                </button>
                            ))}
                        </div>
                        {seanceDebloquee >= 5 && (
                            <span className="text-xs text-blue-500 ml-1">
                                ↳ Colonne « chiffres » visible
                            </span>
                        )}
                    </div>
                )}
            </div>

            <BandeRepertoire
                seanceDebloquee={seanceDebloquee}
                modeEleve={modeEleve}
            />
        </div>
    );
}

VueBandeRepertoire.propTypes = {
    seanceDebloquee: PropTypes.number.isRequired,
    onChangerSeance: PropTypes.func.isRequired,
};

// ── Vue M2 ────────────────────────────────────────────────────────────────────

/**
 * Vue M2 — Jeu de cartes, sessions A et B (sprint 3).
 */
function VueJeuCartes() {
    return (
        <div className="max-w-3xl mx-auto p-6">
            <JeuCartes />
        </div>
    );
}

// ── Navigation ────────────────────────────────────────────────────────────────

/**
 * @param {{ vueActive: string, onNaviguer: (vue: string) => void }} props
 */
function NavBar({ vueActive, onNaviguer }) {
    return (
        <nav className="bg-slate-800 text-white px-6 py-3 flex items-center gap-2">
            <span className="font-semibold text-slate-300 text-sm mr-4 shrink-0">
                Fractions CE1
            </span>
            <div className="flex gap-1 flex-wrap">
                {Object.entries(NAV_CONFIG).map(([vue, { label, module }]) => (
                    <button
                        key={vue}
                        onClick={() => onNaviguer(vue)}
                        className={[
                            "flex items-center gap-1.5 px-3 py-1.5 rounded text-sm transition-colors",
                            vueActive === vue
                                ? "bg-blue-600 text-white"
                                : "text-slate-400 hover:text-white hover:bg-slate-700",
                        ].join(" ")}
                    >
                        <span className="text-xs font-mono opacity-60">
                            {module}
                        </span>
                        {label}
                    </button>
                ))}
            </div>
        </nav>
    );
}

NavBar.propTypes = {
    vueActive: PropTypes.string.isRequired,
    onNaviguer: PropTypes.func.isRequired,
};

// ── Composant racine ──────────────────────────────────────────────────────────

/**
 * @returns {JSX.Element}
 */
export default function App() {
    const [vueActive, setVueActive] = useState(VUE_INITIALE);
    const [seanceDebloquee, setSeanceDebloquee] = useState(1);

    function renderVue() {
        switch (vueActive) {
            case VUES.JEU_DE_CARTES:
                return <VueJeuCartes />;
            case VUES.BANDE_REPERTOIRE:
                return (
                    <VueBandeRepertoire
                        seanceDebloquee={seanceDebloquee}
                        onChangerSeance={setSeanceDebloquee}
                    />
                );
            case VUES.MODELAGE:
                return (
                    <div className="max-w-4xl mx-auto p-6">
                        <ModelageInteractif />
                    </div>
                );
            case VUES.EVALUATION:
                return (
                    <div className="max-w-5xl mx-auto p-6">
                        <BilanS6 />
                    </div>
                );
            default:
                return <TableauDeBord />;
        }
    }

    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <NavBar vueActive={vueActive} onNaviguer={setVueActive} />
            <main className="flex-1">{renderVue()}</main>
        </div>
    );
}
