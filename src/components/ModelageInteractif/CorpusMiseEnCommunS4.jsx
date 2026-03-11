/**
 * @fileoverview CorpusMiseEnCommunS4 — institutionnalisation phase ④ (fiche S4).
 *
 * Structure prescrite par la fiche S4, phase ④ (7 min) :
 *
 *   Institutionnalisation 1 — Les deux nouvelles fractions (2 min)
 *     « Un cinquième de la bande, c'est une part quand la bande est
 *     partagée en 5 parts égales. Un dixième de la bande, c'est une part
 *     quand la bande est partagée en 10 parts égales. Et on a vu que
 *     1/10 = la moitié de 1/5 du même tout — comme 1/6 = la moitié de 1/3. »
 *     ✓ Règle : si on partage chaque part en deux, on double le nombre de
 *     parts → on obtient une fraction deux fois plus petite.
 *
 *   Institutionnalisation 2 — Tableau-répertoire des 7 fractions (3 min)
 *     Tableau prescrit fiche S4 : Fraction | Nom | Nombre de parts | Séance.
 *     Les 7 fractions du CE1 : 1/2, 1/3, 1/4, 1/5, 1/6, 1/8, 1/10.
 *
 *   Règle générale de comparaison (1 min)
 *     « Pour des fractions unitaires d'un même tout : plus le dénominateur
 *     est grand, plus la fraction est petite. »
 */

import { useState } from "react";
import PropTypes from "prop-types";
import LigneBande from "./BandeRepertoireVisuelle";
import { ORDRE_REPERTOIRE } from "./useModelageS4";

// ── Tableau-répertoire ────────────────────────────────────────────────────────

/**
 * Tableau des 7 fractions.
 * Source : fiche S4, phase ④ — libellés exacts.
 * Ordre : 1/2, 1/3, 1/4, 1/5, 1/6, 1/8, 1/10 (ordre du tableau fiche S4).
 */
const TABLEAU_REPERTOIRE = [
    {
        fraction: "1/2",
        nomLettres: "un demi",
        nbParts: "2 parts égales",
        seance: "S1–S2",
    },
    {
        fraction: "1/3",
        nomLettres: "un tiers",
        nbParts: "3 parts égales",
        seance: "S3",
    },
    {
        fraction: "1/4",
        nomLettres: "un quart",
        nbParts: "4 parts égales",
        seance: "S1–S2",
    },
    {
        fraction: "1/5",
        nomLettres: "un cinquième",
        nbParts: "5 parts égales",
        seance: "S4",
    },
    {
        fraction: "1/6",
        nomLettres: "un sixième",
        nbParts: "6 parts égales",
        seance: "S3",
    },
    {
        fraction: "1/8",
        nomLettres: "un huitième",
        nbParts: "8 parts égales",
        seance: "S1–S2",
    },
    {
        fraction: "1/10",
        nomLettres: "un dixième",
        nbParts: "10 parts égales",
        seance: "S4",
    },
];

/**
 * Tableau-répertoire des 7 fractions (fiche S4, phase ④).
 */
function TableauRepertoire() {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
                <thead>
                    <tr className="bg-slate-100">
                        {[
                            "Fraction",
                            "Nom en lettres",
                            "Nombre de parts",
                            "Séance",
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
                    {TABLEAU_REPERTOIRE.map((row, i) => (
                        <tr
                            key={row.fraction}
                            className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}
                        >
                            <td className="px-3 py-2 font-bold text-blue-700 border border-slate-200">
                                {row.fraction}
                            </td>
                            <td className="px-3 py-2 text-slate-700 border border-slate-200">
                                {row.nomLettres}
                            </td>
                            <td className="px-3 py-2 text-slate-600 border border-slate-200">
                                {row.nbParts}
                            </td>
                            <td className="px-3 py-2 text-slate-400 text-xs border border-slate-200">
                                {row.seance}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <p className="text-xs text-slate-400 mt-1 italic px-1">
                Source : fiche S4 — phase ④ tableau-répertoire collectif
            </p>
        </div>
    );
}

// ── Carte d'un point ──────────────────────────────────────────────────────────

/**
 * @param {{ point: object }} props
 */
function CartePoint({ point }) {
    const [conclusionVisible, setConclusionVisible] = useState(false);

    return (
        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
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
            <div className="p-4 space-y-3">
                <p className="text-xs italic text-slate-500">
                    {point.question}
                </p>

                {point.contenu}

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
                                Source : fiche S4 — phase ④
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
        titre: PropTypes.string.isRequired,
        duree: PropTypes.string,
        question: PropTypes.string.isRequired,
        conclusion: PropTypes.string.isRequired,
        contenu: PropTypes.node.isRequired,
    }).isRequired,
};

// ── Visuels bande pour la relation 1/5 → 1/10 ────────────────────────────────

/**
 * Deux bandes côte à côte : 1/5 et 1/10.
 * SVG inline — bande rectangulaire 5 ou 10 parts, 1 part coloriée.
 */
function PaireBandes() {
    const W = 200,
        H = 22;
    const fractions = [
        { denominateur: 5, couleur: "#10b981", label: "1/5 (un cinquième)" },
        { denominateur: 10, couleur: "#3b82f6", label: "1/10 (un dixième)" },
    ];

    return (
        <div className="flex flex-wrap items-end justify-center gap-6">
            {fractions.map((f) => (
                <div
                    key={f.denominateur}
                    className="flex flex-col items-start gap-1"
                >
                    <svg
                        width={W}
                        height={H}
                        viewBox={`0 0 ${W} ${H}`}
                        role="img"
                        aria-label={f.label}
                    >
                        {Array.from({ length: f.denominateur }, (_, i) => (
                            <rect
                                key={i}
                                x={i * (W / f.denominateur) + 0.5}
                                y={0.5}
                                width={W / f.denominateur - 1}
                                height={H - 1}
                                fill={i === 0 ? f.couleur : "#f8fafc"}
                                stroke={i === 0 ? f.couleur : "#cbd5e1"}
                                strokeWidth={0.8}
                                rx={1}
                            />
                        ))}
                        <rect
                            x={0.5}
                            y={0.5}
                            width={W - 1}
                            height={H - 1}
                            fill="none"
                            stroke="#475569"
                            strokeWidth={1.2}
                            rx={2}
                        />
                    </svg>
                    <span className="text-xs text-slate-500">{f.label}</span>
                </div>
            ))}
        </div>
    );
}

// ── Composant principal ───────────────────────────────────────────────────────

/**
 * Mise en commun S4 — 3 points d'institutionnalisation.
 * @returns {JSX.Element}
 */
export default function CorpusMiseEnCommunS4() {
    const points = [
        {
            titre: "Point 1 — Les deux nouvelles fractions",
            duree: "2 min",
            question:
                "« En combien de parts partage-t-on pour un cinquième ? Pour un dixième ? Quel est le lien entre les deux ? »",
            contenu: <PaireBandes />,
            conclusion:
                "Un cinquième de la bande, c'est une part quand la bande est partagée en 5 parts égales. Un dixième, c'est une part sur 10. Et 1/10 = la moitié de 1/5 du même tout — comme 1/6 = la moitié de 1/3. Si on partage chaque part en deux, on double le nombre de parts : on obtient une fraction deux fois plus petite.",
        },
        {
            titre: "Point 2 — Tableau-répertoire des 7 fractions",
            duree: "3 min",
            question:
                "« Ce tableau, c'est votre répertoire des fractions. Vous pouvez l'utiliser pendant toute la suite de la séquence. »",
            contenu: <TableauRepertoire />,
            conclusion:
                "Le répertoire contient les 7 fractions unitaires du CE1 : un demi, un tiers, un quart, un cinquième, un sixième, un huitième et un dixième. Chacune correspond à une part quand le tout est partagé en 2, 3, 4, 5, 6, 8 ou 10 parts égales.",
        },
        {
            titre: "Point 3 — Règle générale de comparaison",
            duree: "1 min",
            question:
                '« Regardez la ligne "nombre de parts". Quand on passe de 1/2 à 1/10, les parts coloriées deviennent plus grandes ou plus petites ? »',
            contenu: (
                <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-800">
                    Sur la bande-répertoire : 1/2 a la plus grande part ; 1/10 a
                    la plus petite.
                </div>
            ),
            conclusion:
                "Pour des fractions unitaires d'un même tout : plus le dénominateur est grand, plus la fraction est petite. Un dixième est plus petit qu'un demi parce qu'on a partagé le même tout en beaucoup plus de parts.",
        },
    ];

    return (
        <div className="space-y-4">
            <div className="px-1">
                <h2 className="font-bold text-slate-700 text-base">
                    Mise en commun — Institutionnalisation
                </h2>
                <p className="text-xs text-slate-400">
                    Cliquez sur « Afficher la conclusion » après échange avec
                    les élèves.
                </p>
            </div>
            <div className="space-y-3">
                {points.map((p, i) => (
                    <CartePoint key={i} point={p} />
                ))}
            </div>
        </div>
    );
}
