import {useQuery} from "@tanstack/react-query"
import {getAPI, postAPI} from "../apiCalls"
import {useAuth} from "../components/context/AuthContext"
const Profile = () => {
  const {accessToken,logout} = useAuth()
  
  const {data:profile,isError,isLoading} = useQuery({
    queryKey : ["me"],
    queryFn : async()=>{
      const response = await getAPI("/api/user/me", accessToken)
      
      return response
    }
    

  })

  if (isLoading){return (<div>...is loading</div>)}
  if (isError){return (<div>...is error</div>)}

  return (
    <div className="p-6">Profile
    <button className="bg-gray-600 rounded-2xl border-2 p-2" onClick={()=>logout()}>Logout</button>
    </div>
  )
}

export default Profile