/**
 * @fileoverview BilanS6 — module M4 : bilan de séquence S6, vue enseignant.
 *
 * Orchestre les sous-composants du bilan :
 *   - GestionClasse     : ajout/suppression des élèves
 *   - SaisieAutoEval    : saisie item par item pour un élève sélectionné
 *   - SyntheseBilan     : tableau de synthèse de la classe
 *   - AlerteCollective  : bandeau RF-M4-09 si majorité hésite sur 1/5 et 1/10
 *
 * Navigation interne : onglets « Saisie » / « Synthèse ».
 *
 * Sources :
 *   - Fiche S6, section « Bilan de séquence — session C »
 *   - RF-M4-06 à RF-M4-09 (SRS, section 4.5.2)
 *
 * Approximation documentée (RF-M4-09) :
 *   L'alerte collective est détectée via l'item AE-03, faute de granularité
 *   par fraction dans la grille d'auto-évaluation. Voir AlerteCollective.jsx.
 */

import { useState } from "react";
import { useBilanS6 } from "./useBilanS6";
import GestionClasse from "./GestionClasse";
import SaisieAutoEval from "./SaisieAutoEval";
import SyntheseBilan from "./SyntheseBilan";
import AlerteCollective from "./AlerteCollective";

/** @type {('saisie'|'synthese')} */
const ONGLETS = { SAISIE: "saisie", SYNTHESE: "synthese" };

/**
 * Composant racine du module M4 — bilan de séquence S6.
 *
 * Aucune prop requise : état complet géré via useBilanS6.
 *
 * @returns {JSX.Element}
 */
export default function BilanS6() {
    const [onglet, setOnglet] = useState(ONGLETS.SAISIE);
    const [eleveSelectionne, setEleveSelectionne] = useState(null);

    const {
        eleves,
        resultats,
        ajouterEleve,
        supprimerEleve,
        setResultat,
        syntheses,
        alerteCollective,
        nbElevesComplets,
        reinitialiserResultats,
    } = useBilanS6();

    /**
     * Élève effectivement affiché — dérivé au rendu, sans useEffect.
     * Règle : liste vide → null ; sélection valide → conservée ;
     * sélection invalide ou null → dernier ajouté.
     */
    const eleveEffectifId =
        eleves.length === 0
            ? null
            : (eleves.find((e) => e.id === eleveSelectionne)?.id ??
              eleves[eleves.length - 1].id);

    const idxCourant = eleves.findIndex((e) => e.id === eleveEffectifId);
    const eleveCourant = idxCourant >= 0 ? eleves[idxCourant] : null;
    const aSuivant = idxCourant >= 0 && idxCourant < eleves.length - 1;

    function allerEleveSuivant() {
        if (aSuivant) setEleveSelectionne(eleves[idxCourant + 1].id);
    }

    function handleSupprimer(id) {
        supprimerEleve(id);
        if (eleveSelectionne === id) setEleveSelectionne(null);
    }

    return (
        <div className="min-h-[70vh] space-y-4">
            {/* ── En-tête du module ── */}
            <div className="bg-white border border-slate-200 rounded-2xl px-6 py-4 shadow-sm">
                <div className="flex items-start justify-between flex-wrap gap-3">
                    <div>
                        <h2 className="text-lg font-bold text-slate-800">
                            M4 — Bilan de séquence S6
                        </h2>
                        <p className="text-sm text-slate-500 mt-0.5">
                            Saisie des auto-évaluations élèves (session C) et
                            décisions pédagogiques avant la séquence 3.
                        </p>
                    </div>
                    {eleves.length > 0 && (
                        <div className="text-right">
                            <p className="text-2xl font-bold text-blue-600">
                                {nbElevesComplets} / {eleves.length}
                            </p>
                            <p className="text-xs text-slate-400">
                                saisies complètes
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Alerte collective RF-M4-09 ── */}
            <AlerteCollective visible={alerteCollective} />

            {/* ── Onglets ── */}
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
                            onSupprimer={handleSupprimer}
                            onSelectionner={setEleveSelectionne}
                            onReinitialiser={reinitialiserResultats}
                        />
                    </div>
                    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                        {eleveCourant ? (
                            <SaisieAutoEval
                                prenom={eleveCourant.prenom}
                                resultats={resultats[eleveCourant.id] ?? {}}
                                onSetResultat={(itemId, niveau) =>
                                    setResultat(eleveCourant.id, itemId, niveau)
                                }
                                onEleveSuivant={allerEleveSuivant}
                                aSuivant={aSuivant}
                            />
                        ) : (
                            <div
                                className="flex flex-col items-center justify-center
                                h-full min-h-50 gap-3 text-center"
                            >
                                <span className="text-4xl">👈</span>
                                <p className="text-slate-400 text-sm">
                                    {eleves.length === 0
                                        ? "Ajoutez des élèves dans le panneau gauche."
                                        : "Sélectionnez un élève pour saisir son auto-évaluation."}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                    <SyntheseBilan
                        syntheses={syntheses}
                        resultats={resultats}
                        onSelectionnerEleve={(id) => {
                            setEleveSelectionne(id);
                            setOnglet(ONGLETS.SAISIE);
                        }}
                    />
                </div>
            )}
        </div>
    );
}
