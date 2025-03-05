import { InfoIcon, PlayIcon, SettingsIcon } from "lucide-react"

export const DEFAULT_PROJECT_SETTINGS = [
  {
    name: "BUILD_COMMAND",
    value: "npm run build"
  },
  {
    name: "INSTALL_COMMAND",
    value: "npm install --legacy-peer-deps --include=optional"
  },
  {
    name: "OUTPUT_FOLDER_NAME",
    value: "dist"
  },
]

export const PROJECT_DETAIL_TABS = [
  {
    name: "Details",
    icon: <InfoIcon size={18} />,
    value: "details"
  },
  {
    name: "Deployments",
    icon: <PlayIcon size={18} />,
    value: "deployments"
  },
  {
    name: "Settings",
    icon: <SettingsIcon size={18} />,
    value: "settings"
  },
] as const

