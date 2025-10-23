import { Metadata } from 'next';
import { PageLayout } from '../../../components/layout/PageLayout';

// Language-specific content
const contactContent = {
  en: {
    title: 'Contact COSMT - Get in Touch with Our Beauty Experts',
    description: 'Contact COSMT for product inquiries, customer support, or beauty advice. Our expert team is here to help you find the perfect products.',
    heroTitle: 'Contact Us',
    heroSubtitle: 'We\'re here to help! Get in touch with our beauty experts for product advice, customer support, or any questions you may have.',
    formTitle: 'Send us a Message',
    firstName: 'First Name',
    lastName: 'Last Name',
    email: 'Email Address',
    subject: 'Subject',
    selectSubject: 'Select a subject',
    productInquiry: 'Product Inquiry',
    orderSupport: 'Order Support',
    beautyAdvice: 'Beauty Advice',
    general: 'General Question',
    message: 'Message',
    messagePlaceholder: 'Tell us how we can help you...',
    sendButton: 'Send Message',
    getInTouchTitle: 'Get in Touch',
    emailUs: 'Email Us',
    emailAddress: 'info@cosmt.com',
    emailResponse: 'We\'ll respond within 24 hours',
    callUs: 'Call Us',
    phoneNumber: '+1 (555) 123-4567',
    callHours: 'Mon-Fri 9AM-6PM EST',
    visitUs: 'Visit Us',
    address: '123 Beauty Street\nNew York, NY 10001',
    visitNote: 'By appointment only',
    faqTitle: 'Frequently Asked Questions',
    faq1Question: 'What is your return policy?',
    faq1Answer: 'We offer a 30-day return policy for all unused products in their original packaging.',
    faq2Question: 'Do you offer free shipping?',
    faq2Answer: 'Yes! Free shipping on orders over $50 within the continental US.',
    faq3Question: 'Can I get beauty advice?',
    faq3Answer: 'Absolutely! Our beauty experts are here to help you find the perfect products.'
  },
  ar: {
    title: 'اتصل بكوزمت - تواصل مع خبراء الجمال لدينا',
    description: 'اتصل بكوزمت للاستفسارات حول المنتجات أو دعم العملاء أو النصائح الجمالية. فريق الخبراء لدينا هنا لمساعدتك في العثور على المنتجات المثالية.',
    heroTitle: 'اتصل بنا',
    heroSubtitle: 'نحن هنا للمساعدة! تواصل مع خبراء الجمال لدينا للحصول على نصائح حول المنتجات أو دعم العملاء أو أي أسئلة قد تكون لديك.',
    formTitle: 'أرسل لنا رسالة',
    firstName: 'الاسم الأول',
    lastName: 'الاسم الأخير',
    email: 'عنوان البريد الإلكتروني',
    subject: 'الموضوع',
    selectSubject: 'اختر موضوعاً',
    productInquiry: 'استفسار عن منتج',
    orderSupport: 'دعم الطلب',
    beautyAdvice: 'نصيحة جمالية',
    general: 'سؤال عام',
    message: 'الرسالة',
    messagePlaceholder: 'أخبرنا كيف يمكننا مساعدتك...',
    sendButton: 'إرسال الرسالة',
    getInTouchTitle: 'تواصل معنا',
    emailUs: 'راسلنا',
    emailAddress: 'info@cosmt.com',
    emailResponse: 'سنجيب خلال 24 ساعة',
    callUs: 'اتصل بنا',
    phoneNumber: '+1 (555) 123-4567',
    callHours: 'الاثنين-الجمعة 9 صباحاً-6 مساءً بتوقيت شرق أمريكا',
    visitUs: 'زرنا',
    address: '123 شارع الجمال\nنيويورك، نيويورك 10001',
    visitNote: 'بموعد فقط',
    faqTitle: 'الأسئلة الشائعة',
    faq1Question: 'ما هي سياسة الإرجاع الخاصة بكم؟',
    faq1Answer: 'نحن نقدم سياسة إرجاع لمدة 30 يوماً لجميع المنتجات غير المستخدمة في عبواتها الأصلية.',
    faq2Question: 'هل تقدمون شحن مجاني؟',
    faq2Answer: 'نعم! شحن مجاني للطلبات التي تزيد عن 50 دولاراً داخل الولايات المتحدة القارية.',
    faq3Question: 'هل يمكنني الحصول على نصائح جمالية؟',
    faq3Answer: 'بالطبع! خبراء الجمال لدينا هنا لمساعدتك في العثور على المنتجات المثالية.'
  },
  tr: {
    title: 'COSMT ile İletişim - Güzellik Uzmanlarımızla İletişime Geçin',
    description: 'Ürün sorguları, müşteri desteği veya güzellik tavsiyeleri için COSMT ile iletişime geçin. Uzman ekibimiz mükemmel ürünleri bulmanızda size yardımcı olmak için burada.',
    heroTitle: 'İletişim',
    heroSubtitle: 'Yardım etmek için buradayız! Ürün tavsiyeleri, müşteri desteği veya sahip olabileceğiniz sorular için güzellik uzmanlarımızla iletişime geçin.',
    formTitle: 'Bize Mesaj Gönderin',
    firstName: 'Ad',
    lastName: 'Soyad',
    email: 'E-posta Adresi',
    subject: 'Konu',
    selectSubject: 'Bir konu seçin',
    productInquiry: 'Ürün Sorgusu',
    orderSupport: 'Sipariş Desteği',
    beautyAdvice: 'Güzellik Tavsiyesi',
    general: 'Genel Soru',
    message: 'Mesaj',
    messagePlaceholder: 'Size nasıl yardımcı olabileceğimizi söyleyin...',
    sendButton: 'Mesaj Gönder',
    getInTouchTitle: 'İletişime Geçin',
    emailUs: 'E-posta Gönderin',
    emailAddress: 'info@cosmt.com',
    emailResponse: '24 saat içinde yanıtlayacağız',
    callUs: 'Bizi Arayın',
    phoneNumber: '+1 (555) 123-4567',
    callHours: 'Pzt-Cum 09:00-18:00 EST',
    visitUs: 'Bizi Ziyaret Edin',
    address: '123 Güzellik Sokağı\nNew York, NY 10001',
    visitNote: 'Sadece randevu ile',
    faqTitle: 'Sık Sorulan Sorular',
    faq1Question: 'İade politikanız nedir?',
    faq1Answer: 'Orijinal ambalajında kullanılmamış tüm ürünler için 30 günlük iade politikası sunuyoruz.',
    faq2Question: 'Ücretsiz kargo sunuyor musunuz?',
    faq2Answer: 'Evet! Amerika kıtası içinde 50$ üzeri siparişlerde ücretsiz kargo.',
    faq3Question: 'Güzellik tavsiyesi alabilir miyim?',
    faq3Answer: 'Kesinlikle! Güzellik uzmanlarımız mükemmel ürünleri bulmanızda size yardımcı olmak için burada.'
  },
  de: {
    title: 'COSMT kontaktieren - Treten Sie mit unseren Beauty-Experten in Kontakt',
    description: 'Kontaktieren Sie COSMT für Produktanfragen, Kundensupport oder Beauty-Beratung. Unser Expertenteam hilft Ihnen dabei, die perfekten Produkte zu finden.',
    heroTitle: 'Kontaktieren Sie uns',
    heroSubtitle: 'Wir sind hier, um zu helfen! Treten Sie mit unseren Beauty-Experten für Produktberatung, Kundensupport oder Fragen in Kontakt.',
    formTitle: 'Senden Sie uns eine Nachricht',
    firstName: 'Vorname',
    lastName: 'Nachname',
    email: 'E-Mail-Adresse',
    subject: 'Betreff',
    selectSubject: 'Wählen Sie einen Betreff',
    productInquiry: 'Produktanfrage',
    orderSupport: 'Bestellsupport',
    beautyAdvice: 'Beauty-Beratung',
    general: 'Allgemeine Frage',
    message: 'Nachricht',
    messagePlaceholder: 'Sagen Sie uns, wie wir Ihnen helfen können...',
    sendButton: 'Nachricht senden',
    getInTouchTitle: 'Kontakt aufnehmen',
    emailUs: 'E-Mail senden',
    emailAddress: 'info@cosmt.com',
    emailResponse: 'Wir antworten innerhalb von 24 Stunden',
    callUs: 'Anrufen',
    phoneNumber: '+1 (555) 123-4567',
    callHours: 'Mo-Fr 9-18 Uhr EST',
    visitUs: 'Besuchen Sie uns',
    address: '123 Beauty Street\nNew York, NY 10001',
    visitNote: 'Nur nach Terminvereinbarung',
    faqTitle: 'Häufig gestellte Fragen',
    faq1Question: 'Wie ist Ihre Rückgaberichtlinie?',
    faq1Answer: 'Wir bieten eine 30-tägige Rückgaberichtlinie für alle unbenutzten Produkte in der Originalverpackung.',
    faq2Question: 'Bieten Sie kostenlosen Versand?',
    faq2Answer: 'Ja! Kostenloser Versand bei Bestellungen über 50$ innerhalb der kontinentalen USA.',
    faq3Question: 'Kann ich Beauty-Beratung erhalten?',
    faq3Answer: 'Absolut! Unsere Beauty-Experten sind hier, um Ihnen bei der Suche nach den perfekten Produkten zu helfen.'
  },
  fr: {
    title: 'Contactez COSMT - Entrez en contact avec nos experts beauté',
    description: 'Contactez COSMT pour des demandes de produits, support client ou conseils beauté. Notre équipe d\'experts est là pour vous aider à trouver les produits parfaits.',
    heroTitle: 'Contactez-nous',
    heroSubtitle: 'Nous sommes là pour vous aider ! Contactez nos experts beauté pour des conseils produits, support client ou toute question que vous pourriez avoir.',
    formTitle: 'Envoyez-nous un message',
    firstName: 'Prénom',
    lastName: 'Nom de famille',
    email: 'Adresse e-mail',
    subject: 'Sujet',
    selectSubject: 'Sélectionnez un sujet',
    productInquiry: 'Demande de produit',
    orderSupport: 'Support commande',
    beautyAdvice: 'Conseil beauté',
    general: 'Question générale',
    message: 'Message',
    messagePlaceholder: 'Dites-nous comment nous pouvons vous aider...',
    sendButton: 'Envoyer le message',
    getInTouchTitle: 'Entrer en contact',
    emailUs: 'Nous écrire',
    emailAddress: 'info@cosmt.com',
    emailResponse: 'Nous répondrons dans les 24 heures',
    callUs: 'Nous appeler',
    phoneNumber: '+1 (555) 123-4567',
    callHours: 'Lun-Ven 9h-18h EST',
    visitUs: 'Nous rendre visite',
    address: '123 Rue de la Beauté\nNew York, NY 10001',
    visitNote: 'Sur rendez-vous uniquement',
    faqTitle: 'Questions fréquemment posées',
    faq1Question: 'Quelle est votre politique de retour ?',
    faq1Answer: 'Nous offrons une politique de retour de 30 jours pour tous les produits non utilisés dans leur emballage d\'origine.',
    faq2Question: 'Offrez-vous la livraison gratuite ?',
    faq2Answer: 'Oui ! Livraison gratuite sur les commandes de plus de 50$ dans les États-Unis continentaux.',
    faq3Question: 'Puis-je obtenir des conseils beauté ?',
    faq3Answer: 'Absolument ! Nos experts beauté sont là pour vous aider à trouver les produits parfaits.'
  },
  es: {
    title: 'Contacta COSMT - Ponte en contacto con nuestros expertos en belleza',
    description: 'Contacta COSMT para consultas de productos, soporte al cliente o consejos de belleza. Nuestro equipo de expertos está aquí para ayudarte a encontrar los productos perfectos.',
    heroTitle: 'Contáctanos',
    heroSubtitle: '¡Estamos aquí para ayudar! Ponte en contacto con nuestros expertos en belleza para consejos de productos, soporte al cliente o cualquier pregunta que puedas tener.',
    formTitle: 'Envíanos un mensaje',
    firstName: 'Nombre',
    lastName: 'Apellido',
    email: 'Dirección de correo electrónico',
    subject: 'Asunto',
    selectSubject: 'Selecciona un asunto',
    productInquiry: 'Consulta de producto',
    orderSupport: 'Soporte de pedido',
    beautyAdvice: 'Consejo de belleza',
    general: 'Pregunta general',
    message: 'Mensaje',
    messagePlaceholder: 'Dinos cómo podemos ayudarte...',
    sendButton: 'Enviar mensaje',
    getInTouchTitle: 'Ponte en contacto',
    emailUs: 'Escríbenos',
    emailAddress: 'info@cosmt.com',
    emailResponse: 'Responderemos en 24 horas',
    callUs: 'Llámanos',
    phoneNumber: '+1 (555) 123-4567',
    callHours: 'Lun-Vie 9AM-6PM EST',
    visitUs: 'Visítanos',
    address: '123 Calle de la Belleza\nNueva York, NY 10001',
    visitNote: 'Solo con cita previa',
    faqTitle: 'Preguntas frecuentes',
    faq1Question: '¿Cuál es su política de devolución?',
    faq1Answer: 'Ofrecemos una política de devolución de 30 días para todos los productos no utilizados en su empaque original.',
    faq2Question: '¿Ofrecen envío gratuito?',
    faq2Answer: '¡Sí! Envío gratuito en pedidos superiores a $50 dentro de los Estados Unidos continentales.',
    faq3Question: '¿Puedo obtener consejos de belleza?',
    faq3Answer: '¡Absolutamente! Nuestros expertos en belleza están aquí para ayudarte a encontrar los productos perfectos.'
  }
};

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const { locale } = params;
  const content = contactContent[locale as keyof typeof contactContent] || contactContent.en;
  
  return {
    title: content.title,
    description: content.description,
    keywords: 'contact COSMT, customer support, beauty advice, product inquiry, help center',
    openGraph: {
      title: content.title,
      description: content.description,
      images: ['/images/contact-og.jpg'],
    },
  };
}

export default function ContactPage({ params }: { params: { locale: string } }) {
  const { locale } = params;
  const content = contactContent[locale as keyof typeof contactContent] || contactContent.en;
  
  return (
    <PageLayout>
      {/* Hero Section */}
      <div className="bg-gray-50 py-16">
        <div className="cosmt-container text-center">
          <h1 className="text-cosmt-4xl font-bold text-gray-900 mb-4">{content.heroTitle}</h1>
          <p className="text-cosmt-lg text-gray-600 max-w-2xl mx-auto">
            {content.heroSubtitle}
          </p>
        </div>
      </div>

      <div className="cosmt-container py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <h2 className="text-cosmt-2xl font-bold text-gray-900 mb-6">{content.formTitle}</h2>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-cosmt-sm font-medium text-gray-700 mb-2">
                    {content.firstName}
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    className="w-full p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors duration-200"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-cosmt-sm font-medium text-gray-700 mb-2">
                    {content.lastName}
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    className="w-full p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors duration-200"
                    required
                  />
                </div>
              </div>
              <div>
                <label htmlFor="email" className="block text-cosmt-sm font-medium text-gray-700 mb-2">
                  {content.email}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors duration-200"
                  required
                />
              </div>
              <div>
                <label htmlFor="subject" className="block text-cosmt-sm font-medium text-gray-700 mb-2">
                  {content.subject}
                </label>
                <select
                  id="subject"
                  name="subject"
                  className="w-full p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors duration-200"
                >
                  <option value="">{content.selectSubject}</option>
                  <option value="product-inquiry">{content.productInquiry}</option>
                  <option value="order-support">{content.orderSupport}</option>
                  <option value="beauty-advice">{content.beautyAdvice}</option>
                  <option value="general">{content.general}</option>
                </select>
              </div>
              <div>
                <label htmlFor="message" className="block text-cosmt-sm font-medium text-gray-700 mb-2">
                  {content.message}
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  className="w-full p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors duration-200"
                  placeholder={content.messagePlaceholder}
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full px-6 py-3 bg-green-600 text-white hover:bg-green-700 transition-colors duration-200 font-medium"
              >
                {content.sendButton}
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div>
            <h2 className="text-cosmt-2xl font-bold text-gray-900 mb-6">{content.getInTouchTitle}</h2>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-cosmt-lg font-semibold text-gray-900 mb-1">{content.emailUs}</h3>
                  <p className="text-gray-600">{content.emailAddress}</p>
                  <p className="text-cosmt-sm text-gray-500">{content.emailResponse}</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-cosmt-lg font-semibold text-gray-900 mb-1">{content.callUs}</h3>
                  <p className="text-gray-600">{content.phoneNumber}</p>
                  <p className="text-cosmt-sm text-gray-500">{content.callHours}</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-cosmt-lg font-semibold text-gray-900 mb-1">{content.visitUs}</h3>
                  <p className="text-gray-600 whitespace-pre-line">{content.address}</p>
                  <p className="text-cosmt-sm text-gray-500">{content.visitNote}</p>
                </div>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="mt-12">
              <h3 className="text-cosmt-xl font-semibold text-gray-900 mb-4">{content.faqTitle}</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-cosmt-base font-medium text-gray-900 mb-1">
                    {content.faq1Question}
                  </h4>
                  <p className="text-cosmt-sm text-gray-600">
                    {content.faq1Answer}
                  </p>
                </div>
                <div>
                  <h4 className="text-cosmt-base font-medium text-gray-900 mb-1">
                    {content.faq2Question}
                  </h4>
                  <p className="text-cosmt-sm text-gray-600">
                    {content.faq2Answer}
                  </p>
                </div>
                <div>
                  <h4 className="text-cosmt-base font-medium text-gray-900 mb-1">
                    {content.faq3Question}
                  </h4>
                  <p className="text-cosmt-sm text-gray-600">
                    {content.faq3Answer}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
