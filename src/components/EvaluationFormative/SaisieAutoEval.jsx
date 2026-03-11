/**
 * @fileoverview SaisieAutoEval — saisie de l'auto-évaluation d'un élève.
 *
 * L'enseignant reporte ici les réponses que l'élève a données sur la grille
 * papier remplie pendant la session C de S6.
 *
 * Affiche les 6 items (libellés exacts de la fiche S6) avec les 3 niveaux.
 * Les items critères pour la décision vers S3 sont mis en évidence (RF-M4-08).
 *
 * Sources :
 *   - Fiche S6, grille d'auto-évaluation session C
 *   - RF-M4-06, RF-M4-07, RF-M4-08 (SRS section 4.5.2)
 *   - ITEMS_AUTOEVAL, NIVEAUX, LIBELLES_NIVEAUX (autoeval.config.js)
 */

import PropTypes from "prop-types";
import {
    ITEMS_AUTOEVAL,
    NIVEAUX,
    LIBELLES_NIVEAUX,
} from "../../config/autoeval.config";

/** Couleurs des boutons de niveau */
const COULEURS_NIVEAU = {
    [NIVEAUX.OUI]: "bg-emerald-500 text-white border-emerald-500",
    [NIVEAUX.EN_COURS]: "bg-amber-400 text-white border-amber-400",
    [NIVEAUX.PAS_ENCORE]: "bg-rose-400 text-white border-rose-400",
};

const COULEUR_INACTIF =
    "bg-white text-slate-400 border-slate-200 hover:border-slate-400";

/**
 * Un item de la grille avec ses 3 boutons de niveau.
 *
 * @param {Object}   props
 * @param {import('../../config/autoeval.config').ItemAutoEval} props.item
 * @param {string|null} props.valeur   - Niveau actuel ou null
 * @param {Function} props.onChange    - (niveau: string|null) => void
 */
function LigneItem({ item, valeur, onChange }) {
    const niveaux = [NIVEAUX.OUI, NIVEAUX.EN_COURS, NIVEAUX.PAS_ENCORE];

    return (
        <div
            className={[
                "border rounded-xl px-4 py-3 space-y-2",
                item.critereVersS3
                    ? "border-amber-200 bg-amber-50"
                    : "border-slate-200 bg-white",
            ].join(" ")}
        >
            <div className="flex items-start gap-2">
                {/* Badge critère S3 */}
                {item.critereVersS3 && (
                    <span
                        className="shrink-0 mt-0.5 text-xs font-bold bg-amber-200 text-amber-800
            px-1.5 py-0.5 rounded"
                    >
                        → S3
                    </span>
                )}
                <p className="text-sm text-slate-700 leading-snug">
                    {item.libelle}
                </p>
            </div>

            {/* Boutons de niveau */}
            <div className="flex gap-2 flex-wrap">
                {niveaux.map((n) => (
                    <button
                        key={n}
                        type="button"
                        onClick={() => onChange(valeur === n ? null : n)}
                        title={
                            valeur === n
                                ? "Cliquer pour effacer"
                                : LIBELLES_NIVEAUX[n]
                        }
                        className={[
                            "px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors",
                            valeur === n ? COULEURS_NIVEAU[n] : COULEUR_INACTIF,
                        ].join(" ")}
                    >
                        {LIBELLES_NIVEAUX[n]}
                    </button>
                ))}
            </div>
        </div>
    );
}

LigneItem.propTypes = {
    item: PropTypes.shape({
        id: PropTypes.string.isRequired,
        libelle: PropTypes.string.isRequired,
        critereVersS3: PropTypes.bool.isRequired,
    }).isRequired,
    valeur: PropTypes.string,
    onChange: PropTypes.func.isRequired,
};

// ── Composant principal ───────────────────────────────────────────────────────

/**
 * @param {Object}   props
 * @param {string}   props.prenom     - Prénom de l'élève affiché en en-tête
 * @param {Object}   props.resultats  - Record<itemId, NIVEAUX|null>
 * @param {Function} props.onSetResultat - (itemId: string, niveau: string|null) => void
 * @param {Function} [props.onEleve Suivant] - Callback vers l'élève suivant
 * @param {boolean}  [props.aSuivant]  - S'il y a un élève suivant
 */
export default function SaisieAutoEval({
    prenom,
    resultats,
    onSetResultat,
    onEleveSuivant,
    aSuivant,
}) {
    const nbRemplis = Object.values(resultats).filter((v) => v !== null).length;
    const complet = nbRemplis === ITEMS_AUTOEVAL.length;

    return (
        <div className="space-y-4">
            {/* ── En-tête ── */}
            <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                    <h3 className="font-semibold text-slate-700 text-base">
                        Auto-évaluation de {prenom}
                    </h3>
                    <p className="text-xs text-slate-400">
                        Reportez les réponses cochées sur la grille papier de
                        l'élève.{" "}
                        <span className="font-medium text-slate-500">
                            {nbRemplis} / {ITEMS_AUTOEVAL.length} items
                            renseignés
                        </span>
                    </p>
                </div>
                {complet && (
                    <span
                        className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full
            font-semibold"
                    >
                        ✓ Complet
                    </span>
                )}
            </div>

            {/* ── Légende critères S3 ── */}
            <div
                className="flex items-center gap-2 text-xs text-amber-700 bg-amber-50
        border border-amber-200 rounded-lg px-3 py-2"
            >
                <span className="font-bold bg-amber-200 px-1.5 py-0.5 rounded">
                    → S3
                </span>
                <span>
                    Items critères pour la décision vers la séquence 3 (fiche S6
                    — items 3, 4 et 6).
                </span>
            </div>

            {/* ── Grille des 6 items ── */}
            <div className="space-y-2">
                {ITEMS_AUTOEVAL.map((item) => (
                    <LigneItem
                        key={item.id}
                        item={item}
                        valeur={resultats[item.id] ?? null}
                        onChange={(niveau) => onSetResultat(item.id, niveau)}
                    />
                ))}
            </div>

            {/* ── Navigation ── */}
            {onEleveSuivant && (
                <div className="flex justify-end pt-1">
                    <button
                        type="button"
                        onClick={onEleveSuivant}
                        disabled={!aSuivant}
                        className={[
                            "px-4 py-2 rounded-xl text-sm font-semibold transition-colors",
                            aSuivant
                                ? "bg-blue-600 text-white hover:bg-blue-700"
                                : "bg-slate-100 text-slate-300 cursor-not-allowed",
                        ].join(" ")}
                    >
                        Élève suivant →
                    </button>
                </div>
            )}
        </div>
    );
}

SaisieAutoEval.propTypes = {
    prenom: PropTypes.string.isRequired,
    resultats: PropTypes.object.isRequired,
    onSetResultat: PropTypes.func.isRequired,
    onEleveSuivant: PropTypes.func,
    aSuivant: PropTypes.bool,
};
