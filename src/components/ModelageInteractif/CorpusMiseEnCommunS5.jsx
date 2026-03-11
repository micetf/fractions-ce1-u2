/**
 * @fileoverview CorpusMiseEnCommunS5 — institutionnalisation phase ④ (fiche S5).
 *
 * Structure prescrite par la fiche S5, phase ④ (11 min) :
 *
 *   1. Observation collective des triplets (5 min) — structure « Têtes numérotées »
 *      Trois triplets présentés :
 *        - Triplet 1 (correct)  : 1/6 / « un sixième » / hexagone
 *        - Triplet 2 (erreur)   : 6/1 → erreur de position identifiable
 *        - Triplet 3 (correct)  : 1/10 / « un dixième » / bande en 10 parts
 *
 *   2. Tableau de décomposition des 7 fractions (3 min)
 *      Source : fiche S5, phase ④ — libellés exacts, ordre du tableau.
 *
 *   3. Tableau des trois représentations (2 min)
 *      Image / Nom en lettres / Écriture en chiffres ★ NOUVEAU
 *
 *   4. Mise à jour du répertoire (1 min)
 *
 * ⚠️ Terminologie CE1 : « chiffre du haut », « chiffre du bas ».
 */

import { useState } from "react";
import PropTypes from "prop-types";
import FormePartageeSVG from "./FormePartageeSVG";
import CarteFractionSVG from "./CarteFractionSVG";

// ── Données du tableau de décomposition ──────────────────────────────────────

/**
 * Tableau de décomposition des 7 fractions.
 * Source : fiche S5, phase ④ — libellés exacts.
 * Ordre : un demi, un quart, un huitième, un tiers, un sixième, un cinquième, un dixième.
 */
const TABLEAU_DECOMPOSITION = [
    {
        nomLettres: "un demi",
        ecriture: "1/2",
        lecture:
            "1 : je prends 1 part | trait de fraction | 2 : le tout est partagé en 2 parts égales",
    },
    {
        nomLettres: "un quart",
        ecriture: "1/4",
        lecture:
            "1 : je prends 1 part | trait de fraction | 4 : le tout est partagé en 4 parts égales",
    },
    {
        nomLettres: "un huitième",
        ecriture: "1/8",
        lecture:
            "1 : je prends 1 part | trait de fraction | 8 : le tout est partagé en 8 parts égales",
    },
    {
        nomLettres: "un tiers",
        ecriture: "1/3",
        lecture:
            "1 : je prends 1 part | trait de fraction | 3 : le tout est partagé en 3 parts égales",
    },
    {
        nomLettres: "un sixième",
        ecriture: "1/6",
        lecture:
            "1 : je prends 1 part | trait de fraction | 6 : le tout est partagé en 6 parts égales",
    },
    {
        nomLettres: "un cinquième",
        ecriture: "1/5",
        lecture:
            "1 : je prends 1 part | trait de fraction | 5 : le tout est partagé en 5 parts égales",
    },
    {
        nomLettres: "un dixième",
        ecriture: "1/10",
        lecture:
            "1 : je prends 1 part | trait de fraction | 10 : le tout est partagé en 10 parts égales",
    },
];

// ── Triplets phase ④ ──────────────────────────────────────────────────────────

/**
 * Les trois triplets prescrits par la fiche S5, phase ④.
 * Source : fiche S5 — triplets listés mot pour mot.
 * @type {Array<{ id: string, correct: boolean, erreur?: string, fraction: object, forme: object }>}
 */
const TRIPLETS = [
    {
        id: "T1",
        correct: true,
        fraction: {
            denominateur: 6,
            nomLettres: "un sixième",
            etatCarte: "complet",
        },
        forme: { id: "hexagone", denominateur: 6, etat: "colorie" },
        source: "Triplet 1 — correct (fiche S5, phase ④)",
    },
    {
        id: "T2",
        correct: false,
        erreur: "Le chiffre 6 est EN HAUT — c'est une erreur de position. Pour « un sixième », le 6 doit aller EN BAS (= nombre de parts du tout).",
        fraction: {
            denominateur: 6,
            nomLettres: "un sixième",
            etatCarte: "inverse",
        },
        forme: { id: "hexagone", denominateur: 6, etat: "colorie" },
        source: "Triplet 2 — erreur de position 6/1 (fiche S5, phase ④)",
    },
    {
        id: "T3",
        correct: true,
        fraction: {
            denominateur: 10,
            nomLettres: "un dixième",
            etatCarte: "complet",
        },
        forme: { id: "rectangle", denominateur: 10, etat: "colorie" },
        source: "Triplet 3 — correct (fiche S5, phase ④)",
    },
];

// ── Sous-composants ───────────────────────────────────────────────────────────

/**
 * Un triplet représentationnel (image + lettres + chiffres).
 * @param {{ triplet: object }} props
 */
function CarteTriplet({ triplet }) {
    const [analyseVisible, setAnalyseVisible] = useState(false);
    const { correct, erreur, fraction, forme, source } = triplet;

    return (
        <div
            className={[
                "rounded-2xl border overflow-hidden",
                correct ? "border-slate-200" : "border-red-200 bg-red-50/30",
            ].join(" ")}
        >
            <div className="px-4 py-2 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-600">
                    {triplet.id}
                </span>
                <span
                    className={[
                        "text-xs font-bold px-2 py-0.5 rounded-full",
                        correct
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-red-100 text-red-700",
                    ].join(" ")}
                >
                    {correct ? "✓ Correct" : "✗ Erreur"}
                </span>
            </div>

            <div className="p-4">
                {/* Les 3 cartes côte à côte */}
                <div className="flex items-end justify-center gap-4 flex-wrap">
                    {/* Carte image */}
                    <div className="flex flex-col items-center gap-1">
                        <FormePartageeSVG
                            forme={forme.id}
                            denominateur={forme.denominateur}
                            etat={forme.etat}
                            partColoriee={0}
                            taille={70}
                        />
                        <span className="text-xs text-slate-400 italic">
                            image
                        </span>
                    </div>

                    {/* Carte lettres */}
                    <div className="flex flex-col items-center gap-1">
                        <div
                            className="w-17.5 h-24 flex items-center justify-center
              border border-slate-200 rounded-lg bg-white"
                        >
                            <span className="text-sm font-semibold text-slate-700 text-center leading-tight px-1">
                                {fraction.nomLettres}
                            </span>
                        </div>
                        <span className="text-xs text-slate-400 italic">
                            lettres
                        </span>
                    </div>

                    {/* Carte chiffres */}
                    <div className="flex flex-col items-center gap-1">
                        <CarteFractionSVG
                            denominateur={fraction.denominateur}
                            etat={fraction.etatCarte}
                            taille={96}
                        />
                        <span className="text-xs text-slate-400 italic">
                            chiffres
                        </span>
                    </div>
                </div>

                {/* Question + analyse */}
                <div className="mt-3">
                    <p className="text-xs italic text-slate-500 mb-2">
                        « Dans votre équipe, ce triplet est-il correct ? Y
                        a-t-il une erreur ? »
                    </p>
                    {!analyseVisible ? (
                        <button
                            type="button"
                            onClick={() => setAnalyseVisible(true)}
                            className="w-full py-2 text-xs font-medium border rounded-lg transition-colors
                text-blue-600 border-blue-200 hover:bg-blue-50"
                        >
                            {correct
                                ? "Confirmer la réponse →"
                                : "Révéler l'erreur →"}
                        </button>
                    ) : (
                        <div
                            className={[
                                "rounded-xl px-4 py-3 text-xs",
                                correct
                                    ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
                                    : "bg-red-50 border border-red-200 text-red-800",
                            ].join(" ")}
                        >
                            {correct
                                ? `✓ Ce triplet est correct. 1/${fraction.denominateur} se lit bien « ${fraction.nomLettres} ».`
                                : `✗ ${erreur}`}
                            <p className="text-xs text-slate-400 mt-1 italic">
                                {source}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

CarteTriplet.propTypes = {
    triplet: PropTypes.shape({
        id: PropTypes.string.isRequired,
        correct: PropTypes.bool.isRequired,
        erreur: PropTypes.string,
        source: PropTypes.string,
        fraction: PropTypes.object.isRequired,
        forme: PropTypes.object.isRequired,
    }).isRequired,
};

// ── Tableau de décomposition ──────────────────────────────────────────────────

function TableauDecomposition() {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
                <thead>
                    <tr className="bg-slate-100">
                        {[
                            "Fraction",
                            "Écriture en chiffres",
                            "Lecture décomposée",
                        ].map((h) => (
                            <th
                                key={h}
                                className="px-3 py-2 text-left text-xs font-bold text-slate-600 border border-slate-200"
                            >
                                {h}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {TABLEAU_DECOMPOSITION.map((row, i) => (
                        <tr
                            key={row.ecriture}
                            className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}
                        >
                            <td className="px-3 py-2 text-slate-700 border border-slate-200">
                                {row.nomLettres}
                            </td>
                            <td className="px-3 py-2 font-bold text-blue-700 font-mono text-base border border-slate-200">
                                {row.ecriture}
                            </td>
                            <td className="px-3 py-2 text-slate-500 text-xs border border-slate-200">
                                {row.lecture}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <p className="text-xs text-slate-400 mt-1 italic px-1">
                Source : fiche S5 — phase ④ tableau de décomposition
            </p>
        </div>
    );
}

// ── Composant principal ───────────────────────────────────────────────────────

/**
 * Mise en commun S5 — 4 temps d'institutionnalisation.
 * @returns {JSX.Element}
 */
export default function CorpusMiseEnCommunS5() {
    return (
        <div className="space-y-5">
            <div className="px-1">
                <h2 className="font-bold text-slate-700 text-base">
                    Mise en commun — Institutionnalisation
                </h2>
                <p className="text-xs text-slate-400">
                    Structure « Têtes numérotées » — 11 min.
                </p>
            </div>

            {/* ── Triplets ── */}
            <div>
                <h3 className="text-sm font-semibold text-slate-600 mb-2 px-1">
                    Observation des triplets{" "}
                    <span className="text-xs font-normal text-slate-400">
                        (5 min)
                    </span>
                </h3>
                <div className="space-y-3">
                    {TRIPLETS.map((t) => (
                        <CarteTriplet key={t.id} triplet={t} />
                    ))}
                </div>
            </div>

            {/* ── Tableau de décomposition ── */}
            <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
                <div className="px-4 py-3 bg-slate-50 border-b border-slate-100">
                    <h3 className="font-semibold text-slate-700 text-sm">
                        Tableau de décomposition
                        <span className="ml-2 text-xs font-normal text-slate-400">
                            (3 min)
                        </span>
                    </h3>
                </div>
                <div className="p-4">
                    <TableauDecomposition />
                    <div className="mt-3 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
                        <p className="text-xs font-semibold text-blue-800 mb-1">
                            Conclusion (fiche S5) :
                        </p>
                        <p className="text-sm text-blue-700 leading-snug">
                            « Pour toutes ces fractions, le chiffre du haut est
                            toujours 1. Pourquoi ? Parce que pour l'instant, on
                            ne prend qu'une seule part. C'est ce qu'on appelle
                            une fraction unitaire. »
                        </p>
                    </div>
                </div>
            </div>

            {/* ── Triplet des 3 représentations ── */}
            <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
                <div className="px-4 py-3 bg-slate-50 border-b border-slate-100">
                    <h3 className="font-semibold text-slate-700 text-sm">
                        Les trois représentations
                        <span className="ml-2 text-xs font-normal text-slate-400">
                            (2 min)
                        </span>
                    </h3>
                </div>
                <div className="p-4 space-y-4">
                    {/* Exemple 1 : 1/4 */}
                    <div className="flex items-end gap-4 flex-wrap">
                        <FormePartageeSVG
                            forme="carre"
                            denominateur={4}
                            etat="colorie"
                            taille={65}
                        />
                        <div className="flex flex-col items-center">
                            <span className="text-sm font-semibold text-slate-700">
                                un quart
                            </span>
                            <span className="text-xs text-slate-400 italic">
                                nom en lettres
                            </span>
                        </div>
                        <div className="flex flex-col items-center">
                            <CarteFractionSVG
                                denominateur={4}
                                etat="complet"
                                taille={80}
                            />
                            <span className="text-xs text-emerald-600 font-semibold">
                                ★ NOUVEAU
                            </span>
                        </div>
                    </div>
                    {/* Exemple 2 : 1/8 */}
                    <div className="flex items-end gap-4 flex-wrap">
                        <FormePartageeSVG
                            forme="disque"
                            denominateur={8}
                            etat="colorie"
                            taille={65}
                        />
                        <div className="flex flex-col items-center">
                            <span className="text-sm font-semibold text-slate-700">
                                un huitième
                            </span>
                            <span className="text-xs text-slate-400 italic">
                                nom en lettres
                            </span>
                        </div>
                        <div className="flex flex-col items-center">
                            <CarteFractionSVG
                                denominateur={8}
                                etat="complet"
                                taille={80}
                            />
                            <span className="text-xs text-emerald-600 font-semibold">
                                ★ NOUVEAU
                            </span>
                        </div>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
                        <p className="text-sm text-blue-700 leading-snug">
                            « Ces trois cartes, c'est le même objet
                            mathématique. Il faut savoir passer librement de
                            l'une à l'autre. »
                        </p>
                        <p className="text-xs text-blue-400 mt-1 italic">
                            Source : fiche S5 — phase ④ institutionnalisation du
                            triplet
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
