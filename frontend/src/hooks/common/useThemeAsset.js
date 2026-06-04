// Return dark/light theme image asset.

import { useTheme } from "../../contexts/ThemeContext"
import { themeAsset } from "../../utils/themeAsset"

export const useThemeAsset = () => {
 
    const {theme} = useTheme()
 
    return themeAsset[theme];
}