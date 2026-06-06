'use client';

import { useNavigationStore } from '@/lib/store';
import HomePage from '@/components/home/HomePage';
import SolarCategoryPage from '@/components/solar/SolarCategoryPage';
import CraneCategoryPage from '@/components/crane/CraneCategoryPage';
import ProductDetailPage from '@/components/product/ProductDetailPage';
import CartPage from '@/components/shared/CartPage';
import ComparePage from '@/components/shared/ComparePage';
import WishlistPage from '@/components/shared/WishlistPage';
import SolarBuilderPage from '@/components/solar/SolarBuilderPage';
import SolarCalculatorPage from '@/components/solar/SolarCalculatorPage';
import SolarAIRecommendationPage from '@/components/solar/SolarAIRecommendationPage';
import CraneConfiguratorPage from '@/components/crane/CraneConfiguratorPage';
import SparePartFinderPage from '@/components/crane/SparePartFinderPage';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import WhatsAppButton from '@/components/layout/WhatsAppButton';
import SearchOverlay from '@/components/search/SearchOverlay';
import BrandsPage from '@/components/brands/BrandsPage';
import BlogPage from '@/components/blog/BlogPage';
import AboutPage from '@/components/about/AboutPage';
import ContactPage from '@/components/contact/ContactPage';
import CustomSolutionPage from '@/components/custom/CustomSolutionPage';

export default function Home() {
  const currentPage = useNavigationStore((s) => s.currentPage);

  const renderPage = () => {
    switch (currentPage) {
      // Solar tools
      case 'solar-builder':
        return <SolarBuilderPage />;
      case 'solar-calculator':
        return <SolarCalculatorPage />;
      case 'solar-ai':
        return <SolarAIRecommendationPage />;

      // Solar category pages
      case 'solar-panels':
      case 'solar-inverters':
      case 'solar-batteries':
      case 'solar-structures':
      case 'solar-charge-controllers':
      case 'solar-accessories':
      case 'solar-complete-systems':
      case 'solar':
        return <SolarCategoryPage />;

      // Crane tools
      case 'crane-configurator':
        return <CraneConfiguratorPage />;
      case 'spare-part-finder':
        return <SparePartFinderPage />;

      // Crane category pages
      case 'crane-complete':
      case 'crane-hooks':
      case 'crane-wire-ropes':
      case 'crane-bearings':
      case 'crane-motors':
      case 'crane-gearboxes':
      case 'crane-brakes':
      case 'crane-electrical':
      case 'crane-remote-controls':
      case 'crane-accessories':
      case 'crane':
        return <CraneCategoryPage />;

      // Product detail
      case 'product':
        return <ProductDetailPage />;

      // Cart, Wishlist, Compare
      case 'cart':
        return <CartPage />;
      case 'wishlist':
        return <WishlistPage />;
      case 'compare':
        return <ComparePage />;

      // Brands
      case 'brands':
        return <BrandsPage />;

      // Blog
      case 'blog':
        return <BlogPage />;

      // About
      case 'about':
        return <AboutPage />;

      // Contact
      case 'contact':
        return <ContactPage />;

      // Custom Solutions
      case 'custom-solutions':
      case 'bulk-order':
        return <CustomSolutionPage />;

      // Search
      case 'search':
        return <HomePage />;

      // Default: Home
      case 'home':
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1">{renderPage()}</main>
      <Footer />
      <WhatsAppButton />
      <SearchOverlay />
    </div>
  );
}
