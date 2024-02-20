import { DarkModeOutlined, LightModeOutlined } from "@mui/icons-material";
import {
  useGetIdentity,
  useGetLocale,
  useSetLocale,
} from "@pankod/refine-core";
import {
  AppBar,
  Avatar,
  FormControl,
  IconButton,
  MenuItem,
  Select,
  Stack,
  Toolbar,
  Typography,
} from "@pankod/refine-mui";
import React, { useContext } from "react";
import { Link } from "react-router-dom"; // Correct import for Link component
import { ColorModeContext } from "contexts";
import i18n from "i18n";
import { useNavigate } from "react-router-dom";

export const Header: React.FC = () => {
  const { mode, setMode } = useContext(ColorModeContext);

  const changeLanguage = useSetLocale();
  const locale = useGetLocale();
  const currentLocale = locale();

  const { data: user } = useGetIdentity();
  const showUserInfo = user && (user.name || user.avatar);

  const navigate = useNavigate();

  const handleAvatarClick = () => {
    navigate("/my-profile");
  };

  return (
    <AppBar
      color="default"
      position="sticky"
      elevation={0}
      sx={{ background: "#fcfcfc" }}
    >
      <Toolbar>
        <Stack
          direction="row"
          width="100%"
          justifyContent="flex-end"
          alignItems="center"
        >
          <FormControl sx={{ m: 1, minWidth: 120 }}>
            <Select
              disableUnderline
              defaultValue={currentLocale}
              inputProps={{ "aria-label": "Without label" }}
              variant="standard"
            >
              {[...(i18n.languages ?? [])].sort().map((lang: string) => (
                <MenuItem
                  selected={currentLocale === lang}
                  key={lang}
                  defaultValue={lang}
                  onClick={() => {
                    changeLanguage(lang);
                  }}
                  value={lang}
                >
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Avatar
                      sx={{
                        width: "16px",
                        height: "16px",
                        marginRight: "5px",
                        cursor: "pointer",
                      }}
                      src={`/images/flags/${lang}.svg`}
                    />
                    {lang === "en" ? "English" : "German"}
                  </Stack>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {showUserInfo && (
            <Stack direction="row" gap="16px" alignItems="center">
              {user.avatar && (
                <Avatar
                  src={user?.avatar}
                  alt={user?.name}
                  onClick={handleAvatarClick}
                  style={{ cursor: "pointer" }}
                />
              )}
              {user.name && (
                <Link
                  to="/my-profile"
                  style={{ textDecoration: "none", cursor: "pointer" }}
                >
                  <Typography variant="subtitle2">{user?.name}</Typography>
                </Link>
              )}
            </Stack>
          )}
        </Stack>
      </Toolbar>
    </AppBar>
  );
};
