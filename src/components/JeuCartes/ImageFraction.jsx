/**
 * @fileoverview ImageFraction — rendu SVG d'une fraction, carte "un" incluse.
 *
 * Point d'entrée unique pour tout affichage d'image de fraction.
 * Gère le cas spécial fractionId='un' (le tout) qui n'est pas dans
 * FRACTIONS et ne peut donc pas être passé à FormeImage.
 *
 * Extraction de ContenuImage (Carte.jsx) en composant public :
 *   - Carte.jsx l'utilise pour son contenu interne
 *   - JeuAutocorrectif.jsx l'utilise pour CarteAutocorrective
 *   - Tout futur composant affichant une image de fraction l'utilisera
 *
 * Règle : ne jamais appeler FormeImage avec fractionId='un'.
 */

import PropTypes from "prop-types";
import { FormeImage } from "../FormesSVG";
import { CARTE_ID_UN } from "../../config/jeu.config";

/**
 * Carré entier colorié — représentation de "un" (le tout).
 * @param {{ taille: number, grise?: boolean }} props
 */
function CarreUn({ taille, grise }) {
    const couleur = grise ? "#cbd5e1" : "#2563eb";
    return (
        <svg
            width={taille}
            height={taille}
            viewBox={`0 0 ${taille} ${taille}`}
            aria-label="Forme entière coloriée — le tout (un)"
            role="img"
        >
            <rect
                x={2}
                y={2}
                width={taille - 4}
                height={taille - 4}
                fill={couleur}
                rx={4}
            />
        </svg>
    );
}

CarreUn.propTypes = {
    taille: PropTypes.number.isRequired,
    grise: PropTypes.bool,
};

/**
 * Rendu SVG d'une fraction, avec prise en charge de la carte "un".
 *
 * @param {Object}  props
 * @param {string}  props.fractionId   - Ex. "1-4" ou "un"
 * @param {number}  [props.taille]     - Taille en px (défaut 64)
 * @param {boolean} [props.grise]      - Rendu grisé (état incorrect)
 * @returns {JSX.Element}
 */
export default function ImageFraction({
    fractionId,
    taille = 64,
    grise = false,
}) {
    if (fractionId === CARTE_ID_UN) {
        return <CarreUn taille={taille} grise={grise} />;
    }
    return <FormeImage fractionId={fractionId} taille={taille} grise={grise} />;
}

ImageFraction.propTypes = {
    fractionId: PropTypes.string.isRequired,
    taille: PropTypes.number,
    grise: PropTypes.bool,
};
