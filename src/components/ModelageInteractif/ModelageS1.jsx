/**
 * @fileoverview ModelageS1 — modelage interactif pour la séance 1.
 *
 * Outil de projection pour l'enseignant (55 min, phase ② et ④).
 *
 * Deux onglets :
 *   ① Modelage (phase ②, 7 min)
 *   ② Mise en commun (phase ④, 8 min)
 *
 * Sprint RNF-02 : ajout de la prop modeProjection.
 *   taille SVG : 150 → 300 en mode projection (lisibilité 4 m, RNF-02).
 */

import { useState } from "react";
import PropTypes from "prop-types";
import { useModelageS1, ETAPE, FRACTIONS_S1, FORMES_S1 } from "./useModelageS1";
import FormePartageeSVG from "./FormePartageeSVG";
import CorpusMiseEnCommun from "./CorpusMiseEnCommun";

// ── Sélecteur de fraction ─────────────────────────────────────────────────────

function SelecteurFraction({ fractionIndex, onChange }) {
    return (
        <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-slate-500 font-medium shrink-0">
                Fraction :
            </span>
            <div className="flex gap-1">
                {FRACTIONS_S1.map((f, i) => (
                    <button
                        key={f.id}
                        onClick={() => onChange(i)}
                        className={[
                            "px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors",
                            fractionIndex === i
                                ? "bg-blue-600 text-white"
                                : "bg-slate-100 text-slate-600 hover:bg-slate-200",
                        ].join(" ")}
                    >
                        {f.nomLettres}
                    </button>
                ))}
            </div>
        </div>
    );
}

SelecteurFraction.propTypes = {
    fractionIndex: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired,
};

// ── Sélecteur de forme ────────────────────────────────────────────────────────

function SelecteurForme({ formeIndex, onChange }) {
    return (
        <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-slate-500 font-medium shrink-0">
                Forme :
            </span>
            <div className="flex gap-1">
                {FORMES_S1.map((f, i) => (
                    <button
                        key={f.id}
                        onClick={() => onChange(i)}
                        className={[
                            "px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors",
                            formeIndex === i
                                ? "bg-slate-700 text-white"
                                : "bg-slate-100 text-slate-500 hover:bg-slate-200",
                        ].join(" ")}
                    >
                        {f.label}
                    </button>
                ))}
            </div>
        </div>
    );
}

SelecteurForme.propTypes = {
    formeIndex: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired,
};

// ── Indicateur d'étape ────────────────────────────────────────────────────────

const ORDRE_ETAPES = [ETAPE.TOUT, ETAPE.PARTAGE, ETAPE.COLORIE];
const ETAPES_LABEL = {
    [ETAPE.TOUT]: "① Le tout",
    [ETAPE.PARTAGE]: "② Je partage",
    [ETAPE.COLORIE]: "③ Je colorie",
};

function IndicateurEtapes({ etape, onGo }) {
    return (
        <div className="flex items-center gap-1">
            {ORDRE_ETAPES.map((e, i) => (
                <button
                    key={e}
                    onClick={() => onGo(e)}
                    className={[
                        "px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors",
                        etape === e
                            ? "bg-blue-600 text-white shadow-sm"
                            : ORDRE_ETAPES.indexOf(etape) > i
                              ? "bg-blue-100 text-blue-700"
                              : "bg-slate-100 text-slate-400",
                    ].join(" ")}
                >
                    {ETAPES_LABEL[e]}
                </button>
            ))}
        </div>
    );
}

IndicateurEtapes.propTypes = {
    etape: PropTypes.string.isRequired,
    onGo: PropTypes.func.isRequired,
};

// ── Bulle de texte ────────────────────────────────────────────────────────────

function BulleTexte({ titre, texte, question, reponseAttendue }) {
    const [reponseVisible, setReponseVisible] = useState(false);
    return (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl px-4 py-3 space-y-2">
            <p className="text-xs font-bold text-blue-800 uppercase tracking-wide">
                {titre}
            </p>
            <p className="text-sm text-blue-700 leading-snug">{texte}</p>
            {question && (
                <p className="text-xs italic text-blue-600 pt-1">
                    ❓ {question}
                </p>
            )}
            {reponseAttendue && (
                <div className="pt-1">
                    {!reponseVisible ? (
                        <button
                            type="button"
                            onClick={() => setReponseVisible(true)}
                            className="text-xs text-blue-500 hover:underline"
                        >
                            Réponse attendue →
                        </button>
                    ) : (
                        <p className="text-xs text-emerald-700 bg-emerald-50 px-3 py-2 rounded-lg">
                            « {reponseAttendue} »
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}

BulleTexte.propTypes = {
    titre: PropTypes.string.isRequired,
    texte: PropTypes.string.isRequired,
    question: PropTypes.string,
    reponseAttendue: PropTypes.string,
};

// ── Onglet Modelage ───────────────────────────────────────────────────────────

/**
 * @param {{ modeProjection: boolean }} props
 */
function OngletModelage({ modeProjection }) {
    const {
        fractionIndex,
        formeIndex,
        etape,
        fraction,
        forme,
        textes,
        peutReculer,
        peutAvancer,
        setFractionIndex,
        setFormeIndex,
        setEtape,
        avancer,
        reculer,
    } = useModelageS1();

    const texteCourant = textes[etape];

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <SelecteurFraction
                    fractionIndex={fractionIndex}
                    onChange={setFractionIndex}
                />
                <SelecteurForme
                    formeIndex={formeIndex}
                    onChange={setFormeIndex}
                />
            </div>
            <IndicateurEtapes etape={etape} onGo={setEtape} />

            <div
                className="flex flex-col sm:flex-row items-center gap-5 bg-white
                rounded-2xl border border-slate-200 p-5"
            >
                <div className="flex items-center justify-center shrink-0">
                    <FormePartageeSVG
                        forme={forme.id}
                        denominateur={fraction.denominateur}
                        etat={etape}
                        partColoriee={0}
                        taille={modeProjection ? 300 : 150}
                    />
                </div>
                <div className="flex-1 w-full">
                    <BulleTexte
                        titre={texteCourant.titre}
                        texte={texteCourant.texte}
                        question={texteCourant.question}
                        reponseAttendue={texteCourant.reponseAttendue}
                    />
                </div>
            </div>

            <div className="flex items-center justify-between gap-3">
                <button
                    type="button"
                    onClick={reculer}
                    disabled={!peutReculer}
                    className="px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors
                        disabled:opacity-30 disabled:cursor-not-allowed
                        bg-slate-100 text-slate-600 hover:bg-slate-200"
                >
                    ← Précédent
                </button>
                <span className="text-xs text-slate-400">
                    {fraction.nomLettres} · {forme.label}
                </span>
                <button
                    type="button"
                    onClick={avancer}
                    disabled={!peutAvancer}
                    className="px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors
                        disabled:opacity-30 disabled:cursor-not-allowed
                        bg-blue-600 text-white hover:bg-blue-700"
                >
                    Suivant →
                </button>
            </div>
        </div>
    );
}

OngletModelage.propTypes = { modeProjection: PropTypes.bool };
OngletModelage.defaultProps = { modeProjection: false };

// ── Composant principal ───────────────────────────────────────────────────────

/**
 * ModelageS1 — outil de projection pour la séance 1.
 *
 * @param {Object}  props
 * @param {boolean} [props.modeProjection=false] — SVG agrandis pour TBI (RNF-02)
 */
export default function ModelageS1({ modeProjection }) {
    const [onglet, setOnglet] = useState("modelage");

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 px-1">
                <div>
                    <h2 className="font-bold text-slate-700 text-base">
                        Séance 1 — Représenter des fractions unitaires
                    </h2>
                    <p className="text-xs text-slate-400">
                        1/2 · 1/4 · 1/8 · Carré, rectangle, disque, éventail
                    </p>
                </div>
                <span className="text-xs bg-slate-100 text-slate-500 px-3 py-1 rounded-full">
                    55 min · Outil enseignant
                </span>
            </div>

            <div className="flex gap-1 border-b border-slate-200">
                {[
                    { id: "modelage", label: "② Modelage", duree: "7 min" },
                    { id: "mec", label: "④ Mise en commun", duree: "8 min" },
                ].map((o) => (
                    <button
                        key={o.id}
                        onClick={() => setOnglet(o.id)}
                        className={[
                            "px-4 py-2.5 text-sm font-semibold rounded-t-lg transition-colors -mb-px",
                            onglet === o.id
                                ? "bg-white border border-slate-200 border-b-white text-blue-700"
                                : "text-slate-500 hover:text-slate-700",
                        ].join(" ")}
                    >
                        {o.label}
                        <span className="ml-1.5 text-xs font-normal text-slate-400">
                            {o.duree}
                        </span>
                    </button>
                ))}
            </div>

            <div className="pt-1">
                {onglet === "modelage" && (
                    <OngletModelage modeProjection={modeProjection} />
                )}
                {onglet === "mec" && <CorpusMiseEnCommun />}
            </div>
        </div>
    );
}

ModelageS1.propTypes = { modeProjection: PropTypes.bool };
ModelageS1.defaultProps = { modeProjection: false };
