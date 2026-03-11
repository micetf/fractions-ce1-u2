/**
 * @fileoverview ContreExempleSVG — disque partagé en 3 parts INÉGALES.
 *
 * Prescrit par la fiche S3, phase ② modelage :
 *
 *   « L'enseignant montre un disque partagé en 3 parts INÉGALES
 *   (une grande, deux petites).
 *   ✗ Est-ce que la partie coloriée est un tiers de ce disque ? Non —
 *   parce que les 3 parts ne sont PAS égales. Pour avoir un tiers, les
 *   parts doivent être égales. »
 *
 *   « Ce contre-exemple est fondamental : beaucoup d'élèves confondent
 *   "partager en 3" et "partager en 3 parts égales". »
 *
 * Rendu : 3 secteurs d'angles 160°, 120°, 80° — délibérément inégaux
 * (pas 120°/120°/120°) — avec la première part (160°) coloriée.
 */

import PropTypes from "prop-types";

// Palette cohérente avec FormePartageeSVG
const C = {
    partColoriee: "#ef4444", // red-500 — rouge pour signaler l'erreur
    partNeutre: "#f8fafc",
    bordForme: "#475569",
    bordDiv: "#fca5a5", // red-300
    croix: "#dc2626", // red-600
};

/**
 * Chemin SVG d'un secteur de disque depuis un angle de départ.
 * @param {number} cx       Centre x
 * @param {number} cy       Centre y
 * @param {number} r        Rayon
 * @param {number} aDebut   Angle de départ en radians
 * @param {number} aFin     Angle de fin en radians
 * @returns {string}
 */
function pathSecteur(cx, cy, r, aDebut, aFin) {
    const x1 = (cx + r * Math.cos(aDebut)).toFixed(3);
    const y1 = (cy + r * Math.sin(aDebut)).toFixed(3);
    const x2 = (cx + r * Math.cos(aFin)).toFixed(3);
    const y2 = (cy + r * Math.sin(aFin)).toFixed(3);
    const largeArc = aFin - aDebut > Math.PI ? 1 : 0;
    return `M ${cx},${cy} L ${x1},${y1} A ${r},${r} 0 ${largeArc},1 ${x2},${y2} Z`;
}

/**
 * Disque partagé en 3 parts délibérément inégales.
 * Angles choisis : 160°, 120°, 80° — visuellement distincts des 120° égaux.
 * La première part (160°) est coloriée en rouge.
 *
 * @param {Object}  props
 * @param {number}  [props.taille=120] - Dimension en px
 * @returns {JSX.Element}
 */
export default function ContreExempleSVG({ taille = 120 }) {
    const SIZE = 100;
    const cx = 50,
        cy = 50,
        r = 44;

    // Angles en degrés → radians, départ en haut (−90°)
    const debut = -Math.PI / 2;
    const deg = (d) => (d * Math.PI) / 180;

    const angles = [
        { debut: debut, fin: debut + deg(160), colorie: true },
        { debut: debut + deg(160), fin: debut + deg(280), colorie: false },
        { debut: debut + deg(280), fin: debut + deg(360), colorie: false },
    ];

    return (
        <svg
            width={taille}
            height={taille}
            viewBox={`0 0 ${SIZE} ${SIZE}`}
            role="img"
            aria-label="Contre-exemple : disque partagé en 3 parts inégales"
        >
            {/* Secteurs */}
            {angles.map((s, i) => (
                <path
                    key={i}
                    d={pathSecteur(cx, cy, r, s.debut, s.fin)}
                    fill={s.colorie ? C.partColoriee : C.partNeutre}
                    stroke={C.bordDiv}
                    strokeWidth={1}
                />
            ))}

            {/* Contour extérieur */}
            <circle
                cx={cx}
                cy={cy}
                r={r}
                fill="none"
                stroke={C.bordForme}
                strokeWidth={1.5}
            />

            {/* Croix ✗ en haut à droite — signal visuel d'erreur */}
            <text
                x={SIZE - 8}
                y={14}
                textAnchor="middle"
                fontSize="14"
                fontWeight="bold"
                fill={C.croix}
                aria-hidden="true"
            >
                ✗
            </text>
        </svg>
    );
}

ContreExempleSVG.propTypes = {
    taille: PropTypes.number,
};
