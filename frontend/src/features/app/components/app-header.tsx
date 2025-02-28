import AppLogo from '@/components/shared/app-logo'
import ProfileAvatar from '@/components/shared/profile-avatar'
import AppNavigation from './app-navigation'
import { useAuth } from '@/hooks/use-auth'
import AppContainer from './app-container'

function AppHeader() {

  const {
    canAccessAppDashboard
  } = useAuth()

  return (
    <header className=' bg-primary-foreground border-b border-gray-200 dark:border-gray-700 shadow-sm'>
      <AppContainer className='w-full py-2 flex items-center justify-between'>

        <AppLogo to="/app" textClass="text-2xl" />
        {
          canAccessAppDashboard &&
          <>
            <AppNavigation />
            <ProfileAvatar />
          </>
        }
      </AppContainer>
    </header>
  )
}

export default AppHeader