/**
 * @fileoverview PiedDePage — pied de page global de l'application.
 *
 * Présent sur toutes les vues. Porte la référence institutionnelle
 * du document pédagogique source et l'identité micetf.fr.
 *
 * Masqué automatiquement en mode plein écran (le navigateur masque
 * l'ensemble de la page hors de l'élément en plein écran).
 */

/**
 * Pied de page global.
 *
 * @returns {JSX.Element}
 */
export default function PiedDePage() {
    return (
        <footer className="border-t border-slate-200 bg-white mt-auto">
            <div
                className="max-w-5xl mx-auto px-6 py-3 flex flex-wrap items-center
                justify-between gap-2 text-xs text-slate-400"
            >
                <span>© micetf.fr</span>
                <span className="text-center">
                    Fondé sur le{" "}
                    <a
                        href="https://eduscol.education.gouv.fr/sites/default/files/document/2025livretaccompagnementmathce1pdf-116325.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-500 hover:text-blue-600 underline underline-offset-2
                            transition-colors"
                    >
                        Livret d'accompagnement CE1 — Mathématiques
                    </a>
                    , Éduscol / MEN, 2025
                </span>
            </div>
        </footer>
    );
}
