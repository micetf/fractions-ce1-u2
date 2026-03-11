/**
 * @fileoverview DisqueSVG — disque partagé en N secteurs égaux.
 *
 * Utilisé comme carte-image pour les fractions 1/2, 1/3, 1/4, 1/8.
 * Source : fiche S1 (disque pour 1/2, 1/4, 1/8), fiche S3 (disque pour 1/3).
 *
 * Également utilisé pour la forme « demi-disque » de 1/2 quand celle-ci
 * est demandée explicitement dans FormeImage : un seul demi-cercle colorié
 * représente 1/2 du disque complet.
 *
 * Calcul géométrique :
 *   - Chaque secteur est un arc SVG dont le sommet est le centre du disque.
 *   - Angle de départ : −90° (sommet du cercle, 12 heures) pour que
 *     le premier secteur parte du haut.
 *   - Sens de rotation : horaire (sweep-flag = 1, convention SVG).
 */

import PropTypes from "prop-types";

const COULEUR_PART = "#2563eb"; // blue-600
const COULEUR_FOND = "#f1f5f9"; // slate-100
const COULEUR_TRAIT = "#94a3b8"; // slate-400

/**
 * Convertit des degrés en radians.
 * @param {number} deg
 * @returns {number}
 */
function toRad(deg) {
    return (deg * Math.PI) / 180;
}

/**
 * Coordonnées d'un point sur le cercle à l'angle donné (degrés).
 * @param {number} cx
 * @param {number} cy
 * @param {number} r
 * @param {number} angleDeg
 * @returns {{ x: number, y: number }}
 */
function pointCercle(cx, cy, r, angleDeg) {
    return {
        x: cx + r * Math.cos(toRad(angleDeg)),
        y: cy + r * Math.sin(toRad(angleDeg)),
    };
}

/**
 * @param {Object}  props
 * @param {2|3|4|8} props.denominateur  - Nombre de secteurs
 * @param {number}  [props.taille=80]   - Taille du SVG (largeur = hauteur) en pixels
 * @param {boolean} [props.grise=false] - Niveaux de gris (état verrouillé)
 * @returns {JSX.Element}
 */
export default function DisqueSVG({
    denominateur,
    taille = 80,
    grise = false,
}) {
    const cx = taille / 2;
    const cy = taille / 2;
    // Rayon légèrement inférieur à la moitié pour laisser de la marge
    const r = taille / 2 - 4;

    const angleParSecteur = 360 / denominateur;
    // Départ à -90° : premier secteur en haut
    const ANGLE_DEPART = -90;

    const couleurPart = grise ? "#cbd5e1" : COULEUR_PART;
    const couleurFond = grise ? "#f8fafc" : COULEUR_FOND;
    const couleurTrait = grise ? "#e2e8f0" : COULEUR_TRAIT;

    return (
        <svg
            width={taille}
            height={taille}
            viewBox={`0 0 ${taille} ${taille}`}
            aria-label={`Disque partagé en ${denominateur} parts égales, une part coloriée`}
            role="img"
        >
            {/* Fond du disque complet */}
            <circle cx={cx} cy={cy} r={r} fill={couleurFond} />

            {/* Secteurs */}
            {Array.from({ length: denominateur }, (_, i) => {
                const startDeg = ANGLE_DEPART + i * angleParSecteur;
                const endDeg = ANGLE_DEPART + (i + 1) * angleParSecteur;
                const debut = pointCercle(cx, cy, r, startDeg);
                const fin = pointCercle(cx, cy, r, endDeg);
                const grandArc = angleParSecteur > 180 ? 1 : 0;

                const d = `M ${cx} ${cy} L ${debut.x} ${debut.y} A ${r} ${r} 0 ${grandArc} 1 ${fin.x} ${fin.y} Z`;

                return (
                    <path
                        key={i}
                        d={d}
                        fill={i === 0 ? couleurPart : couleurFond}
                        stroke={couleurTrait}
                        strokeWidth={1}
                    />
                );
            })}

            {/* Bordure extérieure du disque */}
            <circle
                cx={cx}
                cy={cy}
                r={r}
                fill="none"
                stroke={couleurTrait}
                strokeWidth={1.5}
            />
        </svg>
    );
}

DisqueSVG.propTypes = {
    denominateur: PropTypes.oneOf([2, 3, 4, 8]).isRequired,
    taille: PropTypes.number,
    grise: PropTypes.bool,
};
