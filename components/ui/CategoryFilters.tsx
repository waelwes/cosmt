'use client';

import React, { useState, useEffect } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import type { Product } from '@/lib/types/Product';
import { Concern } from '@/lib/types/Concern';

interface CategoryFiltersProps {
  filters: {
    brands: string[];
    productTypes: string[];
    skinConcerns?: string[];
    skinTypes?: string[];
    usageAreas?: string[];
    genders?: string[];
    // Hair care specific (optional)
    hairNeeds?: string[];
    hairTypes?: string[];
    stylingProducts?: string[];
    stylingFeatures?: string[];
    gripStrength?: string[];
    paintCareProducts?: string[];
    paintProperties?: string[];
    dyePermanence?: string[];
    oxidantVolume?: string[];
    hairdresserProducts?: string[];
  };
  onFilterChange: (filters: CategoryFiltersProps['filters']) => void;
  products: Product[];
  categorySlug?: string;
}

export const CategoryFilters: React.FC<CategoryFiltersProps> = ({
  filters,
  onFilterChange,
  products,
  categorySlug,
}) => {
  // local UI state
  const [brandSearch, setBrandSearch] = useState('');
  const [productTypeSearch, setProductTypeSearch] = useState('');
  const [skinConcernSearch] = useState('');
  const [skinTypeSearch] = useState('');
  const [usageAreaSearch] = useState('');
  const [genderSearch] = useState('');
  const [availableConcerns, setAvailableConcerns] = useState<Concern[]>([]);
  const [loadingConcerns, setLoadingConcerns] = useState(false);

  // Load concerns from database
  useEffect(() => {
    const loadConcerns = async () => {
      try {
        setLoadingConcerns(true);
        const response = await fetch('/api/admin/concerns?type=skin_concern');
        const result = await response.json();
        
        if (result.success && result.data) {
          setAvailableConcerns(result.data);
        } else {
          console.error('Failed to load concerns:', result.error);
        }
      } catch (error) {
        console.error('Failed to load concerns:', error);
      } finally {
        setLoadingConcerns(false);
      }
    };

    loadConcerns();
  }, []);

  // Predefined list of all available brands (expanded hair care list)
  const allBrands = [
    'Kerastase','Davines','La Roche-Posay','L\'Oréal Professionnel Paris','Mason Pearson','Percy & Reed','milk_shake','Tangle Teezer','Vichy','Dyson','Lavera','Bioderma','Alphaparf','Aveda','MOROCCANOIL','Nuxe','Olaplex','Simply Zen','Wella','Schwarzkopf','Artego','Lazartigue','Bonacure','Dax','Depot','Ducray','Morgan\'s Pomade','Hush','Invisibobble','Keune','Mane \'n Tail','Maria Nila','Phyto','Proraso','REF','RefectoCil','Reuzel','Schatz','Sebastian','Swissoderm','Tigi','Weleda','Cadiveu','Insight','Stalex','Beurer','Uppercut Deluxe','Alterego Italy','SACHABOX','Alpecin','Antaç','Awapuhi Wild Ginger','Babe','Batiste','Biocap','Biorin','Bioxcin','Borthe','Bosley','Brazilian Blowout','Ceradolin','Claris','Color Natural','Dermadolin','Other Brands','Element','Ellipse','EuroStyle','Faith In Nature','Fino','Foamie','Folly','FREJA','Fulin','Gamma Professional','Goldwell','Hector','Herbatint','Hydra','Impala','Inebrya','Jaguar','Jamaican Jeans','Young','JRL','Kadus Professional','Kallos Cosmetics','Karseell','Keo Professional','KERASLIK','Keratin Complex','KYANA','Lioness','Loof','L\'Oréal Paris','M2 Beauty','Misbahce','MKS eco','Morphose','Mounir','My Natural Colors','Nascita','Nashi Argan','Native Base','Natulika','Novex','Olivia Garden','Organic Color Systems','Osmo','Passionate','Paul Mitchell','Prodiva','Pumpoo','Purple','RedOne','Revlon','Rodeo','Roon','Lounge','Schultz','Sebamed','Selective','Seven Pigments','Solingen','Sortic','Tabac Original','Tanaçan','Tea Tree','Tenax','The Color Codes','The Fair','Toni & Guy','Treecell','Trina','TTO','URBAN Care','Valdore','Vita Coco','Wet Brush'
  ];

  // Hair care product types
  const allProductTypes = [
    'Bond Strengthener','Care Foam','Care Spray','Brush','Hairpin','Blow Dryer Brush','Keratin Lotion','Cutting Comb','Crepe Comb','Massage Comb','Perm Paper','Perm Lotion','Perm Stabilizer','Perm Comb','Pump','Hair Detangling Comb','Hair conditioner','Hair Lotion','Hair Mask','Hair Peeling','Hair Clips','Hair Serum','Hair Tonic','Hair Oil','Shampoo','Set','Comb','Bobby pin','Clasp','Knob Net','Bun Brush','Mace Sponge'
  ];

  // Hair Needs
  const allHairNeeds = [
    'Arganli','Purifying','Paint Stabilizer','Curl Enhancer','Dermocosmetics','Spill Preventer','Detangler','Straightener','Anti-frizz','Strengthening','After Sun Care','Daily Care','Volumizing','Heat Protector','Itch-Redness-Sensitizer','Anti-Dandruff','Keratin Care','Keratinous','Before/After Chemical Treatment','Fracture Prevention','Purple-Blue Toner','Moisturizer','Restorative','Brightening','Color Saver','Sulfate-free','Oil Balancer','Thickener'
  ];

  // Hair Types
  const allHairTypes = [
    'Dyed Hair','Hair Loss','Sensitive Scalp','Fine Hair','Thinning Hair','Thick-Unruly Hair','Dandruff Hair','Curly Hair','Dry Hair','Dull-Lifeless Hair','Blonde-Gray Hair','Black Hair','All Hair Types','Oily Hair','Damaged Hair'
  ];

  // Styling Products
  const allStylingProducts = [
    'Gel','Jelly','Hair','Cream','Dry Shampoo','Lotion','Paste','Pomade','Powder','Hair Mousse','Hair Spray','Serum','Set','Wax'
  ];

  // Styling Features
  const allStylingFeatures = [
    'Curl Enhancer','Natural Look','Texture Giving','Detangler','Straightener','Anti-frizz','Volumizing','Heat Protector','Wet Look','Matte Appearance','Brightening','Smoothing','Stabilizer','Shaping Base'
  ];

  // Grip Strength
  const allGripStrength = ['Natural','Light','Middle','High'];

  // Paint Care Products
  const allPaintCareProducts = [
    'Base Cream','White Hair Concealer','Bonnet','Paintbrush','Paint Container','Paint Nylon','Paint Squeezer','Skin Paint Remover','Foil','Under-Eye Protective Pad','Eyebrow and Eyelash Dye','Eyebrow and Eyelash Dye Oxidizer','Oxidant','Highlighting Apparatus','Highlight Palette','Hair Lightener','Hair Dye','Hair Dye Remover','Toner','Topic','Application Lotion'
  ];

  // Paint Properties
  const allPaintProperties = ['Ammonia','Ammonia-free'];

  // Dye Permanence
  const allDyePermanence = ['Temporary','Permanent','Semi-Permanent'];

  // Oxidant Volume
  const allOxidantVolume = ['5 Volume','6 Volume','7 Volume','9 Volume','10 Volume','13 Volume','15 Volume','20 Volume','30 Volume','40 Volume','0 Volume','25 Volume','3.5 Volume'];

  // Hairdresser Products
  const allHairdresserProducts = ['Mirror','Curler','Bonnet','Neckband','Bag','Regulator','Nape Brush','Blow Dryer Hanger','Towel','Rope','Welding Machine','Hairdresser Apron','Scissors','Paraffin','Stretcher Cover','Visor','Sterile Package','Leech','Scales','Razor','Straight Razor Blade','Collar Weight','Spare Bottle'];

  // Use database concerns instead of hardcoded list
  const allSkinConcerns = availableConcerns.map(concern => concern.name);

  // Predefined list of skin types (skin-care specific)
  const allSkinTypes = [
    'Sensitive Skin', 'Combination Skin', 'Dry Skin', 'Normal Skin', 'All Skin Types', 'Oily Skin'
  ];

  // Predefined list of usage areas (skin-care specific)
  const allUsageAreas = [
    'Lips', 'Eye Area', 'Face'
  ];

  // Predefined list of genders (generic)
  const allGenders = [
    'Male', 'Woman'
  ];

  // Get brands that actually have products
  const availableBrands = products && products.length > 0 
    ? Array.from(new Set(products.map(product => product.brand || '').filter(Boolean)))
    : [];

  // Combine available brands with all brands, prioritizing available ones
  const allBrandsList = [...new Set([...availableBrands, ...allBrands])].sort();
  
  // Filter brands based on search
  const brands = brandSearch.trim() === '' 
    ? allBrandsList 
    : allBrandsList.filter(brand => 
        brand.toLowerCase().includes(brandSearch.toLowerCase())
      );

  // Filter product types based on search
  const productTypes = productTypeSearch.trim() === '' 
    ? allProductTypes 
    : allProductTypes.filter(type => 
        type.toLowerCase().includes(productTypeSearch.toLowerCase())
      );

  // Filter skin concerns based on search
  const skinConcerns = skinConcernSearch.trim() === '' 
    ? allSkinConcerns 
    : allSkinConcerns.filter(concern => 
        concern.toLowerCase().includes(skinConcernSearch.toLowerCase())
      );

  // Filter skin types based on search
  const skinTypes = skinTypeSearch.trim() === '' 
    ? allSkinTypes 
    : allSkinTypes.filter(type => 
        type.toLowerCase().includes(skinTypeSearch.toLowerCase())
      );

  // Filter usage areas based on search
  const usageAreas = usageAreaSearch.trim() === '' 
    ? allUsageAreas 
    : allUsageAreas.filter(area => 
        area.toLowerCase().includes(usageAreaSearch.toLowerCase())
      );

  // Filter genders based on search
  const genders = genderSearch.trim() === '' 
    ? allGenders 
    : allGenders.filter(gender => 
        gender.toLowerCase().includes(genderSearch.toLowerCase())
      );

  const handleBrandToggle = (brand: string) => {
    const currentBrands = filters.brands || [];
    const newBrands = currentBrands.includes(brand)
      ? currentBrands.filter(b => b !== brand)
      : [...currentBrands, brand];
    
    onFilterChange({
      ...filters,
      brands: newBrands,
    });
  };


  const handleProductTypeToggle = (productType: string) => {
    const currentProductTypes = filters.productTypes || [];
    const newProductTypes = currentProductTypes.includes(productType)
      ? currentProductTypes.filter(t => t !== productType)
      : [...currentProductTypes, productType];
    
    onFilterChange({
      ...filters,
      productTypes: newProductTypes,
    });
  };


  // Skin Concerns handlers
  const handleSkinConcernToggle = (skinConcern: string) => {
    const currentSkinConcerns = filters.skinConcerns || [];
    const newSkinConcerns = currentSkinConcerns.includes(skinConcern)
      ? currentSkinConcerns.filter(c => c !== skinConcern)
      : [...currentSkinConcerns, skinConcern];
    
    onFilterChange({
      ...filters,
      skinConcerns: newSkinConcerns,
    });
  };


  // Skin Types handlers
  const handleSkinTypeToggle = (skinType: string) => {
    const currentSkinTypes = filters.skinTypes || [];
    const newSkinTypes = currentSkinTypes.includes(skinType)
      ? currentSkinTypes.filter(t => t !== skinType)
      : [...currentSkinTypes, skinType];
    
    onFilterChange({
      ...filters,
      skinTypes: newSkinTypes,
    });
  };


  // Usage Areas handlers
  const handleUsageAreaToggle = (usageArea: string) => {
    const currentUsageAreas = filters.usageAreas || [];
    const newUsageAreas = currentUsageAreas.includes(usageArea)
      ? currentUsageAreas.filter(a => a !== usageArea)
      : [...currentUsageAreas, usageArea];
    
    onFilterChange({
      ...filters,
      usageAreas: newUsageAreas,
    });
  };


  // Genders handlers
  const handleGenderToggle = (gender: string) => {
    const currentGenders = filters.genders || [];
    const newGenders = currentGenders.includes(gender)
      ? currentGenders.filter(g => g !== gender)
      : [...currentGenders, gender];
    
    onFilterChange({
      ...filters,
      genders: newGenders,
    });
  };



  const clearFilters = () => {
    onFilterChange({
      brands: [],
      productTypes: [],
      skinConcerns: [],
      skinTypes: [],
      usageAreas: [],
      genders: [],
      hairNeeds: [],
      hairTypes: [],
      stylingProducts: [],
      stylingFeatures: [],
      gripStrength: [],
      paintCareProducts: [],
      paintProperties: [],
      dyePermanence: [],
      oxidantVolume: [],
      hairdresserProducts: [],
    });
  };

  const isSkinCare = (categorySlug || '').toLowerCase() === 'skincare';

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <SlidersHorizontal className="w-5 h-5 text-[#00514B]" />
          <h3 className="text-lg font-semibold text-gray-900">Product Filters</h3>
        </div>
        <button
          onClick={clearFilters}
          className="text-sm text-[#00514B] hover:text-[#00514B]/80 transition-colors duration-200 font-medium"
        >
          Clear All
        </button>
      </div>

      {/* Brands Section */}
      <div className="mb-6">
        <div className="mb-3">
          <h4 className="text-sm font-medium text-gray-900">BRANDS</h4>
        </div>
        {/* Brand Search */}
        <div className="mb-3">
          <input
            type="text"
            placeholder="Search brands..."
            value={brandSearch}
            onChange={(e) => setBrandSearch(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#00514B] focus:border-[#00514B]"
          />
        </div>
        
        <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-3">
          <div className="space-y-1">
            {brands.length > 0 ? (
              brands.map((brand) => {
                const isSelected = filters.brands?.includes(brand as string) || false;
                return (
                  <label
                    key={brand}
                    className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleBrandToggle(brand as string)}
                      className="w-4 h-4 text-[#00514B] border-gray-300 rounded focus:ring-[#00514B] focus:ring-2 accent-[#00514B]"
                      style={{ accentColor: '#00514B' }}
                    />
                    <span className="text-gray-700">{brand}</span>
                  </label>
                );
              })
            ) : (
              <div className="text-center text-gray-500 py-4">No brands found</div>
            )}
          </div>
        </div>
      </div>

      {/* Product Types Section (Hair Care) */}
      <div className="mb-6">
        <div className="mb-3">
          <h4 className="text-sm font-medium text-gray-900">Personal Care Products</h4>
        </div>
      {/* Hair Needs */}
      <div className="mb-6">
        <div className="mb-3">
          <h4 className="text-sm font-medium text-gray-900">Hair Needs</h4>
        </div>
        <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-3">
          <div className="flex flex-wrap gap-2">
            {allHairNeeds.map((need) => {
              const isSelected = (filters.hairNeeds || []).includes(need);
              return (
                <button
                  key={need}
                  onClick={() => onFilterChange({ ...filters, hairNeeds: isSelected ? (filters.hairNeeds || []).filter(n => n !== need) : [ ...(filters.hairNeeds || []), need ] })}
                  className={`px-2 py-1 text-xs rounded border ${isSelected ? 'bg-[#00514B] text-white border-[#00514B]' : 'text-gray-700 border-gray-300'}`}
                >
                  {need}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Hair Type */}
      <div className="mb-6">
        <div className="mb-3">
          <h4 className="text-sm font-medium text-gray-900">Hair Type</h4>
        </div>
        <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-3">
          <div className="flex flex-wrap gap-2">
            {allHairTypes.map((t) => {
              const isSelected = (filters.hairTypes || []).includes(t);
              return (
                <button
                  key={t}
                  onClick={() => onFilterChange({ ...filters, hairTypes: isSelected ? (filters.hairTypes || []).filter(n => n !== t) : [ ...(filters.hairTypes || []), t ] })}
                  className={`px-2 py-1 text-xs rounded border ${isSelected ? 'bg-[#00514B] text-white border-[#00514B]' : 'text-gray-700 border-gray-300'}`}
                >
                  {t}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Styling Products */}
      <div className="mb-6">
        <div className="mb-3">
          <h4 className="text-sm font-medium text-gray-900">Styling Products</h4>
        </div>
        <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-3">
          <div className="flex flex-wrap gap-2">
            {allStylingProducts.map((sp) => {
              const isSelected = (filters.stylingProducts || []).includes(sp);
              return (
                <button
                  key={sp}
                  onClick={() => onFilterChange({ ...filters, stylingProducts: isSelected ? (filters.stylingProducts || []).filter(n => n !== sp) : [ ...(filters.stylingProducts || []), sp ] })}
                  className={`px-2 py-1 text-xs rounded border ${isSelected ? 'bg-[#00514B] text-white border-[#00514B]' : 'text-gray-700 border-gray-300'}`}
                >
                  {sp}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Styling Feature */}
      <div className="mb-6">
        <div className="mb-3">
          <h4 className="text-sm font-medium text-gray-900">Styling Feature</h4>
        </div>
        <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-3">
          <div className="flex flex-wrap gap-2">
            {allStylingFeatures.map((sf) => {
              const isSelected = (filters.stylingFeatures || []).includes(sf);
              return (
                <button
                  key={sf}
                  onClick={() => onFilterChange({ ...filters, stylingFeatures: isSelected ? (filters.stylingFeatures || []).filter(n => n !== sf) : [ ...(filters.stylingFeatures || []), sf ] })}
                  className={`px-2 py-1 text-xs rounded border ${isSelected ? 'bg-[#00514B] text-white border-[#00514B]' : 'text-gray-700 border-gray-300'}`}
                >
                  {sf}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Grip Strength */}
      <div className="mb-6">
        <div className="mb-3">
          <h4 className="text-sm font-medium text-gray-900">Grip Strength</h4>
        </div>
        <div className="flex flex-wrap gap-2">
          {allGripStrength.map((g) => {
            const isSelected = (filters.gripStrength || []).includes(g);
            return (
              <button
                key={g}
                onClick={() => onFilterChange({ ...filters, gripStrength: isSelected ? (filters.gripStrength || []).filter(n => n !== g) : [ ...(filters.gripStrength || []), g ] })}
                className={`px-2 py-1 text-xs rounded border ${isSelected ? 'bg-[#00514B] text-white border-[#00514B]' : 'text-gray-700 border-gray-300'}`}
              >
                {g}
              </button>
            );
          })}
        </div>
      </div>

      {/* Paint Care Products */}
      <div className="mb-6">
        <div className="mb-3">
          <h4 className="text-sm font-medium text-gray-900">Paint Care Products</h4>
        </div>
        <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-3">
          <div className="flex flex-wrap gap-2">
            {allPaintCareProducts.map((pc) => {
              const isSelected = (filters.paintCareProducts || []).includes(pc);
              return (
                <button
                  key={pc}
                  onClick={() => onFilterChange({ ...filters, paintCareProducts: isSelected ? (filters.paintCareProducts || []).filter(n => n !== pc) : [ ...(filters.paintCareProducts || []), pc ] })}
                  className={`px-2 py-1 text-xs rounded border ${isSelected ? 'bg-[#00514B] text-white border-[#00514B]' : 'text-gray-700 border-gray-300'}`}
                >
                  {pc}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Paint Properties */}
      <div className="mb-6">
        <div className="mb-3">
          <h4 className="text-sm font-medium text-gray-900">Paint Properties</h4>
        </div>
        <div className="flex flex-wrap gap-2">
          {allPaintProperties.map((pp) => {
            const isSelected = (filters.paintProperties || []).includes(pp);
            return (
              <button
                key={pp}
                onClick={() => onFilterChange({ ...filters, paintProperties: isSelected ? (filters.paintProperties || []).filter(n => n !== pp) : [ ...(filters.paintProperties || []), pp ] })}
                className={`px-2 py-1 text-xs rounded border ${isSelected ? 'bg-[#00514B] text-white border-[#00514B]' : 'text-gray-700 border-gray-300'}`}
              >
                {pp}
              </button>
            );
          })}
        </div>
      </div>

      {/* Dye Permanence */}
      <div className="mb-6">
        <div className="mb-3">
          <h4 className="text-sm font-medium text-gray-900">Dye Permanence</h4>
        </div>
        <div className="flex flex-wrap gap-2">
          {allDyePermanence.map((dp) => {
            const isSelected = (filters.dyePermanence || []).includes(dp);
            return (
              <button
                key={dp}
                onClick={() => onFilterChange({ ...filters, dyePermanence: isSelected ? (filters.dyePermanence || []).filter(n => n !== dp) : [ ...(filters.dyePermanence || []), dp ] })}
                className={`px-2 py-1 text-xs rounded border ${isSelected ? 'bg-[#00514B] text-white border-[#00514B]' : 'text-gray-700 border-gray-300'}`}
              >
                {dp}
              </button>
            );
          })}
        </div>
      </div>

      {/* Oxidant Volume */}
      <div className="mb-6">
        <div className="mb-3">
          <h4 className="text-sm font-medium text-gray-900">Oxidant Volume</h4>
        </div>
        <div className="flex flex-wrap gap-2">
          {allOxidantVolume.map((ov) => {
            const isSelected = (filters.oxidantVolume || []).includes(ov);
            return (
              <button
                key={ov}
                onClick={() => onFilterChange({ ...filters, oxidantVolume: isSelected ? (filters.oxidantVolume || []).filter(n => n !== ov) : [ ...(filters.oxidantVolume || []), ov ] })}
                className={`px-2 py-1 text-xs rounded border ${isSelected ? 'bg-[#00514B] text-white border-[#00514B]' : 'text-gray-700 border-gray-300'}`}
              >
                {ov}
              </button>
            );
          })}
        </div>
      </div>

      {/* Hairdresser Products */}
      <div className="mb-6">
        <div className="mb-3">
          <h4 className="text-sm font-medium text-gray-900">Hairdresser Products</h4>
        </div>
        <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-3">
          <div className="flex flex-wrap gap-2">
            {allHairdresserProducts.map((hp) => {
              const isSelected = (filters.hairdresserProducts || []).includes(hp);
              return (
                <button
                  key={hp}
                  onClick={() => onFilterChange({ ...filters, hairdresserProducts: isSelected ? (filters.hairdresserProducts || []).filter(n => n !== hp) : [ ...(filters.hairdresserProducts || []), hp ] })}
                  className={`px-2 py-1 text-xs rounded border ${isSelected ? 'bg-[#00514B] text-white border-[#00514B]' : 'text-gray-700 border-gray-300'}`}
                >
                  {hp}
                </button>
              );
            })}
          </div>
        </div>
      </div>
        
        {/* Product Type Search */}
        <div className="mb-3">
          <input
            type="text"
            placeholder="Search product types..."
            value={productTypeSearch}
            onChange={(e) => setProductTypeSearch(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#00514B] focus:border-[#00514B]"
          />
        </div>
        
        <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-3">
          <div className="space-y-1">
            {productTypes.length > 0 ? (
              productTypes.map((productType) => {
                const isSelected = filters.productTypes?.includes(productType) || false;
                return (
                  <label
                    key={productType}
                    className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleProductTypeToggle(productType)}
                      className="w-4 h-4 text-[#00514B] border-gray-300 rounded focus:ring-[#00514B] focus:ring-2 accent-[#00514B]"
                      style={{ accentColor: '#00514B' }}
                    />
                    <span className="text-gray-700">{productType}</span>
                  </label>
                );
              })
            ) : (
              <div className="text-center text-gray-500 py-4">No product types found</div>
            )}
          </div>
        </div>
      </div>

      {/* Skin Concerns Section (only for Skincare) */}
      {isSkinCare && (
      <div className="mb-6">
        <div className="mb-3">
          <h4 className="text-sm font-medium text-gray-900">Skin Concerns</h4>
        </div>
        
        <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-3">
          <div className="space-y-1">
            {loadingConcerns ? (
              <div className="text-sm text-gray-500">Loading concerns...</div>
            ) : skinConcerns.map((skinConcern) => {
              const isSelected = filters.skinConcerns?.includes(skinConcern) || false;
              return (
                <label
                  key={skinConcern}
                  className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded text-sm"
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleSkinConcernToggle(skinConcern)}
                    className="w-4 h-4 text-[#00514B] border-gray-300 rounded focus:ring-[#00514B] focus:ring-2 accent-[#00514B]"
                    style={{ accentColor: '#00514B' }}
                  />
                  <span className="text-gray-700">{skinConcern}</span>
                </label>
              );
            })}
          </div>
        </div>
      </div>
      )}

      {/* Skin Type Section (only for Skincare) */}
      {isSkinCare && (
      <div className="mb-6">
        <div className="mb-3">
          <h4 className="text-sm font-medium text-gray-900">Skin Type</h4>
        </div>
        
        <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-3">
          <div className="space-y-1">
            {skinTypes.map((skinType) => {
              const isSelected = filters.skinTypes?.includes(skinType) || false;
              return (
                <label
                  key={skinType}
                  className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded text-sm"
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleSkinTypeToggle(skinType)}
                    className="w-4 h-4 text-[#00514B] border-gray-300 rounded focus:ring-[#00514B] focus:ring-2 accent-[#00514B]"
                    style={{ accentColor: '#00514B' }}
                  />
                  <span className="text-gray-700">{skinType}</span>
                </label>
              );
            })}
          </div>
        </div>
      </div>
      )}

      {/* Usage Area Section (only for Skincare) */}
      {isSkinCare && (
      <div className="mb-6">
        <div className="mb-3">
          <h4 className="text-sm font-medium text-gray-900">Usage Area</h4>
        </div>
        
        <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-3">
          <div className="space-y-1">
            {usageAreas.map((usageArea) => {
              const isSelected = filters.usageAreas?.includes(usageArea) || false;
              return (
                <label
                  key={usageArea}
                  className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded text-sm"
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleUsageAreaToggle(usageArea)}
                    className="w-4 h-4 text-[#00514B] border-gray-300 rounded focus:ring-[#00514B] focus:ring-2 accent-[#00514B]"
                    style={{ accentColor: '#00514B' }}
                  />
                  <span className="text-gray-700">{usageArea}</span>
                </label>
              );
            })}
          </div>
        </div>
      </div>
      )}

      {/* Gender Section */}
      <div className="mb-6">
        <div className="mb-3">
          <h4 className="text-sm font-medium text-gray-900">Gender</h4>
        </div>
        
        <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-3">
          <div className="space-y-1">
            {genders.map((gender) => {
              const isSelected = filters.genders?.includes(gender) || false;
              return (
                <label
                  key={gender}
                  className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded text-sm"
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleGenderToggle(gender)}
                    className="w-4 h-4 text-[#00514B] border-gray-300 rounded focus:ring-[#00514B] focus:ring-2 accent-[#00514B]"
                    style={{ accentColor: '#00514B' }}
                  />
                  <span className="text-gray-700">{gender}</span>
                </label>
              );
            })}
          </div>
        </div>
      </div>

    </div>
  );
};
