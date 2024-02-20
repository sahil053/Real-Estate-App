import { AuthProvider, Refine } from "@pankod/refine-core";
import {
  CssBaseline,
  ErrorComponent,
  GlobalStyles,
  ReadyPage,
  RefineSnackbarProvider,
  notificationProvider,
} from "@pankod/refine-mui";
import {
  AccountCircleOutlined,
  ChatBubbleOutlined,
  HomeRounded,
  PeopleAltOutlined,
  StarOutlineRounded,
  VillaOutlined,
} from "@mui/icons-material";

import { MuiInferencer } from "@pankod/refine-inferencer/mui";
import { RefineKbarProvider } from "@pankod/refine-kbar";
import routerProvider from "@pankod/refine-react-router-v6";
import dataProvider from "@pankod/refine-simple-rest";
import axios, { AxiosRequestConfig } from "axios";
import { Header, Layout, Sider, Title } from "components/layout";
import { DashboardPageProps } from "@pankod/refine-core/dist/interfaces";
import { OffLayoutArea } from "components/offLayoutArea";
import { ColorModeContextProvider } from "contexts";
import { CredentialResponse } from "interfaces/google";

import {
  Login,
  Home,
  Agents,
  MyProfile,
  PropertyDetails,
  AllProperties,
  CreateProperty,
  AgentProfile,
  EditProperty,
} from "pages";

import { useTranslation } from "react-i18next";
import { parseJwt } from "utils/parse-jwt";
import myProfile from "pages/my-profile";

const axiosInstance = axios.create();
axiosInstance.interceptors.request.use((request: AxiosRequestConfig) => {
  const token = localStorage.getItem("token");
  if (request.headers) {
    request.headers["Authorization"] = `Bearer ${token}`;
  } else {
    request.headers = {
      Authorization: `Bearer ${token}`,
    };
  }

  return request;
});

function App() {
  const { t, i18n } = useTranslation();

  const authProvider: AuthProvider = {
    login: async ({ credential }: CredentialResponse) => {
      const profileObj = credential ? parseJwt(credential) : null;

      // Save user to MongoDB...
      if (profileObj) {
        const response = await fetch("http://localhost:8080/api/v1/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: profileObj.name,
            email: profileObj.email,
            avatar: profileObj.picture,
          }),
        });

        const data = await response.json();

        if (response.status === 200) {
          localStorage.setItem(
            "user",
            JSON.stringify({
              ...profileObj,
              avatar: profileObj.picture,
              userid: data._id,
            })
          );
        } else {
          return Promise.reject();
        }
      }
      localStorage.setItem("token", `${credential}`);

      return Promise.resolve();
    },
    logout: () => {
      const token = localStorage.getItem("token");

      if (token && typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        axios.defaults.headers.common = {};
        window.google?.accounts.id.revoke(token, () => {
          return Promise.resolve();
        });
      }

      return Promise.resolve();
    },
    checkError: () => Promise.resolve(),
    checkAuth: async () => {
      const token = localStorage.getItem("token");

      if (token) {
        return Promise.resolve();
      }
      return Promise.reject();
    },

    getPermissions: () => Promise.resolve(),
    getUserIdentity: async () => {
      const user = localStorage.getItem("user");
      if (user) {
        return Promise.resolve(JSON.parse(user));
      }
    },
  };

  const i18nProvider = {
    translate: (key: string, params: object) => t(key, params),
    changeLocale: (lang: string) => i18n.changeLanguage(lang),
    getLocale: () => i18n.language,
  };

  return (
    <ColorModeContextProvider>
      <CssBaseline />
      <GlobalStyles styles={{ html: { WebkitFontSmoothing: "auto" } }} />
      <RefineSnackbarProvider>
        <RefineKbarProvider>
          <Refine
            dataProvider={dataProvider("http://localhost:8080/api/v1")}
            notificationProvider={notificationProvider}
            ReadyPage={ReadyPage}
            catchAll={<ErrorComponent />}
            resources={[
              {
                name: "properties",
                list: AllProperties,
                show: PropertyDetails,
                create: CreateProperty,
                edit: EditProperty,
                icon: <VillaOutlined />,
              },
              {
                name: "agent",
                list: Agents,
                show: AgentProfile,
                icon: <PeopleAltOutlined />,
              },
              {
                name: "review",
                list: Home,
                icon: <StarOutlineRounded />,
              },
              {
                name: "message",
                list: Home,
                icon: <ChatBubbleOutlined />,
              },
              {
                name: "my-profile",
                options: { label: "My Profile" },
                list: myProfile,
                icon: <AccountCircleOutlined />,
              },
            ]}
            Title={Title}
            Sider={Sider}
            Layout={Layout}
            Header={Header}
            routerProvider={routerProvider}
            authProvider={authProvider}
            LoginPage={Login}
            i18nProvider={i18nProvider}
            OffLayoutArea={OffLayoutArea}
            DashboardPage={Home}
          />
        </RefineKbarProvider>
      </RefineSnackbarProvider>
    </ColorModeContextProvider>
  );
}

export default App;
