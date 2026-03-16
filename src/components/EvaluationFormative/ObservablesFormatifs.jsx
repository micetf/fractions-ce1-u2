/**
 * @fileoverview ObservablesFormatifs — module M4, observables formatifs S1–S6.
 *
 * Conteneur principal. Orchestre :
 *   - Sélecteur de séance (S1 → S6)
 *   - GestionClasse (liste élèves partagée — RF-M4-01)
 *   - FicheObservableEleve (saisie individuelle — RF-M4-03 + RF-M4-04)
 *   - SyntheseObservables (vue classe — RF-M4-05)
 *
 * Sources : RF-M4-01 à RF-M4-05 (SRS, section 4.5.1)
 */

import { useState } from "react";
import PropTypes from "prop-types";
import {
    SEANCES,
    getObservablesParSeance,
} from "../../config/observables.config";
import { useObservablesFormatifs } from "./useObservablesFormatifs";
import GestionClasse from "./GestionClasse";
import FicheObservableEleve from "./FicheObservableEleve";
import SyntheseObservables from "./SyntheseObservables";

/** @type {('saisie'|'synthese')} */
const ONGLETS = { SAISIE: "saisie", SYNTHESE: "synthese" };

/**
 * Badge d'état de complétion d'une séance.
 *
 * @param {Object} props
 * @param {'non_commence'|'en_cours'|'complet'} props.etat
 */
function BadgeCompletion({ etat }) {
    const config = {
        non_commence: {
            label: "Non commencé",
            classes: "bg-slate-100 text-slate-500",
        },
        en_cours: { label: "En cours", classes: "bg-amber-100 text-amber-700" },
        complet: {
            label: "Complet",
            classes: "bg-emerald-100 text-emerald-700",
        },
    };
    const { label, classes } = config[etat] ?? config.non_commence;
    return (
        <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full ${classes}`}
        >
            {label}
        </span>
    );
}

BadgeCompletion.propTypes = {
    etat: PropTypes.oneOf(["non_commence", "en_cours", "complet"]).isRequired,
};

// ─────────────────────────────────────────────────────────────────────────────

/**
 * ObservablesFormatifs — module complet RF-M4-01 à RF-M4-05.
 *
 * @returns {JSX.Element}
 */
export default function ObservablesFormatifs() {
    const [seanceActive, setSeanceActive] = useState("S1");
    const [onglet, setOnglet] = useState(ONGLETS.SAISIE);
    const [eleveSelectionne, setEleveSelectionne] = useState(null);

    const {
        eleves,
        ajouterEleve,
        supprimerEleve,
        getSaisie,
        setSaisie,
        getSynthese,
        getCompletionSeance,
    } = useObservablesFormatifs();

    const observables = getObservablesParSeance(seanceActive);
    const syntheses = getSynthese(seanceActive);

    const eleveEffectifId =
        eleves.length === 0
            ? null
            : (eleves.find((e) => e.id === eleveSelectionne)?.id ??
              eleves[0].id);

    const idxCourant = eleves.findIndex((e) => e.id === eleveEffectifId);
    const eleveCourant = idxCourant >= 0 ? eleves[idxCourant] : null;

    function allerPrecedent() {
        if (idxCourant > 0) setEleveSelectionne(eleves[idxCourant - 1].id);
    }
    function allerSuivant() {
        if (idxCourant < eleves.length - 1)
            setEleveSelectionne(eleves[idxCourant + 1].id);
    }

    return (
        <div className="min-h-[70vh] space-y-4">
            {/* ── En-tête ── */}
            <div className="bg-white border border-slate-200 rounded-2xl px-6 py-4 shadow-sm">
                <h2 className="text-lg font-bold text-slate-800">
                    M4 — Observables formatifs S1–S6
                </h2>
                <p className="text-sm text-slate-500 mt-0.5">
                    Saisie des observables par séance et par élève — régulations
                    automatiques.
                </p>
            </div>

            {/* ── Sélecteur de séance ── */}
            <div className="bg-white border border-slate-200 rounded-2xl px-4 py-3 shadow-sm">
                <p className="text-xs text-slate-500 font-medium mb-2">
                    Séance :
                </p>
                <div className="flex flex-wrap gap-2">
                    {SEANCES.map((s) => {
                        const etat = getCompletionSeance(s.id);
                        const actif = seanceActive === s.id;
                        return (
                            <button
                                key={s.id}
                                type="button"
                                onClick={() => {
                                    setSeanceActive(s.id);
                                    setOnglet(ONGLETS.SAISIE);
                                    setEleveSelectionne(null);
                                }}
                                className={[
                                    "flex flex-col items-start px-3 py-2 rounded-xl border-2",
                                    "text-left transition-colors",
                                    actif
                                        ? "border-blue-500 bg-blue-50"
                                        : "border-slate-200 bg-white hover:border-slate-300",
                                ].join(" ")}
                            >
                                <span
                                    className={[
                                        "text-sm font-bold",
                                        actif
                                            ? "text-blue-700"
                                            : "text-slate-700",
                                    ].join(" ")}
                                >
                                    {s.id}
                                </span>
                                <BadgeCompletion etat={etat} />
                            </button>
                        );
                    })}
                </div>
                <p className="text-xs text-slate-500 mt-2 italic">
                    {SEANCES.find((s) => s.id === seanceActive)?.titre}
                </p>
            </div>

            {/* ── Onglets Saisie / Synthèse ── */}
            <div className="flex gap-1 border-b border-slate-200">
                {[
                    { id: ONGLETS.SAISIE, label: "Saisie par élève" },
                    { id: ONGLETS.SYNTHESE, label: "Synthèse de classe" },
                ].map(({ id, label }) => (
                    <button
                        key={id}
                        type="button"
                        onClick={() => setOnglet(id)}
                        className={[
                            "px-4 py-2 text-sm font-semibold border-b-2 transition-colors -mb-px",
                            onglet === id
                                ? "border-blue-600 text-blue-700"
                                : "border-transparent text-slate-500 hover:text-slate-700",
                        ].join(" ")}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {/* ── Corps ── */}
            {onglet === ONGLETS.SAISIE ? (
                <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4">
                    <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm self-start">
                        <GestionClasse
                            eleves={eleves}
                            eleveSelectionne={eleveEffectifId}
                            onAjouter={ajouterEleve}
                            onSupprimer={supprimerEleve}
                            onSelectionner={setEleveSelectionne}
                        />
                    </div>
                    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                        {eleveCourant ? (
                            <FicheObservableEleve
                                prenom={eleveCourant.prenom}
                                observables={observables}
                                getValeur={(obsId) =>
                                    getSaisie(
                                        seanceActive,
                                        obsId,
                                        eleveCourant.id
                                    )
                                }
                                onSetValeur={(obsId, valeur) =>
                                    setSaisie(
                                        seanceActive,
                                        obsId,
                                        eleveCourant.id,
                                        valeur
                                    )
                                }
                                onElevePrecedent={allerPrecedent}
                                onEleveSuivant={allerSuivant}
                                aPrecedent={idxCourant > 0}
                                aSuivant={idxCourant < eleves.length - 1}
                                indexEleve={idxCourant + 1}
                                totalEleves={eleves.length}
                            />
                        ) : (
                            <div
                                className="flex flex-col items-center justify-center
                                min-h-[40vh] gap-3 text-center"
                            >
                                <span className="text-4xl">👈</span>
                                <p className="text-slate-400 text-sm">
                                    {eleves.length === 0
                                        ? "Ajoutez des élèves dans le panneau gauche."
                                        : "Sélectionnez un élève pour saisir ses observables."}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                    <SyntheseObservables
                        syntheses={syntheses}
                        totalEleves={eleves.length}
                    />
                </div>
            )}
        </div>
    );
}
