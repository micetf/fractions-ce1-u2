/**
 * @fileoverview CorpusMiseEnCommun — 3 corpus de la mise en commun (fiche S1, phase ④).
 *
 * Structure prescrite par la fiche S1 :
 *
 *   Corpus A — La fraction s'interprète par rapport à son tout
 *     Montrer 1/2 de disque et 1/2 d'éventail.
 *     Conclusion : « Une fraction s'interprète toujours par rapport à son tout.
 *       Les deux parties sont des 'un demi' de leur tout respectif,
 *       mais elles n'ont pas la même taille. »
 *
 *   Corpus B — Formes différentes pour une même fraction
 *     Comparer des quarts de carrés de formes différentes.
 *     Fiche : « triangles, rectangles... » = cartes physiques des élèves.
 *     ⚠️ Transposition numérique : montré avec 2 grilles différentes
 *        (2×2 et 4 colonnes), les deux représentent 1/4 d'un carré.
 *     Conclusion : « Une fraction d'un même tout peut être représentée
 *       par des surfaces de formes différentes. »
 *
 *   Corpus C — Comparer des fractions d'un même tout
 *     Ranger 1/8, 1/4, 1/2 d'un même rectangle du plus petit au plus grand.
 *     Conclusion : « Plus on partage le tout en beaucoup de parts, plus
 *       chaque part est petite. Un huitième c'est plus petit qu'un quart
 *       du même tout. »
 *
 * Les libellés de conclusion sont reproduits fidèlement depuis la fiche S1.
 */

import { useState } from "react";
import PropTypes from "prop-types";
import FormePartageeSVG from "./FormePartageeSVG";

// ── Données des corpus (source : fiche S1, phase ④) ──────────────────────────

/**
 * @typedef {Object} CorpusData
 * @property {string}   id
 * @property {string}   titre        - Titre exact de la fiche
 * @property {string}   question     - Question prescrite par la fiche
 * @property {string}   conclusion   - Conclusion à formuler avec les élèves (fiche S1 exact)
 * @property {object[]} elements     - Visuels à afficher
 */

/** @type {CorpusData[]} */
const CORPUS = [
    {
        id: "A",
        titre: "Corpus A — La fraction s'interprète par rapport à son tout",
        question:
            "« Quelle fraction représente la partie colorée ? Sont-elles pareilles ? »",
        conclusion:
            "Une fraction s'interprète toujours par rapport à son tout. Les deux parties sont des « un demi » de leur tout respectif, mais elles n'ont pas la même taille.",
        elements: [
            { forme: "disque", denominateur: 2, label: "1/2 du disque" },
            { forme: "eventail", denominateur: 2, label: "1/2 de l'éventail" },
        ],
    },
    {
        id: "B",
        titre: "Corpus B — Formes différentes pour une même fraction",
        question:
            "« Ces deux images montrent toutes les deux un quart. Sont-elles pareilles ? Les deux sont-elles correctes ? »",
        conclusion:
            "Une fraction d'un même tout peut être représentée par des surfaces de formes différentes.",
        note: "⚠️ Transposition numérique : la fiche mentionne des cartes de quarts de carrés « triangles, rectangles... » fabriquées par les élèves. Ici : deux grilles différentes pour 1/4 du même carré.",
        elements: [
            {
                forme: "carre",
                denominateur: 4,
                label: "1/4 carré (2×2)",
                grille: "standard",
            },
            {
                forme: "rectangle",
                denominateur: 4,
                label: "1/4 rectangle (4 bandes)",
                grille: "variante",
            },
        ],
    },
    {
        id: "C",
        titre: "Corpus C — Comparer des fractions d'un même tout",
        question:
            "« Comment sont rangées ces fractions ? Qu'est-ce qu'on remarque ? »",
        conclusion:
            "Plus on partage le tout en beaucoup de parts, plus chaque part est petite. Un huitième c'est plus petit qu'un quart du même tout.",
        elements: [
            { forme: "rectangle", denominateur: 8, label: "1/8" },
            { forme: "rectangle", denominateur: 4, label: "1/4" },
            { forme: "rectangle", denominateur: 2, label: "1/2" },
        ],
    },
];

// ── Sous-composants ───────────────────────────────────────────────────────────

/**
 * Élément visuel d'un corpus.
 * @param {{ element: object }} props
 */
function ElementCorpus({ element }) {
    return (
        <div className="flex flex-col items-center gap-1.5">
            <FormePartageeSVG
                forme={element.forme}
                denominateur={element.denominateur}
                etat="colorie"
                partColoriee={0}
                taille={90}
            />
            <span className="text-xs text-slate-500 font-medium">
                {element.label}
            </span>
        </div>
    );
}

ElementCorpus.propTypes = {
    element: PropTypes.shape({
        forme: PropTypes.string.isRequired,
        denominateur: PropTypes.number.isRequired,
        label: PropTypes.string.isRequired,
    }).isRequired,
};

/**
 * Carte d'un corpus — visuels + question + conclusion.
 * @param {{ corpus: CorpusData }} props
 */
function CarteCorpus({ corpus }) {
    const [conclusionVisible, setConclusionVisible] = useState(false);

    return (
        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
            {/* En-tête */}
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-100">
                <h3 className="font-semibold text-slate-700 text-sm">
                    {corpus.titre}
                </h3>
            </div>

            <div className="p-4 space-y-4">
                {/* Question prescrite */}
                <p className="text-xs italic text-slate-500">
                    {corpus.question}
                </p>

                {/* Visuels */}
                <div className="flex items-end justify-center gap-6 flex-wrap">
                    {corpus.elements.map((el, i) => (
                        <ElementCorpus key={i} element={el} />
                    ))}
                </div>

                {/* Note de transposition si présente */}
                {corpus.note && (
                    <p className="text-xs text-amber-600 bg-amber-50 px-3 py-2 rounded-lg">
                        {corpus.note}
                    </p>
                )}

                {/* Conclusion (révélable) */}
                <div className="pt-1">
                    {!conclusionVisible ? (
                        <button
                            type="button"
                            onClick={() => setConclusionVisible(true)}
                            className="w-full py-2 text-xs text-blue-600 font-medium border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
                        >
                            Afficher la conclusion →
                        </button>
                    ) : (
                        <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
                            <p className="text-xs font-semibold text-blue-800 mb-1">
                                Conclusion :
                            </p>
                            <p className="text-sm text-blue-700 leading-snug">
                                « {corpus.conclusion} »
                            </p>
                            <p className="text-xs text-blue-400 mt-1.5 italic">
                                Source : fiche S1 — phase ④ mise en commun
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

CarteCorpus.propTypes = {
    corpus: PropTypes.shape({
        id: PropTypes.string.isRequired,
        titre: PropTypes.string.isRequired,
        question: PropTypes.string.isRequired,
        conclusion: PropTypes.string.isRequired,
        note: PropTypes.string,
        elements: PropTypes.arrayOf(PropTypes.object).isRequired,
    }).isRequired,
};

// ── Composant principal ───────────────────────────────────────────────────────

/**
 * Mise en commun S1 — 3 corpus de la phase ④.
 * @returns {JSX.Element}
 */
export default function CorpusMiseEnCommun() {
    return (
        <div className="space-y-4">
            <div className="px-1">
                <h2 className="font-bold text-slate-700 text-base">
                    Mise en commun — 3 corpus
                </h2>
                <p className="text-xs text-slate-400">
                    Cliquez sur « Afficher la conclusion » après échange avec
                    les élèves.
                </p>
            </div>
            <div className="space-y-3">
                {CORPUS.map((corpus) => (
                    <CarteCorpus key={corpus.id} corpus={corpus} />
                ))}
            </div>
        </div>
    );
}
