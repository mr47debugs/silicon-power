import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PageId, Product, CartItem, WishlistItem, CompareItem } from './types';

// ─── Navigation Store ──────────────────────────────────────────────────────

interface NavigationStore {
  currentPage: PageId;
  selectedProductId: string | null;
  selectedCategory: string | null;
  navigate: (page: PageId, productId?: string | null, category?: string | null) => void;
}

export const useNavigationStore = create<NavigationStore>((set) => ({
  currentPage: 'home',
  selectedProductId: null,
  selectedCategory: null,
  navigate: (page, productId = null, category = null) =>
    set({
      currentPage: page,
      selectedProductId: productId ?? null,
      selectedCategory: category ?? null,
    }),
}));

// ─── Cart Store (persisted) ────────────────────────────────────────────────

interface CartStore {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, quantity = 1) =>
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.product.id === product.id
          );
          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.product.id === product.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          }
          return { items: [...state.items, { product, quantity }] };
        }),
      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        })),
      updateQuantity: (productId, quantity) =>
        set((state) => {
          if (quantity <= 0) {
            return {
              items: state.items.filter((item) => item.product.id !== productId),
            };
          }
          return {
            items: state.items.map((item) =>
              item.product.id === productId ? { ...item, quantity } : item
            ),
          };
        }),
      clearCart: () => set({ items: [] }),
      getTotal: () =>
        get().items.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
        ),
      getItemCount: () =>
        get().items.reduce((count, item) => count + item.quantity, 0),
    }),
    {
      name: 'solar-crane-cart',
    }
  )
);

// ─── Wishlist Store (persisted) ────────────────────────────────────────────

interface WishlistStore {
  items: WishlistItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product) =>
        set((state) => {
          if (state.items.find((item) => item.product.id === product.id)) {
            return state;
          }
          return {
            items: [...state.items, { product, addedAt: new Date() }],
          };
        }),
      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        })),
      isInWishlist: (productId) =>
        get().items.some((item) => item.product.id === productId),
      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: 'solar-crane-wishlist',
    }
  )
);

// ─── Compare Store (persisted) ─────────────────────────────────────────────

interface CompareStore {
  items: CompareItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  clearCompare: () => void;
}

const MAX_COMPARE_ITEMS = 4;

export const useCompareStore = create<CompareStore>()(
  persist(
    (set) => ({
      items: [],
      addItem: (product) =>
        set((state) => {
          if (state.items.find((item) => item.product.id === product.id)) {
            return state;
          }
          if (state.items.length >= MAX_COMPARE_ITEMS) {
            return state;
          }
          return { items: [...state.items, { product }] };
        }),
      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        })),
      clearCompare: () => set({ items: [] }),
    }),
    {
      name: 'solar-crane-compare',
    }
  )
);

// ─── Search Store ──────────────────────────────────────────────────────────

interface SearchStore {
  query: string;
  setQuery: (query: string) => void;
  isSearchOpen: boolean;
  toggleSearch: () => void;
  openSearch: () => void;
  closeSearch: () => void;
}

export const useSearchStore = create<SearchStore>((set) => ({
  query: '',
  setQuery: (query) => set({ query }),
  isSearchOpen: false,
  toggleSearch: () => set((state) => ({ isSearchOpen: !state.isSearchOpen })),
  openSearch: () => set({ isSearchOpen: true }),
  closeSearch: () => set({ isSearchOpen: false, query: '' }),
}));

// ─── Mobile Menu Store ─────────────────────────────────────────────────────

interface MobileMenuStore {
  isOpen: boolean;
  toggle: () => void;
  open: () => void;
  close: () => void;
}

export const useMobileMenuStore = create<MobileMenuStore>((set) => ({
  isOpen: false,
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));
