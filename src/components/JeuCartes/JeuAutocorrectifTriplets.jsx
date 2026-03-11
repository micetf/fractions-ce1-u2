/**
 * @fileoverview JeuAutocorrectifTriplets — session C du jeu de triplets (S6).
 *
 * Trois phases (fiche S6, session C) :
 *
 *   1. CONSTITUTION (7 min)
 *      L'élève constitue silencieusement ses 7 triplets sans validation immédiate.
 *      Fiche S6 : « Posez-le de côté — sans vérifier encore. »
 *
 *   2. VÉRIFICATION (2 min)
 *      La bande-répertoire devient accessible.
 *      Les triplets sont validés : correct ✓ / incorrect ✗.
 *      Fiche S6 : « Seulement à la fin, vous pouvez ouvrir votre
 *      bande-répertoire pour vérifier. »
 *
 *   3. BILAN (5 min)
 *      Grille d'auto-évaluation des 6 items (ITEMS_AUTOEVAL).
 *      Fiche S6 : « Je m'auto-évalue honnêtement sur la grille de bilan. »
 */

import PropTypes from "prop-types";
import { useAutocorrectifTriplets, PHASE_C } from "./useAutocorrectifTriplets";
import Carte from "./Carte";
import { BandeRepertoire } from "../BandeRepertoire";
import { PROFIL } from "../../config/jeu.config";
import {
    ITEMS_AUTOEVAL,
    NIVEAUX,
    LIBELLES_NIVEAUX,
} from "../../config/autoeval.config";
import { getFractionById } from "../../config/fractions.config";

// ── Phase Constitution ────────────────────────────────────────────────────────

/**
 * @param {{ cartes, etats, selection, tripletsConstitues, totalTriplets, selectionnerCarte, onPasser }} props
 */
function PhaseConstitution({
    cartes,
    etats,
    selection,
    tripletsConstitues,
    totalTriplets,
    selectionnerCarte,
    onPasser,
}) {
    const nbConstitues = tripletsConstitues.length;
    const termine = nbConstitues === totalTriplets;

    return (
        <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
                <p className="text-sm text-blue-700 leading-snug">
                    Tirez une carte. Nommez mentalement les deux autres cartes
                    du triplet avant de les chercher. Posez les triplets de côté
                    — sans vérifier encore.
                </p>
                <p className="text-xs text-blue-400 mt-1 italic">
                    Source : fiche S6, session C
                </p>
            </div>

            {/* Progression */}
            <div className="flex items-center gap-3 flex-wrap">
                <span className="text-sm font-semibold text-slate-700">
                    {nbConstitues} / {totalTriplets} triplets constitués
                </span>
                {selection.length > 0 && (
                    <span className="text-xs text-blue-500">
                        {selection.length} carte
                        {selection.length > 1 ? "s" : ""} sélectionnée
                        {selection.length > 1 ? "s" : ""}…
                    </span>
                )}
            </div>

            {/* Grille de cartes */}
            <div className="flex flex-wrap gap-2">
                {cartes.map((carte) => (
                    <Carte
                        key={carte.id}
                        id={carte.id}
                        fractionId={carte.fractionId}
                        type={carte.type}
                        nomLettres={carte.nomLettres}
                        denominateur={carte.denominateur}
                        etat={etats[carte.id] ?? "neutre"}
                        onClick={selectionnerCarte}
                        taille={52}
                    />
                ))}
            </div>

            {/* Bouton passer */}
            <div className="flex justify-end">
                <button
                    type="button"
                    onClick={onPasser}
                    disabled={!termine}
                    className={[
                        "px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors",
                        termine
                            ? "bg-emerald-600 text-white hover:bg-emerald-700"
                            : "bg-slate-100 text-slate-300 cursor-not-allowed",
                    ].join(" ")}
                >
                    {termine
                        ? "Vérifier avec la bande-répertoire →"
                        : `Encore ${totalTriplets - nbConstitues} triplet(s)…`}
                </button>
            </div>
        </div>
    );
}

// ── Phase Vérification ────────────────────────────────────────────────────────

/**
 * @param {{ tripletsConstitues, cartes, onPasser }} props
 */
function PhaseVerification({ tripletsConstitues, cartes, onPasser }) {
    const nbCorrects = tripletsConstitues.filter((t) => t.correct).length;
    const nbIncorrects = tripletsConstitues.filter((t) => !t.correct).length;

    return (
        <div className="space-y-5">
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
                <p className="text-sm text-amber-700 leading-snug">
                    Vérifiez vos triplets avec la bande-répertoire. Si un
                    triplet est faux, cherchez l'erreur vous-même avant de
                    demander de l'aide.
                </p>
                <p className="text-xs text-amber-400 mt-1 italic">
                    Source : fiche S6, session C
                </p>
            </div>

            {/* Résultats des triplets */}
            <div className="space-y-2">
                <h3 className="text-sm font-semibold text-slate-600 px-1">
                    Vos triplets
                </h3>
                {tripletsConstitues.map((triplet, i) => {
                    const cartesTrip = triplet.ids.map((id) =>
                        cartes.find((c) => c.id === id)
                    );
                    const fraction = getFractionById(triplet.fractionId);
                    return (
                        <div
                            key={i}
                            className={[
                                "flex items-center gap-3 px-4 py-2 rounded-xl border text-sm",
                                triplet.correct
                                    ? "bg-emerald-50 border-emerald-200"
                                    : "bg-red-50 border-red-200",
                            ].join(" ")}
                        >
                            <span
                                className={
                                    triplet.correct
                                        ? "text-emerald-600 font-bold"
                                        : "text-red-600 font-bold"
                                }
                            >
                                {triplet.correct ? "✓" : "✗"}
                            </span>
                            <span className="flex-1 text-slate-700">
                                {triplet.correct
                                    ? `Triplet correct — ${fraction?.nomLettres ?? triplet.fractionId}`
                                    : `Erreur dans ce triplet — les 3 cartes ne représentent pas la même fraction`}
                            </span>
                            <div className="flex gap-1">
                                {cartesTrip.map(
                                    (c) =>
                                        c && (
                                            <span
                                                key={c.id}
                                                className="text-xs bg-white border border-slate-200
                    rounded px-1.5 py-0.5 text-slate-500 font-mono"
                                            >
                                                {c.type[0]}
                                            </span>
                                        )
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Bilan rapide */}
            <div className="flex items-center gap-4 text-sm px-1">
                <span className="text-emerald-700 font-semibold">
                    ✓ {nbCorrects} correct{nbCorrects > 1 ? "s" : ""}
                </span>
                {nbIncorrects > 0 && (
                    <span className="text-red-600 font-semibold">
                        ✗ {nbIncorrects} à revoir
                    </span>
                )}
            </div>

            {/* Bande-répertoire (RF-M3-04 — modeEleve) */}
            <div className="border border-slate-200 rounded-2xl overflow-hidden">
                <div className="px-4 py-2 bg-slate-50 border-b border-slate-100">
                    <p className="text-xs font-semibold text-slate-600">
                        Bande-répertoire — outil de vérification
                    </p>
                </div>
                <div className="p-4">
                    <BandeRepertoire seanceDebloquee={6} modeEleve />
                </div>
            </div>

            <div className="flex justify-end">
                <button
                    type="button"
                    onClick={onPasser}
                    className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors
            bg-blue-600 text-white hover:bg-blue-700"
                >
                    Passer au bilan de séquence →
                </button>
            </div>
        </div>
    );
}

// ── Phase Bilan ───────────────────────────────────────────────────────────────

/**
 * Grille d'auto-évaluation — libellés exacts de la fiche S6.
 * @param {{ autoEval, setAutoEval }} props
 */
function PhaseBilan({ autoEval, setAutoEval }) {
    const niveaux = [NIVEAUX.OUI, NIVEAUX.EN_COURS, NIVEAUX.PAS_ENCORE];
    const nbComplete = Object.values(autoEval).filter(Boolean).length;
    const complete = nbComplete === ITEMS_AUTOEVAL.length;

    return (
        <div className="space-y-5">
            <div className="px-1">
                <h3 className="font-semibold text-slate-700 text-sm">
                    Bilan de séquence
                </h3>
                <p className="text-xs text-slate-400">
                    Complète honnêtement — {nbComplete} /{" "}
                    {ITEMS_AUTOEVAL.length} items remplis.
                </p>
            </div>

            <div className="space-y-3">
                {ITEMS_AUTOEVAL.map((item) => (
                    <div
                        key={item.id}
                        className="bg-white border border-slate-200 rounded-xl px-4 py-3 space-y-2"
                    >
                        <p className="text-sm text-slate-700 leading-snug">
                            {item.critereVersS3 && (
                                <span
                                    className="inline-block text-xs bg-amber-100 text-amber-700
                  px-1.5 py-0.5 rounded font-semibold mr-2 align-middle"
                                >
                                    S3
                                </span>
                            )}
                            {item.libelle}
                        </p>
                        <div className="flex gap-2 flex-wrap">
                            {niveaux.map((n) => (
                                <button
                                    key={n}
                                    type="button"
                                    onClick={() => setAutoEval(item.id, n)}
                                    className={[
                                        "px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors",
                                        autoEval[item.id] === n
                                            ? n === NIVEAUX.OUI
                                                ? "bg-emerald-500 text-white border-emerald-500"
                                                : n === NIVEAUX.EN_COURS
                                                  ? "bg-amber-400 text-white border-amber-400"
                                                  : "bg-red-400 text-white border-red-400"
                                            : "bg-white text-slate-500 border-slate-200 hover:border-slate-400",
                                    ].join(" ")}
                                >
                                    {LIBELLES_NIVEAUX[n]}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Message d'ouverture vers S3 — fiche S6 */}
            {complete && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-4 space-y-2">
                    <p className="text-sm font-semibold text-blue-800">
                        Bravo, vous avez terminé la séquence 2 !
                    </p>
                    <p className="text-sm text-blue-700 leading-snug">
                        « Jusqu'ici, le chiffre en haut était toujours 1 — on
                        prenait une seule part. Dans la prochaine séquence, on
                        va apprendre ce qui se passe quand on prend 2 parts, 3
                        parts… Comment écrire deux tiers ? Trois quarts ? Vous
                        avez toutes les bases pour y arriver. »
                    </p>
                    <p className="text-xs text-blue-400 italic">
                        Source : fiche S6, session C — annonce de la suite
                    </p>
                </div>
            )}
        </div>
    );
}

// ── Composant principal ───────────────────────────────────────────────────────

/**
 * Session C complète — autocorrectif + bilan de séquence.
 * @param {{ profil?: string }} props
 */
export default function JeuAutocorrectifTriplets({ profil = PROFIL.STANDARD }) {
    const {
        cartes,
        etats,
        selection,
        tripletsConstitues,
        phase,
        autoEval,
        totalTriplets,
        selectionnerCarte,
        passerVerification,
        passerBilan,
        setAutoEval,
        reinitialiser,
    } = useAutocorrectifTriplets({ profil });

    const LABELS_PHASE = {
        [PHASE_C.CONSTITUTION]: "Constitution des triplets",
        [PHASE_C.VERIFICATION]: "Vérification",
        [PHASE_C.BILAN]: "Bilan de séquence",
    };

    return (
        <div className="space-y-4">
            {/* En-tête de phase */}
            <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                    {Object.values(PHASE_C).map((p, i) => (
                        <div key={p} className="flex items-center gap-1">
                            {i > 0 && (
                                <span className="text-slate-300 text-xs">
                                    →
                                </span>
                            )}
                            <span
                                className={[
                                    "text-xs font-semibold px-2 py-1 rounded-full",
                                    phase === p
                                        ? "bg-blue-100 text-blue-700"
                                        : "text-slate-400",
                                ].join(" ")}
                            >
                                {LABELS_PHASE[p]}
                            </span>
                        </div>
                    ))}
                </div>
                <button
                    type="button"
                    onClick={reinitialiser}
                    className="px-3 py-1.5 text-xs text-slate-500 border border-slate-200
            rounded-lg hover:bg-slate-50 transition-colors"
                >
                    ↺ Recommencer
                </button>
            </div>

            {/* Phase active */}
            {phase === PHASE_C.CONSTITUTION && (
                <PhaseConstitution
                    cartes={cartes}
                    etats={etats}
                    selection={selection}
                    tripletsConstitues={tripletsConstitues}
                    totalTriplets={totalTriplets}
                    selectionnerCarte={selectionnerCarte}
                    onPasser={passerVerification}
                />
            )}
            {phase === PHASE_C.VERIFICATION && (
                <PhaseVerification
                    tripletsConstitues={tripletsConstitues}
                    cartes={cartes}
                    onPasser={passerBilan}
                />
            )}
            {phase === PHASE_C.BILAN && (
                <PhaseBilan autoEval={autoEval} setAutoEval={setAutoEval} />
            )}
        </div>
    );
}

JeuAutocorrectifTriplets.propTypes = {
    profil: PropTypes.string,
};
