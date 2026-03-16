/**
 * @fileoverview Composant racine — navigation par useState.
 *
 * Sprint 13b : BilanS6 → ModuleM4 (une ligne).
 * Sprint 12 : intégration de la Navbar écosystème micetf.fr.
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
import { ModuleM4 } from "./components/EvaluationFormative";
import Navbar from "./components/Navbar/Navbar";

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
                        Élève
                    </button>
                </div>

                {/* Sélecteur de séance (mode enseignant uniquement) */}
                {!modeEleve && (
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-600 font-medium">
                            Séance :
                        </span>
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5, 6].map((s) => (
                                <button
                                    key={s}
                                    onClick={() => onChangerSeance(s)}
                                    className={[
                                        "w-8 h-8 rounded text-sm font-semibold transition-colors",
                                        seanceDebloquee === s
                                            ? "bg-blue-600 text-white"
                                            : "bg-white text-slate-500 hover:bg-slate-200",
                                    ].join(" ")}
                                >
                                    S{s}
                                </button>
                            ))}
                        </div>
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
 * Vue M2 — Jeu de cartes interactif.
 * @returns {JSX.Element}
 */
function VueJeuCartes() {
    return (
        <div className="max-w-3xl mx-auto p-6">
            <JeuCartes />
        </div>
    );
}

// ── Composant racine ──────────────────────────────────────────────────────────

/**
 * Composant racine de l'application Fractions CE1.
 *
 * Orchestre la navigation inter-modules et délègue le rendu à chaque vue.
 * La Navbar est fixée en haut (position: fixed) ; `pt-14` compense
 * la hauteur de la barre (h-14 = 3.5 rem) pour éviter tout chevauchement.
 *
 * @returns {JSX.Element}
 */
export default function App() {
    const [vueActive, setVueActive] = useState(VUE_INITIALE);
    const [seanceDebloquee, setSeanceDebloquee] = useState(1);

    /**
     * Rendu conditionnel de la vue active.
     * @returns {JSX.Element}
     */
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
                        <ModuleM4 />
                    </div>
                );
            default:
                return <TableauDeBord />;
        }
    }

    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            {/* Navbar fixe — identité visuelle micetf.fr */}
            <Navbar
                vueActive={vueActive}
                onNaviguer={setVueActive}
                // onAide={() => { /* TODO: ouvrir modale d'aide */ }}
            />

            {/*
             * pt-14 : compense la hauteur fixe de la navbar (h-14 = 3.5 rem)
             * afin que le contenu ne se retrouve pas masqué derrière elle.
             */}
            <main className="flex-1 pt-14">{renderVue()}</main>
        </div>
    );
}
