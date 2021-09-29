
const initialState = { product: {id: 1} };


const productReducer = (state = initialState, action) => {
  switch (action.type) {
  case 'CHANGE_PRODUCT':
    return { product: action.product };
  default:
    return state;
  }
};

export default productReducer;