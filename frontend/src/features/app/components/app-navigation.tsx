import { NavigationMenu, NavigationMenuItem, NavigationMenuList, navigationMenuTriggerStyle } from '@/components/ui/navigation-menu'
import { Link } from 'react-router'

const Links = [
  {
    name: "Projects",
    path: "/app/projects"
  },
  // {
  //   name: "Deployments",
  //   path: "/app/deployments"
  // },
  // {
  //   name: "Logs",
  //   path: "/app/logs"
  // },
]


function AppNavigation() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        {
          Links.map(link => (
            <NavigationMenuItem key={link.name}>
              <Link to={link.path} className={navigationMenuTriggerStyle()}>
                {link.name}
              </Link>
            </NavigationMenuItem>
          ))
        }
      </NavigationMenuList>
    </NavigationMenu>
  )
}

export default AppNavigation