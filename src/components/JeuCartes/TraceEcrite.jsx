/**
 * @fileoverview TraceEcrite — trace écrite institutionnalisée de la session C.
 *
 * Contenu prescrit mot pour mot par la fiche S2,
 * section « Élaboration de la trace écrite » :
 *
 *   « Un demi — Un quart — Un huitième
 *   • Un demi : la forme est partagée en 2 parts égales. Je colorie 1 part.
 *   • Un quart : la forme est partagée en 4 parts égales. Je colorie 1 part.
 *   • Un huitième : la forme est partagée en 8 parts égales. Je colorie 1 part. »
 *
 * ⚠ Les libellés sont reproduits fidèlement depuis la fiche.
 *    Ne pas modifier sans référence documentaire.
 *
 * Note : "un" (le tout) est absent de la trace écrite — cohérent avec la fiche
 * qui ne mentionne que les 3 fractions du répertoire S1.
 *
 * La trace écrite inclut les images SVG pour faciliter l'association
 * image/nom (continuité pédagogique avec les cartes fabriquées en S1).
 */

import PropTypes from "prop-types";
import { FormeImage } from "../FormesSVG";
import { getFractionById } from "../../config/fractions.config";

/**
 * Lignes de la trace écrite.
 * Source : fiche S2, section « Contenu de la trace écrite ».
 * Ordre et libellés stricts — ne pas modifier sans référence fiche S2.
 *
 * @type {Array<{ fractionId: string, texte: string }>}
 */
const LIGNES_TRACE = [
    {
        fractionId: "1-2",
        texte: "la forme est partagée en 2 parts égales. Je colorie 1 part.",
    },
    {
        fractionId: "1-4",
        texte: "la forme est partagée en 4 parts égales. Je colorie 1 part.",
    },
    {
        fractionId: "1-8",
        texte: "la forme est partagée en 8 parts égales. Je colorie 1 part.",
    },
];

/**
 * Une ligne de la trace écrite avec image + texte.
 * @param {{ fractionId: string, texte: string }} props
 */
function LigneTrace({ fractionId, texte }) {
    const fraction = getFractionById(fractionId);
    if (!fraction) return null;

    return (
        <div className="flex items-center gap-4 p-3 bg-white rounded-xl border border-slate-200">
            {/* Image SVG de la fraction */}
            <div className="shrink-0">
                <FormeImage fractionId={fractionId} taille={52} />
            </div>

            {/* Texte de la trace */}
            <p className="text-slate-700 text-sm leading-snug">
                <span className="font-semibold capitalize">
                    {fraction.nomLettres}
                </span>
                {" : "}
                {texte}
            </p>
        </div>
    );
}

LigneTrace.propTypes = {
    fractionId: PropTypes.string.isRequired,
    texte: PropTypes.string.isRequired,
};

/**
 * Composant TraceEcrite — affiche les 3 lignes institutionnalisées.
 *
 * @param {Object}   props
 * @param {Function} [props.onTerminer] - Callback déclenché quand l'élève
 *                                        valide avoir copié la trace.
 *                                        Si absent, le bouton n'est pas affiché.
 * @returns {JSX.Element}
 */
export default function TraceEcrite({ onTerminer }) {
    return (
        <div className="space-y-4">
            {/* ── En-tête ── */}
            <div className="flex items-center gap-2">
                <span className="text-xl" aria-hidden="true">
                    📓
                </span>
                <div>
                    <h3 className="font-bold text-slate-700 text-sm">
                        Ma trace écrite
                    </h3>
                    <p className="text-xs text-slate-400">
                        Copie ces phrases dans ton cahier de maths.
                    </p>
                </div>
            </div>

            {/* ── Titre de la trace (fiche S2 exact) ── */}
            <p className="font-bold text-slate-600 text-center text-sm tracking-wide">
                Un demi — Un quart — Un huitième
            </p>

            {/* ── Lignes ── */}
            <div className="space-y-2">
                {LIGNES_TRACE.map((ligne) => (
                    <LigneTrace
                        key={ligne.fractionId}
                        fractionId={ligne.fractionId}
                        texte={ligne.texte}
                    />
                ))}
            </div>

            {/* ── Validation copie ── */}
            {onTerminer && (
                <button
                    type="button"
                    onClick={onTerminer}
                    className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-colors text-sm mt-2"
                >
                    ✅ J'ai copié ma trace écrite dans mon cahier !
                </button>
            )}
        </div>
    );
}

TraceEcrite.propTypes = {
    onTerminer: PropTypes.func,
};
