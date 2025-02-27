import { Link } from 'react-router'
import { Button } from '../ui/button'
import AppLogo from './app-logo'

function PublicHeader() {
  return (
    <header className="flex justify-between container mx-auto p-4 overflow-hidden md:rounded-lg">
      <AppLogo />

      <Link to={'/login'}>
        <Button>
          Get Started
        </Button>
      </Link>
    </header >
  )
}

export default PublicHeader