/**
 * @fileoverview ModelageS4 — modelage interactif pour la séance 4.
 *
 * Outil de projection pour l'enseignant (45 min, phases ② et ③b et ④).
 *
 * Trois onglets :
 *   ② Modelage (8 min)
 *      Navigation TOUT → PARTAGE → COLORIE sur bande rectangulaire.
 *      Fractions : 1/5 et 1/10. Forme unique : bande.
 *
 *   ③b Bande-répertoire (12 min)
 *      Construction guidée collective des 7 lignes (ordre prescrit fiche S4).
 *
 *   ④ Mise en commun (7 min)
 *      3 points d'institutionnalisation (fiche S4).
 */

import { useState } from "react";
import PropTypes from "prop-types";
import { useModelageS4, FRACTIONS_S4, ETAPE } from "./useModelageS4";
import FormePartageeSVG from "./FormePartageeSVG";
import BandeRepertoireVisuelle from "./BandeRepertoireVisuelle";
import CorpusMiseEnCommunS4 from "./CorpusMiseEnCommunS4";
import { BandeRepertoire } from "../BandeRepertoire";

// ── Constantes ────────────────────────────────────────────────────────────────

const ETAPES_LABEL = {
    [ETAPE.TOUT]: "① Le tout",
    [ETAPE.PARTAGE]: "② Je partage",
    [ETAPE.COLORIE]: "③ Je colorie",
};

const ORDRE_ETAPES = [ETAPE.TOUT, ETAPE.PARTAGE, ETAPE.COLORIE];

// ── Sélecteur de fraction ─────────────────────────────────────────────────────

/**
 * @param {{ fractionIndex: number, onChange: (i: number) => void }} props
 */
function SelecteurFraction({ fractionIndex, onChange }) {
    return (
        <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-slate-500 font-medium shrink-0">
                Fraction :
            </span>
            <div className="flex gap-1">
                {FRACTIONS_S4.map((f, i) => (
                    <button
                        key={f.id}
                        onClick={() => onChange(i)}
                        className={[
                            "px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors",
                            fractionIndex === i
                                ? "bg-emerald-600 text-white"
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

// ── Indicateur d'étape ────────────────────────────────────────────────────────

/**
 * @param {{ etape: string, onGo: (e: string) => void }} props
 */
function IndicateurEtapes({ etape, onGo }) {
    return (
        <div className="flex items-center gap-1 flex-wrap">
            {ORDRE_ETAPES.map((e, i) => (
                <button
                    key={e}
                    onClick={() => onGo(e)}
                    className={[
                        "px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors",
                        etape === e
                            ? "bg-emerald-600 text-white shadow-sm"
                            : ORDRE_ETAPES.indexOf(etape) > i
                              ? "bg-emerald-100 text-emerald-700"
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

/**
 * @param {{ titre: string, texte: string, question?: string, reponseAttendue?: string }} props
 */
function BulleTexte({ titre, texte, question, reponseAttendue }) {
    const [reponseVisible, setReponseVisible] = useState(false);

    return (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-3 space-y-2">
            <p className="text-xs font-bold text-emerald-800 uppercase tracking-wide">
                {titre}
            </p>
            <p className="text-sm text-emerald-700 leading-snug">{texte}</p>
            {question && (
                <p className="text-xs italic text-emerald-600 pt-1">
                    ❓ {question}
                </p>
            )}
            {reponseAttendue && (
                <div className="pt-1">
                    {!reponseVisible ? (
                        <button
                            type="button"
                            onClick={() => setReponseVisible(true)}
                            className="text-xs text-emerald-500 hover:underline"
                        >
                            Réponse attendue →
                        </button>
                    ) : (
                        <p className="text-xs text-emerald-700 bg-emerald-100 px-3 py-2 rounded-lg">
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

function OngletModelage() {
    const {
        fractionIndex,
        etape,
        fraction,
        textes,
        peutReculer,
        peutAvancer,
        setFractionIndex,
        setEtape,
        avancer,
        reculer,
    } = useModelageS4();

    const texteCourant = textes[etape];

    return (
        <div className="space-y-4">
            {/* Sélecteur */}
            <SelecteurFraction
                fractionIndex={fractionIndex}
                onChange={setFractionIndex}
            />

            {/* Indicateur d'étapes */}
            <IndicateurEtapes etape={etape} onGo={setEtape} />

            {/* Zone principale */}
            <div className="flex flex-col sm:flex-row items-center gap-5 bg-white rounded-2xl border border-slate-200 p-5">
                <div className="flex items-center justify-center shrink-0">
                    <FormePartageeSVG
                        forme="rectangle"
                        denominateur={fraction.denominateur}
                        etat={etape}
                        partColoriee={0}
                        taille={130}
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

            {/* Navigation */}
            <div className="flex items-center justify-between">
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
                <button
                    type="button"
                    onClick={avancer}
                    disabled={!peutAvancer}
                    className="px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors
            disabled:opacity-30 disabled:cursor-not-allowed
            bg-emerald-600 text-white hover:bg-emerald-700"
                >
                    Suivant →
                </button>
            </div>

            {/* Note obstacle pliage en 5 */}
            {fraction.denominateur === 5 && etape === ETAPE.PARTAGE && (
                <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
                    <span className="font-semibold">⚠ Obstacle S4 :</span>{" "}
                    Partager en 5 parts égales est difficile (5 n'est pas une
                    puissance de 2). Stratégies : tâtonnement par pliage +
                    vérification superposition, ou règle graduée. Fiche S4,
                    phase ② et obstacles prévisibles.
                </div>
            )}

            {/* Note relation 1/10 = moitié de 1/5 */}
            {fraction.denominateur === 10 && etape === ETAPE.PARTAGE && (
                <div className="text-xs text-blue-700 bg-blue-50 border border-blue-200 rounded-xl px-3 py-2">
                    <span className="font-semibold">Relation clé :</span> Un
                    dixième = la moitié d'un cinquième. Comme un sixième était
                    la moitié d'un tiers (S3). Le principe est le même. Fiche
                    S4, phase ②.
                </div>
            )}
        </div>
    );
}

// ── Composant principal ───────────────────────────────────────────────────────

/**
 * ModelageS4 — outil de projection pour la séance 4.
 * @returns {JSX.Element}
 */
export default function ModelageS4() {
    const [onglet, setOnglet] = useState("modelage");

    const onglets = [
        { id: "modelage", label: "② Modelage", duree: "8 min" },
        { id: "repertoire", label: "③b Bande-répertoire", duree: "12 min" },
        {
            id: "ref-repertoire",
            label: "Répertoire de référence",
            duree: "RF-M3-05",
        },
        { id: "mec", label: "④ Mise en commun", duree: "7 min" },
    ];

    return (
        <div className="space-y-4">
            {/* En-tête */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-1">
                <div>
                    <h2 className="font-bold text-slate-700 text-base">
                        Séance 4 — Un cinquième et un dixième · Répertoire
                        complet
                    </h2>
                    <p className="text-xs text-slate-400">
                        1/5 · 1/10 · Bande · Relation 1/10 = moitié de 1/5 · 7
                        fractions
                    </p>
                </div>
                <span className="text-xs bg-slate-100 text-slate-500 px-3 py-1 rounded-full">
                    45 min · Outil enseignant
                </span>
            </div>

            {/* Onglets */}
            <div className="flex gap-1 border-b border-slate-200">
                {onglets.map((o) => (
                    <button
                        key={o.id}
                        onClick={() => setOnglet(o.id)}
                        className={[
                            "px-4 py-2.5 text-sm font-semibold rounded-t-lg transition-colors -mb-px",
                            onglet === o.id
                                ? "bg-white border border-slate-200 border-b-white text-emerald-700"
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

            {/* Contenu */}
            <div className="pt-1">
                {onglet === "modelage" && <OngletModelage />}
                {onglet === "repertoire" && <BandeRepertoireVisuelle />}
                {onglet === "ref-repertoire" && (
                    <BandeRepertoire seanceDebloquee={4} modeProjection />
                )}
                {onglet === "mec" && <CorpusMiseEnCommunS4 />}
            </div>
        </div>
    );
}
