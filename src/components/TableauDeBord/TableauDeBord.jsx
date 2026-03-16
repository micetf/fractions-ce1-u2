/**
 * @fileoverview TableauDeBord — module M0, vue d'ensemble de la séquence.
 *
 * Vue affichée au démarrage de l'application.
 * Accessible à l'enseignant pour piloter la séquence sur les 6 séances.
 *
 * Exigences couvertes :
 *   RF-M0-01 : 6 cartes séances (titre, durée, format, fractions, artefact)
 *   RF-M0-02 : Navigation vers M1–M4 depuis le tableau de bord
 *   RF-M0-03 : Indicateur de complétion des observables M4 par séance
 *   RF-M0-04 : Accès à la bande-répertoire en lecture à tout moment
 *
 * Sources :
 *   - RF-M0-01 à RF-M0-04 (SRS, section 4.1)
 *   - observables.config.js : SEANCES (données fixes issues des fiches)
 *   - fractions.config.js   : FRACTIONS (résolution fractionsIds → chiffres)
 *   - useObservablesFormatifs : getCompletionSeance (RF-M0-03)
 *
 * Architecture (décision sprint 14) :
 *   useObservablesFormatifs() est appelé directement ici (Option A).
 *   Justification : vues exclusives, jamais de coexistence avec
 *   ObservablesFormatifs dans le même arbre de rendu.
 *
 * @module components/TableauDeBord/TableauDeBord
 */

import PropTypes from "prop-types";
import { SEANCES } from "../../config/observables.config";
import { FRACTIONS } from "../../config/fractions.config";
import { VUES } from "../../config/navigation.config";
import { useObservablesFormatifs } from "../EvaluationFormative/useObservablesFormatifs";

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Résout les fractionsIds d'une séance en notations chiffrées affichables.
 * Ex. : ['1-2', '1-4'] → '1/2, 1/4'
 *
 * @param {string[]} fractionsIds
 * @returns {string}
 */
function resoudreFractions(fractionsIds) {
    return fractionsIds
        .map((id) => FRACTIONS.find((f) => f.id === id)?.chiffres ?? id)
        .join(", ");
}

// ── Constantes visuelles ──────────────────────────────────────────────────────

/**
 * Couleurs d'accentuation par séance — cohérence avec FractionLigne (M3)
 * et les palettes établies dans le projet.
 *
 * @type {Record<string, { bordure: string, titre: string, badge: string }>}
 */
const COULEURS_SEANCE = {
    S1: {
        bordure: "border-blue-200",
        titre: "text-blue-700",
        badge: "bg-blue-100 text-blue-700",
    },
    S2: {
        bordure: "border-blue-200",
        titre: "text-blue-700",
        badge: "bg-blue-100 text-blue-700",
    },
    S3: {
        bordure: "border-emerald-200",
        titre: "text-emerald-700",
        badge: "bg-emerald-100 text-emerald-700",
    },
    S4: {
        bordure: "border-amber-200",
        titre: "text-amber-700",
        badge: "bg-amber-100 text-amber-700",
    },
    S5: {
        bordure: "border-violet-200",
        titre: "text-violet-700",
        badge: "bg-violet-100 text-violet-700",
    },
    S6: {
        bordure: "border-violet-200",
        titre: "text-violet-700",
        badge: "bg-violet-100 text-violet-700",
    },
};

/**
 * Configuration des états de complétion des observables (RF-M0-03).
 * @type {Record<string, { label: string, classes: string, icone: string }>}
 */
const COMPLETION_UI = {
    non_commence: {
        label: "Non commencé",
        classes: "bg-slate-100 text-slate-500",
        icone: "○",
    },
    en_cours: {
        label: "En cours",
        classes: "bg-amber-100 text-amber-700",
        icone: "◑",
    },
    complet: {
        label: "Complet",
        classes: "bg-emerald-100 text-emerald-700",
        icone: "●",
    },
};

/**
 * Configuration des modules de navigation (RF-M0-02).
 * @type {Array<{ vue: string, module: string, label: string, description: string, classes: string }>}
 */
const MODULES_NAV = [
    {
        vue: VUES.MODELAGE,
        module: "M1",
        label: "Modelage",
        description: "Projection collective — S1, S3, S4, S5",
        classes: "border-blue-200 hover:bg-blue-50 hover:border-blue-400",
    },
    {
        vue: VUES.JEU_DE_CARTES,
        module: "M2",
        label: "Jeu de cartes",
        description: "Autonomie élève — S2, S6",
        classes:
            "border-emerald-200 hover:bg-emerald-50 hover:border-emerald-400",
    },
    {
        vue: VUES.BANDE_REPERTOIRE,
        module: "M3",
        label: "Répertoire",
        description: "Bande-répertoire — S4, S5, S6",
        classes: "border-amber-200 hover:bg-amber-50 hover:border-amber-400",
    },
    {
        vue: VUES.EVALUATION,
        module: "M4",
        label: "Évaluation",
        description: "Observables & bilan — toutes séances",
        classes: "border-violet-200 hover:bg-violet-50 hover:border-violet-400",
    },
];

// ── Sous-composants ───────────────────────────────────────────────────────────

/**
 * Badge de complétion des observables M4 (RF-M0-03).
 *
 * @param {Object} props
 * @param {'non_commence'|'en_cours'|'complet'} props.etat
 */
function BadgeCompletion({ etat }) {
    const ui = COMPLETION_UI[etat] ?? COMPLETION_UI.non_commence;
    return (
        <span
            className={`inline-flex items-center gap-1 text-xs font-semibold
            px-2 py-0.5 rounded-full ${ui.classes}`}
        >
            <span aria-hidden="true">{ui.icone}</span>
            {ui.label}
        </span>
    );
}

BadgeCompletion.propTypes = {
    etat: PropTypes.oneOf(["non_commence", "en_cours", "complet"]).isRequired,
};

// ─────────────────────────────────────────────────────────────────────────────

/**
 * Carte d'une séance (RF-M0-01 + RF-M0-03).
 *
 * @param {Object} props
 * @param {import('../../config/observables.config').Seance} props.seance
 * @param {'non_commence'|'en_cours'|'complet'} props.completion
 */
function CarteSeance({ seance, completion }) {
    const couleurs = COULEURS_SEANCE[seance.id] ?? COULEURS_SEANCE.S1;
    const fractions = resoudreFractions(seance.fractionsIds);
    const formatLabel = seance.format === "distribué" ? "3 × 15 min" : "Bloc";

    return (
        <div
            className={`bg-white border-2 ${couleurs.bordure} rounded-2xl p-4
            space-y-3 shadow-sm`}
        >
            {/* ── En-tête : identifiant + durée + format ── */}
            <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                    <span className={`text-2xl font-black ${couleurs.titre}`}>
                        {seance.id}
                    </span>
                    <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded-full
                        ${couleurs.badge}`}
                    >
                        {formatLabel}
                    </span>
                </div>
                <span className="text-xs text-slate-500 font-medium shrink-0">
                    {seance.duree}
                </span>
            </div>

            {/* ── Titre ── */}
            <p className="text-sm font-semibold text-slate-700 leading-snug">
                {seance.titre}
            </p>

            {/* ── Fractions ciblées ── */}
            <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs text-slate-400">Fractions :</span>
                <span className="text-xs font-mono font-semibold text-slate-600">
                    {fractions}
                </span>
            </div>

            {/* ── Artefact pédagogique ── */}
            <p className="text-xs text-slate-500 leading-snug border-t border-slate-100 pt-2">
                {seance.artefact}
            </p>

            {/* ── Badge complétion observables RF-M0-03 ── */}
            <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-slate-400">Observables M4 :</span>
                <BadgeCompletion etat={completion} />
            </div>
        </div>
    );
}

CarteSeance.propTypes = {
    seance: PropTypes.shape({
        id: PropTypes.string.isRequired,
        titre: PropTypes.string.isRequired,
        duree: PropTypes.string.isRequired,
        format: PropTypes.string.isRequired,
        fractionsIds: PropTypes.arrayOf(PropTypes.string).isRequired,
        artefact: PropTypes.string.isRequired,
    }).isRequired,
    completion: PropTypes.oneOf(["non_commence", "en_cours", "complet"])
        .isRequired,
};

// ─────────────────────────────────────────────────────────────────────────────

/**
 * Bouton de navigation vers un module (RF-M0-02).
 *
 * @param {Object}   props
 * @param {string}   props.module      - Ex. "M1"
 * @param {string}   props.label       - Libellé court
 * @param {string}   props.description - Sous-titre
 * @param {string}   props.classes     - Classes Tailwind d'accentuation
 * @param {Function} props.onClick
 */
function BoutonModule({ module, label, description, classes, onClick }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`flex flex-col items-start gap-0.5 px-4 py-3 rounded-xl
                border-2 bg-white text-left transition-colors w-full ${classes}`}
        >
            <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-slate-400">
                    {module}
                </span>
                <span className="text-sm font-bold text-slate-700">
                    {label}
                </span>
            </div>
            <span className="text-xs text-slate-500">{description}</span>
        </button>
    );
}

BoutonModule.propTypes = {
    module: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    classes: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
};

// ── Composant principal ───────────────────────────────────────────────────────

/**
 * Tableau de bord de séquence — module M0.
 *
 * @param {Object}   props
 * @param {Function} props.onNaviguer - (vue: string) => void — fourni par App.jsx
 */
export default function TableauDeBord({ onNaviguer }) {
    // Option A (décision sprint 14) : instance locale, vues exclusives.
    const { getCompletionSeance } = useObservablesFormatifs();

    return (
        <div className="max-w-5xl mx-auto p-6 space-y-6">
            {/* ── En-tête ── */}
            <div className="bg-white border border-slate-200 rounded-2xl px-6 py-4 shadow-sm">
                <h1 className="text-xl font-black text-slate-800">
                    Fractions CE1 — Tableau de bord
                </h1>
                <p className="text-sm text-slate-500 mt-0.5">
                    Séquence 2 · 6 séances · 7 fractions unitaires
                </p>
            </div>

            {/* ── Accès rapide bande-répertoire RF-M0-04 ── */}
            <button
                type="button"
                onClick={() => onNaviguer(VUES.BANDE_REPERTOIRE)}
                className="w-full flex items-center justify-between gap-3 px-5 py-3
                    bg-white border-2 border-amber-200 hover:border-amber-400
                    hover:bg-amber-50 rounded-xl text-left transition-colors shadow-sm"
            >
                <div className="flex items-center gap-3">
                    <span className="text-xl" aria-hidden="true">
                        📋
                    </span>
                    <div>
                        <p className="text-sm font-bold text-amber-800">
                            Bande-répertoire des 7 fractions
                        </p>
                        <p className="text-xs text-amber-600">
                            Accès en lecture à tout moment — M3
                        </p>
                    </div>
                </div>
                <span className="text-amber-400 text-lg" aria-hidden="true">
                    →
                </span>
            </button>

            {/* ── Hub modules RF-M0-02 ── */}
            <div>
                <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                    Modules
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {MODULES_NAV.map((m) => (
                        <BoutonModule
                            key={m.vue}
                            module={m.module}
                            label={m.label}
                            description={m.description}
                            classes={m.classes}
                            onClick={() => onNaviguer(m.vue)}
                        />
                    ))}
                </div>
            </div>

            {/* ── Grille des 6 séances RF-M0-01 + RF-M0-03 ── */}
            <div>
                <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                    Séances
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {SEANCES.map((seance) => (
                        <CarteSeance
                            key={seance.id}
                            seance={seance}
                            completion={getCompletionSeance(seance.id)}
                        />
                    ))}
                </div>
            </div>

            <p className="text-xs text-slate-400 text-center pb-2">
                Sprint 14 — M0 Tableau de bord (RF-M0-01 à RF-M0-04).
            </p>
        </div>
    );
}

TableauDeBord.propTypes = {
    onNaviguer: PropTypes.func.isRequired,
};
