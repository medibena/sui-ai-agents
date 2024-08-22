// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { createBrowserRouter } from "react-router-dom";

import App from "../App";
import { Call } from "../components/Call";
import { Agents } from "../components/Agents";
import { History } from "../components/History";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Call />,
      },
      {
        path: "agents",
        element: <Agents />,
      },
      {
        path: "history",
        element: <History />,
      }
    ],
  },
]);
