/**
 * @fileoverview Composant racine — navigation par useState.
 *
 * Intègre la modale PriseEnMain :
 *   - usePriseEnMain gère l'état (première visite + réouverture)
 *   - onAide={ouvrir} passé à Navbar active le bouton « ? »
 *   - PriseEnMain rendu au-dessus de tout (z-50)
 */

import { useState } from "react";
import PropTypes from "prop-types";
import { VUES, VUE_INITIALE } from "./config/navigation.config";
import { BandeRepertoire } from "./components/BandeRepertoire";
import { JeuCartes } from "./components/JeuCartes";
import TableauDeBord from "./components/TableauDeBord/TableauDeBord";
import { ModelageInteractif } from "./components/ModelageInteractif";
import { ModuleM4 } from "./components/EvaluationFormative";
import Navbar from "./components/Navbar/Navbar";
import PiedDePage from "./components/PiedDePage/PiedDePage";
import PriseEnMain from "./components/PriseEnMain/PriseEnMain";
import { usePriseEnMain } from "./hooks/usePriseEnMain";

// ── Vues ──────────────────────────────────────────────────────────────────────

function VueBandeRepertoire({ seanceDebloquee, onChangerSeance }) {
    const [modeEleve, setModeEleve] = useState(false);

    return (
        <div className="max-w-2xl mx-auto p-6 space-y-4">
            <div
                className="flex items-center justify-between gap-3 p-3
                bg-slate-100 rounded-lg flex-wrap"
            >
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
                {!modeEleve && (
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-600 font-medium">
                            Séance :
                        </span>
                        <select
                            value={seanceDebloquee}
                            onChange={(e) =>
                                onChangerSeance(Number(e.target.value))
                            }
                            className="px-2 py-1 text-sm border border-slate-300
                                rounded-lg focus:outline-none focus:ring-2
                                focus:ring-blue-400"
                        >
                            {[1, 2, 3, 4, 5, 6].map((n) => (
                                <option key={n} value={n}>
                                    S{n}
                                </option>
                            ))}
                        </select>
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

function VueJeuCartes() {
    return (
        <div className="max-w-3xl mx-auto p-6">
            <JeuCartes />
        </div>
    );
}

// ── Composant racine ──────────────────────────────────────────────────────────

export default function App() {
    const [vueActive, setVueActive] = useState(VUE_INITIALE);
    const [seanceDebloquee, setSeanceDebloquee] = useState(1);
    const { visible, ouvrir, fermer } = usePriseEnMain();

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
                return <TableauDeBord onNaviguer={setVueActive} />;
        }
    }

    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <Navbar
                vueActive={vueActive}
                onNaviguer={setVueActive}
                onAide={ouvrir}
            />
            <main className="flex-1 pt-14">{renderVue()}</main>
            <PiedDePage />

            {/* Modale de prise en main — rendue au-dessus de tout */}
            {visible && (
                <PriseEnMain onFermer={fermer} onNaviguer={setVueActive} />
            )}
        </div>
    );
}
