/**
 * @fileoverview Composant Carte — une carte individuelle du jeu M2.
 *
 * Affiche une carte de type "image" ou "lettres".
 * (Le type "chiffres" sera ajouté au sprint 10 pour les triplets S6.)
 *
 * États visuels :
 *   'neutre'      — carte non sélectionnée
 *   'selectionnee'— carte en cours de sélection (en attente de validation)
 *   'correcte'    — paire validée, reste affichée avec un retour positif
 *   'incorrecte'  — paire refusée, bref retour visuel puis retour en 'neutre'
 *
 * Carte spéciale "un" (le tout) :
 *   fractionId='un' → affiche la forme entière sans division via ImageFraction.
 *   Source : fiche S2 matériel — « cartes-lettres : "un demi", "un quart",
 *   "un huitième", "un" ».
 */

import PropTypes from "prop-types";
import { TYPE_CARTE } from "../../config/jeu.config";
import ImageFraction from "./ImageFraction";
import CarteFractionSVG from "../ModelageInteractif/CarteFractionSVG";

/**
 * @typedef {'neutre'|'selectionnee'|'correcte'|'incorrecte'} EtatCarte
 */

/**
 * Styles Tailwind selon l'état de la carte.
 * @type {Record<EtatCarte, string>}
 */
const STYLES_ETAT = {
    neutre: "border-slate-200 bg-white hover:border-blue-300 hover:shadow-md cursor-pointer",
    selectionnee:
        "border-blue-500 bg-blue-50 shadow-md ring-2 ring-blue-300 cursor-pointer",
    correcte: "border-emerald-400 bg-emerald-50 shadow-sm cursor-default",
    incorrecte: "border-red-400 bg-red-50 cursor-default",
};

/**
 * Composant Carte individuelle.
 *
 * @param {Object}     props
 * @param {string}     props.id           - Identifiant unique de la carte dans le jeu
 *                                          (ex. "1-4_image", "1-4_lettres", "un_lettres")
 * @param {string}     props.fractionId   - Identifiant de la fraction (ex. "1-4")
 *                                          ou "un" pour la carte du tout
 * @param {'image'|'lettres'} props.type  - Type de carte
 * @param {string}     props.nomLettres   - Nom en lettres (ex. "un quart")
 * @param {EtatCarte}  [props.etat]       - État visuel de la carte
 * @param {Function}   [props.onClick]    - Callback appelé au clic (si la carte est cliquable)
 * @param {number}     [props.taille]     - Taille (px) du SVG pour les cartes-image
 * @returns {JSX.Element}
 */
export default function Carte({
    id,
    fractionId,
    type,
    nomLettres,
    denominateur,
    etat = "neutre",
    onClick,
    taille = 72,
}) {
    const estCliquable = etat === "neutre" || etat === "selectionnee";
    const classeEtat = STYLES_ETAT[etat] ?? STYLES_ETAT.neutre;

    function handleClick() {
        if (estCliquable && onClick) onClick(id);
    }

    return (
        <button
            type="button"
            onClick={handleClick}
            disabled={!estCliquable}
            aria-label={
                type === TYPE_CARTE.IMAGE
                    ? `Carte image : ${nomLettres}`
                    : type === TYPE_CARTE.CHIFFRES
                      ? `Carte chiffres : ${nomLettres}`
                      : `Carte mot : ${nomLettres}`
            }
            aria-pressed={etat === "selectionnee"}
            className={[
                "relative flex flex-col items-center justify-center",
                "w-28 h-32 rounded-xl border-2 transition-all duration-150",
                "select-none",
                classeEtat,
            ].join(" ")}
        >
            {/* Indicateur d'état — coin supérieur droit */}
            {etat === "correcte" && (
                <span
                    className="absolute top-1.5 right-1.5 text-emerald-500 text-sm"
                    aria-hidden="true"
                >
                    ✓
                </span>
            )}
            {etat === "incorrecte" && (
                <span
                    className="absolute top-1.5 right-1.5 text-red-400 text-sm"
                    aria-hidden="true"
                >
                    ✗
                </span>
            )}

            {/* Contenu de la carte */}
            {type === TYPE_CARTE.IMAGE ? (
                <ContenuImage
                    fractionId={fractionId}
                    taille={taille}
                    grise={etat === "incorrecte"}
                />
            ) : type === TYPE_CARTE.CHIFFRES ? (
                <ContenuChiffres denominateur={denominateur} etat={etat} />
            ) : (
                <ContenuLettres nomLettres={nomLettres} etat={etat} />
            )}

            {/* Étiquette de type — en bas de carte */}
            <span className="absolute bottom-1.5 text-xs text-slate-300 font-mono">
                {type === TYPE_CARTE.IMAGE
                    ? "image"
                    : type === TYPE_CARTE.CHIFFRES
                      ? "1/n"
                      : "mot"}
            </span>
        </button>
    );
}

// ── Sous-composants ───────────────────────────────────────────────────────────

/**
 * Contenu d'une carte de type "image".
 * Délègue à ImageFraction qui gère le cas spécial 'un'.
 */
function ContenuImage({ fractionId, taille, grise }) {
    return (
        <ImageFraction fractionId={fractionId} taille={taille} grise={grise} />
    );
}

ContenuImage.propTypes = {
    fractionId: PropTypes.string.isRequired,
    taille: PropTypes.number.isRequired,
    grise: PropTypes.bool,
};

/**
 * Contenu d'une carte de type "chiffres" — utilise CarteFractionSVG (sprint 8).
 */
function ContenuChiffres({ denominateur, etat }) {
    return (
        <CarteFractionSVG
            denominateur={denominateur}
            etat="complet"
            taille={etat === "incorrecte" ? 60 : 64}
        />
    );
}

ContenuChiffres.propTypes = {
    denominateur: PropTypes.number.isRequired,
    etat: PropTypes.string.isRequired,
};

/**
 * Contenu d'une carte de type "lettres".
 */
function ContenuLettres({ nomLettres, etat }) {
    const couleurTexte =
        etat === "correcte"
            ? "text-emerald-700"
            : etat === "incorrecte"
              ? "text-red-600"
              : etat === "selectionnee"
                ? "text-blue-700"
                : "text-slate-700";

    return (
        <span
            className={[
                "text-center font-semibold leading-tight px-2",
                nomLettres.length > 10 ? "text-sm" : "text-base",
                couleurTexte,
            ].join(" ")}
        >
            {nomLettres}
        </span>
    );
}

ContenuLettres.propTypes = {
    nomLettres: PropTypes.string.isRequired,
    etat: PropTypes.string.isRequired,
};

Carte.propTypes = {
    id: PropTypes.string.isRequired,
    fractionId: PropTypes.string.isRequired,
    type: PropTypes.oneOf([
        TYPE_CARTE.IMAGE,
        TYPE_CARTE.LETTRES,
        TYPE_CARTE.CHIFFRES,
    ]).isRequired,
    nomLettres: PropTypes.string.isRequired,
    denominateur: PropTypes.number,
    etat: PropTypes.oneOf(["neutre", "selectionnee", "correcte", "incorrecte"]),
    onClick: PropTypes.func,
    taille: PropTypes.number,
};
