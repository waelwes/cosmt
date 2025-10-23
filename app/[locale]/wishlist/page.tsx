'use client';

import React, { useState, useEffect } from 'react';
import { Heart, ShoppingBag, Trash2, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '../../../components/layout/Header';
import { Footer } from '../../../components/layout/Footer';
import { Button } from '../../../components/ui/Button';
import { useWishlist } from '../../../contexts/WishlistContext';
import { useCart } from '../../../contexts/CartContext';
import { useAuth } from '../../../contexts/AuthContextBypass';
import { useProductDisplay } from '../../../hooks/useProductDisplay';
import { useRouter } from 'next/navigation';
import { buildProductPath } from '../../../utils/slug';

interface WishlistPageProps {
  params: { locale: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function WishlistPage({ params }: WishlistPageProps) {
  const { locale } = params;
  const { wishlistItems, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { convertProductsForDisplay } = useProductDisplay();
  const router = useRouter();
  const [displayItems, setDisplayItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Convert wishlist items for display with translations
  useEffect(() => {
    const convertItems = async () => {
      setIsLoading(true);
      try {
        const converted = await convertProductsForDisplay(wishlistItems);
        setDisplayItems(converted);
      } catch (error) {
        console.error('Error converting wishlist items:', error);
        setDisplayItems(wishlistItems);
      } finally {
        setIsLoading(false);
      }
    };

    convertItems();
  }, [wishlistItems, convertProductsForDisplay]);

  const translations = {
    en: {
      pleaseSignIn: 'Please sign in',
      signInMessage: 'You need to be signed in to view your wishlist.',
      signIn: 'Sign In',
      myWishlist: 'My Wishlist',
      itemsSaved: 'items saved',
      itemSaved: 'item saved',
      clearAll: 'Clear All',
      removeFromWishlist: 'Remove from wishlist',
      addToCart: 'Add to Cart',
      wishlistEmpty: 'Your wishlist is empty',
      wishlistEmptyMessage: 'Start adding products you love to your wishlist. You can save items for later and easily find them when you\'re ready to buy.',
      startShopping: 'Start Shopping',
    },
    ar: {
      pleaseSignIn: 'يرجى تسجيل الدخول',
      signInMessage: 'تحتاج إلى تسجيل الدخول لعرض قائمة الأمنيات الخاصة بك.',
      signIn: 'تسجيل الدخول',
      myWishlist: 'قائمة الأمنيات الخاصة بي',
      itemsSaved: 'عناصر محفوظة',
      itemSaved: 'عنصر محفوظ',
      clearAll: 'مسح الكل',
      removeFromWishlist: 'إزالة من قائمة الأمنيات',
      addToCart: 'أضف إلى السلة',
      wishlistEmpty: 'قائمة الأمنيات الخاصة بك فارغة',
      wishlistEmptyMessage: 'ابدأ بإضافة المنتجات التي تحبها إلى قائمة الأمنيات الخاصة بك. يمكنك حفظ العناصر لاحقاً والعثور عليها بسهولة عندما تكون مستعداً للشراء.',
      startShopping: 'ابدأ التسوق',
    },
    tr: {
      pleaseSignIn: 'Lütfen giriş yapın',
      signInMessage: 'İstek listesini görüntülemek için giriş yapmanız gerekiyor.',
      signIn: 'Giriş Yap',
      myWishlist: 'İstek Listem',
      itemsSaved: 'ürün kaydedildi',
      itemSaved: 'ürün kaydedildi',
      clearAll: 'Tümünü Temizle',
      removeFromWishlist: 'İstek listesinden kaldır',
      addToCart: 'Sepete Ekle',
      wishlistEmpty: 'İstek listeniz boş',
      wishlistEmptyMessage: 'Sevdiğiniz ürünleri istek listenize eklemeye başlayın. Öğeleri daha sonra kaydedebilir ve satın almaya hazır olduğunuzda kolayca bulabilirsiniz.',
      startShopping: 'Alışverişe Başla',
    },
    de: {
      pleaseSignIn: 'Bitte melden Sie sich an',
      signInMessage: 'Sie müssen angemeldet sein, um Ihre Wunschliste anzuzeigen.',
      signIn: 'Anmelden',
      myWishlist: 'Meine Wunschliste',
      itemsSaved: 'Artikel gespeichert',
      itemSaved: 'Artikel gespeichert',
      clearAll: 'Alle löschen',
      removeFromWishlist: 'Aus Wunschliste entfernen',
      addToCart: 'In den Warenkorb',
      wishlistEmpty: 'Ihre Wunschliste ist leer',
      wishlistEmptyMessage: 'Beginnen Sie damit, Produkte, die Sie lieben, zu Ihrer Wunschliste hinzuzufügen. Sie können Artikel für später speichern und sie einfach finden, wenn Sie bereit zum Kaufen sind.',
      startShopping: 'Einkaufen beginnen',
    },
    fr: {
      pleaseSignIn: 'Veuillez vous connecter',
      signInMessage: 'Vous devez être connecté pour voir votre liste de souhaits.',
      signIn: 'Se connecter',
      myWishlist: 'Ma liste de souhaits',
      itemsSaved: 'articles sauvegardés',
      itemSaved: 'article sauvegardé',
      clearAll: 'Tout effacer',
      removeFromWishlist: 'Retirer de la liste de souhaits',
      addToCart: 'Ajouter au panier',
      wishlistEmpty: 'Votre liste de souhaits est vide',
      wishlistEmptyMessage: 'Commencez à ajouter des produits que vous aimez à votre liste de souhaits. Vous pouvez sauvegarder des articles pour plus tard et les retrouver facilement quand vous êtes prêt à acheter.',
      startShopping: 'Commencer à acheter',
    },
    es: {
      pleaseSignIn: 'Por favor inicia sesión',
      signInMessage: 'Necesitas iniciar sesión para ver tu lista de deseos.',
      signIn: 'Iniciar sesión',
      myWishlist: 'Mi lista de deseos',
      itemsSaved: 'artículos guardados',
      itemSaved: 'artículo guardado',
      clearAll: 'Limpiar todo',
      removeFromWishlist: 'Quitar de la lista de deseos',
      addToCart: 'Agregar al carrito',
      wishlistEmpty: 'Tu lista de deseos está vacía',
      wishlistEmptyMessage: 'Comienza a agregar productos que te encantan a tu lista de deseos. Puedes guardar artículos para más tarde y encontrarlos fácilmente cuando estés listo para comprar.',
      startShopping: 'Comenzar a comprar',
    },
  };

  const t = translations[locale] || translations.en;

  const handleAddToCart = (item: any) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      originalPrice: item.originalPrice,
      image: item.image,
      brand: item.brand,
      category: item.category,
      slug: item.slug,
      quantity: 1
    });
  };

  const handleRemoveItem = (itemId: string) => {
    removeFromWishlist(itemId);
  };

  const handleClearWishlist = () => {
    clearWishlist();
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main>
          <div className="cosmt-container py-8">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-cosmt-2xl font-bold text-gray-900 mb-4">{t.pleaseSignIn}</h1>
              <p className="text-gray-600 mb-6">{t.signInMessage}</p>
              <Button onClick={() => router.push(`/${locale}/signin`)}>
                {t.signIn}
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <div className="cosmt-container py-8">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-cosmt-3xl font-bold text-gray-900">{t.myWishlist}</h1>
                <p className="text-gray-600 mt-2">
                  {wishlistItems.length} {wishlistItems.length === 1 ? t.itemSaved : t.itemsSaved}
                </p>
              </div>
              {wishlistItems.length > 0 && (
                <Button
                  variant="outline"
                  onClick={handleClearWishlist}
                  className="text-red-600 border-red-300 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  {t.clearAll}
                </Button>
              )}
            </div>

            {/* Wishlist Items */}
            {wishlistItems.length > 0 ? (
              isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Translating products...</p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {displayItems.map((item) => (
                  <div key={item.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden group">
                    {/* Product Image */}
                    <div className="relative aspect-square overflow-hidden">
                      <Link href={buildProductPath({ 
                        name: item.name, 
                        categorySlug: item.categories?.slug, 
                        subcategorySlug: null, 
                        productSlug: item.slug, 
                        id: item.id 
                      })}>
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </Link>
                      
                      {/* Wishlist Button */}
                      <div className="absolute top-3 right-3">
        <button
          onClick={() => handleRemoveItem(item.id)}
          className="p-2 text-red-600 hover:text-red-700 transition-colors"
          title={t.removeFromWishlist}
        >
                          <Heart className="w-4 h-4 fill-current" />
                        </button>
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="p-4">
                      <div className="mb-2">
                        <p className="text-cosmt-xs font-medium text-gray-500 uppercase tracking-wide">
                          {item.brand}
                        </p>
                        <h3 className="text-cosmt-sm font-semibold text-gray-900 line-clamp-2">
                          <Link href={`/${locale}/product/${item.slug}`} className="hover:text-green-600">
                            {item.name}
                          </Link>
                        </h3>
                      </div>

                      {/* Price */}
                      <div className="flex items-center space-x-2 mb-4">
                        <span className="text-cosmt-lg font-bold text-gray-900">
                          ${item.price.toFixed(2)}
                        </span>
                        {item.originalPrice && item.originalPrice > item.price && (
                          <span className="text-cosmt-sm text-gray-500 line-through">
                            ${item.originalPrice.toFixed(2)}
                          </span>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => handleAddToCart(item)}
                          size="sm"
                          className="flex-1"
                        >
                          <ShoppingBag className="w-4 h-4 mr-2" />
                          {t.addToCart}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveItem(item.id)}
                          className="px-3"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  ))}
                </div>
              )
            ) : (
              /* Empty State */
              <div className="text-center py-16">
                <Heart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-cosmt-xl font-medium text-gray-900 mb-2">{t.wishlistEmpty}</h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  {t.wishlistEmptyMessage}
                </p>
                <Button onClick={() => router.push(`/${locale}`)}>
                  {t.startShopping}
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
