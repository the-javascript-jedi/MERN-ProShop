import {
  CART_ADD_ITEM,
  CART_REMOVE_ITEM,
  CART_SAVE_SHIPPING_ADDRESS,
  CART_SAVE_PAYMENT_METHOD,
} from "../constants/cartConstants";
//cartItems is an intial state as an empty array
//shippingAddress is an initial state with empty object
export const cartReducer = (
  state = { cartItems: [], shippingAddress: {} },
  action
) => {
  switch (action.type) {
    case CART_ADD_ITEM:
      const item = action.payload;
      //   we need to check if the item is already in the cart
      //   we search the productId in the existing state with the product id of the state passed in the payload - x is the currentProduct existing in the state
      const existItem = state.cartItems.find((x) => x.product === item.product);
      if (existItem) {
        return {
          ...state,
          // cartItems - map current cart Items and check
          // if the current item id matches with the exist item id we return the current item
          // else we return the existing id
          cartItems: state.cartItems.map((x) =>
            x.product === existItem.product ? item : x
          ),
        };
      } else {
        // if item is not present in the state we add it to the cart
        return {
          ...state,
          cartItems: [...state.cartItems, item],
        };
      }
    case CART_REMOVE_ITEM:
      return {
        ...state,
        // filter function to remove the id
        cartItems: state.cartItems.filter((x) => x.product !== action.payload),
        // filter example
        // var ages = [1, 2, 3, 4,5]
        // function checkAdult(age) {
        //   return age != 3;
        // }
        // O/P-1,2,4,5
      };
    case CART_SAVE_SHIPPING_ADDRESS:
      return {
        ...state,
        // add the shipping address
        shippingAddress: action.payload,
      };
    case CART_SAVE_PAYMENT_METHOD:
      return {
        ...state,
        // add the shipping address
        paymentMethod: action.payload,
      };
    default:
      return state;
  }
};
