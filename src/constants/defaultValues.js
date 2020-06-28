/* 
Menu Types:
"menu-default", "menu-sub-hidden", "menu-hidden"
*/
export const defaultMenuType = "menu-default";

export const subHiddenBreakpoint = 1440;
export const menuHiddenBreakpoint = 768;
export const defaultLocale = "en";
export const localeOptions = [
  { id: "en", name: "English - LTR", direction: "ltr" },
  { id: "es", name: "Español", direction: "ltr" },
  { id: "enrtl", name: "English - RTL", direction: "rtl" }
];

export const firebaseConfig = {
  apiKey: "AIzaSyC0z1dXt6L3j3jmMy9mkrgDyF7Gn35fFAY",
  authDomain: "go-africa.firebaseapp.com",
  databaseURL: "https://go-africa.firebaseio.com",
  projectId: "go-africa",
  storageBucket: "go-africa.appspot.com",
  messagingSenderId: "216495999563"
};

export const searchPath = "/app/pages/search";
export const servicePath = "https://api.coloredstrategies.com";

/* 
Color Options:
"light.purple", "light.blue", "light.green", "light.orange", "light.red", "dark.purple", "dark.blue", "dark.green", "dark.orange", "dark.red"
*/
export const isMultiColorActive = false;
export const defaultColor = "light.blue";
export const defaultDirection = "ltr";
export const isDarkSwitchActive = true;
export const themeColorStorageKey="__theme_color";
export const themeRadiusStorageKey = "__theme_radius";
export const isDemo = false;