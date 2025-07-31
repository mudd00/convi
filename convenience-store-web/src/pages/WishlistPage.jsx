import React, { useState } from 'react';
import { Heart, Filter, Grid, List, Trash2, Settings, Share2, ShoppingCart } from 'lucide-react';
import { useWishlist, useWishlistFilters, useBulkWishlistActions } from '../hooks/useWishlist';
import { useCartStore } from '../stores/cartStore';
import WishlistButton from '../components/wishlist/WishlistButton';
import { Button } from '../components/ui/Button';
import { formatPrice } from '../utils/format';

/**
 * 관심 상품 페이지
 */
const WishlistPage = () => {
  const [viewMode, setViewMode] = useState('grid'); // grid, list
  const [selectedItems, setSelectedItems] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  // 관심 상품 데이터
  const { data: wishlistData, isLoading } = useWishlist();
  const { filters, setFilters, filteredData } = useWishlistFilters(wishlistData);
  const { removeMultiple } = useBulkWishlistActions();
  const { addItem } = useCartStore();

  // 전체 선택/해제
  const handleSelectAll = () => {
    if (selectedItems.length === filteredData.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredData.map(item => item.id));
    }
  };

  // 개별 선택/해제
  const handleSelectItem = (itemId) => {
    setSelectedItems(prev => 
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  // 선택된 상품 삭제
  const handleDeleteSelected = async () => {
    if (selectedItems.length === 0) return;

    const confirmed = window.confirm(`선택한 ${selectedItems.length}개 상품을 관심 상품에서 제거하시겠습니까?`);
    if (!confirmed) return;

    try {
      const productIds = selectedItems.map(itemId => {
        const item = filteredData.find(item => item.id === itemId);
        return item?.productId;
      }).filter(Boolean);

      await removeMultiple.mutateAsync(productIds);
      setSelectedItems([]);
    } catch (error) {
      alert('삭제 중 오류가 발생했습니다.');
    }
  };

  // 선택된 상품 장바구니 추가
  const handleAddSelectedToCart = () => {
    const selectedProducts = filteredData
      .filter(item => selectedItems.includes(item.id) && item.product.isAvailable)
      .map(item => item.product);

    selectedProducts.forEach(product => {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image
      });
    });

    alert(`${selectedProducts.length}개 상품이 장바구니에 추가되었습니다.`);
    setSelectedItems([]);
  };

  // 관심 상품 공유
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: '내 관심 상품',
          text: '편의점에서 찜한 상품들을 확인해보세요!',
          url: window.location.href
        });
      } catch (error) {
        console.log('공유 취소됨');
      }
    } else {
      // 클립보드에 복사
      navigator.clipboard.writeText(window.location.href);
      alert('링크가 클립보드에 복사되었습니다.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Heart className="w-8 h-8 text-red-500" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">관심 상품</h1>
                <p className="text-gray-600 mt-1">
                  찜한 상품 {filteredData.length}개
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                onClick={handleShare}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                공유
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 필터 및 뷰 컨트롤 */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* 필터 토글 */}
              <Button
                onClick={() => setShowFilters(!showFilters)}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                필터
              </Button>

              {/* 선택된 항목 액션 */}
              {selectedItems.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">
                    {selectedItems.length}개 선택됨
                  </span>
                  <Button
                    onClick={handleAddSelectedToCart}
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    장바구니 추가
                  </Button>
                  <Button
                    onClick={handleDeleteSelected}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1 text-red-600 border-red-300 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                    삭제
                  </Button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* 전체 선택 */}
              {filteredData.length > 0 && (
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={selectedItems.length === filteredData.length}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  전체 선택
                </label>
              )}

              {/* 뷰 모드 토글 */}
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'bg-white text-gray-600'}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-white text-gray-600'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* 필터 패널 */}
          {showFilters && (
            <WishlistFilters
              filters={filters}
              onFiltersChange={setFilters}
              className="mt-4 pt-4 border-t border-gray-200"
            />
          )}
        </div>

        {/* 관심 상품 목록 */}
        {isLoading ? (
          <WishlistSkeleton viewMode={viewMode} />
        ) : filteredData.length > 0 ? (
          <div className={`
            ${viewMode === 'grid' 
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
              : 'space-y-4'
            }
          `}>
            {filteredData.map((item) => (
              <WishlistItem
                key={item.id}
                item={item}
                viewMode={viewMode}
                isSelected={selectedItems.includes(item.id)}
                onSelect={() => handleSelectItem(item.id)}
                onAddToCart={() => {
                  addItem({
                    id: item.product.id,
                    name: item.product.name,
                    price: item.product.price,
                    originalPrice: item.product.originalPrice,
                    image: item.product.image
                  });
                }}
              />
            ))}
          </div>
        ) : (
          <EmptyWishlist />
        )}
      </div>
    </div>
  );
};

/**
 * 관심 상품 필터 컴포넌트
 */
const WishlistFilters = ({ filters, onFiltersChange, className = '' }) => {
  const categories = [
    { value: 'all', label: '전체 카테고리' },
    { value: 'instant-food', label: '즉석식품' },
    { value: 'beverages', label: '음료' },
    { value: 'snacks', label: '과자' },
    { value: 'dairy', label: '유제품' }
  ];

  return (
    <div className={`grid grid-cols-1 md:grid-cols-4 gap-4 ${className}`}>
      {/* 카테고리 필터 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          카테고리
        </label>
        <select
          value={filters.category}
          onChange={(e) => onFiltersChange({ ...filters, category: e.target.value })}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
        >
          {categories.map(category => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>
      </div>

      {/* 재고 상태 필터 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          재고 상태
        </label>
        <select
          value={filters.availability}
          onChange={(e) => onFiltersChange({ ...filters, availability: e.target.value })}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
        >
          <option value="all">전체</option>
          <option value="available">재고 있음</option>
          <option value="outOfStock">품절</option>
        </select>
      </div>

      {/* 할인 상태 필터 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          할인 상태
        </label>
        <select
          value={filters.onSale}
          onChange={(e) => onFiltersChange({ ...filters, onSale: e.target.value })}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
        >
          <option value="all">전체</option>
          <option value="onSale">할인 중</option>
          <option value="regular">정가</option>
        </select>
      </div>

      {/* 정렬 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          정렬
        </label>
        <select
          value={`${filters.sortBy}-${filters.sortOrder}`}
          onChange={(e) => {
            const [sortBy, sortOrder] = e.target.value.split('-');
            onFiltersChange({ ...filters, sortBy, sortOrder });
          }}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
        >
          <option value="addedAt-desc">최근 추가순</option>
          <option value="addedAt-asc">오래된 순</option>
          <option value="name-asc">이름순</option>
          <option value="price-asc">가격 낮은순</option>
          <option value="price-desc">가격 높은순</option>
        </select>
      </div>
    </div>
  );
};

/**
 * 관심 상품 아이템 컴포넌트
 */
const WishlistItem = ({ item, viewMode, isSelected, onSelect, onAddToCart }) => {
  const { product } = item;

  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex items-center gap-4">
          {/* 체크박스 */}
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onSelect}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />

          {/* 상품 이미지 */}
          <div className="w-20 h-20 flex-shrink-0">
            <img
              src={product.image || '/images/placeholder-product.jpg'}
              alt={product.name}
              className="w-full h-full object-cover rounded-md"
            />
          </div>

          {/* 상품 정보 */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 mb-1">
              {product.name}
            </h3>
            <p className="text-sm text-gray-500 mb-2">
              {product.brand} · {product.category}
            </p>
            
            {/* 가격 정보 */}
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-gray-900">
                {formatPrice(product.price)}원
              </span>
              {product.originalPrice > product.price && (
                <>
                  <span className="text-sm text-gray-500 line-through">
                    {formatPrice(product.originalPrice)}원
                  </span>
                  <span className="text-sm text-red-600 font-medium">
                    {product.discountRate}% 할인
                  </span>
                </>
              )}
            </div>

            {/* 상태 표시 */}
            <div className="flex items-center gap-2 mt-2">
              {!product.isAvailable && (
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                  품절
                </span>
              )}
              {product.isOnSale && (
                <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
                  할인 중
                </span>
              )}
            </div>
          </div>

          {/* 액션 버튼 */}
          <div className="flex items-center gap-2">
            <Button
              onClick={onAddToCart}
              disabled={!product.isAvailable}
              size="sm"
              className="flex items-center gap-1"
            >
              <ShoppingCart className="w-4 h-4" />
              담기
            </Button>
            <WishlistButton
              productId={product.id}
              variant="icon"
              size="sm"
            />
          </div>
        </div>
      </div>
    );
  }

  // 그리드 뷰
  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      {/* 체크박스 */}
      <div className="absolute top-2 left-2 z-10">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onSelect}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
      </div>

      {/* 상품 이미지 */}
      <div className="relative aspect-square">
        <img
          src={product.image || '/images/placeholder-product.jpg'}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        
        {/* 관심 상품 버튼 */}
        <div className="absolute top-2 right-2">
          <WishlistButton
            productId={product.id}
            variant="icon"
            size="sm"
            className="bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-1.5 shadow-sm"
          />
        </div>

        {/* 상태 배지 */}
        {!product.isAvailable && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="bg-white text-gray-900 px-3 py-1 rounded-full text-sm font-medium">
              품절
            </span>
          </div>
        )}
      </div>

      {/* 상품 정보 */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
          {product.name}
        </h3>
        <p className="text-sm text-gray-500 mb-2">
          {product.brand}
        </p>

        {/* 가격 정보 */}
        <div className="mb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-gray-900">
              {formatPrice(product.price)}원
            </span>
            {product.originalPrice > product.price && (
              <span className="text-sm text-red-600 font-medium">
                {product.discountRate}% 할인
              </span>
            )}
          </div>
          {product.originalPrice > product.price && (
            <span className="text-sm text-gray-500 line-through">
              {formatPrice(product.originalPrice)}원
            </span>
          )}
        </div>

        {/* 장바구니 버튼 */}
        <Button
          onClick={onAddToCart}
          disabled={!product.isAvailable}
          className="w-full"
          size="sm"
        >
          {product.isAvailable ? '장바구니 담기' : '품절'}
        </Button>
      </div>
    </div>
  );
};

/**
 * 로딩 스켈레톤
 */
const WishlistSkeleton = ({ viewMode }) => {
  const skeletonCount = viewMode === 'grid' ? 8 : 5;

  return (
    <div className={`
      ${viewMode === 'grid' 
        ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
        : 'space-y-4'
      }
    `}>
      {Array.from({ length: skeletonCount }).map((_, index) => (
        <div key={index} className="bg-white rounded-lg shadow-sm border overflow-hidden animate-pulse">
          {viewMode === 'grid' ? (
            <>
              <div className="aspect-square bg-gray-200"></div>
              <div className="p-4 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            </>
          ) : (
            <div className="p-4 flex items-center gap-4">
              <div className="w-4 h-4 bg-gray-200 rounded"></div>
              <div className="w-20 h-20 bg-gray-200 rounded-md"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="h-6 bg-gray-200 rounded w-1/3"></div>
              </div>
              <div className="w-20 h-8 bg-gray-200 rounded"></div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

/**
 * 빈 상태 컴포넌트
 */
const EmptyWishlist = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-12 text-center">
      <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        관심 상품이 없습니다
      </h3>
      <p className="text-gray-500 mb-6">
        마음에 드는 상품을 찜해보세요!
      </p>
      <Button
        onClick={() => window.location.href = '/products'}
      >
        상품 둘러보기
      </Button>
    </div>
  );
};

export default WishlistPage;