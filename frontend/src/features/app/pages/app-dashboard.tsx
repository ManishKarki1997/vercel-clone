import LatestDeployments from '../components/dashboard/latest-deployments'
import LatestProjects from '../components/dashboard/latest-projects'

function AppDashboard() {



  return (
    <div className='container mx-auto py-8'>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <LatestProjects />
        <LatestDeployments />
      </div>
    </div>
  )
}

export default AppDashboard