import { configureStore  } from "@reduxjs/toolkit";
import clientReducer from "./clientSlice"
import artboardReducer from "./artboardSlice"
import penReducer from "./penSlice"

export const store = configureStore( {
    reducer: {
        client: clientReducer,
        artboard: artboardReducer,
        pen: penReducer,
    }
} );

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
