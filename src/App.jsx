/**
 * @fileoverview Composant racine — navigation par useState.
 *
 * Sprint 2 : la vue M2 (jeu de cartes) est branchée sur JeuPaires (session A).
 * Sprint 1 : la vue M3 (bande-répertoire) reste opérationnelle.
 * M0, M1, M4 : placeholders (sprints à venir).
 */

import { useState } from "react";
import PropTypes from "prop-types";
import { VUES, NAV_CONFIG, VUE_INITIALE } from "./config/navigation.config";
import { BandeRepertoire } from "./components/BandeRepertoire";
import { JeuPaires } from "./components/JeuCartes";
import {
    TableauDeBord,
    ModelageInteractif,
    EvaluationFormative,
} from "./components/placeholders";

// ── Vues disponibles ──────────────────────────────────────────────────────────

/**
 * Vue M3 — Bande-répertoire avec sélecteur de séance.
 *
 * Le sélecteur (1–6) simule l'avancement dans la séquence.
 * En production, seanceDebloquee sera géré dans un contexte global
 * ou persisté (sprint à préciser).
 *
 * @param {Object} props
 * @param {number} props.seanceDebloquee
 * @param {(n: number) => void} props.onChangerSeance
 */
function VueBandeRepertoire({ seanceDebloquee, onChangerSeance }) {
    return (
        <div className="max-w-2xl mx-auto p-6 space-y-6">
            {/* Contrôle de séance — pour tester le déverrouillage progressif */}
            <div className="flex items-center gap-3 p-3 bg-slate-100 rounded-lg">
                <span className="text-sm text-slate-600 font-medium shrink-0">
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
                <span className="text-xs text-slate-400 ml-2">
                    {seanceDebloquee >= 5
                        ? "↳ Colonne « chiffres » visible"
                        : ""}
                </span>
            </div>

            <BandeRepertoire seanceDebloquee={seanceDebloquee} />
        </div>
    );
}

VueBandeRepertoire.propTypes = {
    seanceDebloquee: PropTypes.number.isRequired,
    onChangerSeance: PropTypes.func.isRequired,
};

// ── Vue M2 ────────────────────────────────────────────────────────────────────

/**
 * Vue M2 — Jeu de cartes, session A (cartes visibles).
 */
function VueJeuCartes() {
    return (
        <div className="max-w-3xl mx-auto p-6">
            <JeuPaires />
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
                return <ModelageInteractif />;
            case VUES.EVALUATION:
                return <EvaluationFormative />;
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
