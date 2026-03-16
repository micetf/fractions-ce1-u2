/**
 * @fileoverview SyntheseObservables — vue synthétique des observables d'une séance.
 *
 * Pour chaque observable d'une séance, affiche le nombre d'élèves
 * dans chacune des trois catégories : ✓ / ✗ / ---.
 *
 * Source : RF-M4-05 (SRS) — « Une vue synthétique par séance indique,
 * pour chaque observable, le nombre d'élèves dans chacune des trois valeurs. »
 *
 * @module components/EvaluationFormative/SyntheseObservables
 */

import PropTypes from "prop-types";
import { VALEURS, VALEURS_UI } from "./useObservablesFormatifs";

/**
 * Barre de progression colorée pour une valeur donnée.
 *
 * @param {Object} props
 * @param {string} props.valeur       - Constante VALEURS
 * @param {number} props.nb           - Nombre d'élèves
 * @param {number} props.total        - Total d'élèves (pour le pourcentage)
 */
function BarreValeur({ valeur, nb, total }) {
    const ui = VALEURS_UI[valeur];
    const pct = total > 0 ? Math.round((nb / total) * 100) : 0;

    return (
        <div className="flex items-center gap-2">
            <span
                className={[
                    "w-7 h-7 rounded-lg border text-sm font-bold flex items-center justify-center shrink-0",
                    ui.classes,
                ].join(" ")}
                title={ui.label}
                aria-label={ui.label}
            >
                {ui.signe}
            </span>
            <div className="flex-1 flex items-center gap-2">
                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                    {pct > 0 && (
                        <div
                            className={[
                                "h-full rounded-full transition-all",
                                valeur === VALEURS.ATTEINT
                                    ? "bg-emerald-400"
                                    : valeur === VALEURS.NON_ATTEINT
                                      ? "bg-red-400"
                                      : "bg-slate-300",
                            ].join(" ")}
                            style={{ width: `${pct}%` }}
                            role="progressbar"
                            aria-valuenow={pct}
                            aria-valuemin={0}
                            aria-valuemax={100}
                        />
                    )}
                </div>
                <span className="text-sm font-semibold text-slate-700 w-4 text-right">
                    {nb}
                </span>
            </div>
        </div>
    );
}

BarreValeur.propTypes = {
    valeur: PropTypes.string.isRequired,
    nb: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
};

// ─────────────────────────────────────────────────────────────────────────────

/**
 * Carte d'un observable avec ses comptages.
 *
 * @param {Object} props
 * @param {import('./useObservablesFormatifs').SyntheseObservable} props.synthese
 * @param {number} props.totalEleves
 * @param {number} props.index
 */
function CarteObservable({ synthese, totalEleves, index }) {
    const { observable, nbAtteint, nbNonAtteint, nbNonObserve } = synthese;
    const alerter = totalEleves > 0 && nbNonAtteint > totalEleves / 2;

    return (
        <div
            className={[
                "bg-white border rounded-xl p-4 space-y-3",
                alerter ? "border-red-200" : "border-slate-200",
            ].join(" ")}
        >
            {/* ── Libellé ── */}
            <div className="flex items-start gap-2">
                <span
                    className="shrink-0 w-6 h-6 rounded-full bg-slate-100 text-slate-500
                    text-xs font-bold flex items-center justify-center mt-0.5"
                >
                    {index}
                </span>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-700 leading-snug">
                        {observable.libelle}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                        {observable.phase}
                    </p>
                </div>
                {/* Alerte si majorité en difficulté */}
                {alerter && (
                    <span
                        className="shrink-0 text-red-500 text-lg"
                        title="Plus de la moitié des élèves n'a pas atteint cet observable"
                        aria-label="Alerte : majorité en difficulté"
                    >
                        ⚠
                    </span>
                )}
            </div>

            {/* ── Barres de comptage ── */}
            <div className="space-y-1.5 pl-8">
                <BarreValeur
                    valeur={VALEURS.ATTEINT}
                    nb={nbAtteint}
                    total={totalEleves}
                />
                <BarreValeur
                    valeur={VALEURS.NON_ATTEINT}
                    nb={nbNonAtteint}
                    total={totalEleves}
                />
                <BarreValeur
                    valeur={VALEURS.NON_OBSERVE}
                    nb={nbNonObserve}
                    total={totalEleves}
                />
            </div>

            {/* Régulation si alerte */}
            {alerter && (
                <div className="pl-8 pt-1 border-t border-red-100">
                    <p className="text-xs text-red-600 leading-snug">
                        <span className="font-semibold">
                            Régulation collective :{" "}
                        </span>
                        {observable.regulation}
                    </p>
                </div>
            )}
        </div>
    );
}

CarteObservable.propTypes = {
    synthese: PropTypes.shape({
        observable: PropTypes.object.isRequired,
        nbAtteint: PropTypes.number.isRequired,
        nbNonAtteint: PropTypes.number.isRequired,
        nbNonObserve: PropTypes.number.isRequired,
    }).isRequired,
    totalEleves: PropTypes.number.isRequired,
    index: PropTypes.number.isRequired,
};

// ─────────────────────────────────────────────────────────────────────────────

/**
 * SyntheseObservables — vue synthétique complète d'une séance (RF-M4-05).
 *
 * @param {Object}   props
 * @param {import('./useObservablesFormatifs').SyntheseObservable[]} props.syntheses
 * @param {number}   props.totalEleves
 */
export default function SyntheseObservables({ syntheses, totalEleves }) {
    if (totalEleves === 0) {
        return (
            <p className="text-slate-400 text-sm text-center py-8">
                Ajoutez des élèves dans la liste de classe pour afficher la
                synthèse.
            </p>
        );
    }

    if (syntheses.length === 0) {
        return (
            <p className="text-slate-400 text-sm text-center py-8">
                Aucun observable pour cette séance.
            </p>
        );
    }

    const nbAlertes = syntheses.filter(
        (s) => s.nbNonAtteint > totalEleves / 2
    ).length;

    return (
        <div className="space-y-4">
            {/* Légende */}
            <div className="flex flex-wrap gap-3 text-xs text-slate-500">
                {Object.values(VALEURS).map((v) => (
                    <span key={v} className="flex items-center gap-1">
                        <span
                            className={[
                                "w-5 h-5 rounded border text-xs font-bold flex items-center justify-center",
                                VALEURS_UI[v].classes,
                            ].join(" ")}
                        >
                            {VALEURS_UI[v].signe}
                        </span>
                        {VALEURS_UI[v].label}
                    </span>
                ))}
                <span className="text-slate-400">
                    · {totalEleves} élève{totalEleves > 1 ? "s" : ""}
                </span>
                {nbAlertes > 0 && (
                    <span className="text-red-500">
                        ⚠ {nbAlertes} observable{nbAlertes > 1 ? "s" : ""} en
                        alerte
                    </span>
                )}
            </div>

            {/* Cartes des observables */}
            <div className="space-y-3">
                {syntheses.map((s, i) => (
                    <CarteObservable
                        key={s.observable.id}
                        synthese={s}
                        totalEleves={totalEleves}
                        index={i + 1}
                    />
                ))}
            </div>
        </div>
    );
}

SyntheseObservables.propTypes = {
    syntheses: PropTypes.array.isRequired,
    totalEleves: PropTypes.number.isRequired,
};
