/**
 * @fileoverview BandeRepertoireVisuelle — bande-répertoire de projection (M1, S4).
 *
 * Implémente la phase ③b de la séance 4 (fiche S4) :
 *
 *   « Prenez maintenant une grande bande. C'est votre bande-répertoire.
 *   Vous allez y représenter toutes les fractions qu'on a vues : un demi,
 *   un tiers, un quart, un cinquième, un sixième, un huitième et un
 *   dixième. Chaque fraction aura sa propre ligne. »
 *
 * Ordre prescrit par la fiche S4 :
 *   1/2 → 1/4 → 1/8 → 1/3 → 1/6 → 1/5 → 1/10
 *
 * Différent du module M3 (BandeRepertoire) qui est l'outil interactif
 * élève (sprint 1). Ce composant est un outil de projection enseignant
 * pour la séance 4 — statique, sans interaction élève.
 *
 * ⚠️ La fiche prescrit explicitement de ne pas aligner parfaitement
 *    les bandes : « L'enjeu est la comparaison des parts coloriées,
 *    pas la précision géométrique. »
 *    Ce composant respecte cela : toutes les bandes ont la même largeur
 *    (= le tout), les parts varient visuellement.
 */

import { useState } from "react";
import PropTypes from "prop-types";
import { ORDRE_REPERTOIRE } from "./useModelageS4";

// ── Palette ───────────────────────────────────────────────────────────────────

/** Couleurs par séance d'introduction (cohérence visuelle S1/S3/S4). */
const COULEUR_SEANCE = {
    S1: "#3b82f6", // blue-500
    S3: "#8b5cf6", // violet-500
    S4: "#10b981", // emerald-500
};

const C_NEUTRE = "#f8fafc";
const C_BORDURE = "#cbd5e1";
const C_BORD_EXT = "#475569";

// ── SVG d'une ligne de bande ─────────────────────────────────────────────────

/**
 * Une ligne de bande rectangulaire partagée en N parts, 1 part coloriée.
 * @param {Object} props
 * @param {number} props.denominateur
 * @param {string} props.couleur     - Couleur de la part coloriée
 * @param {number} props.largeur     - Largeur totale SVG en px (= le tout)
 * @param {number} props.hauteur     - Hauteur de la bande en px
 */
function LigneBande({ denominateur, couleur, largeur, hauteur }) {
    const largeurPart = largeur / denominateur;

    return (
        <svg
            width={largeur}
            height={hauteur}
            viewBox={`0 0 ${largeur} ${hauteur}`}
            role="img"
            aria-label={`Bande partagée en ${denominateur} parts`}
        >
            {/* Parts */}
            {Array.from({ length: denominateur }, (_, i) => (
                <rect
                    key={i}
                    x={i * largeurPart + 0.5}
                    y={0.5}
                    width={largeurPart - 1}
                    height={hauteur - 1}
                    fill={i === 0 ? couleur : C_NEUTRE}
                    stroke={i === 0 ? couleur : C_BORDURE}
                    strokeWidth={0.8}
                    rx={1}
                />
            ))}
            {/* Contour extérieur */}
            <rect
                x={0.5}
                y={0.5}
                width={largeur - 1}
                height={hauteur - 1}
                fill="none"
                stroke={C_BORD_EXT}
                strokeWidth={1.2}
                rx={2}
            />
        </svg>
    );
}

LigneBande.propTypes = {
    denominateur: PropTypes.number.isRequired,
    couleur: PropTypes.string.isRequired,
    largeur: PropTypes.number.isRequired,
    hauteur: PropTypes.number.isRequired,
};

// ── Composant principal ───────────────────────────────────────────────────────

/**
 * Bande-répertoire visuelle — 7 lignes en construction progressive.
 *
 * Affiche les lignes une à une selon l'ordre prescrit (fiche S4).
 * L'enseignant clique « Ajouter la ligne suivante » pour révéler
 * chaque fraction, simulant la construction guidée collective.
 *
 * @returns {JSX.Element}
 */
export default function BandeRepertoireVisuelle() {
    // Nombre de lignes révélées (0 = aucune, 7 = toutes)
    const [nbVisible, setNbVisible] = useState(0);

    const LARGEUR = 340;
    const HAUTEUR = 20;

    const lignesVisibles = ORDRE_REPERTOIRE.slice(0, nbVisible);
    const prochaineEtape = ORDRE_REPERTOIRE[nbVisible];

    /** Question de comparaison guidée — prescrite fiche S4 après la 7e ligne. */
    const comparaisonComplete = nbVisible >= ORDRE_REPERTOIRE.length;

    return (
        <div className="space-y-4">
            {/* ── En-tête ── */}
            <div className="px-1">
                <p className="text-xs text-slate-400 leading-relaxed">
                    Ordre prescrit fiche S4 : 1/2 → 1/4 → 1/8 → 1/3 → 1/6 → 1/5
                    → 1/10. Cliquer « Ajouter » pour révéler chaque fraction au
                    fur et à mesure.
                </p>
            </div>

            {/* ── Grille bandes + étiquettes ── */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-2 overflow-x-auto">
                {lignesVisibles.length === 0 && (
                    <p className="text-sm text-slate-300 text-center py-4 italic">
                        La bande-répertoire est vide. Cliquez sur « Ajouter »
                        pour commencer.
                    </p>
                )}

                {lignesVisibles.map((f) => (
                    <div key={f.id} className="flex items-center gap-3">
                        {/* Étiquette fraction */}
                        <span
                            className="text-xs font-semibold w-24 shrink-0 text-right"
                            style={{ color: COULEUR_SEANCE[f.seance] }}
                        >
                            {f.nomLettres}
                        </span>

                        {/* Bande SVG */}
                        <LigneBande
                            denominateur={f.denominateur}
                            couleur={COULEUR_SEANCE[f.seance]}
                            largeur={LARGEUR}
                            hauteur={HAUTEUR}
                        />

                        {/* Pastille séance */}
                        <span className="text-xs text-slate-300 w-6 shrink-0">
                            {f.seance}
                        </span>
                    </div>
                ))}
            </div>

            {/* ── Question de comparaison (après ligne 7) ── */}
            {comparaisonComplete && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 space-y-2">
                    <p className="text-xs font-bold text-blue-800">
                        Question de comparaison guidée (fiche S4) :
                    </p>
                    <p className="text-sm italic text-blue-700">
                        « Quelle est la plus grande fraction — celle dont la
                        part coloriée est la plus grande ? [1/2] Et la plus
                        petite ? [1/10] Pourquoi ? »
                    </p>
                    <p className="text-xs text-blue-600 font-semibold">
                        ✓ Plus le nombre de parts est grand, plus chaque part
                        est petite.
                    </p>
                </div>
            )}

            {/* ── Contrôles ── */}
            <div className="flex items-center gap-3 flex-wrap">
                {!comparaisonComplete && (
                    <button
                        type="button"
                        onClick={() =>
                            setNbVisible((n) =>
                                Math.min(n + 1, ORDRE_REPERTOIRE.length)
                            )
                        }
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors"
                    >
                        + Ajouter
                        {prochaineEtape
                            ? ` « ${prochaineEtape.nomLettres} »`
                            : ""}
                    </button>
                )}

                {comparaisonComplete && (
                    <span className="text-xs text-emerald-600 font-semibold">
                        ✅ Bande-répertoire complète — 7 fractions
                    </span>
                )}

                {nbVisible > 0 && (
                    <button
                        type="button"
                        onClick={() => setNbVisible(0)}
                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-medium rounded-xl transition-colors"
                    >
                        ↺ Recommencer
                    </button>
                )}

                {/* Tout afficher d'un coup */}
                {!comparaisonComplete &&
                    nbVisible < ORDRE_REPERTOIRE.length && (
                        <button
                            type="button"
                            onClick={() =>
                                setNbVisible(ORDRE_REPERTOIRE.length)
                            }
                            className="px-3 py-2 text-xs text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            Tout afficher
                        </button>
                    )}
            </div>

            {/* Légende séances */}
            <div className="flex items-center gap-4 text-xs text-slate-400 flex-wrap px-1">
                {["S1", "S3", "S4"].map((s) => (
                    <span key={s} className="flex items-center gap-1.5">
                        <span
                            className="inline-block w-3 h-3 rounded-sm"
                            style={{ background: COULEUR_SEANCE[s] }}
                        />
                        Séance {s}
                    </span>
                ))}
            </div>
        </div>
    );
}
