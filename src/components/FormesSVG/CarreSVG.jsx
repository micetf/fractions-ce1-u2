/**
 * @fileoverview CarreSVG — carré partagé en parts égales, première part coloriée.
 *
 * Utilisé comme carte-image pour les fractions 1/2, 1/4, 1/8.
 * Source : fiche S1 — formes-supports « carré ».
 *
 * Dispositions retenues (visuellement équilibrées sur forme carrée) :
 *   denominateur=2 → 2 colonnes × 1 ligne
 *   denominateur=4 → 2 colonnes × 2 lignes
 *   denominateur=8 → 4 colonnes × 2 lignes
 *
 * La part coloriée est toujours celle en haut à gauche (colonne 0, ligne 0).
 * Cohérent avec la convention « une seule part coloriée » des fiches.
 */

import PropTypes from "prop-types";

/** @type {Record<number, {cols: number, rows: number}>} */
const DISPOSITION = {
    2: { cols: 2, rows: 1 },
    4: { cols: 2, rows: 2 },
    8: { cols: 4, rows: 2 },
};

const COULEUR_PART = "#2563eb"; // blue-600
const COULEUR_FOND = "#f1f5f9"; // slate-100
const COULEUR_TRAIT = "#94a3b8"; // slate-400

/**
 * @param {Object}  props
 * @param {2|4|8}   props.denominateur   - Nombre de parts (2, 4 ou 8)
 * @param {number}  [props.taille=80]    - Côté du carré en pixels
 * @param {boolean} [props.grise=false]  - Niveaux de gris (état verrouillé)
 * @returns {JSX.Element}
 */
export default function CarreSVG({ denominateur, taille = 80, grise = false }) {
    const disposition = DISPOSITION[denominateur];
    if (!disposition) {
        console.warn(
            `CarreSVG : dénominateur ${denominateur} non supporté (2, 4 ou 8 attendus).`
        );
        return null;
    }

    const { cols, rows } = disposition;
    const largeurPart = taille / cols;
    const hauteurPart = taille / rows;

    const couleurPart = grise ? "#cbd5e1" : COULEUR_PART;
    const couleurFond = grise ? "#f8fafc" : COULEUR_FOND;
    const couleurTrait = grise ? "#e2e8f0" : COULEUR_TRAIT;

    return (
        <svg
            width={taille}
            height={taille}
            viewBox={`0 0 ${taille} ${taille}`}
            aria-label={`Carré partagé en ${denominateur} parts égales, une part coloriée`}
            role="img"
        >
            {/* Grille de parts */}
            {Array.from({ length: rows }, (_, row) =>
                Array.from({ length: cols }, (_, col) => {
                    const estColorié = row === 0 && col === 0;
                    return (
                        <rect
                            key={`${row}-${col}`}
                            x={col * largeurPart}
                            y={row * hauteurPart}
                            width={largeurPart}
                            height={hauteurPart}
                            fill={estColorié ? couleurPart : couleurFond}
                            stroke={couleurTrait}
                            strokeWidth={1}
                        />
                    );
                })
            )}

            {/* Bordure extérieure */}
            <rect
                x={0.5}
                y={0.5}
                width={taille - 1}
                height={taille - 1}
                fill="none"
                stroke={couleurTrait}
                strokeWidth={1.5}
            />
        </svg>
    );
}

CarreSVG.propTypes = {
    denominateur: PropTypes.oneOf([2, 4, 8]).isRequired,
    taille: PropTypes.number,
    grise: PropTypes.bool,
};
