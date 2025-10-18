'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Language {
  code: string;
  name: string;
  flag: string;
  direction: 'ltr' | 'rtl';
}

export interface Translations {
  // Common
  loading: string;
  save: string;
  cancel: string;
  delete: string;
  edit: string;
  view: string;
  search: string;
  filter: string;
  sort: string;
  refresh: string;
  export: string;
  import: string;
  
  // Navigation
  dashboard: string;
  products: string;
  orders: string;
  customers: string;
  analytics: string;
  marketing: string;
  content: string;
  settings: string;
  support: string;
  apps: string;
  
  // Dashboard
  adminDashboard: string;
  totalSales: string;
  netSales: string;
  orderCount: string;
  conversionRate: string;
  salesOverview: string;
  liveVisitors: string;
  topPages: string;
  trafficSources: string;
  deviceAnalytics: string;
  conversionFunnel: string;
  
  // Time periods
  all: string;
  today: string;
  thisWeek: string;
  thisMonth: string;
  thisYear: string;
  selectDate: string;
  
  // Chart labels
  sales: string;
  visitors: string;
  orders: string;
  revenue: string;
  
  // Status
  online: string;
  offline: string;
  active: string;
  inactive: string;
  pending: string;
  completed: string;
  cancelled: string;
  
  // Actions
  viewDetails: string;
  editItem: string;
  deleteItem: string;
  addNew: string;
  bulkActions: string;
  
  // Notifications
  notifications: string;
  viewAllNotifications: string;
  newOrder: string;
  lowStock: string;
  paymentProcessed: string;
  
  // User menu
  profile: string;
  settings: string;
  signOut: string;
  switchToLightMode: string;
  switchToDarkMode: string;
}

const translations: Record<string, Translations> = {
  en: {
    // Common
    loading: 'Loading...',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    view: 'View',
    search: 'Search',
    filter: 'Filter',
    sort: 'Sort',
    refresh: 'Refresh',
    export: 'Export',
    import: 'Import',
    
    // Navigation
    dashboard: 'Dashboard',
    products: 'Products',
    orders: 'Orders',
    customers: 'Customers',
    analytics: 'Analytics',
    marketing: 'Marketing',
    content: 'Content',
    settings: 'Settings',
    support: 'Support',
    apps: 'Apps',
    
    // Dashboard
    adminDashboard: 'Admin Dashboard',
    totalSales: 'Total Sales',
    netSales: 'Net Sales',
    orderCount: 'Order Count',
    conversionRate: 'Conversion Rate',
    salesOverview: 'Sales Overview',
    liveVisitors: 'Live Visitors',
    topPages: 'Top Pages',
    trafficSources: 'Traffic Sources',
    deviceAnalytics: 'Device Analytics',
    conversionFunnel: 'Conversion Funnel',
    
    // Time periods
    all: 'All',
    today: 'Today',
    thisWeek: 'This Week',
    thisMonth: 'This Month',
    thisYear: 'This Year',
    selectDate: 'Select Date',
    
    // Chart labels
    sales: 'Sales',
    visitors: 'Visitors',
    orders: 'Orders',
    revenue: 'Revenue',
    
    // Status
    online: 'Online',
    offline: 'Offline',
    active: 'Active',
    inactive: 'Inactive',
    pending: 'Pending',
    completed: 'Completed',
    cancelled: 'Cancelled',
    
    // Actions
    viewDetails: 'View Details',
    editItem: 'Edit Item',
    deleteItem: 'Delete Item',
    addNew: 'Add New',
    bulkActions: 'Bulk Actions',
    
    // Notifications
    notifications: 'Notifications',
    viewAllNotifications: 'View All Notifications',
    newOrder: 'New Order',
    lowStock: 'Low Stock Alert',
    paymentProcessed: 'Payment Processed',
    
    // User menu
    profile: 'Profile',
    settings: 'Settings',
    signOut: 'Sign Out',
    switchToLightMode: 'Switch to Light Mode',
    switchToDarkMode: 'Switch to Dark Mode',
  },
  
  ar: {
    // Common
    loading: 'جاري التحميل...',
    save: 'حفظ',
    cancel: 'إلغاء',
    delete: 'حذف',
    edit: 'تعديل',
    view: 'عرض',
    search: 'بحث',
    filter: 'تصفية',
    sort: 'ترتيب',
    refresh: 'تحديث',
    export: 'تصدير',
    import: 'استيراد',
    
    // Navigation
    dashboard: 'لوحة التحكم',
    products: 'المنتجات',
    orders: 'الطلبات',
    customers: 'العملاء',
    analytics: 'التحليلات',
    marketing: 'التسويق',
    content: 'المحتوى',
    settings: 'الإعدادات',
    support: 'الدعم',
    apps: 'التطبيقات',
    
    // Dashboard
    adminDashboard: 'لوحة تحكم الإدارة',
    totalSales: 'إجمالي المبيعات',
    netSales: 'صافي المبيعات',
    orderCount: 'عدد الطلبات',
    conversionRate: 'معدل التحويل',
    salesOverview: 'نظرة عامة على المبيعات',
    liveVisitors: 'الزوار المباشرون',
    topPages: 'الصفحات الأكثر زيارة',
    trafficSources: 'مصادر الزيارات',
    deviceAnalytics: 'تحليلات الأجهزة',
    conversionFunnel: 'قمع التحويل',
    
    // Time periods
    all: 'الكل',
    today: 'اليوم',
    thisWeek: 'هذا الأسبوع',
    thisMonth: 'هذا الشهر',
    thisYear: 'هذا العام',
    selectDate: 'اختر التاريخ',
    
    // Chart labels
    sales: 'المبيعات',
    visitors: 'الزوار',
    orders: 'الطلبات',
    revenue: 'الإيرادات',
    
    // Status
    online: 'متصل',
    offline: 'غير متصل',
    active: 'نشط',
    inactive: 'غير نشط',
    pending: 'معلق',
    completed: 'مكتمل',
    cancelled: 'ملغي',
    
    // Actions
    viewDetails: 'عرض التفاصيل',
    editItem: 'تعديل العنصر',
    deleteItem: 'حذف العنصر',
    addNew: 'إضافة جديد',
    bulkActions: 'إجراءات مجمعة',
    
    // Notifications
    notifications: 'الإشعارات',
    viewAllNotifications: 'عرض جميع الإشعارات',
    newOrder: 'طلب جديد',
    lowStock: 'تنبيه مخزون منخفض',
    paymentProcessed: 'تم معالجة الدفع',
    
    // User menu
    profile: 'الملف الشخصي',
    settings: 'الإعدادات',
    signOut: 'تسجيل الخروج',
    switchToLightMode: 'التبديل إلى الوضع النهاري',
    switchToDarkMode: 'التبديل إلى الوضع الليلي',
  },
  
  fr: {
    // Common
    loading: 'Chargement...',
    save: 'Enregistrer',
    cancel: 'Annuler',
    delete: 'Supprimer',
    edit: 'Modifier',
    view: 'Voir',
    search: 'Rechercher',
    filter: 'Filtrer',
    sort: 'Trier',
    refresh: 'Actualiser',
    export: 'Exporter',
    import: 'Importer',
    
    // Navigation
    dashboard: 'Tableau de bord',
    products: 'Produits',
    orders: 'Commandes',
    customers: 'Clients',
    analytics: 'Analyses',
    marketing: 'Marketing',
    content: 'Contenu',
    settings: 'Paramètres',
    support: 'Support',
    apps: 'Applications',
    
    // Dashboard
    adminDashboard: 'Tableau de bord administrateur',
    totalSales: 'Ventes totales',
    netSales: 'Ventes nettes',
    orderCount: 'Nombre de commandes',
    conversionRate: 'Taux de conversion',
    salesOverview: 'Aperçu des ventes',
    liveVisitors: 'Visiteurs en direct',
    topPages: 'Pages les plus visitées',
    trafficSources: 'Sources de trafic',
    deviceAnalytics: 'Analyses des appareils',
    conversionFunnel: 'Entonnoir de conversion',
    
    // Time periods
    all: 'Tout',
    today: 'Aujourd\'hui',
    thisWeek: 'Cette semaine',
    thisMonth: 'Ce mois',
    thisYear: 'Cette année',
    selectDate: 'Sélectionner une date',
    
    // Chart labels
    sales: 'Ventes',
    visitors: 'Visiteurs',
    orders: 'Commandes',
    revenue: 'Revenus',
    
    // Status
    online: 'En ligne',
    offline: 'Hors ligne',
    active: 'Actif',
    inactive: 'Inactif',
    pending: 'En attente',
    completed: 'Terminé',
    cancelled: 'Annulé',
    
    // Actions
    viewDetails: 'Voir les détails',
    editItem: 'Modifier l\'élément',
    deleteItem: 'Supprimer l\'élément',
    addNew: 'Ajouter nouveau',
    bulkActions: 'Actions groupées',
    
    // Notifications
    notifications: 'Notifications',
    viewAllNotifications: 'Voir toutes les notifications',
    newOrder: 'Nouvelle commande',
    lowStock: 'Alerte stock faible',
    paymentProcessed: 'Paiement traité',
    
    // User menu
    profile: 'Profil',
    settings: 'Paramètres',
    signOut: 'Se déconnecter',
    switchToLightMode: 'Passer au mode clair',
    switchToDarkMode: 'Passer au mode sombre',
  },
  
  es: {
    // Common
    loading: 'Cargando...',
    save: 'Guardar',
    cancel: 'Cancelar',
    delete: 'Eliminar',
    edit: 'Editar',
    view: 'Ver',
    search: 'Buscar',
    filter: 'Filtrar',
    sort: 'Ordenar',
    refresh: 'Actualizar',
    export: 'Exportar',
    import: 'Importar',
    
    // Navigation
    dashboard: 'Panel de control',
    products: 'Productos',
    orders: 'Pedidos',
    customers: 'Clientes',
    analytics: 'Análisis',
    marketing: 'Marketing',
    content: 'Contenido',
    settings: 'Configuración',
    support: 'Soporte',
    apps: 'Aplicaciones',
    
    // Dashboard
    adminDashboard: 'Panel de administración',
    totalSales: 'Ventas totales',
    netSales: 'Ventas netas',
    orderCount: 'Número de pedidos',
    conversionRate: 'Tasa de conversión',
    salesOverview: 'Resumen de ventas',
    liveVisitors: 'Visitantes en vivo',
    topPages: 'Páginas principales',
    trafficSources: 'Fuentes de tráfico',
    deviceAnalytics: 'Análisis de dispositivos',
    conversionFunnel: 'Embudo de conversión',
    
    // Time periods
    all: 'Todo',
    today: 'Hoy',
    thisWeek: 'Esta semana',
    thisMonth: 'Este mes',
    thisYear: 'Este año',
    selectDate: 'Seleccionar fecha',
    
    // Chart labels
    sales: 'Ventas',
    visitors: 'Visitantes',
    orders: 'Pedidos',
    revenue: 'Ingresos',
    
    // Status
    online: 'En línea',
    offline: 'Desconectado',
    active: 'Activo',
    inactive: 'Inactivo',
    pending: 'Pendiente',
    completed: 'Completado',
    cancelled: 'Cancelado',
    
    // Actions
    viewDetails: 'Ver detalles',
    editItem: 'Editar elemento',
    deleteItem: 'Eliminar elemento',
    addNew: 'Agregar nuevo',
    bulkActions: 'Acciones masivas',
    
    // Notifications
    notifications: 'Notificaciones',
    viewAllNotifications: 'Ver todas las notificaciones',
    newOrder: 'Nuevo pedido',
    lowStock: 'Alerta de stock bajo',
    paymentProcessed: 'Pago procesado',
    
    // User menu
    profile: 'Perfil',
    settings: 'Configuración',
    signOut: 'Cerrar sesión',
    switchToLightMode: 'Cambiar a modo claro',
    switchToDarkMode: 'Cambiar a modo oscuro',
  },
  
  de: {
    // Common
    loading: 'Wird geladen...',
    save: 'Speichern',
    cancel: 'Abbrechen',
    delete: 'Löschen',
    edit: 'Bearbeiten',
    view: 'Anzeigen',
    search: 'Suchen',
    filter: 'Filtern',
    sort: 'Sortieren',
    refresh: 'Aktualisieren',
    export: 'Exportieren',
    import: 'Importieren',
    
    // Navigation
    dashboard: 'Dashboard',
    products: 'Produkte',
    orders: 'Bestellungen',
    customers: 'Kunden',
    analytics: 'Analysen',
    marketing: 'Marketing',
    content: 'Inhalt',
    settings: 'Einstellungen',
    support: 'Support',
    apps: 'Apps',
    
    // Dashboard
    adminDashboard: 'Admin-Dashboard',
    totalSales: 'Gesamtumsatz',
    netSales: 'Nettoumsatz',
    orderCount: 'Anzahl Bestellungen',
    conversionRate: 'Konversionsrate',
    salesOverview: 'Umsatzübersicht',
    liveVisitors: 'Live-Besucher',
    topPages: 'Top-Seiten',
    trafficSources: 'Traffic-Quellen',
    deviceAnalytics: 'Geräte-Analysen',
    conversionFunnel: 'Konversions-Trichter',
    
    // Time periods
    all: 'Alle',
    today: 'Heute',
    thisWeek: 'Diese Woche',
    thisMonth: 'Diesen Monat',
    thisYear: 'Dieses Jahr',
    selectDate: 'Datum auswählen',
    
    // Chart labels
    sales: 'Umsatz',
    visitors: 'Besucher',
    orders: 'Bestellungen',
    revenue: 'Einnahmen',
    
    // Status
    online: 'Online',
    offline: 'Offline',
    active: 'Aktiv',
    inactive: 'Inaktiv',
    pending: 'Ausstehend',
    completed: 'Abgeschlossen',
    cancelled: 'Storniert',
    
    // Actions
    viewDetails: 'Details anzeigen',
    editItem: 'Element bearbeiten',
    deleteItem: 'Element löschen',
    addNew: 'Neu hinzufügen',
    bulkActions: 'Massenaktionen',
    
    // Notifications
    notifications: 'Benachrichtigungen',
    viewAllNotifications: 'Alle Benachrichtigungen anzeigen',
    newOrder: 'Neue Bestellung',
    lowStock: 'Niedrige Lagerbestand-Warnung',
    paymentProcessed: 'Zahlung verarbeitet',
    
    // User menu
    profile: 'Profil',
    settings: 'Einstellungen',
    signOut: 'Abmelden',
    switchToLightMode: 'Zum hellen Modus wechseln',
    switchToDarkMode: 'Zum dunklen Modus wechseln',
  },
  
  zh: {
    // Common
    loading: '加载中...',
    save: '保存',
    cancel: '取消',
    delete: '删除',
    edit: '编辑',
    view: '查看',
    search: '搜索',
    filter: '筛选',
    sort: '排序',
    refresh: '刷新',
    export: '导出',
    import: '导入',
    
    // Navigation
    dashboard: '仪表板',
    products: '产品',
    orders: '订单',
    customers: '客户',
    analytics: '分析',
    marketing: '营销',
    content: '内容',
    settings: '设置',
    support: '支持',
    apps: '应用',
    
    // Dashboard
    adminDashboard: '管理仪表板',
    totalSales: '总销售额',
    netSales: '净销售额',
    orderCount: '订单数量',
    conversionRate: '转化率',
    salesOverview: '销售概览',
    liveVisitors: '实时访客',
    topPages: '热门页面',
    trafficSources: '流量来源',
    deviceAnalytics: '设备分析',
    conversionFunnel: '转化漏斗',
    
    // Time periods
    all: '全部',
    today: '今天',
    thisWeek: '本周',
    thisMonth: '本月',
    thisYear: '今年',
    selectDate: '选择日期',
    
    // Chart labels
    sales: '销售',
    visitors: '访客',
    orders: '订单',
    revenue: '收入',
    
    // Status
    online: '在线',
    offline: '离线',
    active: '活跃',
    inactive: '非活跃',
    pending: '待处理',
    completed: '已完成',
    cancelled: '已取消',
    
    // Actions
    viewDetails: '查看详情',
    editItem: '编辑项目',
    deleteItem: '删除项目',
    addNew: '添加新项',
    bulkActions: '批量操作',
    
    // Notifications
    notifications: '通知',
    viewAllNotifications: '查看所有通知',
    newOrder: '新订单',
    lowStock: '库存不足警告',
    paymentProcessed: '付款已处理',
    
    // User menu
    profile: '个人资料',
    settings: '设置',
    signOut: '退出登录',
    switchToLightMode: '切换到浅色模式',
    switchToDarkMode: '切换到深色模式',
  }
};

const languages: Language[] = [
  { code: 'en', name: 'English', flag: '🇺🇸', direction: 'ltr' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦', direction: 'rtl' },
  { code: 'fr', name: 'Français', flag: '🇫🇷', direction: 'ltr' },
  { code: 'es', name: 'Español', flag: '🇪🇸', direction: 'ltr' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪', direction: 'ltr' },
  { code: 'zh', name: '中文', flag: '🇨🇳', direction: 'ltr' },
];

interface LanguageContextType {
  currentLanguage: string;
  setCurrentLanguage: (language: string) => void;
  languages: Language[];
  t: Translations;
  direction: 'ltr' | 'rtl';
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [mounted, setMounted] = useState(false);

  // Load language from localStorage on mount
  useEffect(() => {
    setMounted(true);
    const savedLanguage = localStorage.getItem('preferred-language') || 'en';
    console.log('LanguageProvider: Loading saved language:', savedLanguage);
    setCurrentLanguage(savedLanguage);
  }, []);

  // Debug language changes
  useEffect(() => {
    console.log('LanguageProvider: Language state changed to:', currentLanguage);
    const currentLang = languages.find(lang => lang.code === currentLanguage);
    console.log('LanguageProvider: Found language object:', currentLang);
    if (currentLang) {
      console.log('LanguageProvider: Direction should be:', currentLang.direction);
    }
  }, [currentLanguage]);

  useEffect(() => {
    if (mounted) {
      console.log('LanguageProvider: Saving language to localStorage:', currentLanguage);
      localStorage.setItem('preferred-language', currentLanguage);
    }
  }, [currentLanguage, mounted]);

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return <>{children}</>;
  }

  const currentLang = languages.find(lang => lang.code === currentLanguage) || languages[0];
  const t = translations[currentLanguage] || translations.en;
  
  console.log('LanguageProvider: Current language:', currentLanguage, 'Direction:', currentLang.direction);
  console.log('LanguageProvider: Available languages:', languages.map(l => `${l.code}(${l.direction})`));
  console.log('LanguageProvider: Context value being provided:', {
    currentLanguage,
    direction: currentLang.direction,
    languages: languages.length
  });

  return (
    <LanguageContext.Provider value={{
      currentLanguage,
      setCurrentLanguage,
      languages,
      t,
      direction: currentLang.direction
    }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
