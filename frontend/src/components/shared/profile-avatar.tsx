import { User } from '@/features/app/types/auth.types'
import { profileAction } from '@/features/home/actions/auth.action'
import { useQuery } from '@tanstack/react-query'
import { LogOutIcon, SettingsIcon, UserRoundIcon } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu'

function ProfileAvatar() {

  const { data: profileData, isFetching: isFetchingUser } = useQuery({
    queryFn: profileAction,
    queryKey: ['profile'],
  })

  const user: User | null = profileData

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage src={`https://api.dicebear.com/9.x/lorelei/svg?seed=${user?.id || 'DV'}`} />
          <AvatarFallback>DV</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <UserRoundIcon />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem>
          <SettingsIcon />
          Settings
        </DropdownMenuItem>

        <DropdownMenuItem className='text-red-500'>
          <LogOutIcon />
          Logout
        </DropdownMenuItem>

      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ProfileAvatar