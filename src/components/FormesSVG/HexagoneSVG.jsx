/**
 * @fileoverview HexagoneSVG — hexagone régulier partagé en 3 ou 6 parts égales.
 *
 * Utilisé comme carte-image pour les fractions 1/3 et 1/6.
 * Source : fiche S3 — « hexagone régulier divisé en 6 triangles équilatéraux ».
 *
 * Géométrie :
 *   - Hexagone orienté « pointe en haut » (pointy-top).
 *   - 6 sommets calculés depuis le centre, rayon r, angle de départ à -90°.
 *   - Pour denominateur=6 : 6 triangles isocèles (centre + 2 sommets adjacents).
 *   - Pour denominateur=3 : 3 losanges (centre + 3 sommets alternés),
 *     soit 2 triangles adjacents groupés — correspond à la relation
 *     « 1/3 = 2 sixièmes » documentée en fiche S3.
 *
 * Convention visuelle cohérente avec DisqueSVG :
 *   - La part coloriée est toujours la première (index 0), en haut à droite.
 */

import PropTypes from "prop-types";

const COULEUR_PART = "#2563eb"; // blue-600
const COULEUR_FOND = "#f1f5f9"; // slate-100
const COULEUR_TRAIT = "#94a3b8"; // slate-400

/**
 * Calcule les 6 sommets d'un hexagone régulier « pointe en haut ».
 * @param {number} cx - Centre X
 * @param {number} cy - Centre Y
 * @param {number} r  - Rayon (centre → sommet)
 * @returns {Array<{x: number, y: number}>}
 */
function sommetsHexagone(cx, cy, r) {
    return Array.from({ length: 6 }, (_, k) => {
        // Angle du sommet k : départ à -90° (pointe en haut), pas de 60°
        const angleDeg = -90 + k * 60;
        const angleRad = (angleDeg * Math.PI) / 180;
        return {
            x: cx + r * Math.cos(angleRad),
            y: cy + r * Math.sin(angleRad),
        };
    });
}

/**
 * Formate des coordonnées pour un attribut SVG `points`.
 * @param {Array<{x: number, y: number}>} pts
 * @returns {string}
 */
function pointsSVG(pts) {
    return pts.map((p) => `${p.x},${p.y}`).join(" ");
}

/**
 * @param {Object}  props
 * @param {3|6}     props.denominateur  - 3 (tiers) ou 6 (sixièmes)
 * @param {number}  [props.taille=80]   - Taille du SVG (largeur = hauteur) en pixels
 * @param {boolean} [props.grise=false] - Niveaux de gris (état verrouillé)
 * @returns {JSX.Element}
 */
export default function HexagoneSVG({
    denominateur,
    taille = 80,
    grise = false,
}) {
    const cx = taille / 2;
    const cy = taille / 2;
    const r = taille / 2 - 4;

    const sommets = sommetsHexagone(cx, cy, r);

    const couleurPart = grise ? "#cbd5e1" : COULEUR_PART;
    const couleurFond = grise ? "#f8fafc" : COULEUR_FOND;
    const couleurTrait = grise ? "#e2e8f0" : COULEUR_TRAIT;

    // ── denominateur = 6 : 6 triangles ────────────────────────────────────────
    // Triangle k = [centre, sommet k, sommet (k+1)%6]
    // Source : fiche S3 — « hexagone divisé en 6 triangles équilatéraux »
    if (denominateur === 6) {
        return (
            <svg
                width={taille}
                height={taille}
                viewBox={`0 0 ${taille} ${taille}`}
                aria-label="Hexagone partagé en 6 parts égales, une part coloriée"
                role="img"
            >
                {Array.from({ length: 6 }, (_, k) => {
                    const s1 = sommets[k];
                    const s2 = sommets[(k + 1) % 6];
                    return (
                        <polygon
                            key={k}
                            points={pointsSVG([{ x: cx, y: cy }, s1, s2])}
                            fill={k === 0 ? couleurPart : couleurFond}
                            stroke={couleurTrait}
                            strokeWidth={1}
                            strokeLinejoin="round"
                        />
                    );
                })}
                {/* Bordure de l'hexagone */}
                <polygon
                    points={pointsSVG(sommets)}
                    fill="none"
                    stroke={couleurTrait}
                    strokeWidth={1.5}
                    strokeLinejoin="round"
                />
            </svg>
        );
    }

    // ── denominateur = 3 : 3 losanges (= 2 triangles groupés) ─────────────────
    // Losange k = [centre, sommet 2k, sommet 2k+1, sommet 2k+2]
    // Cohérent avec la relation 1/3 = 2 sixièmes (fiche S3).
    if (denominateur === 3) {
        return (
            <svg
                width={taille}
                height={taille}
                viewBox={`0 0 ${taille} ${taille}`}
                aria-label="Hexagone partagé en 3 parts égales, une part coloriée"
                role="img"
            >
                {Array.from({ length: 3 }, (_, k) => {
                    const s1 = sommets[2 * k];
                    const s2 = sommets[(2 * k + 1) % 6];
                    const s3 = sommets[(2 * k + 2) % 6];
                    return (
                        <polygon
                            key={k}
                            points={pointsSVG([{ x: cx, y: cy }, s1, s2, s3])}
                            fill={k === 0 ? couleurPart : couleurFond}
                            stroke={couleurTrait}
                            strokeWidth={1}
                            strokeLinejoin="round"
                        />
                    );
                })}
                {/* Bordure de l'hexagone */}
                <polygon
                    points={pointsSVG(sommets)}
                    fill="none"
                    stroke={couleurTrait}
                    strokeWidth={1.5}
                    strokeLinejoin="round"
                />
            </svg>
        );
    }

    console.warn(
        `HexagoneSVG : dénominateur ${denominateur} non supporté (3 ou 6 attendus).`
    );
    return null;
}

HexagoneSVG.propTypes = {
    denominateur: PropTypes.oneOf([3, 6]).isRequired,
    taille: PropTypes.number,
    grise: PropTypes.bool,
};
