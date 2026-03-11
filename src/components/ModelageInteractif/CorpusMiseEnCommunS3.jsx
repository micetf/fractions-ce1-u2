/**
 * @fileoverview CorpusMiseEnCommunS3 — 3 points d'institutionnalisation (fiche S3, phase ④).
 *
 * Structure prescrite par la fiche S3 :
 *
 *   Point 1 — Difficulté du tiers : pas de pliage simple (1 min 30)
 *     Côte à côte : disque en 2 (pliage) vs disque en 3 (gabarit).
 *     Conclusion : « Pour un demi, on peut plier en deux. Pour un tiers,
 *       il faut tracer ou utiliser un gabarit. La contrainte reste la même :
 *       les 3 parts doivent être ÉGALES. »
 *
 *   Point 2 — La relation 1/3 = 2/6 sur l'hexagone (3 min)
 *     Côte à côte : hexagone 1 tiers (2 triangles) vs hexagone 1 sixième (1 triangle).
 *     Conclusion : « Un tiers de l'hexagone = 2 sixièmes. Un sixième est la
 *       moitié d'un tiers du même tout. »
 *
 *   Point 3 — Toujours par rapport au tout (1 min 30)
 *     Côte à côte : 1/6 du disque vs 1/6 de l'hexagone.
 *     Conclusion : « Un sixième de disque ≠ un sixième d'hexagone,
 *       car les touts ne sont pas les mêmes. »
 *
 * Les libellés de conclusion sont reproduits fidèlement depuis la fiche S3.
 */

import { useState } from "react";
import PropTypes from "prop-types";
import FormePartageeSVG from "./FormePartageeSVG";

// ── Sous-composants ───────────────────────────────────────────────────────────

/**
 * Paire de formes côte à côte avec leurs étiquettes.
 * @param {{ elements: object[] }} props
 */
function PaireForme({ elements }) {
    return (
        <div className="flex items-end justify-center gap-6 flex-wrap">
            {elements.map((el, i) => (
                <div key={i} className="flex flex-col items-center gap-1.5">
                    <FormePartageeSVG
                        forme={el.forme}
                        denominateur={el.denominateur}
                        etat={el.etat}
                        partColoriee={el.partColoriee ?? 0}
                        taille={el.taille ?? 90}
                    />
                    <span className="text-xs text-slate-500 font-medium">
                        {el.label}
                    </span>
                </div>
            ))}
        </div>
    );
}

PaireForme.propTypes = {
    elements: PropTypes.arrayOf(
        PropTypes.shape({
            forme: PropTypes.string.isRequired,
            denominateur: PropTypes.number.isRequired,
            etat: PropTypes.string.isRequired,
            partColoriee: PropTypes.number,
            label: PropTypes.string.isRequired,
            taille: PropTypes.number,
        })
    ).isRequired,
};

/**
 * Carte d'un point d'institutionnalisation.
 * @param {{ point: object }} props
 */
function CartePoint({ point }) {
    const [conclusionVisible, setConclusionVisible] = useState(false);

    return (
        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
            {/* En-tête */}
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-100">
                <h3 className="font-semibold text-slate-700 text-sm">
                    {point.titre}
                </h3>
                {point.duree && (
                    <span className="text-xs text-slate-400">
                        {point.duree}
                    </span>
                )}
            </div>

            <div className="p-4 space-y-4">
                {/* Question prescrite */}
                <p className="text-xs italic text-slate-500">
                    {point.question}
                </p>

                {/* Visuels */}
                <PaireForme elements={point.elements} />

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
                                « {point.conclusion} »
                            </p>
                            <p className="text-xs text-blue-400 mt-1.5 italic">
                                Source : fiche S3 — phase ④ mise en commun
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

CartePoint.propTypes = {
    point: PropTypes.shape({
        id: PropTypes.string.isRequired,
        titre: PropTypes.string.isRequired,
        duree: PropTypes.string,
        question: PropTypes.string.isRequired,
        conclusion: PropTypes.string.isRequired,
        elements: PropTypes.array.isRequired,
    }).isRequired,
};

// ── Données des points (source : fiche S3, phase ④) ──────────────────────────

/**
 * 3 points d'institutionnalisation prescrits par la fiche S3.
 * Conclusions reproduites fidèlement — ne pas modifier sans référence fiche S3.
 */
const POINTS = [
    {
        id: "1",
        titre: "Point 1 — Difficulté du tiers : pas de pliage simple",
        duree: "1 min 30",
        question:
            "« Pour un demi, on peut plier en deux. Pour un tiers, c'est différent. Pourquoi ? »",
        conclusion:
            "Pour un demi, on peut plier en deux. Pour un tiers, il faut tracer ou utiliser un gabarit. La contrainte reste la même : les 3 parts doivent être ÉGALES.",
        elements: [
            {
                forme: "disque",
                denominateur: 2,
                etat: "colorie",
                label: "1/2 (pliage possible)",
                taille: 90,
            },
            {
                forme: "disque",
                denominateur: 3,
                etat: "colorie",
                label: "1/3 (gabarit 120°)",
                taille: 90,
            },
        ],
    },
    {
        id: "2",
        titre: "Point 2 — La relation 1/3 = 2/6 sur l'hexagone",
        duree: "3 min",
        question:
            "« Combien de triangles dans un tiers ? Dans un sixième ? Alors, dans un tiers, il y a combien de sixièmes ? »",
        conclusion:
            "Un tiers de l'hexagone = 2 sixièmes. Un sixième est la moitié d'un tiers du même tout. Un tiers est plus grand qu'un sixième.",
        elements: [
            {
                forme: "hexagone",
                denominateur: 3,
                etat: "colorie",
                partColoriee: 0,
                label: "1/3 (2 triangles)",
                taille: 95,
            },
            {
                forme: "hexagone",
                denominateur: 6,
                etat: "colorie",
                partColoriee: 0,
                label: "1/6 (1 triangle)",
                taille: 95,
            },
        ],
    },
    {
        id: "3",
        titre: "Point 3 — Toujours par rapport au tout",
        duree: "1 min 30",
        question:
            "« Ces deux parties sont toutes les deux un sixième. Sont-elles de la même taille ? »",
        conclusion:
            "Un sixième de disque ≠ un sixième d'hexagone, car les touts ne sont pas les mêmes. La fraction s'interprète toujours par rapport à son tout.",
        elements: [
            {
                forme: "disque",
                denominateur: 6,
                etat: "colorie",
                label: "1/6 du disque",
                taille: 90,
            },
            {
                forme: "hexagone",
                denominateur: 6,
                etat: "colorie",
                label: "1/6 de l'hexagone",
                taille: 90,
            },
        ],
    },
];

// ── Composant principal ───────────────────────────────────────────────────────

/**
 * Mise en commun S3 — 3 points d'institutionnalisation.
 * @returns {JSX.Element}
 */
export default function CorpusMiseEnCommunS3() {
    return (
        <div className="space-y-4">
            <div className="px-1">
                <h2 className="font-bold text-slate-700 text-base">
                    Mise en commun — 3 points d'institutionnalisation
                </h2>
                <p className="text-xs text-slate-400">
                    Cliquez sur « Afficher la conclusion » après échange avec
                    les élèves.
                </p>
            </div>
            <div className="space-y-3">
                {POINTS.map((point) => (
                    <CartePoint key={point.id} point={point} />
                ))}
            </div>
        </div>
    );
}
