import { ColorModeScript } from '@chakra-ui/react';
import React, { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import * as serviceWorker from './serviceWorker';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

// Pages
import Root from "./routes/root";
import ErrorPage from "./error-page";
import Parties from "./routes/parties";
import Login from './components/Login';

import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import { AuthProvider } from './context/AuthProvider';
import RequireAuth from './components/RequireAuth';

// 2. Add your color mode config
const config = {
  initialColorMode: 'light',
  useSystemColorMode: false,
}

// 3. extend the theme
const theme = extendTheme({ config })

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
const router = createBrowserRouter([
  {
    path: "/",
    element: (<RequireAuth allowedRoles={["User"]}><Root /></RequireAuth>),
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/parties",
        element: (<RequireAuth allowedRoles={["User"]}><Parties /></RequireAuth>),
      }
    ]
  },
  {
    path: "/login",
    element: <Login />,
    errorElement: <ErrorPage />,
  }
]);

root.render(
  <StrictMode>
    <AuthProvider>
      <ChakraProvider theme={theme}>
        <RouterProvider router={router} />
        <ColorModeScript />
      </ChakraProvider>
    </AuthProvider>
  </StrictMode>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorker.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
