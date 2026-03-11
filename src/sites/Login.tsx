import {useState} from "react"
import {Link,useNavigate} from "react-router-dom"
import {useMutation} from "@tanstack/react-query"
import {postAPI} from "../apiCalls"
import {useAuth} from "../components/context/AuthContext"

const Login = () => {
    const [showPassword, setShowPassword] = useState(false)
    const {login} = useAuth()
    const navigate = useNavigate()

    const loginMutation = useMutation({
        mutationFn : async(payload:{username:string, password:string})=>
            {await login(payload)},
        onSuccess : ()=>{
            navigate("/profile")
        }
    })

    const handleSubmit = async(event:React.SubmitEvent<HTMLFormElement>)=>{
        event.preventDefault()
        const fd = new FormData(event.currentTarget)
        const username = String(fd.get("username")?? "")
        const password = String(fd.get("password")?? "")
        loginMutation.mutate({username,password})

    }
  return (
    <div className="flex min-h-[calc(100vh-64px)] p-6 items-center justify-center">
        <div className="flex flex-col border rounded-3xl py-20 px-10">
            <h2>Sign-in ...</h2>
            <h5>Here you can login to get a more in detail access to the Data</h5>
            <form onSubmit={handleSubmit} className="flex flex-col ">
                <div className="my-5">
                    <label className="mr-2" id="username">Username</label>
                    <input className="rounded-2xl border dark:bg-gray-300 bg-gray-100 p-2 focus:ring-2 focus:border-indigo-400" id="username" name="username" placeholder="Rainer" />
                </div>
                {showPassword ? 
                <div>
                    <label className="mr-3" id="password">Password</label>
                    <input type="text" className="rounded-2xl border dark:bg-gray-300 bg-gray-100 p-2 focus:ring-2 focus:border-indigo-400" id="password" name="password" placeholder="R3!n3R?!*" />
                </div> :
                <div>
                    <label className="mr-3" id="password">Password</label>
                    <input type="password" className="rounded-2xl border dark:bg-gray-300 bg-gray-100 p-2 focus:ring-2 focus:border-indigo-400" id="password" name="password" placeholder="R3!n3R?!*" />
                </div>}
            <button type ="button" className="text-blue-600 ml-20 text-xs" onClick={()=>setShowPassword(p => !p)}>{showPassword? "Hide": "Show Password"}</button>
            <button className="m-2 bg-gray-600 rounded-2xl border-2" type="submit">Login</button>
            </form>
            <div className="mt-5">
                Doesn't have an account yet? <Link to="/register" className="text-blue-600 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-200 px-2 py-2">Register now</Link>
            </div>
        </div>
    </div>
  )
}

export default Login