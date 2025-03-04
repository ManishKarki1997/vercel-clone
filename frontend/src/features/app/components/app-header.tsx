import AppLogo from '@/components/shared/app-logo'
import ProfileAvatar from '@/components/shared/profile-avatar'
import AppNavigation from './app-navigation'
import { useAuth } from '@/hooks/use-auth'
import AppContainer from './app-container'
import { useSocket } from '@/hooks/use-socket'
import { cn } from '@/lib/utils'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Badge } from '@/components/ui/badge'

function AppHeader() {

  const {
    canAccessAppDashboard
  } = useAuth()

  const { isConnected } = useSocket()

  return (
    <header className=' bg-primary-foreground border-b border-gray-200 dark:border-gray-700 shadow-sm'>
      <AppContainer className='w-full py-2 flex items-center justify-between'>

        <AppLogo to="/app" textClass="text-2xl" />
        {
          canAccessAppDashboard &&
          <>
            <AppNavigation />

            <div className="flex items-center">
              <Tooltip>
                <TooltipTrigger>
                  <Badge
                    variant="outline"
                    className={cn("font-normal", isConnected ? "text-green-500" : "text-red-500")}>
                    {isConnected ? "Connected" : "Disconnected"}
                  </Badge>

                </TooltipTrigger>
                <TooltipContent>
                  {isConnected ? "Connected to socket server" : "Disconnected from socket server"}
                </TooltipContent>
              </Tooltip>
              <ProfileAvatar />
            </div>
          </>
        }
      </AppContainer>
    </header>
  )
}

export default AppHeader