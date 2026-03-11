/**
 * @fileoverview JeuAutocorrectif — session C, deux phases enchaînées.
 *
 * Phase 1 — Autocorrectif (6 min) :
 *   Présentation des cartes face IMAGE une par une.
 *   L'élève nomme mentalement, retourne pour vérifier, s'auto-évalue.
 *   3 passes minimum avant d'accéder à la trace écrite.
 *   Source : fiche S2, section « Jeu autocorrectif recto-verso ».
 *
 * Phase 2 — Trace écrite (6 min) :
 *   Affichage des 3 lignes prescrites par la fiche.
 *   Source : fiche S2, section « Élaboration de la trace écrite ».
 *
 * Structure UI :
 *   ┌─────────────────────────────────────┐
 *   │  Indicateur de passe (1/3, 2/3…)    │
 *   │  Carte courante (image recto)        │
 *   │  → [Retourner] → nom révélé          │
 *   │  → [J'avais bon] [Je m'étais trompé] │
 *   │  Barre de progression dans la passe  │
 *   └─────────────────────────────────────┘
 *   ↓ après 3 passes
 *   ┌─────────────────────────────────────┐
 *   │  TraceEcrite                         │
 *   └─────────────────────────────────────┘
 */

import { useState } from "react";
import PropTypes from "prop-types";
import { PROFIL, PROFILS_PAIRES } from "../../config/jeu.config";
import { useAutocorrectif, PASSES_MINIMUM } from "./useAutocorrectif";
import ImageFraction from "./ImageFraction";
import TraceEcrite from "./TraceEcrite";

// ── Sélecteur de profil ───────────────────────────────────────────────────────

/**
 * @param {{ profil: string, onChange: (p: string) => void }} props
 */
function SelecteurProfil({ profil, onChange }) {
    return (
        <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium shrink-0">
                Profil :
            </span>
            <div className="flex gap-1">
                {Object.entries(PROFILS_PAIRES)
                    .filter(([, cfg]) => cfg.implemente)
                    .map(([cle, cfg]) => (
                        <button
                            key={cle}
                            onClick={() => onChange(cle)}
                            className={[
                                "px-3 py-1 rounded text-xs font-semibold transition-colors",
                                profil === cle
                                    ? "bg-slate-700 text-white"
                                    : "bg-slate-100 text-slate-500 hover:bg-slate-200",
                            ].join(" ")}
                        >
                            {cfg.label}
                        </button>
                    ))}
            </div>
        </div>
    );
}

SelecteurProfil.propTypes = {
    profil: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
};

// ── Carte autocorrective (une carte à la fois) ────────────────────────────────

/**
 * Affiche la carte courante en deux états :
 *   - recto (image visible, nom masqué)
 *   - verso (image + nom révélé)
 *
 * @param {Object}   props
 * @param {import('./useAutocorrectif').CarteAutocorr} props.carte
 * @param {boolean}  props.retournee        - Verso visible ?
 * @param {Function} props.onRetourner      - Callback : retourner la carte
 * @param {Function} props.onEvaluer        - Callback(avaitBon: boolean)
 */
function CarteAutocorrective({ carte, retournee, onRetourner, onEvaluer }) {
    return (
        <div className="flex flex-col items-center gap-4">
            {/* ── Carte ── */}
            <div
                className={[
                    "w-40 h-44 rounded-2xl border-2 flex flex-col items-center justify-center gap-3 transition-all duration-200",
                    retournee
                        ? "border-emerald-400 bg-emerald-50"
                        : "border-slate-300 bg-white shadow-sm",
                ].join(" ")}
            >
                <ImageFraction fractionId={carte.fractionId} taille={72} />

                {/* Nom révélé au retournement */}
                {retournee && (
                    <span className="font-bold text-emerald-700 text-base">
                        {carte.nomLettres}
                    </span>
                )}
            </div>

            {/* ── Actions ── */}
            {!retournee ? (
                /* Phase 1 : nommer mentalement → retourner */
                <div className="flex flex-col items-center gap-2">
                    <p className="text-xs text-slate-500 text-center">
                        Quel est le nom de cette fraction ?<br />
                        <span className="italic">
                            Réfléchis, puis retourne la carte.
                        </span>
                    </p>
                    <button
                        type="button"
                        onClick={onRetourner}
                        className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors text-sm"
                    >
                        🔄 Retourner pour vérifier
                    </button>
                </div>
            ) : (
                /* Phase 2 : auto-évaluation après retournement */
                <div className="flex flex-col items-center gap-2 w-full max-w-xs">
                    <p className="text-xs text-slate-500 text-center">
                        Tu avais bien trouvé{" "}
                        <span className="font-semibold">
                            « {carte.nomLettres} »
                        </span>{" "}
                        ?
                    </p>
                    <div className="flex gap-2 w-full">
                        <button
                            type="button"
                            onClick={() => onEvaluer(true)}
                            className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-colors text-sm"
                        >
                            ✅ Oui !
                        </button>
                        <button
                            type="button"
                            onClick={() => onEvaluer(false)}
                            className="flex-1 py-2.5 bg-amber-400 hover:bg-amber-500 text-white font-semibold rounded-xl transition-colors text-sm"
                        >
                            🔁 Non
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

CarteAutocorrective.propTypes = {
    carte: PropTypes.shape({
        id: PropTypes.string.isRequired,
        fractionId: PropTypes.string.isRequired,
        nomLettres: PropTypes.string.isRequired,
        denominateur: PropTypes.number.isRequired,
    }).isRequired,
    retournee: PropTypes.bool.isRequired,
    onRetourner: PropTypes.func.isRequired,
    onEvaluer: PropTypes.func.isRequired,
};

// ── Indicateur de passe ───────────────────────────────────────────────────────

/**
 * @param {{ passe: number, passesRequises: number, indexCourant: number, totalCartes: number }} props
 */
function IndicateurPasse({ passe, passesRequises, indexCourant, totalCartes }) {
    const passeAffichee = Math.min(passe, passesRequises);
    const progression = Math.round((indexCourant / totalCartes) * 100);

    return (
        <div className="space-y-1.5">
            {/* Pastilles de passe */}
            <div className="flex items-center gap-1.5 justify-center">
                {Array.from({ length: passesRequises }).map((_, i) => (
                    <div
                        key={i}
                        className={[
                            "w-2.5 h-2.5 rounded-full transition-colors",
                            i < passe - 1
                                ? "bg-emerald-400"
                                : i === passe - 1
                                  ? "bg-blue-500"
                                  : "bg-slate-200",
                        ].join(" ")}
                    />
                ))}
                <span className="text-xs text-slate-400 ml-1">
                    Passe {passeAffichee}/{passesRequises}
                </span>
            </div>

            {/* Barre de progression dans la passe */}
            <div className="w-full bg-slate-100 rounded-full h-1.5">
                <div
                    className="bg-blue-400 h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${progression}%` }}
                />
            </div>
            <p className="text-xs text-center text-slate-400">
                {indexCourant}/{totalCartes} cartes dans cette passe
            </p>
        </div>
    );
}

IndicateurPasse.propTypes = {
    passe: PropTypes.number.isRequired,
    passesRequises: PropTypes.number.isRequired,
    indexCourant: PropTypes.number.isRequired,
    totalCartes: PropTypes.number.isRequired,
};

// ── Plateau interne ───────────────────────────────────────────────────────────

/**
 * @param {{ profil: string }} props
 */
function Plateau({ profil }) {
    const {
        carteCourante,
        indexCourant,
        totalCartes,
        passe,
        retournee,
        passesRequises,
        passeComplete,
        peutPasserTrace,
        retourner,
        evaluer,
    } = useAutocorrectif({ profil });

    const [phase, setPhase] = useState("autocorr"); // 'autocorr' | 'trace'
    const [traceTerminee, setTraceTerminee] = useState(false);

    // Fin de session
    if (traceTerminee) {
        return (
            <div className="flex flex-col items-center gap-4 py-8">
                <span className="text-4xl" aria-hidden="true">
                    🎉
                </span>
                <p className="font-bold text-slate-700 text-center">
                    Séance 2 terminée !
                </p>
                <p className="text-sm text-slate-500 text-center">
                    Tu as complété les 3 sessions. Ta trace écrite est dans ton
                    cahier.
                </p>
            </div>
        );
    }

    if (phase === "trace") {
        return <TraceEcrite onTerminer={() => setTraceTerminee(true)} />;
    }

    // Fin de passe complète avec toutes les passes requises
    if (passeComplete && peutPasserTrace) {
        return (
            <div className="flex flex-col items-center gap-4 py-6">
                <span className="text-4xl" aria-hidden="true">
                    ⭐
                </span>
                <p className="font-bold text-emerald-700 text-center">
                    {passesRequises} passes réalisées !
                </p>
                <p className="text-sm text-slate-500 text-center max-w-xs">
                    Tu es prêt à écrire ta trace écrite dans ton cahier.
                </p>
                <button
                    type="button"
                    onClick={() => setPhase("trace")}
                    className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-colors text-sm"
                >
                    📓 Passer à la trace écrite
                </button>
            </div>
        );
    }

    // En milieu de passe — fin d'une passe mais pas encore les 3 passes
    if (passeComplete) {
        return (
            <div className="flex flex-col items-center gap-3 py-6">
                <span className="text-3xl" aria-hidden="true">
                    ✨
                </span>
                <p className="font-semibold text-slate-700 text-center">
                    Passe {passe - 1} terminée !
                </p>
                <p className="text-xs text-slate-400 text-center">
                    Encore {passesRequises - (passe - 1)} passe
                    {passesRequises - (passe - 1) > 1 ? "s" : ""} avant la trace
                    écrite.
                </p>
                {/* Le hook démarre automatiquement la passe suivante via evaluer() */}
            </div>
        );
    }

    return (
        <div className="space-y-5">
            <IndicateurPasse
                passe={passe}
                passesRequises={passesRequises}
                indexCourant={indexCourant}
                totalCartes={totalCartes}
            />

            {carteCourante && (
                <CarteAutocorrective
                    carte={carteCourante}
                    retournee={retournee}
                    onRetourner={retourner}
                    onEvaluer={evaluer}
                />
            )}

            {/* Accès anticipé à la trace — si peutPasserTrace (≥ 3 passes) */}
            {peutPasserTrace && (
                <div className="text-center">
                    <button
                        type="button"
                        onClick={() => setPhase("trace")}
                        className="text-xs text-emerald-600 hover:underline"
                    >
                        Passer à la trace écrite maintenant →
                    </button>
                </div>
            )}
        </div>
    );
}

Plateau.propTypes = { profil: PropTypes.string.isRequired };

// ── Composant principal ───────────────────────────────────────────────────────

/**
 * Jeu autocorrectif — session C (autocorrectif + trace écrite).
 * @returns {JSX.Element}
 */
export default function JeuAutocorrectif() {
    const [profil, setProfil] = useState(PROFIL.STANDARD);
    const [cleJeu, setCleJeu] = useState(0);

    function changerProfil(nouveauProfil) {
        setProfil(nouveauProfil);
        setCleJeu((k) => k + 1);
    }

    function relancer() {
        setCleJeu((k) => k + 1);
    }

    return (
        <div className="space-y-4">
            {/* ── En-tête ── */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-1">
                <div>
                    <h2 className="font-bold text-slate-700 text-base">
                        Session 3 — Autocorrectif
                    </h2>
                    <p className="text-xs text-slate-400">
                        Nomme chaque fraction, retourne pour vérifier. 3 passes
                        minimum.
                    </p>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                    <SelecteurProfil profil={profil} onChange={changerProfil} />
                    <button
                        onClick={relancer}
                        className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                        ↺ Recommencer
                    </button>
                </div>
            </div>

            {/* ── Plateau ── */}
            <Plateau key={`${profil}-${cleJeu}`} profil={profil} />
        </div>
    );
}
