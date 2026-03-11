/**
 * @fileoverview Représentation SVG d'une bande rectangulaire partagée en N parts égales.
 *
 * Utilisé par FractionLigne pour illustrer chaque fraction unitaire
 * dans la bande-répertoire (M3).
 *
 * Choix de rendu : SVG inline généré programmatiquement.
 * Justification : les 7 fractions ont des dénominateurs différents (2, 3, 4, 5, 6, 8, 10) ;
 * une génération à la volée évite de gérer 7 images statiques et garantit
 * que les parts sont rigoureusement égales.
 *
 * Référence pédagogique : fiche S4 — « une bande représente le tout ».
 */

import PropTypes from "prop-types";

/** Couleur de la part coloriée (une seule — fraction unitaire). */
const COULEUR_PART = "#2563eb"; // blue-600

/** Couleur de fond des parts non coloriées. */
const COULEUR_FOND = "#f1f5f9"; // slate-100

/** Couleur des traits de séparation. */
const COULEUR_TRAIT = "#94a3b8"; // slate-400

/**
 * Bande rectangulaire SVG partagée en `denominateur` parts égales.
 * La première part (à gauche) est coloriée pour représenter la fraction unitaire.
 *
 * @param {Object}  props
 * @param {number}  props.denominateur - Nombre de parts (2, 3, 4, 5, 6, 8 ou 10)
 * @param {number}  [props.largeur=200] - Largeur du SVG en pixels
 * @param {number}  [props.hauteur=28]  - Hauteur du SVG en pixels
 * @param {boolean} [props.grise=false] - Affiche la bande en niveaux de gris (état verrouillé)
 * @returns {JSX.Element}
 */
export default function BandeSVG({
    denominateur,
    largeur = 200,
    hauteur = 28,
    grise = false,
}) {
    const largeurPart = largeur / denominateur;

    const couleurPart = grise ? "#cbd5e1" : COULEUR_PART;
    const couleurFond = grise ? "#f8fafc" : COULEUR_FOND;
    const couleurTrait = grise ? "#e2e8f0" : COULEUR_TRAIT;

    return (
        <svg
            width={largeur}
            height={hauteur}
            viewBox={`0 0 ${largeur} ${hauteur}`}
            aria-label={`Bande partagée en ${denominateur} parts égales, une part coloriée`}
            role="img"
        >
            {/* Parts non coloriées */}
            {Array.from({ length: denominateur }, (_, i) => (
                <rect
                    key={i}
                    x={i * largeurPart}
                    y={0}
                    width={largeurPart}
                    height={hauteur}
                    fill={i === 0 ? couleurPart : couleurFond}
                    stroke={couleurTrait}
                    strokeWidth={1}
                />
            ))}

            {/* Bordure extérieure nette */}
            <rect
                x={0.5}
                y={0.5}
                width={largeur - 1}
                height={hauteur - 1}
                fill="none"
                stroke={couleurTrait}
                strokeWidth={1}
            />
        </svg>
    );
}

BandeSVG.propTypes = {
    denominateur: PropTypes.number.isRequired,
    largeur: PropTypes.number,
    hauteur: PropTypes.number,
    grise: PropTypes.bool,
};
