/**
 * @fileoverview FicheObservableEleve — saisie des observables pour un élève.
 *
 * Affiche tous les observables d'une séance pour un élève sélectionné.
 * Pour chaque observable :
 *   - Boutons de saisie ✓ / ✗ / --- (RF-M4-03)
 *   - Régulation affichée automatiquement si la valeur est ✗ (RF-M4-04)
 *
 * Pattern : fiche individuelle (décision sprint 13a — cohérence avec SaisieAutoEval).
 *
 * Sources :
 *   - RF-M4-03 (SRS) : saisie ✓ / ✗ / ---
 *   - RF-M4-04 (SRS) : régulation automatique si ✗
 *   - observables.config.js : libellés et régulations issus des fiches
 *
 * @module components/EvaluationFormative/FicheObservableEleve
 */

import PropTypes from "prop-types";
import { VALEURS, VALEURS_UI } from "./useObservablesFormatifs";

/**
 * Bouton de saisie d'une valeur (✓ / ✗ / ---).
 *
 * @param {Object}   props
 * @param {string}   props.valeur   - Une des constantes VALEURS
 * @param {boolean}  props.actif    - Ce bouton est-il la valeur courante ?
 * @param {Function} props.onClick  - () => void
 */
function BoutonValeur({ valeur, actif, onClick }) {
    const ui = VALEURS_UI[valeur];
    return (
        <button
            type="button"
            onClick={onClick}
            aria-pressed={actif}
            title={ui.label}
            className={[
                "w-11 h-11 rounded-xl border-2 text-base font-bold transition-all",
                "focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-400",
                actif
                    ? `${ui.classes} shadow-sm scale-105`
                    : "bg-white border-slate-200 text-slate-400 hover:border-slate-300",
            ].join(" ")}
        >
            {ui.signe}
        </button>
    );
}

BoutonValeur.propTypes = {
    valeur: PropTypes.string.isRequired,
    actif: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired,
};

// ─────────────────────────────────────────────────────────────────────────────

/**
 * Ligne d'observable — libellé + saisie + régulation conditionnelle.
 *
 * @param {Object}                    props
 * @param {import('../../config/observables.config').Observable} props.observable
 * @param {string|null}               props.valeur      - VALEURS ou null
 * @param {Function}                  props.onChange    - (valeur: string|null) => void
 * @param {number}                    props.index       - Numéro d'ordre (1-based)
 */
function LigneObservable({ observable, valeur, onChange, index }) {
    const estNonAtteint = valeur === VALEURS.NON_ATTEINT;

    return (
        <div
            className={[
                "rounded-xl border p-4 space-y-3 transition-colors",
                estNonAtteint
                    ? "border-red-200 bg-red-50"
                    : "border-slate-200 bg-white",
            ].join(" ")}
        >
            {/* ── Libellé + boutons ── */}
            <div className="flex items-start justify-between gap-4">
                {/* Numéro + libellé */}
                <div className="flex items-start gap-3 flex-1 min-w-0">
                    <span
                        className="shrink-0 w-6 h-6 rounded-full bg-slate-100 text-slate-500
                        text-xs font-bold flex items-center justify-center mt-0.5"
                    >
                        {index}
                    </span>
                    <p className="text-sm text-slate-700 leading-snug">
                        {observable.libelle}
                    </p>
                </div>

                {/* Boutons de saisie */}
                <div className="flex gap-1.5 shrink-0">
                    {Object.values(VALEURS).map((v) => (
                        <BoutonValeur
                            key={v}
                            valeur={v}
                            actif={valeur === v}
                            onClick={() => onChange(valeur === v ? null : v)}
                        />
                    ))}
                </div>
            </div>

            {/* ── Régulation RF-M4-04 : visible uniquement si ✗ ── */}
            {estNonAtteint && (
                <div className="flex gap-2 pl-9">
                    <span
                        className="text-red-400 text-sm shrink-0 mt-0.5"
                        aria-hidden="true"
                    >
                        ↳
                    </span>
                    <p className="text-sm text-red-700 leading-snug">
                        <span className="font-semibold">Régulation : </span>
                        {observable.regulation}
                    </p>
                </div>
            )}

            {/* Phase source (discret, aide à la contextualisation) */}
            <div className="pl-9">
                <span className="text-xs text-slate-400">
                    {observable.phase}
                </span>
            </div>
        </div>
    );
}

LigneObservable.propTypes = {
    observable: PropTypes.shape({
        id: PropTypes.string.isRequired,
        phase: PropTypes.string.isRequired,
        libelle: PropTypes.string.isRequired,
        regulation: PropTypes.string.isRequired,
    }).isRequired,
    valeur: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    index: PropTypes.number.isRequired,
};

LigneObservable.defaultProps = {
    valeur: null,
};

// ─────────────────────────────────────────────────────────────────────────────

/**
 * FicheObservableEleve — fiche complète d'un élève pour une séance.
 *
 * @param {Object}   props
 * @param {string}   props.prenom               - Prénom de l'élève affiché
 * @param {import('../../config/observables.config').Observable[]} props.observables
 * @param {Function} props.getValeur             - (obsId: string) => string|null
 * @param {Function} props.onSetValeur           - (obsId: string, valeur: string|null) => void
 * @param {Function} props.onElevePrecedent      - () => void | undefined
 * @param {Function} props.onEleveSuivant        - () => void | undefined
 * @param {boolean}  props.aPrecedent            - Bouton ← actif ?
 * @param {boolean}  props.aSuivant              - Bouton → actif ?
 * @param {number}   props.indexEleve            - Position 1-based dans la liste
 * @param {number}   props.totalEleves           - Nombre total d'élèves
 */
export default function FicheObservableEleve({
    prenom,
    observables,
    getValeur,
    onSetValeur,
    onElevePrecedent,
    onEleveSuivant,
    aPrecedent,
    aSuivant,
    indexEleve,
    totalEleves,
}) {
    return (
        <div className="space-y-4">
            {/* ── En-tête élève + navigation ── */}
            <div
                className="flex items-center justify-between gap-3 bg-slate-50
                border border-slate-200 rounded-xl px-4 py-3"
            >
                <button
                    type="button"
                    onClick={onElevePrecedent}
                    disabled={!aPrecedent}
                    aria-label="Élève précédent"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600
                        hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed
                        transition-colors"
                >
                    ←
                </button>

                <div className="text-center">
                    <p className="font-bold text-slate-800">{prenom}</p>
                    <p className="text-xs text-slate-400">
                        {indexEleve} / {totalEleves}
                    </p>
                </div>

                <button
                    type="button"
                    onClick={onEleveSuivant}
                    disabled={!aSuivant}
                    aria-label="Élève suivant"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600
                        hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed
                        transition-colors"
                >
                    →
                </button>
            </div>

            {/* ── Liste des observables ── */}
            {observables.length === 0 ? (
                <p className="text-slate-400 text-sm text-center py-8">
                    Aucun observable pour cette séance.
                </p>
            ) : (
                <div className="space-y-3">
                    {observables.map((obs, i) => (
                        <LigneObservable
                            key={obs.id}
                            observable={obs}
                            valeur={getValeur(obs.id)}
                            onChange={(v) => onSetValeur(obs.id, v)}
                            index={i + 1}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

FicheObservableEleve.propTypes = {
    prenom: PropTypes.string.isRequired,
    observables: PropTypes.array.isRequired,
    getValeur: PropTypes.func.isRequired,
    onSetValeur: PropTypes.func.isRequired,
    onElevePrecedent: PropTypes.func.isRequired,
    onEleveSuivant: PropTypes.func.isRequired,
    aPrecedent: PropTypes.bool.isRequired,
    aSuivant: PropTypes.bool.isRequired,
    indexEleve: PropTypes.number.isRequired,
    totalEleves: PropTypes.number.isRequired,
};
