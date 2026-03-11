/**
 * @fileoverview FormePartageeSVG — représentation SVG d'une forme à trois états.
 *
 * Implémente les trois étapes du modelage (fiche S1, phase ②) :
 *   1. TOUT    — forme entière, non divisée
 *   2. PARTAGE — forme divisée en N parts égales, sans coloriage
 *   3. COLORIE — forme divisée, une part coloriée
 *
 * Formes disponibles :
 *   - carre     : carré découpé par pliage (S1)
 *   - rectangle : rectangle découpé en bandes (S1, S3)
 *   - disque    : disque en secteurs (S1, S3)
 *   - eventail  : demi-disque (S1) — LE TOUT est le demi-disque entier
 *   - hexagone  : hexagone régulier en 6 triangles équilatéraux (S3)
 *                 enjeu didactique S3 : 1/3 = 2 triangles = 2 sixièmes
 *
 * Dénominateurs S1 : 2, 4, 8 — Dénominateurs S3 : 3, 6 — Dénominateurs S4 : 5, 10
 *
 * ⚠️ Grilles carré/rectangle : orientation choisie par cohérence visuelle
 *    (pliage bord à bord, fiche S1 phase ②). Non prescrite au pixel près.
 * ⚠️ Hexagone : sommet en haut (pointe vers le haut), 6 triangles depuis
 *    le centre. Pour denominateur=3, groupes de 2 triangles adjacents.
 */

import PropTypes from "prop-types";

// ── Palette ──────────────────────────────────────────────────────────────────

const C = {
    fondTout: "#dbeafe", // blue-100 — forme entière non divisée
    bordTout: "#93c5fd", // blue-300
    partColoriee: "#3b82f6", // blue-500 — la part choisie
    partNeutre: "#f8fafc", // slate-50 — parts non coloriées
    bordForme: "#475569", // slate-600 — contour extérieur
    bordDiv: "#cbd5e1", // slate-200 — lignes de division internes
};

// ── Helpers grille (carré / rectangle) ───────────────────────────────────────

/**
 * Configurations grille par forme et dénominateur.
 * [rows, cols]
 */
const GRILLES = {
    carre: { 2: [2, 1], 4: [2, 2], 8: [2, 4] },
    rectangle: {
        2: [1, 2],
        3: [1, 3],
        4: [1, 4],
        5: [1, 5],
        6: [1, 6],
        8: [2, 4],
        10: [2, 5],
    },
};

/**
 * Génère les cellules d'une grille rectangulaire.
 * @param {number} W           - Largeur totale
 * @param {number} H           - Hauteur totale
 * @param {number} denominateur
 * @param {'carre'|'rectangle'} forme
 * @returns {Array<{ x:number, y:number, w:number, h:number }>}
 */
function cellsGrille(W, H, denominateur, forme) {
    const [rows, cols] = GRILLES[forme][denominateur] ?? [1, denominateur];
    const cw = W / cols;
    const ch = H / rows;
    return Array.from({ length: denominateur }, (_, i) => ({
        x: (i % cols) * cw,
        y: Math.floor(i / cols) * ch,
        w: cw,
        h: ch,
    }));
}

// ── Helpers secteurs (disque / éventail) ─────────────────────────────────────

/**
 * Chemin SVG d'un secteur de disque (départ en haut, sens horaire).
 * @param {number} cx - Centre x
 * @param {number} cy - Centre y
 * @param {number} r  - Rayon
 * @param {number} i  - Index du secteur (0 = haut)
 * @param {number} N  - Nombre total de secteurs
 * @returns {string}
 */
function pathSecteurDisque(cx, cy, r, i, N) {
    const a1 = -Math.PI / 2 + (2 * Math.PI * i) / N;
    const a2 = -Math.PI / 2 + (2 * Math.PI * (i + 1)) / N;
    const x1 = (cx + r * Math.cos(a1)).toFixed(3);
    const y1 = (cy + r * Math.sin(a1)).toFixed(3); // y-down : sin positif = bas
    const x2 = (cx + r * Math.cos(a2)).toFixed(3);
    const y2 = (cy + r * Math.sin(a2)).toFixed(3);
    // sweep=1 : horaire dans le repère SVG (y vers le bas)
    return `M ${cx},${cy} L ${x1},${y1} A ${r},${r} 0 0,1 ${x2},${y2} Z`;
}

/**
 * Chemin SVG d'un secteur d'éventail (de gauche à droite par l'arc supérieur).
 *
 * L'éventail = demi-disque, bord plat en bas (côté droit de l'axe y).
 * L'arc va de gauche à droite en passant par le haut.
 * Secteur 0 = secteur le plus à gauche.
 *
 * @param {number} cx - Centre de l'axe plat (bas de l'éventail)
 * @param {number} cy - Y du bord plat
 * @param {number} r  - Rayon
 * @param {number} i  - Index du secteur (0 = gauche)
 * @param {number} N  - Nombre total de secteurs
 * @returns {string}
 */
function pathSecteurEventail(cx, cy, r, i, N) {
    // angle en math standard : va de π (gauche) vers 0 (droite)
    const a1 = Math.PI - i * (Math.PI / N);
    const a2 = Math.PI - (i + 1) * (Math.PI / N);
    const x1 = (cx + r * Math.cos(a1)).toFixed(3);
    const y1 = (cy - r * Math.sin(a1)).toFixed(3); // y-down : minus
    const x2 = (cx + r * Math.cos(a2)).toFixed(3);
    const y2 = (cy - r * Math.sin(a2)).toFixed(3);
    // sweep=1 : horaire SVG → de gauche vers droite par le haut ✓
    return `M ${cx},${cy} L ${x1},${y1} A ${r},${r} 0 0,1 ${x2},${y2} Z`;
}

// ── Rendu par forme ───────────────────────────────────────────────────────────

/**
 * Rendu SVG pour carré ou rectangle.
 */
function RectSVG({ forme, denominateur, etat, partColoriee, taille }) {
    const W = forme === "carre" ? 100 : 160;
    const H = forme === "carre" ? 100 : 80;
    const scale = taille / Math.max(W, H);
    const sw = (W * scale).toFixed(1);
    const sh = (H * scale).toFixed(1);

    if (etat === "tout") {
        return (
            <svg
                width={sw}
                height={sh}
                viewBox={`0 0 ${W} ${H}`}
                role="img"
                aria-label={`${forme === "carre" ? "Carré" : "Rectangle"} entier — le tout`}
            >
                <rect
                    x={1}
                    y={1}
                    width={W - 2}
                    height={H - 2}
                    fill={C.fondTout}
                    stroke={C.bordTout}
                    strokeWidth={2}
                    rx={3}
                />
            </svg>
        );
    }

    const cells = cellsGrille(W, H, denominateur, forme);

    return (
        <svg
            width={sw}
            height={sh}
            viewBox={`0 0 ${W} ${H}`}
            role="img"
            aria-label={`${forme === "carre" ? "Carré" : "Rectangle"} partagé en ${denominateur} parts`}
        >
            {cells.map((cell, i) => (
                <rect
                    key={i}
                    x={cell.x + 0.5}
                    y={cell.y + 0.5}
                    width={cell.w - 1}
                    height={cell.h - 1}
                    fill={
                        etat === "colorie" && i === partColoriee
                            ? C.partColoriee
                            : C.partNeutre
                    }
                    stroke={
                        etat === "colorie" && i === partColoriee
                            ? C.partColoriee
                            : C.bordDiv
                    }
                    strokeWidth={1}
                    rx={1}
                />
            ))}
            {/* Contour extérieur */}
            <rect
                x={0.5}
                y={0.5}
                width={W - 1}
                height={H - 1}
                fill="none"
                stroke={C.bordForme}
                strokeWidth={1.5}
                rx={2}
            />
        </svg>
    );
}

/**
 * Rendu SVG pour disque.
 */
function DisqueSVG({ denominateur, etat, partColoriee, taille }) {
    const SIZE = 100;
    const cx = 50,
        cy = 50,
        r = 44;

    if (etat === "tout") {
        return (
            <svg
                width={taille}
                height={taille}
                viewBox={`0 0 ${SIZE} ${SIZE}`}
                role="img"
                aria-label="Disque entier — le tout"
            >
                <circle
                    cx={cx}
                    cy={cy}
                    r={r}
                    fill={C.fondTout}
                    stroke={C.bordTout}
                    strokeWidth={2}
                />
            </svg>
        );
    }

    return (
        <svg
            width={taille}
            height={taille}
            viewBox={`0 0 ${SIZE} ${SIZE}`}
            role="img"
            aria-label={`Disque partagé en ${denominateur} parts`}
        >
            {Array.from({ length: denominateur }, (_, i) => (
                <path
                    key={i}
                    d={pathSecteurDisque(cx, cy, r, i, denominateur)}
                    fill={
                        etat === "colorie" && i === partColoriee
                            ? C.partColoriee
                            : C.partNeutre
                    }
                    stroke={
                        etat === "colorie" && i === partColoriee
                            ? C.partColoriee
                            : C.bordDiv
                    }
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
        </svg>
    );
}

/**
 * Rendu SVG pour éventail (demi-disque).
 * ⚠️ L'éventail est LE TOUT (fiche S1 : "l'éventail est le TOUT").
 */
function EventailSVG({ denominateur, etat, partColoriee, taille }) {
    const VW = 120,
        VH = 66;
    const cx = 60,
        cy = 62,
        r = 56;
    const sw = taille;
    const sh = Math.round((taille * VH) / VW);

    if (etat === "tout") {
        return (
            <svg
                width={sw}
                height={sh}
                viewBox={`0 0 ${VW} ${VH}`}
                role="img"
                aria-label="Éventail entier — le tout"
            >
                <path
                    d={`M ${cx - r},${cy} A ${r},${r} 0 0,1 ${cx + r},${cy} Z`}
                    fill={C.fondTout}
                    stroke={C.bordTout}
                    strokeWidth={2}
                />
                <line
                    x1={cx - r}
                    y1={cy}
                    x2={cx + r}
                    y2={cy}
                    stroke={C.bordTout}
                    strokeWidth={2}
                />
            </svg>
        );
    }

    return (
        <svg
            width={sw}
            height={sh}
            viewBox={`0 0 ${VW} ${VH}`}
            role="img"
            aria-label={`Éventail partagé en ${denominateur} parts`}
        >
            {Array.from({ length: denominateur }, (_, i) => (
                <path
                    key={i}
                    d={pathSecteurEventail(cx, cy, r, i, denominateur)}
                    fill={
                        etat === "colorie" && i === partColoriee
                            ? C.partColoriee
                            : C.partNeutre
                    }
                    stroke={
                        etat === "colorie" && i === partColoriee
                            ? C.partColoriee
                            : C.bordDiv
                    }
                    strokeWidth={1}
                />
            ))}
            {/* Bord plat */}
            <line
                x1={cx - r}
                y1={cy}
                x2={cx + r}
                y2={cy}
                stroke={C.bordForme}
                strokeWidth={1.5}
            />
            {/* Contour arc extérieur */}
            <path
                d={`M ${cx - r},${cy} A ${r},${r} 0 0,1 ${cx + r},${cy}`}
                fill="none"
                stroke={C.bordForme}
                strokeWidth={1.5}
            />
        </svg>
    );
}

/**
 * Calcule les sommets d'un hexagone régulier (pointe en haut).
 * @param {number} cx  Centre x
 * @param {number} cy  Centre y
 * @param {number} r   Rayon (centre → sommet)
 * @returns {Array<[number, number]>} 6 sommets dans le sens horaire
 */
function sommetsHexagone(cx, cy, r) {
    return Array.from({ length: 6 }, (_, i) => {
        // Pointe en haut : décalage de -π/2
        const a = -Math.PI / 2 + (2 * Math.PI * i) / 6;
        return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
    });
}

/**
 * Chemin SVG d'un triangle équilatéral (centre → sommet i → sommet i+1).
 * @param {number} cx  Centre x
 * @param {number} cy  Centre y
 * @param {Array<[number,number]>} sommets
 * @param {number} i   Index du triangle (0–5)
 * @returns {string}
 */
function pathTriangle(cx, cy, sommets, i) {
    const [x1, y1] = sommets[i];
    const [x2, y2] = sommets[(i + 1) % 6];
    return `M ${cx.toFixed(3)},${cy.toFixed(3)} L ${x1.toFixed(3)},${y1.toFixed(3)} L ${x2.toFixed(3)},${y2.toFixed(3)} Z`;
}

/**
 * Rendu SVG pour hexagone régulier.
 *
 * Enjeu didactique S3 (fiche S3, phase ② et ④ point 2) :
 *   L'hexagone est naturellement composé de 6 triangles équilatéraux.
 *   Pour denominateur=6 → 1 triangle colorié = 1 sixième.
 *   Pour denominateur=3 → 2 triangles adjacents colorés = 1 tiers.
 *   Relation : 1 tiers = 2 sixièmes du même hexagone.
 *
 * @param {{ denominateur: 3|6, etat: string, partColoriee: number, taille: number }} props
 */
function HexagoneSVG({ denominateur, etat, partColoriee, taille }) {
    const SIZE = 110;
    const cx = 55,
        cy = 55,
        r = 48;
    const sommets = sommetsHexagone(cx, cy, r);

    // Contour extérieur (polygon)
    const pointsPoly = sommets
        .map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`)
        .join(" ");

    if (etat === "tout") {
        return (
            <svg
                width={taille}
                height={taille}
                viewBox={`0 0 ${SIZE} ${SIZE}`}
                role="img"
                aria-label="Hexagone entier — le tout"
            >
                <polygon
                    points={pointsPoly}
                    fill={C.fondTout}
                    stroke={C.bordTout}
                    strokeWidth={2}
                />
            </svg>
        );
    }

    // Pour denominateur=3 : les 6 triangles sont groupés en 3 paires
    // Part 0 = triangles 0,1 | Part 1 = triangles 2,3 | Part 2 = triangles 4,5
    // Pour denominateur=6 : chaque triangle est une part indépendante
    const trianglesColories = new Set();
    if (etat === "colorie") {
        if (denominateur === 6) {
            trianglesColories.add(partColoriee % 6);
        } else {
            // denominateur=3 : groupe de 2 triangles adjacents
            const groupe = partColoriee % 3;
            trianglesColories.add(groupe * 2);
            trianglesColories.add(groupe * 2 + 1);
        }
    }

    return (
        <svg
            width={taille}
            height={taille}
            viewBox={`0 0 ${SIZE} ${SIZE}`}
            role="img"
            aria-label={`Hexagone partagé en ${denominateur} parts`}
        >
            {/* Les 6 triangles */}
            {Array.from({ length: 6 }, (_, i) => (
                <path
                    key={i}
                    d={pathTriangle(cx, cy, sommets, i)}
                    fill={
                        trianglesColories.has(i) ? C.partColoriee : C.partNeutre
                    }
                    stroke={C.bordDiv}
                    strokeWidth={0.8}
                />
            ))}
            {/* Contour extérieur */}
            <polygon
                points={pointsPoly}
                fill="none"
                stroke={C.bordForme}
                strokeWidth={1.5}
            />
            {/* Rayons visibles uniquement en état partage (denomination=3 : 3 rayons alternés) */}
            {etat === "partage" && denominateur === 3 && (
                <>
                    {[0, 2, 4].map((i) => {
                        const [x, y] = sommets[i];
                        return (
                            <line
                                key={i}
                                x1={cx}
                                y1={cy}
                                x2={x.toFixed(2)}
                                y2={y.toFixed(2)}
                                stroke={C.bordForme}
                                strokeWidth={1}
                                strokeDasharray="3,2"
                            />
                        );
                    })}
                </>
            )}
        </svg>
    );
}

HexagoneSVG.propTypes = {
    denominateur: PropTypes.oneOf([3, 6]).isRequired,
    etat: PropTypes.oneOf(["tout", "partage", "colorie"]).isRequired,
    partColoriee: PropTypes.number,
    taille: PropTypes.number.isRequired,
};

// ── PropTypes internes ────────────────────────────────────────────────────────

const sharedPropTypes = {
    denominateur: PropTypes.oneOf([2, 3, 4, 5, 6, 8, 10]).isRequired,
    etat: PropTypes.oneOf(["tout", "partage", "colorie"]).isRequired,
    partColoriee: PropTypes.number,
    taille: PropTypes.number.isRequired,
};

RectSVG.propTypes = {
    ...sharedPropTypes,
    forme: PropTypes.oneOf(["carre", "rectangle"]).isRequired,
};
DisqueSVG.propTypes = sharedPropTypes;
EventailSVG.propTypes = sharedPropTypes;

// ── Composant public ─────────────────────────────────────────────────────────

/**
 * Forme géométrique partagée — dispatcher public.
 *
 * @param {Object}  props
 * @param {'carre'|'rectangle'|'disque'|'eventail'|'hexagone'} props.forme
 * @param {2|3|4|6|8} props.denominateur
 * @param {'tout'|'partage'|'colorie'} props.etat
 * @param {number}  [props.partColoriee=0] - Index de la part à colorier (0-based)
 * @param {number}  [props.taille=120]     - Dimension de base en px
 * @returns {JSX.Element}
 */
export default function FormePartageeSVG({
    forme,
    denominateur,
    etat,
    partColoriee = 0,
    taille = 120,
}) {
    if (forme === "carre" || forme === "rectangle") {
        return (
            <RectSVG
                forme={forme}
                denominateur={denominateur}
                etat={etat}
                partColoriee={partColoriee}
                taille={taille}
            />
        );
    }
    if (forme === "disque") {
        return (
            <DisqueSVG
                denominateur={denominateur}
                etat={etat}
                partColoriee={partColoriee}
                taille={taille}
            />
        );
    }
    if (forme === "eventail") {
        return (
            <EventailSVG
                denominateur={denominateur}
                etat={etat}
                partColoriee={partColoriee}
                taille={taille}
            />
        );
    }
    if (forme === "hexagone") {
        return (
            <HexagoneSVG
                denominateur={denominateur}
                etat={etat}
                partColoriee={partColoriee}
                taille={taille}
            />
        );
    }
    return null;
}

FormePartageeSVG.propTypes = {
    forme: PropTypes.oneOf([
        "carre",
        "rectangle",
        "disque",
        "eventail",
        "hexagone",
    ]).isRequired,
    denominateur: PropTypes.oneOf([2, 3, 4, 5, 6, 8, 10]).isRequired,
    etat: PropTypes.oneOf(["tout", "partage", "colorie"]).isRequired,
    partColoriee: PropTypes.number,
    taille: PropTypes.number,
};
