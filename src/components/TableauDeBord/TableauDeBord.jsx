/**
 * @fileoverview TableauDeBord — module M0, vue d'ensemble de la séquence.
 *
 * Sources : RF-M0-01 à RF-M0-04 (SRS, section 4.1)
 *           SRS section 2.1 — trois usages numériques tracés aux fiches
 *           Tricot (cité fiches S3/S4) — réduction charge extrinsèque :
 *             référence et usages regroupés dans une seule carte.
 */

import PropTypes from "prop-types";
import { SEANCES } from "../../config/observables.config";
import { FRACTIONS } from "../../config/fractions.config";
import { VUES } from "../../config/navigation.config";
import { useObservablesFormatifs } from "../EvaluationFormative/useObservablesFormatifs";

// ── Helpers ───────────────────────────────────────────────────────────────────

function resoudreFractions(fractionsIds) {
    return fractionsIds
        .map((id) => FRACTIONS.find((f) => f.id === id)?.chiffres ?? id)
        .join(", ");
}

// ── Données pédagogiques ──────────────────────────────────────────────────────

/**
 * Trois usages numériques de l'application, tracés au SRS section 2.1
 * et aux fiches de préparation S1–S6.
 *
 * Chaque usage correspond à un matériau cité dans les fiches que
 * l'application prend en charge numériquement.
 */
const USAGES_NUMERIQUES = [
    {
        vue: VUES.MODELAGE,
        module: "M1",
        libelle: "Le visualiseur numérique",
        seances: "S1, S3, S4, S5",
        classes: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100",
    },
    {
        vue: VUES.JEU_DE_CARTES,
        module: "M2",
        libelle: "Le jeu de cartes interactif",
        seances: "S2, S6",
        classes:
            "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100",
    },
    {
        vue: VUES.EVALUATION,
        module: "M4",
        libelle: "Les grilles d'observables",
        seances: "Toutes séances",
        classes:
            "bg-violet-50 text-violet-700 border-violet-200 hover:bg-violet-100",
    },
];

const SEANCES_MODULES = {
    S1: { utilisateur: "Enseignant", vues: [VUES.MODELAGE, VUES.EVALUATION] },
    S2: { utilisateur: "Élèves", vues: [VUES.JEU_DE_CARTES, VUES.EVALUATION] },
    S3: { utilisateur: "Enseignant", vues: [VUES.MODELAGE, VUES.EVALUATION] },
    S4: {
        utilisateur: "Enseignant",
        vues: [VUES.MODELAGE, VUES.BANDE_REPERTOIRE, VUES.EVALUATION],
    },
    S5: {
        utilisateur: "Enseignant",
        vues: [VUES.MODELAGE, VUES.BANDE_REPERTOIRE, VUES.EVALUATION],
    },
    S6: {
        utilisateur: "Élèves · Enseignant",
        vues: [VUES.JEU_DE_CARTES, VUES.BANDE_REPERTOIRE, VUES.EVALUATION],
    },
};

const VUE_MODULE_CONFIG = {
    [VUES.MODELAGE]: {
        label: "M1",
        classes: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100",
    },
    [VUES.JEU_DE_CARTES]: {
        label: "M2",
        classes:
            "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100",
    },
    [VUES.BANDE_REPERTOIRE]: {
        label: "M3",
        classes:
            "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100",
    },
    [VUES.EVALUATION]: {
        label: "M4",
        classes:
            "bg-violet-50 text-violet-700 border-violet-200 hover:bg-violet-100",
    },
};

const UTILISATEUR_CLASSES = {
    Enseignant: "bg-slate-100 text-slate-600",
    Élèves: "bg-teal-50 text-teal-700",
    "Élèves · Enseignant": "bg-slate-100 text-slate-600",
};

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
 * Carte Eduscol enrichie — référence + trois usages numériques intégrés.
 *
 * Principe Tricot : référence documentaire et usages regroupés
 * dans une seule unité cognitive — pas de split-attention.
 */
function CarteEduscol({ onNaviguer }) {
    return (
        <div
            className="bg-blue-50 border border-blue-200 rounded-2xl shadow-sm
            overflow-hidden"
        >
            {/* ── En-tête cliquable — lien vers le PDF ── */}
            <a
                href="https://eduscol.education.gouv.fr/sites/default/files/document/2025livretaccompagnementmathce1pdf-116325.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 px-5 py-4 hover:bg-blue-100
                    transition-colors group"
            >
                <span className="text-2xl shrink-0" aria-hidden="true">
                    📘
                </span>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-blue-800">
                        Livret d'accompagnement CE1 — Mathématiques
                    </p>
                    <p className="text-xs text-blue-600 mt-0.5">
                        Éduscol / MEN · 2025 · Séquence n°1 — Enseigner les
                        fractions
                    </p>
                </div>
                <span
                    className="text-blue-400 text-sm shrink-0 group-hover:translate-x-1
                        transition-transform"
                    aria-hidden="true"
                >
                    →
                </span>
            </a>

            {/* ── Séparateur + accroche ── */}
            <div className="border-t border-blue-200 px-5 py-3 bg-white">
                <p className="text-xs text-slate-500">
                    Cet outil numérise trois matériaux mentionnés dans les
                    fiches de la séquence :
                </p>
            </div>

            {/* ── Trois usages — cliquables ── */}
            <div className="divide-y divide-blue-100">
                {USAGES_NUMERIQUES.map((usage) => (
                    <button
                        key={usage.vue}
                        type="button"
                        onClick={() => onNaviguer(usage.vue)}
                        className="w-full flex items-center gap-3 px-5 py-3 bg-white
                            hover:bg-slate-50 transition-colors text-left"
                    >
                        {/* Badge module */}
                        <span
                            className={[
                                "shrink-0 text-xs font-bold px-2 py-1 rounded-lg border",
                                "min-w-10 text-center transition-colors",
                                usage.classes,
                            ].join(" ")}
                        >
                            {usage.module}
                        </span>

                        {/* Libellé */}
                        <span className="flex-1 text-sm text-slate-700 font-medium">
                            {usage.libelle}
                        </span>

                        {/* Séances */}
                        <span className="text-xs text-slate-400 shrink-0">
                            {usage.seances}
                        </span>

                        {/* Flèche */}
                        <span
                            className="text-slate-300 text-xs shrink-0"
                            aria-hidden="true"
                        >
                            →
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
}

CarteEduscol.propTypes = {
    onNaviguer: PropTypes.func.isRequired,
};

// ─────────────────────────────────────────────────────────────────────────────

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

function CarteSeance({ seance, completion, onNaviguer }) {
    const couleurs = COULEURS_SEANCE[seance.id] ?? COULEURS_SEANCE.S1;
    const fractions = resoudreFractions(seance.fractionsIds);
    const formatLabel = seance.format === "distribué" ? "3 × 15 min" : "Bloc";
    const info = SEANCES_MODULES[seance.id];

    return (
        <div
            className={`bg-white border-2 ${couleurs.bordure} rounded-2xl p-4
            space-y-3 shadow-sm flex flex-col`}
        >
            <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-2xl font-black ${couleurs.titre}`}>
                        {seance.id}
                    </span>
                    <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded-full
                        ${couleurs.badge}`}
                    >
                        {formatLabel}
                    </span>
                    {info && (
                        <span
                            className={`text-xs font-medium px-2 py-0.5 rounded-full
                            ${UTILISATEUR_CLASSES[info.utilisateur] ?? "bg-slate-100 text-slate-600"}`}
                        >
                            {info.utilisateur}
                        </span>
                    )}
                </div>
                <span className="text-xs text-slate-500 font-medium shrink-0">
                    {seance.duree}
                </span>
            </div>

            <p className="text-sm font-semibold text-slate-700 leading-snug flex-1">
                {seance.titre}
            </p>

            <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs text-slate-400">Fractions :</span>
                <span className="text-xs font-mono font-semibold text-slate-600">
                    {fractions}
                </span>
            </div>

            <p
                className="text-xs text-slate-500 leading-snug border-t
                border-slate-100 pt-2"
            >
                {seance.artefact}
            </p>

            <div className="flex items-center justify-between gap-2 pt-1">
                <div className="flex gap-1.5 flex-wrap">
                    {info?.vues.map((vue) => {
                        const cfg = VUE_MODULE_CONFIG[vue];
                        if (!cfg) return null;
                        return (
                            <button
                                key={vue}
                                type="button"
                                onClick={() => onNaviguer(vue)}
                                aria-label={`Naviguer vers le module ${cfg.label}`}
                                className={[
                                    "text-xs font-bold px-2.5 py-1 rounded-lg border",
                                    "transition-colors",
                                    cfg.classes,
                                ].join(" ")}
                            >
                                {cfg.label}
                            </button>
                        );
                    })}
                </div>
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
    onNaviguer: PropTypes.func.isRequired,
};

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
 * @param {Object}   props
 * @param {Function} props.onNaviguer - (vue: string) => void
 */
export default function TableauDeBord({ onNaviguer }) {
    const { getCompletionSeance } = useObservablesFormatifs();

    return (
        <div className="max-w-5xl mx-auto p-6 space-y-6">
            {/* ── En-tête ── */}
            <div
                className="bg-white border border-slate-200 rounded-2xl px-6
                py-4 shadow-sm"
            >
                <h1 className="text-xl font-black text-slate-800">
                    Fractions CE1 — Tableau de bord
                </h1>
                <p className="text-sm text-slate-500 mt-0.5">
                    Séquence 2 · 6 séances · 7 fractions unitaires
                </p>
            </div>

            {/* ── Carte Eduscol + usages numériques (unité cognitive unique) ── */}
            <CarteEduscol onNaviguer={onNaviguer} />

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
                <h2
                    className="text-xs font-semibold text-slate-400 uppercase
                    tracking-wider mb-3"
                >
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
                <div className="flex items-center justify-between mb-3">
                    <h2
                        className="text-xs font-semibold text-slate-400 uppercase
                        tracking-wider"
                    >
                        Séances
                    </h2>
                    <div className="flex items-center gap-3 text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                            <span
                                className="w-2 h-2 rounded-full bg-slate-300
                                inline-block"
                            />
                            Enseignant
                        </span>
                        <span className="flex items-center gap-1">
                            <span
                                className="w-2 h-2 rounded-full bg-teal-300
                                inline-block"
                            />
                            Élèves
                        </span>
                        <span className="hidden sm:flex items-center gap-1">
                            Badges = modules actifs
                        </span>
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {SEANCES.map((seance) => (
                        <CarteSeance
                            key={seance.id}
                            seance={seance}
                            completion={getCompletionSeance(seance.id)}
                            onNaviguer={onNaviguer}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

TableauDeBord.propTypes = {
    onNaviguer: PropTypes.func.isRequired,
};
