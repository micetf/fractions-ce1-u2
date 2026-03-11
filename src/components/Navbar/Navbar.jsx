/**
 * @fileoverview Navbar — barre de navigation principale.
 *
 * Reproduit fidèlement l'UX/UI de l'écosystème micetf.fr :
 *   - Positionnement fixe, fond gray-800, ombre portée (shadow-lg)
 *   - Logo « MiCetF » cliquable (lien externe vers micetf.fr)
 *   - Chevron + titre « Fractions CE1 » en police Fredoka
 *   - Boutons de navigation inter-modules (M0–M4) intégrés
 *   - Menu hamburger responsive (masqué ≥ md, visible < md)
 *   - Utilitaires : Aide, Don PayPal, Contact webmaster
 *
 * Dépendances extérieures :
 *   - Police Fredoka chargée via Google Fonts dans index.html
 *
 * @module Navbar
 */

import { useState } from "react";
import PropTypes from "prop-types";
import { NAV_CONFIG } from "../../config/navigation.config";

// ── Icônes SVG inline ─────────────────────────────────────────────────────────

/**
 * Icône chevron droit (identique à celle de micetf.fr).
 * @returns {JSX.Element}
 */
function IconChevron() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            className="h-4 w-4 shrink-0"
            fill="#f8f9fa"
            aria-hidden="true"
        >
            <path d="M12.95 10.707l.707-.707L8 4.343 6.586 5.757 10.828 10l-4.242 4.243L8 15.657l4.95-4.95z" />
        </svg>
    );
}

/**
 * Icône cœur PayPal (identique à celle de micetf.fr).
 * @returns {JSX.Element}
 */
function IconHeart() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            className="h-4 w-4 inline"
            fill="#f8f9fa"
            aria-hidden="true"
        >
            <path d="M10 3.22l-.61-.6a5.5 5.5 0 00-7.78 7.77L10 18.78l8.39-8.4a5.5 5.5 0 00-7.78-7.77l-.61.61z" />
        </svg>
    );
}

/**
 * Icône enveloppe mail (identique à celle de micetf.fr).
 * @returns {JSX.Element}
 */
function IconMail() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            className="h-4 w-4 inline"
            fill="#f8f9fa"
            aria-hidden="true"
        >
            <path d="M18 2a2 2 0 012 2v12a2 2 0 01-2 2H2a2 2 0 01-2-2V4c0-1.1.9-2 2-2h16zm-4.37 9.1L20 16v-2l-5.12-3.9L20 6V4l-10 8L0 4v2l5.12 4.1L0 14v2l6.37-4.9L10 14l3.63-2.9z" />
        </svg>
    );
}

/**
 * Icône hamburger (trois lignes horizontales).
 * @returns {JSX.Element}
 */
function IconHamburger() {
    return (
        <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
            />
        </svg>
    );
}

// ── Sous-composants ───────────────────────────────────────────────────────────

/**
 * Bouton d'aide (« ? »).
 *
 * @param {{ onClick: () => void }} props
 * @returns {JSX.Element}
 */
function BoutonAide({ onClick }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="w-10 h-10 bg-blue-600 text-white rounded-full
                       hover:bg-blue-700 transition font-bold text-lg"
            title="Aide"
            aria-label="Ouvrir l'aide"
        >
            ?
        </button>
    );
}

BoutonAide.propTypes = {
    onClick: PropTypes.func,
};

BoutonAide.defaultProps = {
    onClick: undefined,
};

/**
 * Bouton de don PayPal (identique à celui de micetf.fr).
 *
 * @returns {JSX.Element}
 */
function BoutonDon() {
    return (
        <form
            action="https://www.paypal.com/cgi-bin/webscr"
            method="post"
            target="_top"
            className="inline-block"
        >
            <button
                type="submit"
                className="px-3 py-2 bg-yellow-500 text-white rounded
                           hover:bg-yellow-600 transition my-1 mx-1"
                title="Si vous pensez que ces outils le méritent… Merci !"
                aria-label="Faire un don via PayPal"
            >
                <IconHeart />
            </button>
            <input type="hidden" value="_s-xclick" name="cmd" />
            <input
                type="hidden"
                value="Q2XYVFP4EEX2J"
                name="hosted_button_id"
            />
        </form>
    );
}

/**
 * Lien de contact webmaster (identique à celui de micetf.fr).
 *
 * @returns {JSX.Element}
 */
function LienContact() {
    return (
        <a
            href="mailto:webmaster@micetf.fr?subject=À propos de /fractions-ce1-u2"
            className="px-3 py-2 bg-gray-600 text-white rounded
                       hover:bg-gray-700 transition my-1 mx-1 inline-block"
            title="Pour contacter le webmaster…"
            aria-label="Envoyer un e-mail au webmaster"
        >
            <IconMail />
        </a>
    );
}

// ── Composant principal ───────────────────────────────────────────────────────

/**
 * Navbar principale de l'application Fractions CE1.
 *
 * Reproduit l'identité visuelle de l'écosystème micetf.fr tout en
 * intégrant la navigation interne entre modules (M0–M4).
 *
 * Comportement responsive :
 *   - ≥ md : tous les éléments affichés en ligne
 *   - < md  : menu hamburger qui déploie les boutons de navigation
 *             dans un panneau absolu sous la barre
 *
 * @param {Object}   props
 * @param {string}   props.vueActive    - Identifiant de la vue courante
 * @param {Function} props.onNaviguer   - Callback de changement de vue
 * @param {Function} [props.onAide]     - Callback du bouton « ? »
 * @returns {JSX.Element}
 */
export default function Navbar({ vueActive, onNaviguer, onAide }) {
    const [menuOuvert, setMenuOuvert] = useState(false);

    /** Bascule l'état du menu mobile. */
    function toggleMenu() {
        setMenuOuvert((prev) => !prev);
    }

    /**
     * Navigue vers une vue et ferme le menu mobile.
     * @param {string} vue
     */
    function naviguer(vue) {
        onNaviguer(vue);
        setMenuOuvert(false);
    }

    return (
        <nav
            className="fixed top-0 left-0 right-0 bg-gray-800 shadow-lg z-50"
            aria-label="Barre de navigation principale"
        >
            <div className="max-w-full px-4">
                <div className="flex items-center justify-between h-14">
                    {/* ── Logo MiCetF ── */}
                    <a
                        href="https://micetf.fr"
                        className="text-white font-semibold text-lg hover:text-gray-300 transition shrink-0"
                        aria-label="Retour à l'accueil MiCetF"
                    >
                        MiCetF
                    </a>

                    {/* ── Bouton hamburger (mobile uniquement) ── */}
                    <button
                        type="button"
                        onClick={toggleMenu}
                        className="md:hidden inline-flex items-center justify-center p-2
                                   text-gray-400 hover:text-white hover:bg-gray-700 rounded transition"
                        aria-controls="navbarMenu"
                        aria-expanded={menuOuvert}
                        aria-label={
                            menuOuvert ? "Fermer le menu" : "Ouvrir le menu"
                        }
                    >
                        <IconHamburger />
                    </button>

                    {/* ── Menu principal ── */}
                    <div
                        id="navbarMenu"
                        className={[
                            // Base layout
                            "md:flex md:items-center md:flex-1",
                            "flex-col md:flex-row",
                            // Positionnement : absolu sur mobile, statique sur md+
                            "absolute md:static top-14 left-0 right-0",
                            "bg-gray-800 md:bg-transparent",
                            "px-4 md:px-0 pb-3 md:pb-0",
                            // Visibilité
                            menuOuvert ? "flex" : "hidden",
                        ].join(" ")}
                    >
                        {/* Titre de l'application avec chevron */}
                        <div className="flex items-center ml-0 md:ml-4 py-2 md:py-0">
                            <div className="flex items-center gap-1.5">
                                <IconChevron />
                                <span
                                    className="text-white font-semibold text-lg"
                                    style={{
                                        fontFamily: "Fredoka, sans-serif",
                                    }}
                                >
                                    Fractions CE1
                                </span>
                            </div>
                        </div>

                        {/* Boutons de navigation inter-modules */}
                        <div className="flex flex-wrap gap-1 ml-0 md:ml-4 py-2 md:py-0">
                            {Object.entries(NAV_CONFIG).map(
                                ([vue, { label, module }]) => (
                                    <button
                                        key={vue}
                                        type="button"
                                        onClick={() => naviguer(vue)}
                                        className={[
                                            "flex items-center gap-1.5 px-3 py-1.5 rounded text-sm transition-colors",
                                            vueActive === vue
                                                ? "bg-blue-600 text-white"
                                                : "text-gray-400 hover:text-white hover:bg-gray-700",
                                        ].join(" ")}
                                        aria-current={
                                            vueActive === vue
                                                ? "page"
                                                : undefined
                                        }
                                    >
                                        <span className="text-xs font-mono opacity-60">
                                            {module}
                                        </span>
                                        {label}
                                    </button>
                                )
                            )}
                        </div>

                        {/* Espaceur flexible */}
                        <div className="flex-1" />

                        {/* Boutons utilitaires */}
                        <ul
                            className="flex items-center space-x-1 mt-2 md:mt-0"
                            aria-label="Actions rapides"
                        >
                            {/* <li>
                                <BoutonAide onClick={onAide} />
                            </li> */}
                            <li>
                                <BoutonDon />
                            </li>
                            <li>
                                <LienContact />
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
    );
}

Navbar.propTypes = {
    /** Identifiant de la vue actuellement affichée. */
    vueActive: PropTypes.string.isRequired,
    /** Fonction appelée lors d'un changement de vue. */
    onNaviguer: PropTypes.func.isRequired,
    /** Fonction optionnelle appelée au clic sur le bouton « Aide ». */
    onAide: PropTypes.func,
};

Navbar.defaultProps = {
    onAide: undefined,
};
