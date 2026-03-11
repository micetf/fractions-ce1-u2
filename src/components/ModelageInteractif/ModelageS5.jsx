/**
 * @fileoverview ModelageS5 — modelage interactif pour la séance 5.
 *
 * Outil de projection pour l'enseignant (55 min, phases ② et ④).
 *
 * Deux onglets :
 *   ② Modelage (10 min)
 *      Construction progressive de l'écriture fractionnaire :
 *      BAS → TRAIT → COMPLET, avec annotations pédagogiques.
 *      Contre-exemples prescrits (fiche S5) : 8/1, 1-8, 18.
 *
 *   ④ Mise en commun (11 min)
 *      Triplets (dont un erroné), tableau de décomposition,
 *      tableau des 3 représentations.
 *
 * Note de conception : le sélecteur de forme est absent (S5 ne modélise
 * pas une forme géométrique mais l'écriture elle-même). La carte
 * CarteFractionSVG est l'élément central du modelage.
 */

import { useState } from "react";
import PropTypes from "prop-types";
import { useModelageS5, FRACTIONS_S5, ETAPE_S5 } from "./useModelageS5";
import FormePartageeSVG from "./FormePartageeSVG";
import CarteFractionSVG from "./CarteFractionSVG";
import CorpusMiseEnCommunS5 from "./CorpusMiseEnCommunS5";

// ── Constantes ────────────────────────────────────────────────────────────────

const ETAPES_LABEL = {
    [ETAPE_S5.BAS]: "① Chiffre du bas",
    [ETAPE_S5.TRAIT]: "② Trait de fraction",
    [ETAPE_S5.COMPLET]: "③ Chiffre du haut",
};

const ORDRE_ETAPES = [ETAPE_S5.BAS, ETAPE_S5.TRAIT, ETAPE_S5.COMPLET];

// ── Contre-exemples (fiche S5, phase ②) ──────────────────────────────────────

/**
 * Génère les 3 contre-exemples prescrits par la fiche S5 (phase ②)
 * en fonction de la fraction courante.
 *
 * @param {number} denominateur
 * @param {string} nomLettres   - ex. « un quart »
 * @returns {Array<{ id: string, explication: string }>}
 */
function getContreExemples(denominateur, nomLettres) {
    return [
        {
            id: "inverse",
            explication: `${denominateur}/1 — Ce n'est PAS ${nomLettres}. Le ${denominateur} doit être EN BAS. Si je mets ${denominateur} en haut et 1 en bas, ce serait comme dire « je prends ${denominateur} parts quand le tout n'en a qu'une » — ça n'a aucun sens pour une fraction unitaire.`,
        },
        {
            id: "tiret",
            explication: `1-${denominateur} (avec un tiret) — L'écriture fractionnaire utilise toujours un trait horizontal. Un tiret oblique ou court n'est pas le trait de fraction.`,
        },
        {
            id: "sanstrait",
            explication: `1${denominateur} (sans trait) — Sans le trait de fraction, ce n'est plus une écriture de fraction. On ne lit pas « ${nomLettres} » mais un nombre entier.`,
        },
    ];
}

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
            <div className="flex flex-wrap gap-1">
                {FRACTIONS_S5.map((f, i) => (
                    <button
                        key={f.id}
                        onClick={() => onChange(i)}
                        className={[
                            "px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors",
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

// ── Indicateur d'étapes ───────────────────────────────────────────────────────

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

/**
 * @param {{ titre: string, texte: string, question?: string, reponseAttendue?: string }} props
 */
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

// ── Panneau contre-exemples ───────────────────────────────────────────────────

/**
 * Les 3 contre-exemples prescrits, tous affichés d'un coup.
 * @param {{ denominateur: number, nomLettres: string }} props
 */
function PanneauContreExemples({ denominateur, nomLettres }) {
    const [visible, setVisible] = useState(false);
    const contreExemples = getContreExemples(denominateur, nomLettres);

    return (
        <div>
            <button
                type="button"
                onClick={() => setVisible((v) => !v)}
                className={[
                    "w-full px-4 py-2 text-xs font-semibold rounded-xl border transition-colors",
                    visible
                        ? "bg-red-100 text-red-700 border-red-300"
                        : "bg-slate-100 text-slate-500 border-slate-200 hover:bg-red-50 hover:text-red-600",
                ].join(" ")}
            >
                {visible
                    ? "← Masquer les contre-exemples"
                    : "✗ Afficher les contre-exemples"}
            </button>

            {visible && (
                <div className="mt-3 space-y-3">
                    <p className="text-xs text-slate-500 italic px-1">
                        Contre-exemples prescrits — fiche S5, phase ② :
                    </p>
                    <div className="flex gap-4 flex-wrap items-start">
                        {contreExemples.map((ce) => (
                            <div
                                key={ce.id}
                                className="flex flex-col items-center gap-2 flex-1 min-w-40"
                            >
                                <CarteFractionSVG
                                    denominateur={denominateur}
                                    etat={ce.id}
                                    taille={90}
                                />
                                <p className="text-xs text-red-700 text-center leading-snug">
                                    {ce.explication}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

PanneauContreExemples.propTypes = {
    denominateur: PropTypes.number.isRequired,
    nomLettres: PropTypes.string.isRequired,
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
    } = useModelageS5();

    const texteCourant = textes[etape];

    // Forme à afficher à côté de la carte (première forme disponible pour cette fraction)
    const formesParDenominateur = {
        2: { forme: "carre", denominateur: 2 },
        3: { forme: "disque", denominateur: 3 },
        4: { forme: "carre", denominateur: 4 },
        5: { forme: "rectangle", denominateur: 5 },
        6: { forme: "hexagone", denominateur: 6 },
        8: { forme: "disque", denominateur: 8 },
        10: { forme: "rectangle", denominateur: 10 },
    };
    const formeConfig = formesParDenominateur[fraction.denominateur];

    return (
        <div className="space-y-4">
            {/* Sélecteur de fraction */}
            <SelecteurFraction
                fractionIndex={fractionIndex}
                onChange={setFractionIndex}
            />

            {/* Indicateur d'étapes */}
            <IndicateurEtapes etape={etape} onGo={setEtape} />

            {/* Zone principale : carte + image + texte */}
            <div className="flex flex-col sm:flex-row items-center gap-5 bg-white rounded-2xl border border-slate-200 p-5">
                {/* Colonne visuelle : carte en construction + image référence */}
                <div className="flex items-end gap-3 shrink-0">
                    <div className="flex flex-col items-center gap-1">
                        <CarteFractionSVG
                            denominateur={fraction.denominateur}
                            etat={etape}
                            annotations={etape === ETAPE_S5.COMPLET}
                            taille={120}
                        />
                        <span className="text-xs text-slate-400 italic">
                            en chiffres
                        </span>
                    </div>
                    {/* Image de référence (= le tout partagé) */}
                    {formeConfig && (
                        <div className="flex flex-col items-center gap-1">
                            <FormePartageeSVG
                                forme={formeConfig.forme}
                                denominateur={formeConfig.denominateur}
                                etat="colorie"
                                partColoriee={0}
                                taille={80}
                            />
                            <span className="text-xs text-slate-400 italic">
                                image
                            </span>
                        </div>
                    )}
                </div>

                {/* Texte du modelage */}
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
            bg-blue-600 text-white hover:bg-blue-700"
                >
                    Suivant →
                </button>
            </div>

            {/* Contre-exemples */}
            <PanneauContreExemples
                denominateur={fraction.denominateur}
                nomLettres={fraction.nomLettres}
            />

            {/* Note 1/10 */}
            {fraction.denominateur === 10 && (
                <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
                    <span className="font-semibold">
                        ⚠ Erreur très fréquente :
                    </span>{" "}
                    1/10 écrit « 1/1 » suivi d'un 0 séparé. Le 10 est un seul
                    nombre à deux chiffres — il va tout entier sous le trait.
                    Fiche S5, phase ③b.
                </div>
            )}
        </div>
    );
}

// ── Composant principal ───────────────────────────────────────────────────────

/**
 * ModelageS5 — outil de projection pour la séance 5.
 * @returns {JSX.Element}
 */
export default function ModelageS5() {
    const [onglet, setOnglet] = useState("modelage");

    return (
        <div className="space-y-4">
            {/* En-tête */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-1">
                <div>
                    <h2 className="font-bold text-slate-700 text-base">
                        Séance 5 — Écriture fractionnaire en chiffres
                    </h2>
                    <p className="text-xs text-slate-400">
                        7 fractions · Chiffre du bas / trait / chiffre du haut ·
                        Triplets
                    </p>
                </div>
                <span className="text-xs bg-slate-100 text-slate-500 px-3 py-1 rounded-full">
                    55 min · Outil enseignant
                </span>
            </div>

            {/* Onglets */}
            <div className="flex gap-1 border-b border-slate-200">
                {[
                    { id: "modelage", label: "② Modelage", duree: "10 min" },
                    { id: "mec", label: "④ Mise en commun", duree: "11 min" },
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

            {/* Contenu */}
            <div className="pt-1">
                {onglet === "modelage" && <OngletModelage />}
                {onglet === "mec" && <CorpusMiseEnCommunS5 />}
            </div>
        </div>
    );
}
