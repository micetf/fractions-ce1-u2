/**
 * @fileoverview PriseEnMain — modale de prise en main de l'application.
 *
 * S'affiche à la première visite, rouvrable via le bouton « ? » de la navbar.
 * Format : écran compact (1 page), 3 blocs indépendants, bouton Fermer.
 *
 * Principe Tricot : blocs indépendants → pas de séquentialité imposée.
 * L'enseignant scanne ce qui l'intéresse et ferme.
 *
 * Contenu tracé au SRS section 2.1 et aux fiches S1–S6 :
 *   ① La séquence de référence (Eduscol 2025)
 *   ② Les trois matériaux numérisés par l'application
 *   ③ Comment démarrer (actions concrètes avant S1)
 *
 * @module components/PriseEnMain/PriseEnMain
 */

import PropTypes from "prop-types";
import { VUES } from "../../config/navigation.config";

// ── Contenu des blocs ─────────────────────────────────────────────────────────

/**
 * Bloc ① — La séquence.
 * Source : SRS section 2.1, fiches S1–S6 en-têtes.
 */
function BlocSequence() {
    return (
        <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <span
                    className="w-5 h-5 rounded-full bg-blue-100 text-blue-700
                    text-xs font-bold flex items-center justify-center shrink-0"
                >
                    1
                </span>
                La séquence de référence
            </h3>
            <div className="pl-7 space-y-1">
                <p className="text-xs text-slate-600 leading-relaxed">
                    Cet outil accompagne la{" "}
                    <strong className="font-semibold">Séquence n°1</strong> du{" "}
                    <em>Livret d'accompagnement CE1 — Mathématiques</em>{" "}
                    (Éduscol, 2025) : 6 séances pour enseigner les 7 fractions
                    unitaires du programme cycle 2.
                </p>
                <div className="flex flex-wrap gap-1 pt-1">
                    {["1/2", "1/3", "1/4", "1/5", "1/6", "1/8", "1/10"].map(
                        (f) => (
                            <span
                                key={f}
                                className="text-xs font-mono font-semibold px-2 py-0.5
                                bg-slate-100 text-slate-600 rounded"
                            >
                                {f}
                            </span>
                        )
                    )}
                </div>
            </div>
        </div>
    );
}

/**
 * Bloc ② — Les trois outils numériques.
 * Source : SRS section 2.1 — usages numériques cités dans les fiches.
 */
const OUTILS = [
    {
        module: "M1",
        remplace: "Le visualiseur numérique",
        detail: "Projection collective — S1, S3, S4, S5",
        classes: "bg-blue-50 border-blue-200 text-blue-700",
        badge: "bg-blue-100 text-blue-700",
    },
    {
        module: "M2",
        remplace: "Le jeu de cartes",
        detail: "Autonomie élève — S2, S6",
        classes: "bg-emerald-50 border-emerald-200 text-emerald-700",
        badge: "bg-emerald-100 text-emerald-700",
    },
    {
        module: "M4",
        remplace: "Les grilles d'observables",
        detail: "Évaluation formative — toutes séances",
        classes: "bg-violet-50 border-violet-200 text-violet-700",
        badge: "bg-violet-100 text-violet-700",
    },
];

function BlocOutils() {
    return (
        <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <span
                    className="w-5 h-5 rounded-full bg-blue-100 text-blue-700
                    text-xs font-bold flex items-center justify-center shrink-0"
                >
                    2
                </span>
                Ce que l'application numérise
            </h3>
            <div className="pl-7 space-y-2">
                {OUTILS.map((o) => (
                    <div
                        key={o.module}
                        className={`flex items-center gap-3 px-3 py-2 rounded-xl
                            border ${o.classes}`}
                    >
                        <span
                            className={`text-xs font-bold px-2 py-0.5 rounded-lg
                            shrink-0 ${o.badge}`}
                        >
                            {o.module}
                        </span>
                        <div className="min-w-0">
                            <p className="text-xs font-semibold leading-tight">
                                {o.remplace}
                            </p>
                            <p className="text-xs opacity-75 leading-tight">
                                {o.detail}
                            </p>
                        </div>
                    </div>
                ))}
                <p className="text-xs text-slate-400 italic">
                    M3 (bande-répertoire) complète M1 à partir de la séance 4.
                </p>
            </div>
        </div>
    );
}

/**
 * Bloc ③ — Comment démarrer.
 * Source : fiches S1 (matériel), M4 (liste de classe RF-M4-01).
 */
const ETAPES_DEMARRAGE = [
    {
        icone: "📋",
        texte: "Consulter la Séquence n°1 du livret Eduscol (lien dans le tableau de bord)",
    },
    {
        icone: "👥",
        texte: "Saisir la liste de classe dans M4 — elle sera réutilisée pour toutes les séances",
    },
    {
        icone: "🖥",
        texte: "Préparer M1 en plein écran pour la projection de la séance 1",
    },
    {
        icone: "✂️",
        texte: "Préparer le matériel physique : cartes vierges et feutres pour les élèves (fiche S1)",
    },
];

function BlocDemarrer() {
    return (
        <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <span
                    className="w-5 h-5 rounded-full bg-blue-100 text-blue-700
                    text-xs font-bold flex items-center justify-center shrink-0"
                >
                    3
                </span>
                Comment démarrer
            </h3>
            <ul className="pl-7 space-y-2">
                {ETAPES_DEMARRAGE.map((e, i) => (
                    <li key={i} className="flex items-start gap-2">
                        <span
                            className="text-base shrink-0 leading-tight"
                            aria-hidden="true"
                        >
                            {e.icone}
                        </span>
                        <p className="text-xs text-slate-600 leading-relaxed">
                            {e.texte}
                        </p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

// ── Composant principal ───────────────────────────────────────────────────────

/**
 * Modale de prise en main.
 *
 * @param {Object}   props
 * @param {Function} props.onFermer    - Ferme et mémorise dans localStorage
 * @param {Function} props.onNaviguer  - Navigation vers un module
 */
export default function PriseEnMain({ onFermer, onNaviguer }) {
    function allerEtFermer(vue) {
        onFermer();
        onNaviguer(vue);
    }

    return (
        /* Fond semi-transparent */
        <div
            className="fixed inset-0 z-50 flex items-center justify-center
                bg-black/40 p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="prise-en-main-titre"
            onClick={(e) => {
                if (e.target === e.currentTarget) onFermer();
            }}
        >
            {/* Carte modale */}
            <div
                className="bg-white rounded-2xl shadow-xl w-full max-w-lg
                max-h-[90vh] overflow-y-auto"
            >
                {/* ── En-tête ── */}
                <div
                    className="flex items-center justify-between px-6 py-4
                    border-b border-slate-100 sticky top-0 bg-white rounded-t-2xl
                    z-10"
                >
                    <div>
                        <h2
                            id="prise-en-main-titre"
                            className="text-base font-bold text-slate-800"
                        >
                            Bienvenue — Fractions CE1
                        </h2>
                        <p className="text-xs text-slate-400 mt-0.5">
                            Outil numérique pour la séquence Éduscol 2025
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onFermer}
                        aria-label="Fermer"
                        className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600
                            hover:bg-slate-100 flex items-center justify-center
                            transition-colors text-lg leading-none"
                    >
                        ×
                    </button>
                </div>

                {/* ── Corps — 3 blocs ── */}
                <div className="px-6 py-5 space-y-6">
                    <BlocSequence />

                    <div className="border-t border-slate-100" />

                    <BlocOutils />

                    <div className="border-t border-slate-100" />

                    <BlocDemarrer />
                </div>

                {/* ── Pied — actions ── */}
                <div
                    className="px-6 py-4 border-t border-slate-100 flex
                    items-center justify-between gap-3 flex-wrap"
                >
                    <p className="text-xs text-slate-400">
                        Rouvrable via le bouton{" "}
                        <span className="font-bold text-slate-500">?</span> dans
                        la barre de navigation.
                    </p>
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => allerEtFermer(VUES.EVALUATION)}
                            className="px-4 py-2 text-xs font-semibold rounded-xl
                                bg-violet-50 text-violet-700 border border-violet-200
                                hover:bg-violet-100 transition-colors"
                        >
                            Saisir la liste de classe →
                        </button>
                        <button
                            type="button"
                            onClick={onFermer}
                            className="px-4 py-2 text-xs font-semibold rounded-xl
                                bg-slate-800 text-white hover:bg-slate-700
                                transition-colors"
                        >
                            Commencer
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

PriseEnMain.propTypes = {
    onFermer: PropTypes.func.isRequired,
    onNaviguer: PropTypes.func.isRequired,
};
