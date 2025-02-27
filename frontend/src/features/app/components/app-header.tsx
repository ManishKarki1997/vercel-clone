import AppLogo from '@/components/shared/app-logo'
import ProfileAvatar from '@/components/shared/profile-avatar'
import AppNavigation from './app-navigation'
import { useAuth } from '@/hooks/use-auth'

function AppHeader() {

  const {
    canAccessAppDashboard
  } = useAuth()

  return (
    <header className='w-full px-4 py-2 border-b border-gray-200 dark:border-gray-700 shadow-sm flex items-center justify-between'>
      <AppLogo to="/app" textClass="text-2xl" />
      {
        canAccessAppDashboard &&
        <>
          <AppNavigation />
          <ProfileAvatar />
        </>
      }
    </header>
  )
}

export default AppHeader