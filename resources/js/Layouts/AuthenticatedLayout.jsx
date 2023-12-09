import { useState, useEffect } from 'react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import axios from 'axios';
import { Link } from '@inertiajs/react';

export default function Authenticated({ user, header, children }) {
    const [openCategories, setOpenCategories] = useState([]);

    const [categories, setCategoriess] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const response = await axios.get('/api/categories-menu');
            setCategoriess(response.data.categories);
        };

        fetchData();
    }, []);

    const toggleAccordion = (categoryId) => {
        console.log("shi");
        if (openCategories.includes(categoryId)) {
            setOpenCategories(openCategories.filter((id) => id !== categoryId));
        } else {
            setOpenCategories([...openCategories, categoryId]);
        }
    };

    const isOpen = (categoryId) => openCategories.includes(categoryId);
    const renderCategories = (categories) => {
        return categories.map((category) => (
            <li className="menu-item cursor-pointer" key={category.id}>
                <div className="menu-link accordion-header" onClick={() => toggleAccordion(category.id)}>
                    {category.name}
                </div>
                {isOpen(category.id) && category.find_children && renderCategories(category.find_children)}
            </li>
        ));
    };

    

    function generateRandomNumber() {
        return Math.floor(Math.random() * 13) + 1;
    }

    const imageUrl = `/assets/img/elements/${generateRandomNumber()}.jpg`;

    return (
        <>
            <div class="layout-wrapper layout-content-navbar">
                <div class="layout-container">

                    <aside id="layout-menu" class="layout-menu menu-vertical menu bg-menu-theme">
                        <div class="app-brand demo">
                            <a href="index.html" class="app-brand-link">
                                <span class="app-brand-logo demo">

                                    <img src={imageUrl} alt class="w-px-40 h-auto rounded-circle" />

                                </span>
                                <span class="app-brand-text demo menu-text fw-bold ms-2">Write</span>
                            </a>

                            <a href="javascript:void(0);" class="layout-menu-toggle menu-link text-large ms-auto d-block d-xl-none">
                                <i class="bx bx-chevron-left bx-sm align-middle"></i>
                            </a>
                        </div>

                        <div class="menu-inner-shadow"></div>

                        <ul class="menu-inner py-1">
                            <li class="menu-item active open">
                                <a href="javascript:void(0);" class="menu-link menu-toggle">
                                    <i class="menu-icon tf-icons bx bx-home-circle"></i>
                                    <div data-i18n="Dashboards">Dashboards</div>
                                    <div class="badge bg-danger rounded-pill ms-auto">5</div>
                                </a>
                                <ul class="menu-sub">
                                    {renderCategories(categories)}

                                    <li class="menu-item">
                                        <Link
                                            href="/articles"
                                            target="_blank"
                                            class="menu-link">
                                            <div data-i18n="Articles">All</div>
                                        </Link>
                
                                    </li>
                                    
                                    
                                </ul>
                            </li>

                            
                        </ul>
                    </aside>

                    <div class="layout-page">

                        {children}

                        <footer class="content-footer footer bg-footer-theme">
                            <div class="container-xxl d-flex flex-wrap justify-content-between py-2 flex-md-row flex-column">
                                <div class="mb-2 mb-md-0">
                                    ©
                                    <script>
                                        document.write(new Date().getFullYear());
                                    </script>
                                    , made with ❤️ by
                                    <a href="https://themeselection.com" target="_blank" class="footer-link fw-medium">ThemeSelection</a>
                                </div>
                                <div class="d-none d-lg-inline-block">
                                    <a href="https://themeselection.com/license/" class="footer-link me-4" target="_blank">License</a>
                                    <a href="https://themeselection.com/" target="_blank" class="footer-link me-4">More Themes</a>

                                    <a
                                        href="https://demos.themeselection.com/sneat-bootstrap-html-admin-template/documentation/"
                                        target="_blank"
                                        class="footer-link me-4"
                                    >Documentation</a
                                    >

                                    <a
                                        href="https://github.com/themeselection/sneat-html-admin-template-free/issues"
                                        target="_blank"
                                        class="footer-link"
                                    >Support</a
                                    >
                                </div>
                            </div>
                        </footer>

                        <div class="content-backdrop fade"></div>
                    </div>
                </div>
            </div>

            <div class="layout-overlay layout-menu-toggle"></div>
        

        </>
    );
}
