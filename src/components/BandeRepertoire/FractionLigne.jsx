/**
 * @fileoverview Composant FractionLigne — une ligne de la bande-répertoire.
 *
 * Affiche une fraction sous trois formes selon l'avancement de la séquence :
 *   - Nom en lettres        (disponible dès la séance d'introduction)
 *   - Représentation SVG    (disponible dès la séance d'introduction)
 *   - Écriture en chiffres  (disponible dès S5 — RF-M3-02)
 *
 * États :
 *   - « visible »   : fraction déjà introduite (seanceIntro ≤ seanceDebloquee)
 *   - « verrouillée » : fraction pas encore introduite
 *
 * Référence pédagogique :
 *   - Fiche S4 — tableau-répertoire : colonnes Fraction / Nom en lettres / Image / Séance
 *   - Fiche S5 — « Mise à jour du répertoire » : ajout de la colonne chiffres
 *   - RF-M3-01 et RF-M3-02 (SRS)
 */

import PropTypes from "prop-types";
import BandeSVG from "./BandeSVG";

/**
 * Couleurs de badge par séance d'introduction.
 * Cohérence visuelle : chaque couleur correspond à un groupe de fractions
 * introduit dans la même séance.
 */
const BADGE_SEANCE = {
    1: { bg: "bg-blue-100", texte: "text-blue-700", label: "S1" },
    3: { bg: "bg-emerald-100", texte: "text-emerald-700", label: "S3" },
    4: { bg: "bg-amber-100", texte: "text-amber-700", label: "S4" },
};

/**
 * @param {Object}  props
 * @param {import('../../config/fractions.config').Fraction} props.fraction
 * @param {boolean} props.visible          - La fraction est-elle débloquée ?
 * @param {boolean} props.afficherChiffres - Afficher la colonne écriture en chiffres ?
 */
export default function FractionLigne({ fraction, visible, afficherChiffres }) {
    const badge = BADGE_SEANCE[fraction.seanceIntro] ?? {
        bg: "bg-slate-100",
        texte: "text-slate-500",
        label: `S${fraction.seanceIntro}`,
    };

    /* ── État verrouillé ───────────────────────────────────────────────────── */
    if (!visible) {
        return (
            <tr className="border-b border-slate-100">
                {/* Badge séance */}
                <td className="py-2 px-3 w-12 text-center">
                    <span
                        className={`inline-block text-xs font-semibold px-1.5 py-0.5 rounded ${badge.bg} ${badge.texte} opacity-40`}
                    >
                        {badge.label}
                    </span>
                </td>

                {/* Nom en lettres — masqué */}
                <td className="py-2 px-4 w-36">
                    <span className="inline-block h-4 w-24 rounded bg-slate-200 animate-pulse" />
                </td>

                {/* Bande SVG — grisée */}
                <td className="py-2 px-4">
                    <BandeSVG denominateur={fraction.denominateur} grise />
                </td>

                {/* Colonne chiffres — masquée si présente */}
                {afficherChiffres && (
                    <td className="py-2 px-4 w-16 text-center">
                        <span className="inline-block h-4 w-8 rounded bg-slate-200 animate-pulse" />
                    </td>
                )}
            </tr>
        );
    }

    /* ── État visible ─────────────────────────────────────────────────────── */
    return (
        <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
            {/* Badge séance d'introduction */}
            <td className="py-2 px-3 w-12 text-center">
                <span
                    className={`inline-block text-xs font-semibold px-1.5 py-0.5 rounded ${badge.bg} ${badge.texte}`}
                >
                    {badge.label}
                </span>
            </td>

            {/* Nom en lettres — source : fiche S4, colonne « Nom en lettres » */}
            <td className="py-2 px-4 w-36">
                <span className="text-sm font-medium text-slate-700">
                    {fraction.nomLettres}
                </span>
            </td>

            {/* Représentation SVG sur bande */}
            <td className="py-2 px-4">
                <BandeSVG denominateur={fraction.denominateur} />
            </td>

            {/* Écriture en chiffres — disponible dès S5 (RF-M3-02) */}
            {afficherChiffres && (
                <td className="py-2 px-4 w-16 text-center">
                    <span className="text-base font-mono font-bold text-blue-700 tracking-wide">
                        {fraction.chiffres}
                    </span>
                </td>
            )}
        </tr>
    );
}

FractionLigne.propTypes = {
    fraction: PropTypes.shape({
        id: PropTypes.string.isRequired,
        denominateur: PropTypes.number.isRequired,
        chiffres: PropTypes.string.isRequired,
        nomLettres: PropTypes.string.isRequired,
        seanceIntro: PropTypes.number.isRequired,
    }).isRequired,
    visible: PropTypes.bool.isRequired,
    afficherChiffres: PropTypes.bool.isRequired,
};
