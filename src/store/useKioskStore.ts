import { create } from 'zustand';

// 데이터 타입 정의
export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: 'coffee' | 'smoothie' | 'tea' | 'dessert';
  image?: string;
}

export interface SelectedOption {
  temperature: 'HOT' | 'ICE';
  size: 'Regular' | 'Large';
  shotAdded: number;
  sweetness?: '30%' | '50%' | '70%' | '100%';
}

export interface CartItem {
  cartId: string; // 장바구니 고유 ID (같은 메뉴라도 옵션이 다를 수 있으므로)
  menu: MenuItem;
  options: SelectedOption;
  quantity: number;
  totalPrice: number;
}

interface KioskState {
  orderType: '매장' | '포장' | null;
  cart: CartItem[];
  setOrderType: (type: '매장' | '포장') => void;
  addToCart: (item: CartItem) => void;
  removeFromCart: (cartId: string) => void;
  clearCart: () => void;
}

// Zustand 스토어 생성
export const useKioskStore = create<KioskState>((set) => ({
  orderType: null,
  cart: [],
  setOrderType: (type) => set({ orderType: type }),
  addToCart: (item) => set((state) => ({ cart: [...state.cart, item] })),
  removeFromCart: (cartId) => set((state) => ({ 
    cart: state.cart.filter((item) => item.cartId !== cartId) 
  })),
  clearCart: () => set({ cart: [], orderType: null }),
}));