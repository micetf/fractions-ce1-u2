/**
 * @fileoverview FormeImage — dispatcher vers le composant SVG adapté.
 *
 * Point d'entrée unique pour afficher la représentation imagée d'une fraction.
 * Utilisé par les cartes-image du jeu M2 (sprints 2–4, 10).
 *
 * Logique de sélection de la forme :
 *   1. Si `forme` est fourni explicitement, l'utiliser.
 *   2. Sinon, utiliser la première entrée de `fraction.formesSupport`.
 *
 * Correspondances forme → composant SVG :
 *   'carre'      → CarreSVG     (denominateur 2, 4, 8)
 *   'disque'     → DisqueSVG    (denominateur 2, 3, 4, 8)
 *   'demi-disque'→ DisqueSVG avec denominateur=2 et style demi-cercle
 *                  (représente le tout = 1 demi-disque, donc 1/2 du disque complet)
 *   'hexagone'   → HexagoneSVG  (denominateur 3 ou 6)
 *   'rectangle'  → BandeSVG     (format paysage, denominateur quelconque)
 *   'bande'      → BandeSVG     (format paysage, denominateur quelconque)
 *
 * Note sur 'demi-disque' :
 *   La fiche S1 liste cette forme pour 1/2. Le demi-disque (forme en D) représente
 *   physiquement la moitié d'un disque. Ici, on affiche un disque dont la moitié
 *   supérieure est coloriée (DisqueSVG, denominateur=2), ce qui est la représentation
 *   visuelle la plus proche et pédagogiquement correcte.
 *
 * Note sur 'rectangle' et 'bande' :
 *   Les deux formes sont représentées par BandeSVG (bande rectangulaire). La distinction
 *   terminologique « rectangle » (formes S1, S3) / « bande » (S4) est pédagogique, non
 *   graphique. Source : fiche S4 — « une bande représente le tout ».
 */

import PropTypes from "prop-types";
import CarreSVG from "./CarreSVG";
import DisqueSVG from "./DisqueSVG";
import HexagoneSVG from "./HexagoneSVG";
import { BandeSVG } from "../BandeRepertoire";
import { getFractionById } from "../../config/fractions.config";

/**
 * Dimensions de la BandeSVG utilisée comme carte-image.
 * Format paysage pour tenir dans une carte carrée de taille standard.
 */
const BANDE_LARGEUR = 120;
const BANDE_HAUTEUR = 28;

/**
 * Affiche la représentation imagée d'une fraction unitaire CE1.
 *
 * @param {Object}  props
 * @param {string}  props.fractionId  - Identifiant de la fraction (ex. "1-4")
 * @param {string}  [props.forme]     - Forme à afficher. Si absent, utilise
 *                                      la première forme de fraction.formesSupport.
 * @param {number}  [props.taille=80] - Taille du SVG en pixels (largeur = hauteur,
 *                                      sauf pour 'bande'/'rectangle' qui gardent
 *                                      leurs proportions paysage).
 * @param {boolean} [props.grise=false] - Niveaux de gris (état verrouillé)
 * @returns {JSX.Element|null}
 */
export default function FormeImage({
    fractionId,
    forme,
    taille = 80,
    grise = false,
}) {
    const fraction = getFractionById(fractionId);

    if (!fraction) {
        console.warn(`FormeImage : fraction "${fractionId}" introuvable.`);
        return null;
    }

    // Résolution de la forme : explicite > première forme documentée
    const formeResolue = forme ?? fraction.formesSupport[0];

    // Vérification de cohérence : la forme demandée est-elle documentée ?
    if (forme && !fraction.formesSupport.includes(forme)) {
        console.warn(
            `FormeImage : la forme "${forme}" n'est pas documentée pour ${fractionId}. ` +
                `Formes disponibles : ${fraction.formesSupport.join(", ")}.`
        );
    }

    const { denominateur } = fraction;

    switch (formeResolue) {
        case "carre":
            return (
                <CarreSVG
                    denominateur={denominateur}
                    taille={taille}
                    grise={grise}
                />
            );

        case "disque":
            return (
                <DisqueSVG
                    denominateur={denominateur}
                    taille={taille}
                    grise={grise}
                />
            );

        case "demi-disque":
            // Représentation : disque partagé en 2, moitié supérieure coloriée.
            // La forme physique "demi-disque" illustre visuellement 1/2 du disque complet.
            return <DisqueSVG denominateur={2} taille={taille} grise={grise} />;

        case "hexagone":
            // HexagoneSVG supporte denominateur 3 (tiers) et 6 (sixièmes)
            if (denominateur !== 3 && denominateur !== 6) {
                console.warn(
                    `FormeImage : hexagone non supporté pour denominateur=${denominateur}.`
                );
                return null;
            }
            return (
                <HexagoneSVG
                    denominateur={denominateur}
                    taille={taille}
                    grise={grise}
                />
            );

        case "rectangle":
        case "bande":
            // BandeSVG : format paysage, taille adaptée pour une carte.
            // La largeur est proportionnelle à la taille demandée.
            return (
                <BandeSVG
                    denominateur={denominateur}
                    largeur={Math.round(taille * (BANDE_LARGEUR / 80))}
                    hauteur={Math.round(taille * (BANDE_HAUTEUR / 80))}
                    grise={grise}
                />
            );

        default:
            console.warn(`FormeImage : forme "${formeResolue}" non reconnue.`);
            return null;
    }
}

FormeImage.propTypes = {
    fractionId: PropTypes.string.isRequired,
    forme: PropTypes.oneOf([
        "carre",
        "rectangle",
        "disque",
        "demi-disque",
        "hexagone",
        "bande",
    ]),
    taille: PropTypes.number,
    grise: PropTypes.bool,
};
