import { User } from '@/features/app/types/auth.types'
import { logoutAction, profileAction } from '@/features/home/actions/auth.action'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { LogOutIcon, SettingsIcon, UserRoundIcon } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { toast } from 'sonner'
import { useNavigate } from 'react-router'
import { useAuth } from '@/hooks/use-auth'

function ProfileAvatar() {

  const navigate = useNavigate();
  const queryClient = useQueryClient()

  const { user } = useAuth()

  const logoutMutation = useMutation({
    mutationFn: logoutAction,
    onSuccess: () => {
      localStorage.removeItem("isLoggedIn")
      toast.success("Logged out successfully")
      queryClient.invalidateQueries({ queryKey: ['profile'] })
      navigate("/")
    },
    onError: err => {
      console.log("error logging out ", err)
    }
  })

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

        <DropdownMenuItem className='text-red-500' onClick={() => logoutMutation.mutate()}>
          <LogOutIcon />
          Logout
        </DropdownMenuItem>

      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ProfileAvatar